import React, { useState, useEffect } from 'react';

const slides = [
  {
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000",
    title: "Fresh From Our Farm to Your Door",
    subtitle: "Sustainably grown in the hills of Nuwara Eliya. Delivered in our signature wooden boxes."
  },
  {
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=2000",
    title: "Premium Export Quality",
    subtitle: "Experience the Nuwara Eliya standard, harvested within 24 hours of your delivery."
  },
  {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000",
    title: "Sustainable & Paperless",
    subtitle: "Our zero-waste packaging model ensures your luxury produce leaves no footprint."
  }
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      {slides.map((slide, index) => (
        <div 
          key={index} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          <div className="absolute inset-0">
            <img 
              src={slide.image} 
              className={`w-full h-full object-cover transition-transform duration-[15000ms] ${index === current ? 'scale-110' : 'scale-100'}`} 
              alt="Farm"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-5xl md:text-8xl font-serif mb-6 drop-shadow-2xl">
              {slide.title}
            </h1>
            <p className="text-lg md:text-2xl font-light max-w-3xl drop-shadow-lg">
              {slide.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}