// app/products/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/addToCartButton';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

async function getProductDetails(productId: string): Promise<Product | null> {
  const res = await fetch(`https://fakestoreapi.com/products/${productId}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(
      `Failed to fetch product ${productId} (Status: ${res.status})`
    );
  }
  return res.json();
}

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const res = await fetch('https://fakestoreapi.com/products', {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return [];
  const products: Product[] = await res.json();
  return products.map((p) => ({ id: p.id.toString() }));
}

const validateImageUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: productId } = await params;
  let product: Product | null = null;
  let fetchError: string | null = null;

  try {
    product = await getProductDetails(productId);
    if (!product) return notFound();
  } catch (err) {
    fetchError = err instanceof Error ? err.message : 'Unexpected error';
    console.error(`Error loading product ${productId}:`, err);
  }

  if (fetchError) {
    return (
      <main className='max-w-4xl mx-auto px-4 py-10'>
        <div className='bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center'>
          <p className='font-semibold'>Error loading product details:</p>
          <p>{fetchError}</p>
          <p className='mt-2 text-sm'>Please try refreshing or go back.</p>
          <Link
            href='/products'
            className='text-blue-600 hover:text-blue-800 mt-4 block'
          >
            Back to all products
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className='max-w-4xl mx-auto px-4 py-10 text-center text-gray-600'>
        <p className='text-lg'>Product not found.</p>
        <Link
          href='/products'
          className='text-blue-600 hover:text-blue-800 mt-4 block'
        >
          Back to all products
        </Link>
      </main>
    );
  }

  return (
    <main className='max-w-4xl mx-auto px-4 py-10'>
      <div className='bg-white shadow-lg rounded-lg p-6 flex flex-col items-center  gap-8'>
        {validateImageUrl(product.image) ? (
          <Image
            src={product.image}
            alt={product.title}
            width={300}
            height={300}
            className='object-contain rounded-lg shadow-md max-h-80 w-auto'
            priority
          />
        ) : (
          <div className='w-80 h-80 bg-gray-200 flex items-center justify-center rounded-lg'>
            <span className='text-gray-500'>Invalid Image URL</span>
          </div>
        )}

        <div className='flex-grow text-center '>
          <h1 className='text-3xl md:text-4xl font-extrabold text-blue-800 mb-4'>
            {product.title}
          </h1>
          <p className='text-gray-600 text-lg mb-4 capitalize'>
            Category:{' '}
            <Link
              href={`/products/categories/${encodeURIComponent(
                product.category
              )}`}
              className='text-blue-600 hover:underline'
            >
              {product.category.replace(/-/g, ' ')}
            </Link>
          </p>
          <p className='text-green-700 text-3xl font-bold mb-6'>
            ${product.price.toFixed(2)}
          </p>
          <p className='text-gray-700 mb-6 leading-relaxed'>
            {product.description}
          </p>
          <div className='flex items-center justify-center mb-6'>
            <span className='text-yellow-500 text-xl font-bold mr-2'>
              {product.rating.rate}
            </span>
            <span className='text-gray-500 text-sm'>
              ({product.rating.count} reviews)
            </span>
          </div>
          <AddToCartButton product={product} />
        </div>
      </div>

      <div className='mt-10 text-center'>
        <Link
          href='/products'
          className='text-blue-600 hover:text-blue-800 text-lg font-medium'
        >
          ← Back to All Products
        </Link>
      </div>
    </main>
  );
}
