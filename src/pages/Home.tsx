import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Hero from '@/components/Hero';
import Categories from '@/components/Categories';
import { Leaf, Truck, Heart, Shield } from 'lucide-react';

const AutoImageSlider = ({ images, interval = 10000 }: { images: string[], interval?: number }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="fixed inset-0 w-full h-full z-0 bg-[#1a2e1a]">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[3000ms] ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          } brightness-[0.45] animate-breathing`}
          alt="Home farm scenery"
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10" />
    </div>
  );
};

export default function Home() {
  // NEW UNIQUE IMAGES: Verified farming only.
  const homeBgImages = [
    "https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=1600", // Golden wheat
    "https://images.pexels.com/photos/235925/pexels-photo-235925.jpeg?auto=compress&cs=tinysrgb&w=1600",  // Farm rows
    "https://images.pexels.com/photos/158179/lake-island-mist-nature-158179.jpeg?auto=compress&cs=tinysrgb&w=1600" // Misty farm estate
  ];

  return (
    <div className="min-h-screen flex flex-col relative bg-[#1a2e1a] overflow-x-hidden">
      <AutoImageSlider images={homeBgImages} interval={12000} />
      
      <Navbar />
      
      <main className="flex-grow relative z-10">
        <Hero />

        <section className="relative py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <span className="text-[#c5a059] font-bold tracking-[0.5em] uppercase text-xs mb-4 block">
                The My Farm Collection
              </span>
              <h2 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 tracking-tighter">
                Our Premium Harvest
              </h2>
              <div className="w-24 h-[2px] bg-[#c5a059] mx-auto mb-8" />
              <p className="text-white/80 text-xl max-w-2xl mx-auto font-light italic leading-relaxed">
                Hand-picked daily from our fields. Experience the true taste of My Farm.
              </p>
            </div>
            
            <div className="backdrop-blur-md bg-white/5 rounded-[4rem] p-8 border border-white/10 shadow-2xl">
              <Categories />
            </div>
          </div>
        </section>

        <section className="relative py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { icon: Leaf, title: '100% Organic', desc: 'Sustainably grown in our own estate soil.' },
                { icon: Truck, title: 'Direct Delivery', desc: 'From My Farm straight to your residence.' },
                { icon: Heart, title: 'Hand-Selected', desc: 'Every item is checked for absolute perfection.' },
                { icon: Shield, title: 'Our Promise', desc: 'Uncompromising quality, every single time.' },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative p-12 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all duration-700 text-center shadow-2xl"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-[#c5a059]/20 rounded-full mb-8 group-hover:bg-[#c5a059] transition-all duration-700">
                    <item.icon className="w-8 h-8 text-[#c5a059] group-hover:text-[#1a2e1a]" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-4 text-white tracking-tight">{item.title}</h3>
                  <p className="text-white/70 font-light leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-48 relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-6xl md:text-[10rem] font-serif font-bold mb-10 tracking-tighter text-white italic leading-none drop-shadow-2xl">
              Experience the <span className="text-[#c5a059]">Difference.</span>
            </h2>
            <Button size="lg" variant="outline" asChild className="h-20 px-16 bg-white text-[#1a2e1a] border-none hover:bg-[#c5a059] hover:text-white transition-all duration-700 rounded-full font-bold uppercase tracking-[0.4em] text-xs shadow-2xl">
              <Link to="/products">Explore the Full Harvest</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* FOOTER FIX: Fully transparent, no green box above or below */}
      <footer className="relative z-50 bg-transparent">
        <Footer />
      </footer>

      <style>{`
        @keyframes breathing { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        .animate-breathing { animation: breathing 15s ease-in-out infinite; }
      `}</style>
    </div>
  );
}