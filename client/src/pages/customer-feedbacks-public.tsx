import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, MessageSquare, ZoomIn, Eye } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Feedback {
  id: number;
  title: string | null;
  imageUrl: string;
  createdAt: string;
}

export default function CustomerFeedbacksPublic() {
  const { data: feedbacks = [], isLoading } = useQuery<Feedback[]>({
    queryKey: ["/api/feedbacks"],
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#06040a] text-white relative overflow-hidden pb-16">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#06040a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/">
            <a className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Shop</span>
            </a>
          </Link>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span className="font-black tracking-wider text-sm uppercase text-purple-400">Customer Proofs</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent mb-6">
          Customer Feedbacks <br /> & Success Proofs
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto font-medium">
          See live screenshots and proof records uploaded directly showing successful customer transactions and deliveries.
        </p>
      </section>

      {/* Feedbacks Grid */}
      <main className="max-w-6xl mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white/[0.02] border-white/5 overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="w-full h-80 rounded-none bg-white/5" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-white/5" />
                    <Skeleton className="h-3 w-1/2 bg-white/5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl p-8 max-w-lg mx-auto backdrop-blur-sm">
            <Eye className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Feedbacks Yet</h3>
            <p className="text-white/40 text-sm">
              We haven't uploaded any transaction proofs or customer feedback screenshots yet. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((item) => (
              <Card
                key={item.id}
                className="group relative bg-[#0f0a1a] border border-white/5 overflow-hidden hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-500 rounded-3xl"
              >
                <CardContent className="p-0 flex flex-col h-full">
                  <div
                    onClick={() => setSelectedImage(item.imageUrl)}
                    className="relative w-full aspect-[4/5] overflow-hidden cursor-zoom-in"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Customer Proof"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 transform scale-90 group-hover:scale-100 transition-transform duration-300">
                        <ZoomIn className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  {item.title && (
                    <div className="p-5 border-t border-white/5 mt-auto">
                      <h3 className="font-bold text-white text-base leading-snug truncate">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Image Dialog View */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/90 border-white/10 overflow-hidden flex items-center justify-center rounded-3xl">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full Resolution Proof"
              className="max-h-[85vh] w-auto object-contain mx-auto"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
