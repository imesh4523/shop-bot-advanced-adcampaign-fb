import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

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

  useEffect(() => {
    if (!user) return;

    // Request browser notification permission if not yet decided
    if (window.Notification && window.Notification.permission === 'default') {
      window.Notification.requestPermission().catch(console.error);
    }

    // 1. Socket.io for Real-time Toast/Sound/Native Notification when dashboard is open
    const socket = io();
    socket.on('admin_notification', (notification: { title: string; message?: string; description?: string }) => {
      const body = notification.description || notification.message || '';
      toast({
        title: notification.title,
        description: body,
        duration: 10000,
      });

      const audio = new Audio(NOTIFICATION_SOUND_URL);
      audio.play().catch(() => {});

      // Show native browser notification if tab is in background or minimized
      if (window.Notification && window.Notification.permission === 'granted') {
        try {
          new window.Notification(notification.title, {
            body,
            icon: '/favicon.ico'
          });
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
    };
  }, [user, toast]);

  return null;
}
