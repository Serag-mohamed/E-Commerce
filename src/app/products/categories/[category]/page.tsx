// app/products/categories/[category]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

const ALLOWED_PRODUCT_CATEGORIES = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
];

// توليد المسارات الثابتة
export async function generateStaticParams(): Promise<{ category: string }[]> {
  const res = await fetch('https://fakestoreapi.com/products/categories', {
    next: { revalidate: 86400 },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch categories (status: ${res.status})`);
  const cats: string[] = await res.json();
  return cats
    .filter((c) => ALLOWED_PRODUCT_CATEGORIES.includes(c))
    .map((c) => ({ category: encodeURIComponent(c) }));
}

// لمنع إنشاء صفحات لفئات غير معرفة
export const dynamicParams = false;

const validateImageUrl = (url: string) => {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
};

export default async function CategoryProductsPage({
  params,
}: {
  params: { category: string };
}) {
  const currentCategory = decodeURIComponent(params.category);
  if (!ALLOWED_PRODUCT_CATEGORIES.includes(currentCategory)) return notFound();

  const [prodRes, catRes] = await Promise.all([
    fetch('https://fakestoreapi.com/products', { next: { revalidate: 14400 } }),
    fetch('https://fakestoreapi.com/products/categories', {
      next: { revalidate: 86400 },
    }),
  ]);
  if (!prodRes.ok || !catRes.ok) throw new Error('Fetch failed');

  const allProducts: Product[] = await prodRes.json();
  const allCategories: string[] = await catRes.json();

  const products = allProducts.filter((p) => p.category === currentCategory);
  const categories = [
    'all',
    ...new Set(
      allCategories.filter((c) => ALLOWED_PRODUCT_CATEGORIES.includes(c))
    ),
  ];

  return (
    <main className='max-w-7xl mx-auto px-4 py-10'>
      <h1 className='text-4xl font-bold text-center text-blue-800 mb-8 capitalize'>
        {currentCategory.replace(/-/g, ' ')}
      </h1>

      <ul className='flex justify-center flex-wrap gap-2 mb-14'>
        {categories.map((c) => (
          <li key={c}>
            <Link
              href={
                c === 'all'
                  ? '/products'
                  : `/products/categories/${encodeURIComponent(c)}`
              }
              className={`px-4 py-2 rounded-full capitalize ${
                c === currentCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-blue-100 text-gray-800'
              }`}
            >
              {c.replace(/-/g, ' ')}
            </Link>
          </li>
        ))}
      </ul>

      {products.length === 0 ? (
        <div className='text-center text-gray-600 p-8'>
          <p>No products found in {currentCategory.replace(/-/g, ' ')}.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className='group relative rounded-lg shadow-md p-4 overflow-hidden bg-white hover:shadow-lg transition'
            >
              <div className='absolute inset-0 z-10 bg-blue-800/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition'>
                <span className='text-white text-lg font-semibold'>
                  View Details
                </span>
              </div>
              {validateImageUrl(product.image) ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  priority
                  width={250}
                  height={250}
                  className='mx-auto object-contain h-56 group-hover:scale-105 transition-transform duration-300'
                />
              ) : (
                <div className='h-56 bg-gray-200 flex items-center justify-center'>
                  <span className='text-gray-500'>Invalid Image URL</span>
                </div>
              )}
              <h2 className='mt-4 text-lg font-semibold'>{product.title}</h2>
              <p className='text-blue-600 font-bold mt-1'>{`$${product.price.toFixed(
                2
              )}`}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
