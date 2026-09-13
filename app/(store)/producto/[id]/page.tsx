// app/(store)/producto/[id]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import ProductGallery from "@/components/store/ProductGallery";
import ProductInfo from "@/components/store/ProductInfo";
import ProductTabs from "@/components/store/ProductTabs";
import RelatedProducts from "@/components/store/RelatedProducts";
import { newArrivals, moreProducts } from "@/data/products";

const allProducts = [...newArrivals, ...moreProducts];

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductoPage({ params }: PageProps) {
  const { id } = await params;
  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-purple-600 transition-colors">
          Inicio
        </Link>
        <FiChevronRight className="w-3 h-3" />
        <Link
          href={`/productos?categoria=${product.category}`}
          className="hover:text-purple-600 transition-colors capitalize"
        >
          {product.category}
        </Link>
        <FiChevronRight className="w-3 h-3" />
        <span className="text-slate-700 font-medium line-clamp-1">
          {product.name}
        </span>
      </nav>

      {/* Producto: galería + info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <ProductGallery product={product} />
        <ProductInfo product={product} />
      </div>

      {/* Tabs: descripción, specs, garantía */}
      <ProductTabs product={product} />

      {/* Productos relacionados */}
      <RelatedProducts product={product} />
    </div>
  );
}