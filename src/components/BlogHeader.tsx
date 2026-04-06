'use client';

import { BookOpen } from "lucide-react";

export default function BlogHeader() {
  return (
    <header className="mb-16 text-center animate-in fade-in slide-in-from-top-6 duration-700">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4 transform transition-all duration-500 hover:shadow-md hover:bg-indigo-100">
        <BookOpen className="w-3 h-3" />
        Premium Collection
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight transition-all duration-500">
        Discover Our <span className="bg-linear-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">Products</span>
      </h1>
      <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed transition-all duration-500 hover:text-slate-600">
        Browse our curated selection of quality products with exclusive discounts and professional recommendations.
      </p>
    </header>
  );
}
