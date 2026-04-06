'use client';

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-12 animate-in fade-in duration-700 delay-300">
      <Link
        href={`?page=${Math.max(1, currentPage - 1)}`}
        className={`p-2 rounded-lg border border-slate-200 transition-all duration-300 ${
          currentPage === 1
            ? "pointer-events-none opacity-40"
            : "hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>

      {Array.from({ length: totalPages }).map((_, i) => (
        <Link
          key={i}
          href={`?page=${i + 1}`}
          className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-all duration-300 border ${
            currentPage === i + 1
              ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 scale-110"
              : "bg-white text-slate-500 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 hover:shadow-md"
          }`}
        >
          {i + 1}
        </Link>
      ))}

      <Link
        href={`?page=${Math.min(totalPages, currentPage + 1)}`}
        className={`p-2 rounded-lg border border-slate-200 transition-all duration-300 ${
          currentPage === totalPages
            ? "pointer-events-none opacity-40"
            : "hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  );
}
