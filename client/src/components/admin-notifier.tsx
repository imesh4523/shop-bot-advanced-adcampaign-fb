import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Phone, PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NOTIFICATION_SOUND_URL = 'https://github.com/shubham-sawant/shopify-chaching-sound/raw/master/shopify-chaching.mp3';

// Utility to convert VAPID public key to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function AdminNotifier() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [incomingCall, setIncomingCall] = useState<{ from: string; callerName: string; offer: any } | null>(null);
  const incomingCallRef = useRef<any>(null);
  incomingCallRef.current = incomingCall;

  const [activeCall, setActiveCall] = useState<{
    peerConnection: RTCPeerConnection;
    localStream: MediaStream;
    remoteStream: MediaStream;
    callerSocketId: string;
    callerName: string;
    duration: number;
    isLocalMuted: boolean;
    isPeerMuted: boolean;
  } | null>(null);
  const activeCallRef = useRef<any>(null);
  activeCallRef.current = activeCall;

  const socketRef = useRef<any>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const ringIntervalRef = useRef<any>(null);

  const startRingtone = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playRing = () => {
        const playTone = (delay: number) => {
          const osc1 = audioCtx.createOscillator();
          const osc2 = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          osc1.frequency.setValueAtTime(400, audioCtx.currentTime + delay);
          osc2.frequency.setValueAtTime(450, audioCtx.currentTime + delay);
          
          gainNode.gain.setValueAtTime(0, audioCtx.currentTime + delay);
          gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + delay + 0.05);
          gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime + delay + 0.35);
          gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + delay + 0.4);
          
          osc1.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          osc1.start(audioCtx.currentTime + delay);
          osc2.start(audioCtx.currentTime + delay);
          
          osc1.stop(audioCtx.currentTime + delay + 0.4);
          osc2.stop(audioCtx.currentTime + delay + 0.4);
        };
        playTone(0);
        playTone(0.6);
      };
      
      playRing();
      ringIntervalRef.current = setInterval(playRing, 3000);
    } catch (e) {
      console.error("Failed to play synthesized ringtone:", e);
    }
  };
  
  const stopRingtone = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
  };

  const rejectIncomingCall = () => {
    const currentIncoming = incomingCallRef.current;
    if (currentIncoming && socketRef.current) {
      socketRef.current.emit("reject-call", { to: currentIncoming.from });
    }
    setIncomingCall(null);
    stopRingtone();
  };

  const hangupCall = () => {
    stopRingtone();
    const currentCall = activeCallRef.current;
    if (currentCall && socketRef.current) {
      socketRef.current.emit("end-call", { to: currentCall.callerSocketId });
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setActiveCall(null);
  };

  const answerIncomingCall = async () => {
    const currentIncoming = incomingCallRef.current;
    if (!currentIncoming) return;
    stopRingtone();

    let localStream: MediaStream;
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = localStream;
    } catch (err) {
      toast({
        title: "Microphone Access Denied",
        description: "Cannot answer call without microphone access.",
        variant: "destructive"
      });
      if (socketRef.current) {
        socketRef.current.emit("reject-call", { to: currentIncoming.from });
      }
      setIncomingCall(null);
      return;
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
      ]
    });
    peerConnectionRef.current = pc;

    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });

    const remoteStream = new MediaStream();
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.play().catch(e => console.error("Error playing remote audio:", e));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          to: currentIncoming.from,
          candidate: event.candidate
        });
      }
    };

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(currentIncoming.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      if (socketRef.current) {
        socketRef.current.emit("accept-call", {
          to: currentIncoming.from,
          answer
        });
      }

      setActiveCall({
        peerConnection: pc,
        localStream,
        remoteStream,
        callerSocketId: currentIncoming.from,
        callerName: currentIncoming.callerName,
        duration: 0,
        isLocalMuted: false,
        isPeerMuted: false
      });
      setIncomingCall(null);
    } catch (err) {
      console.error("Failed to answer WebRTC call:", err);
      if (socketRef.current) {
        socketRef.current.emit("reject-call", { to: currentIncoming.from });
      }
      localStream.getTracks().forEach(t => t.stop());
      setIncomingCall(null);
    }
  };

  const toggleLocalMute = () => {
    const currentCall = activeCallRef.current;
    if (currentCall && localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setActiveCall(prev => {
          if (!prev) return null;
          return { ...prev, isLocalMuted: !audioTrack.enabled };
        });
        
        if (socketRef.current) {
          socketRef.current.emit("mute-status", {
            to: currentCall.callerSocketId,
            isMuted: !audioTrack.enabled
          });
        }
      }
    }
  };

  const startAdminCall = async (targetTelegramId: string, targetName: string) => {
    if (activeCallRef.current) {
      toast({
        title: "Call in Progress",
        description: "Please hang up the active call before making a new one.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Initiating Voice Call",
      description: `Calling ${targetName}...`,
    });

    let localStream: MediaStream;
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = localStream;
    } catch (err) {
      toast({
        title: "Microphone Access Denied",
        description: "Please allow microphone access to make voice calls.",
        variant: "destructive"
      });
      return;
    }

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
      ]
    });
    peerConnectionRef.current = pc;

    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });

    const remoteStream = new MediaStream();
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.play().catch(e => console.error("Error playing remote audio:", e));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          toTelegramId: targetTelegramId,
          candidate: event.candidate
        });
      }
    };

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (socketRef.current) {
        socketRef.current.emit("call-user", {
          offer,
          callerName: "Support Agent",
          callerId: user?.id?.toString() || "admin",
          toTelegramId: targetTelegramId
        });
      }

      setActiveCall({
        peerConnection: pc,
        localStream,
        remoteStream,
        callerSocketId: "", 
        callerName: targetName,
        duration: 0,
        isLocalMuted: false,
        isPeerMuted: false
      });
    } catch (err) {
      console.error("Failed to start admin call:", err);
      localStream.getTracks().forEach(t => t.stop());
      setActiveCall(null);
    }
  };

  // Call duration counter effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (activeCall) {
      timer = setInterval(() => {
        setActiveCall(prev => {
          if (!prev) return null;
          return { ...prev, duration: prev.duration + 1 };
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeCall ? activeCall.callerSocketId : null]);

  useEffect(() => {
    if (!user) return;

    const handleStartCallEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.telegramId) {
        startAdminCall(customEvent.detail.telegramId, customEvent.detail.name || "Customer");
      }
    };
    window.addEventListener("start-admin-call", handleStartCallEvent);

    // Request browser notification permission if not yet decided
    if (window.Notification && window.Notification.permission === 'default') {
      window.Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setupNativePush();
        }
      }).catch(console.error);
    }

    const socket = io();
    socketRef.current = socket;

    socket.emit("join-admin-calls");

    socket.on("incoming-call", (data: { from: string; offer: any; callerName: string; callerId: string }) => {
      setIncomingCall(data);
      startRingtone();
    });

    socket.on("call-ended", () => {
      hangupCall();
      setIncomingCall(null);
      stopRingtone();
    });

    socket.on("call-accepted", async (data: { answer: any; from: string }) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
          setActiveCall(prev => {
            if (!prev) return null;
            return {
              ...prev,
              callerSocketId: data.from
            };
          });
        } catch (err) {
          console.error("Error setting remote answer description on admin:", err);
        }
      }
    });

    socket.on("call-rejected", () => {
      toast({
        title: "Call Rejected",
        description: "The customer rejected the call.",
        variant: "destructive"
      });
      hangupCall();
    });

    socket.on("peer-mute-status", (data: { isMuted: boolean }) => {
      setActiveCall(prev => {
        if (!prev) return null;
        return { ...prev, isPeerMuted: data.isMuted };
      });
    });

    socket.on("ice-candidate", async (data: { candidate: any }) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error("Error adding ICE candidate on admin:", e);
        }
      }
    });

    socket.on('admin_notification', (notification: { title: string; message?: string; description?: string; type?: string; telegramId?: string }) => {
      const body = notification.description || notification.message || '';
      const isSupport = notification.type === 'support' && notification.telegramId;

      // Navigate to specific chat when notification is clicked
      const goToChat = () => {
        if (isSupport && notification.telegramId) {
          window.location.href = `/main-admin/support?chat=${encodeURIComponent(notification.telegramId)}`;
        }
      };

      toast({
        title: notification.title,
        description: isSupport
          ? (
            <div className="flex flex-col gap-2">
              <span>{body}</span>
              <button
                onClick={goToChat}
                className="mt-1 self-start px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
              >
                📨 View Chat →
              </button>
            </div>
          ) as any
          : body,
        duration: 12000,
      });

      const audio = new Audio(NOTIFICATION_SOUND_URL);
      audio.play().catch(() => {});

      // Show native browser notification if tab is in background or minimized
      if (window.Notification && window.Notification.permission === 'granted') {
        try {
          const nativeNotif = new window.Notification(notification.title, {
            body,
            icon: '/favicon.ico'
          });
          // Clicking native notification also navigates to the chat
          if (isSupport) {
            nativeNotif.onclick = () => {
              window.focus();
              goToChat();
            };
          }
        } catch (e) {
          console.error('Failed to trigger native notification:', e);
        }
      }
    });

    // 2. Native Web Push (VAPID) for background notifications
    const setupNativePush = async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported by browser');
        return;
      }

      try {
        // Register Service Worker
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Wait for it to be active
        await navigator.serviceWorker.ready;

        // Get Public VAPID Key
        const res = await fetch('/api/admin/push-key');
        const { publicKey } = await res.json();
        if (!publicKey) return;

        // Subscribe to Push
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey)
          });
          console.log('User subscribed to push');
          
          toast({
            title: "Notifications Enabled",
            description: "You will now receive native push notifications for orders.",
          });
        }

        // Send subscription to backend
        console.log('[PUSH] Sending subscription to server...');
        const subRes = await fetch('/api/admin/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription })
        });

        if (subRes.ok) {
          console.log('[PUSH] Server acknowledged subscription');
        } else {
          console.error('[PUSH] Server failed to save subscription:', await subRes.text());
        }

      } catch (err) {
        console.error('Failed to setup native push:', err);
        toast({
          title: "Push Setup Failed",
          description: "Check browser console for details.",
          variant: "destructive"
        });
      }
    };

    // Listen for manual trigger
    const handleTrigger = () => setupNativePush();
    window.addEventListener('trigger-push-setup', handleTrigger);

    // Initial attempt (might fail if permission not granted yet)
    if (window.Notification && window.Notification.permission === 'granted') {
      setupNativePush();
    }

    return () => {
      socket.disconnect();
      window.removeEventListener('trigger-push-setup', handleTrigger);
      window.removeEventListener("start-admin-call", handleStartCallEvent);
      
      stopRingtone();
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };
  }, [user, toast]);

  return (
    <>
      <AnimatePresence>
        {/* Incoming Call Popup overlay */}
        {incomingCall && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md border border-purple-500/20 text-white p-6 rounded-2xl shadow-2xl z-[99999] flex flex-col items-center gap-4 w-80"
          >
            <div className="relative w-16 h-16 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute inset-0 bg-purple-500/10 rounded-full"
              />
              <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center border border-purple-500/20">
                <Phone className="w-6 h-6 text-purple-400 animate-pulse" />
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="font-bold text-white tracking-wider">Incoming Support Call</h4>
              <p className="text-xs text-white/50 lowercase mt-1 font-mono">{incomingCall.callerName}</p>
            </div>

            <div className="flex gap-4 w-full justify-center mt-2">
              <button
                onClick={rejectIncomingCall}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/20 border border-red-500/20"
              >
                Decline
              </button>
              <button
                onClick={answerIncomingCall}
                className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-all shadow-lg shadow-green-600/20 border border-green-500/20"
              >
                Answer
              </button>
            </div>
          </motion.div>
        )}

        {/* Active Call Floating Panel */}
        {activeCall && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed bottom-6 right-6 bg-black/90 backdrop-blur-md border border-blue-500/20 text-white p-5 rounded-2xl shadow-2xl z-[99999] flex flex-col gap-3.5 w-72"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">On Call</span>
              </div>
              <span className="text-[11px] font-mono text-white/60 tracking-wider">
                {(seconds => {
                  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
                  const s = (seconds % 60).toString().padStart(2, "0");
                  return `${m}:${s}`;
                })(activeCall.duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 to-purple-600 flex items-center justify-center border border-white/10 shrink-0">
                <Volume2 className="w-5 h-5 text-white/90" />
              </div>
              <div className="overflow-hidden">
                <h5 className="font-bold text-sm text-white truncate">{activeCall.callerName}</h5>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5 font-bold">
                  {activeCall.isPeerMuted ? "Customer Muted" : "Active Stream"}
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-between mt-2 pt-2 border-t border-white/5">
              {/* Mute Button */}
              <button
                onClick={toggleLocalMute}
                className={`flex-1 py-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                  activeCall.isLocalMuted 
                    ? "bg-red-500/25 border-red-500/30 text-red-500 hover:bg-red-500/30" 
                    : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                }`}
              >
                {activeCall.isLocalMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {activeCall.isLocalMuted ? "Unmute" : "Mute"}
              </button>

              {/* End Call Button */}
              <button
                onClick={hangupCall}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all border border-red-500/20 shadow-lg shadow-red-600/10 flex items-center gap-1"
              >
                <PhoneOff className="w-4 h-4" />
                End
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
