import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
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
          } brightness-[0.4] animate-breathing`}
          alt="Organic farm scenery"
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10" />
    </div>
  );
};

export default function About() {
  const aboutBgImages = [
    "https://images.pexels.com/photos/2132250/pexels-photo-2132250.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1483880/pexels-photo-1483880.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=1600"
  ];

  return (
    <div className="min-h-screen flex flex-col relative bg-[#1a2e1a] overflow-x-hidden">
      <AutoImageSlider images={aboutBgImages} interval={12000} />
      
      <Navbar />
      
      <main className="flex-grow relative z-10">
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="relative z-10 text-center px-4 max-w-4xl">
            <span className="text-[10px] tracking-[1.5em] uppercase font-black mb-6 block text-[#c5a059]">
              The Legacy
            </span>
            <h1 className="text-8xl md:text-[12rem] font-serif font-bold tracking-tighter mb-6 text-white leading-none">
              Our Story
            </h1>
            <p className="text-xl md:text-3xl font-light italic text-white/90 max-w-2xl mx-auto leading-relaxed">
              "A family farm committed to sustainable agriculture and community health."
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 relative z-20 pb-32">
          <div className="bg-white/95 backdrop-blur-3xl rounded-[4rem] p-10 md:p-24 shadow-2xl border border-white/50">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                <div className="space-y-8 animate-reveal">
                  <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-none">
                    Rooted in <br/><span className="text-[#2d5a27]">Integrity.</span>
                  </h2>
                  <p className="text-xl text-stone-600 leading-relaxed font-light">
                    At <span className="text-[#8b5e34] font-bold">My Farm</span>, we believe that the best food doesn't need a lab—it just needs the sun, the rain, and a pair of dedicated hands.
                  </p>
                  <div className="w-20 h-[2px] bg-[#c5a059]" />
                </div>
                <div className="relative group overflow-hidden rounded-[3rem] shadow-2xl h-[500px] animate-reveal">
                  <img 
                    src="https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                    alt="Sustainable farming" 
                    className="w-full h-full object-cover transition-transform duration-[5s] group-hover:scale-110"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                {[
                  { title: 'Pure Soil', desc: 'No chemicals. No shortcuts. Just nutrient-rich earth.' },
                  { title: 'Slow Grown', desc: 'We wait for nature. Every fruit is picked at its peak.' },
                  { title: 'Direct Path', desc: 'From our fields to your table in record time.' },
                ].map((value, i) => (
                  <div key={i} className="text-center group animate-reveal">
                    <div className="inline-block p-4 rounded-full bg-[#f4e9d9] mb-6 group-hover:bg-[#2d5a27] group-hover:text-white transition-all duration-500">
                       <div className="w-8 h-[1px] bg-current" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold mb-4 text-stone-800">{value.title}</h3>
                    <p className="text-stone-500 font-light leading-relaxed">{value.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative min-h-screen flex items-center justify-center z-20">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-7xl md:text-[10rem] font-serif font-bold mb-10 tracking-tighter italic text-white leading-none">
                Why <span className="text-[#c5a059]">Us?</span>
              </h2>
              <p className="text-2xl md:text-3xl text-white/80 leading-relaxed font-light mb-16 max-w-2xl mx-auto italic">
                "Transparency isn't just a buzzword for us—it's how we farm. Every seed has a story."
              </p>
              <Button asChild className="h-20 px-16 bg-white text-[#1a2e1a] hover:bg-[#c5a059] hover:text-white transition-all duration-700 rounded-full font-bold uppercase tracking-[0.4em] text-xs shadow-2xl">
                <Link to="/products">Explore the Harvest</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* FIXED FOOTER: Background removed to eliminate the mismatch rectangle */}
      <footer className="relative z-50 bg-transparent">
        <Footer />
      </footer>

      <style>{`
        @keyframes breathing { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
        .animate-breathing { animation: breathing 15s ease-in-out infinite; }
        @keyframes reveal { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-reveal { animation: reveal linear forwards; animation-timeline: view(); animation-range: entry 10% cover 30%; }
      `}</style>
    </div>
  );
}