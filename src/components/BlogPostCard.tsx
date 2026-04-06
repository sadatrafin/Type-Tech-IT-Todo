'use client';

import { ShoppingCart, Star, Percent } from "lucide-react";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  discountPercentage: number;
  thumbnail: string;
  images?: string[];
}

export default function BlogPostCard({ post }: { post: Product }) {
  const discountedPrice = (post.price * (1 - post.discountPercentage / 100)).toFixed(2);

  return (
    <div className="group rounded-xl overflow-hidden bg-white border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col h-full animate-in fade-in slide-in-from-bottom-4">
      <div className="relative overflow-hidden aspect-16/10">
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg bg-white/95 text-indigo-600 shadow-sm border border-indigo-50 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
          {post.category}
        </span>

        {/* Discount Badge */}
        {post.discountPercentage > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg bg-red-500/90 text-white shadow-sm">
            <Percent className="w-3 h-3" />
            {post.discountPercentage.toFixed(0)}%
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col grow space-y-4">
        <div className="grow space-y-3">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 transition-colors duration-300 ${
                    i < Math.round(post.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-600">{post.rating.toFixed(1)}</span>
          </div>

          <h4 className="text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300">
            {post.title}
          </h4>

          <p className="text-sm text-slate-500 line-clamp-2 group-hover:text-slate-600 transition-colors">
            {post.description}
          </p>
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-2 py-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-600">${discountedPrice}</span>
            {post.discountPercentage > 0 && (
              <span className="text-sm text-slate-400 line-through">${post.price.toFixed(2)}</span>
            )}
          </div>
        </div>

        <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 bg-white border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-100 group/btn">
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
