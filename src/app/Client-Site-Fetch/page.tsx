"use client"

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  User,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Loader2,
  Search,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- TYPES ---
interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image?: string;
}

// --- COMPONENT: SKELETON LOADING ---
const SkeletonCard = () => (
  <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-4 overflow-hidden relative">
    <div className="aspect-16/10 bg-slate-100 rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
    <div className="h-4 bg-slate-100 rounded w-1/4" />
    <div className="h-6 bg-slate-100 rounded w-full" />
    <div className="h-10 bg-slate-100 rounded w-full mt-4" />
  </div>
);

interface PostCardProps {
  post: Post;
  index: number;
  key?: React.Key;
}

// --- COMPONENT: POST CARD ---
const PostCard = ({ post, index }: PostCardProps) => {
  const fallbackImage = `https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group rounded-2xl overflow-hidden bg-white border border-slate-200/60 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
    >
      <div className="relative overflow-hidden aspect-16/10">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          src={post.image || fallbackImage}
          alt={post.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute top-4 left-4 px-3 py-1 text-[10px] uppercase tracking-widest font-bold rounded-full bg-white/90 backdrop-blur-sm text-indigo-600 shadow-sm border border-indigo-50">
          {post.category}
        </span>
      </div>

      <div className="p-6 flex flex-col grow space-y-4">
        <div className="grow space-y-3">
          <div className="flex items-center text-slate-400 text-xs gap-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />{" "}
              {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" /> {post.author}
            </span>
          </div>
          <h4 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
            {post.title}
          </h4>
        </div>

        <button
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-200 group/btn"
        >
          Read Article
          <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

// --- COMPONENT: PAGINATION ---
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex items-center justify-center gap-3 mt-16">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`p-2.5 rounded-xl border border-slate-200 transition-all ${
          currentPage === 1 
            ? "opacity-30 cursor-not-allowed" 
            : "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 bg-white"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold transition-all border ${
              currentPage === i + 1
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-200 scale-110"
                : "bg-white text-slate-500 border-slate-200 hover:border-indigo-400 hover:text-indigo-600"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`p-2.5 rounded-xl border border-slate-200 transition-all ${
          currentPage === totalPages 
            ? "opacity-30 cursor-not-allowed" 
            : "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 bg-white"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);
      try {
        // 1. Fetch Data
        const res = await fetch("https://api.vercel.app/blog", {
          next: { revalidate: 3600 },
        } as any);
        if (!res.ok) throw new Error();
        const allPosts: Post[] = await res.json();
        setPosts(allPosts);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { displayedPosts, totalPages } = useMemo(() => {
    // 2. Client-side Pagination Simulation (since the API returns all)
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const displayedPosts = posts.slice(
      (currentPage - 1) * postsPerPage,
      currentPage * postsPerPage,
    );
    return { displayedPosts, totalPages };
  }, [posts, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-red-100 text-center"
        >
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
            Oops!
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            We couldn't reach the server. Please check your internet connection or try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            Retry Connection
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] selection:bg-indigo-100 selection:text-indigo-700">
      {/* Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/40 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-100/30 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Header Section */}
        <header className="mb-20 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-indigo-100/50"
          >
            <TrendingUp className="w-3 h-3" />
            Insights & Innovation
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]"
          >
            The <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-600">Future</span> of Tech
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed"
          >
            Discover deep dives into modern architecture, AI breakthroughs, and the stories shaping our digital landscape.
          </motion.p>

          {/* Search Bar Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 max-w-lg mx-auto relative group"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search articles..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </motion.div>
        </header>

        {/* Content Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : displayedPosts.length > 0 ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} index={index} />
                ))}
              </div>
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-white rounded-4xl border border-slate-200 shadow-sm"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-slate-500 text-xl font-medium mb-4">No articles found on this page.</p>
              <button
                onClick={() => handlePageChange(1)}
                className="text-indigo-600 font-bold hover:underline underline-offset-4"
              >
                Return to Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl">J</div>
            <span className="text-xl font-black text-slate-900 tracking-tight">Journal</span>
          </div>
          <div className="text-slate-400 text-sm">
            © 2026 Journal Premium. All rights reserved.
          </div>
          <div className="flex gap-6 text-slate-500 text-sm font-medium">
            <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Newsletter</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
