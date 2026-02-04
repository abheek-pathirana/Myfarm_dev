import React from 'react';

const categories = [
  { name: "Fresh Vegetables", slug: "vegetables", image: "https://images.unsplash.com/photo-1518843875459-f738682238a6?auto=format&fit=crop&q=80&w=1000" },
  { name: "Orchard Fruits", slug: "fruits", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=1000" },
  { name: "Aromatic Herbs", slug: "herbs", image: "https://images.unsplash.com/photo-1507027682794-35e6c12ad5b4?auto=format&fit=crop&q=80&w=1000" },
  { name: "Other Products", slug: "other", image: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&q=80&w=1000" }
];

export default function Categories() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {categories.map((cat, i) => (
        <a href={`/products?category=${cat.slug}`} key={i} className="group relative overflow-hidden rounded-2xl h-80 cursor-pointer shadow-xl block">
          <img src={cat.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat.name} />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-white text-2xl font-serif font-bold tracking-widest uppercase text-center px-4">{cat.name}</h3>
          </div>
        </a>
      ))}
    </div>
  );
}