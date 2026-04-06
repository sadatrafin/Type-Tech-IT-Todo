import Link from "next/link";
import BlogPostCard from "./BlogPostCard";

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

interface BlogPostsListProps {
  displayedPosts: Product[];
}

export default function BlogPostsList({ displayedPosts }: BlogPostsListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-700 delay-100">
      {displayedPosts.map((post, index) => (
        <div
          key={post.id}
          style={{
            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
          }}
        >
          <BlogPostCard post={post} />
        </div>
      ))}
    </div>
  );
}
