import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sprout, Sun, Package, Truck, ArrowDown } from 'lucide-react';
import { useState, useEffect } from 'react';

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
          } brightness-[0.5] animate-breathing`}
          alt="Process background"
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#fffcf7]/20 z-10" />
    </div>
  );
};

export default function Process() {
  const heroImages = [
    "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/212940/pexels-photo-212940.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=1600"
  ];

  const steps = [
    {
      icon: Sprout,
      title: 'Growing',
      description: 'We plant seeds in nutrient-rich soil, using organic methods and careful monitoring to ensure optimal growth conditions.',
      image: "https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      icon: Sun,
      title: 'Harvesting',
      description: 'Vegetables are hand-picked at peak ripeness in the early morning when they are most nutritious and flavorful.',
      image: "https://images.pexels.com/photos/2589457/pexels-photo-2589457.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      icon: Package,
      title: 'Packing',
      description: 'Each box is carefully curated and packed with a variety of seasonal vegetables, ensuring freshness and quality.',
      image: "https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
    {
      icon: Truck,
      title: 'Delivery',
      description: 'Your box is delivered directly to your door within 24 hours of harvest, guaranteeing maximum freshness.',
      image: "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a2e1a] overflow-x-hidden selection:bg-[#1a2e1a] selection:text-white">
      <Navbar />
      
      <AutoImageSlider images={heroImages} interval={12000} />

      <main className="relative">
        <section className="relative h-screen flex items-center justify-center overflow-hidden z-20">
          <div className="relative z-20 text-center space-y-6">
            <div className="overflow-hidden">
              <span className="block text-white font-bold tracking-[1.5em] uppercase text-[10px] animate-slide-up">
                The My Farm Method
              </span>
            </div>
            <div className="overflow-hidden">
              <h1 className="text-8xl md:text-[12rem] font-serif font-bold text-white tracking-tighter leading-none reveal-text animate-slide-up-delayed">
                Process
              </h1>
            </div>
            <div className="pt-12 flex justify-center animate-fade-in-long">
              <div className="animate-bounce p-3 rounded-full border border-white/30 backdrop-blur-md">
                <ArrowDown className="text-white w-5 h-5" />
              </div>
            </div>
          </div>
        </section>

        <div className="relative z-30">
          {steps.map((step, index) => (
            <section 
              key={index} 
              className="relative min-h-screen py-32 flex items-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10 z-0" />
              <div className="container mx-auto px-6 relative z-10">
                <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24`}>
                  <div className="w-full lg:w-1/2 group perspective-2000 animate-reveal">
                    <div className="relative overflow-hidden rounded-[4rem] shadow-2xl transition-all duration-1000 transform group-hover:rotate-x-2 group-hover:rotate-y-6 group-hover:scale-[1.02] h-[600px]">
                      <img src={step.image} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110" alt={step.title} />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700" />
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 space-y-8 animate-reveal">
                    <div className="inline-flex items-center gap-4 py-2 px-6 bg-white/90 backdrop-blur-md border border-stone-200 rounded-full shadow-sm">
                      <step.icon className="w-5 h-5 text-[#1a2e1a]" />
                      <span className="text-[#8b5e34] font-black tracking-widest text-[10px] uppercase">Stage 0{index + 1}</span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-serif font-bold text-white tracking-tighter leading-tight drop-shadow-lg">
                      {step.title}
                    </h2>
                    <div className="relative p-10 bg-white rounded-[3rem] border border-stone-100 shadow-2xl transition-transform duration-500 hover:-translate-y-1">
                      <p className="text-stone-800 text-xl md:text-2xl font-medium leading-relaxed italic">
                        "{step.description}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </main>

      <div className="relative z-50 bg-[#1a2e1a]">
        <Footer />
      </div>

      <style>{`
        @keyframes breathing { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        .animate-breathing { animation: breathing 15s ease-in-out infinite; }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slideUp 1.2s cubic-bezier(0.2, 1, 0.3, 1) forwards; }
        .animate-slide-up-delayed { animation: slideUp 1.2s cubic-bezier(0.2, 1, 0.3, 1) 0.2s forwards; opacity: 0; }
        .animate-fade-in-long { animation: fadeIn 2s ease-in 1s forwards; opacity: 0; }
        @keyframes reveal { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
        .animate-reveal { animation: reveal linear forwards; animation-timeline: view(); animation-range: entry 15% cover 35%; }
        .reveal-text { background: linear-gradient(to bottom, #fff 20%, #c5a059 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .perspective-2000 { perspective: 2000px; }
      `}</style>
    </div>
  );
}