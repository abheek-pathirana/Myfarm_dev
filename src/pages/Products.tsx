import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { products as staticProducts, Product } from '@/data/products';
import { Loader2, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const location = useLocation();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('category');

  // MANUALLY LOCKED IMAGES: 1. Luxury Greenhouse, 2. Misty Morning Farm, 3. Hands in Soil
  const slides = [
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1600"
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(slideTimer);
  }, [slides.length]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = staticProducts;
      if (categoryFilter) {
        filtered = staticProducts.filter(p =>
          p.category?.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
      setProducts(filtered);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [categoryFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fffcf7] selection:bg-[#1a2e1a] selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="flex-grow relative">

        {/* 1. ANIMATED BACKGROUND (Restricted to z-0) */}
        <div className="fixed inset-0 z-0 bg-black">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[3000ms] ease-in-out scale-110 brightness-[0.3] animate-ken-burns ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              style={{ backgroundImage: `url(${slide})` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent z-10" />
        </div>

        {/* 2. HERO SECTION */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden z-20">
          <div className="relative text-center text-white px-4 max-w-5xl space-y-8">
            <div className="overflow-hidden">
              <span className="block text-xs tracking-[1.5em] uppercase font-bold animate-slide-up opacity-60">
                The Estate Collection
              </span>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-8xl md:text-[12rem] font-serif font-bold tracking-tighter leading-none reveal-text animate-slide-up-delayed capitalize">
                Products
              </h1>
            </div>
            <div className="pt-12 flex justify-center animate-fade-in-long">
              <div className="animate-bounce p-4 rounded-full border border-white/10 backdrop-blur-md">
                <ArrowDown className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. PRODUCT GRID SECTION */}
        <div className="relative z-30">
          <div className="container mx-auto px-4 -mt-32 pb-40 relative z-10">
            <div className="bg-white/95 backdrop-blur-3xl rounded-[5rem] p-10 md:p-24 shadow-[0_80px_150px_-30px_rgba(26,46,26,0.3)] border border-white/60">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-40 space-y-8">
                  <Loader2 className="h-12 w-12 animate-spin text-[#1a2e1a]/20" />
                  <p className="text-[#8b5e34] font-black tracking-[0.6em] text-[10px] uppercase animate-pulse">Consulting the Estate...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
                  {products.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. THE SOLID GREEN ANCHOR (Contact/CTA - NO ANIMATIONS, NO TRANSPARENCY) */}
        <section className="relative py-48 bg-[#1a2e1a] text-white flex items-center justify-center z-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-8xl md:text-[11rem] font-serif font-bold text-white tracking-tighter leading-none mb-12">
              Earth <span className="text-[#c5a059] italic">Refined.</span>
            </h2>
            <div className="space-y-12">
              <p className="text-white/60 tracking-[0.4em] uppercase text-xs font-bold">Bespoke Harvest Inquiries</p>
              <button
                onClick={() => {
                  toast({
                    title: "Contact Us",
                    description: "You can contact us here: myfarm.agro@gmail.com for access requests.",
                  });
                }}
                className="group relative px-20 py-8 overflow-hidden rounded-full bg-white text-black transition-all duration-700">
                <span className="relative z-10 font-bold uppercase tracking-[0.5em] text-xs">Request Access</span>
                <div className="absolute inset-0 bg-[#c5a059] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer also inherits the solid green background */}
      <div className="relative z-50 bg-[#1a2e1a]">
        <Footer />
      </div>

      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1.1); }
          50% { transform: scale(1.22); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns { animation: kenburns 25s ease-in-out infinite; }
        
        @keyframes slideUp {
          from { transform: translateY(120%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slideUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up-delayed { animation: slideUp 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-long { animation: fadeIn 3s ease-in 1.2s forwards; opacity: 0; }

        .reveal-text {
          background: linear-gradient(to bottom, #fff 50%, #c5a059 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}