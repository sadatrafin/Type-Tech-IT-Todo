import BlogHeader from "@/components/BlogHeader";
import BlogPostsList from "@/components/BlogPostsList";
import Pagination from "@/components/Pagination";
import Link from "next/link";

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

// --- MAIN PAGE COMPONENT ---
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Extract pagination info from URL
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const productsPerPage = 12;

  // Fetch Data
  const res = await fetch("https://dummyjson.com/products?limit=194", {
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  const allProducts: Product[] = data.products;

  // Calculate pagination
  const totalPages = Math.ceil(allProducts.length / productsPerPage);
  const displayedProducts = allProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  return (
    <main className="min-h-screen bg-slate-50/50 py-16 px-4">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">

        {displayedProducts.length > 0 ? (
          <>
            <BlogPostsList displayedPosts={displayedProducts} />
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 animate-in fade-in duration-700">
            <p className="text-slate-400 text-lg mb-4">No articles found on this page.</p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg"
            >
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
