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

// دوال fetch للوصول للمنتجات والفئات
async function fetchProductsData(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products', {
    next: { revalidate: 14400 },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch products (status: ${res.status})`);
  return res.json();
}

async function fetchCategoriesData(): Promise<string[]> {
  const res = await fetch('https://fakestoreapi.com/products/categories', {
    next: { revalidate: 86400 },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch categories (status: ${res.status})`);
  return res.json();
}

const ALLOWED_PRODUCT_CATEGORIES = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
];
const validateImageUrl = (url: string) => {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
};

// ✅ دالة توليد المسارات الثابتة لكل فئة
export async function generateStaticParams(): Promise<{ category: string }[]> {
  const categories = await fetchCategoriesData();
  return categories
    .filter((c) => ALLOWED_PRODUCT_CATEGORIES.includes(c))
    .map((category) => ({ category: encodeURIComponent(category) }));
}

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: rawCategory } = await params;
  const currentCategory = decodeURIComponent(rawCategory);

  if (!ALLOWED_PRODUCT_CATEGORIES.includes(currentCategory)) return notFound();

  let products: Product[] = [];
  let categories: string[] = [];
  let fetchError: string | null = null;

  try {
    const [allProducts, allCategories] = await Promise.all([
      fetchProductsData(),
      fetchCategoriesData(),
    ]);
    products = allProducts.filter((p) => p.category === currentCategory);
    categories = [
      'all',
      ...new Set(
        allCategories.filter((c) => ALLOWED_PRODUCT_CATEGORIES.includes(c))
      ),
    ];
  } catch (err) {
    console.error('CategoryProductsPage error:', err);
    fetchError = err instanceof Error ? err.message : 'Unexpected error';
    categories = ['all', ...ALLOWED_PRODUCT_CATEGORIES];
  }

  if (fetchError) {
    return (
      <main className='max-w-7xl mx-auto px-4 py-10'>
        <div className='bg-red-50 text-red-600 p-4 rounded-lg mb-6'>
          <p>Error loading category products: {fetchError}</p>
          <Link href='/products' className='text-blue-600 hover:underline'>
            Back to all products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className='max-w-7xl mx-auto px-4 py-10'>
      <h1 className='text-center text-4xl font-bold text-blue-800 mb-8 capitalize'>
        {currentCategory === 'all'
          ? 'All Products'
          : currentCategory.replace(/-/g, ' ')}
      </h1>

      <div className='mb-14 flex justify-center'>
        <ul className='flex flex-wrap gap-2'>
          {categories.map((cat) => (
            <li key={cat}>
              <Link
                href={
                  cat === 'all'
                    ? '/products'
                    : `/products/categories/${encodeURIComponent(cat)}`
                }
                className={`inline-block px-4 py-2 rounded-full capitalize transition ${
                  (cat === 'all' && currentCategory === 'all') ||
                  cat === currentCategory
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-blue-100 text-gray-800 hover:text-blue-800'
                }`}
              >
                {cat.replace(/-/g, ' ')}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {products.length === 0 ? (
        <div className='text-center text-gray-600 p-8'>
          <p>No products found in {currentCategory.replace(/-/g, ' ')}.</p>
          <p className='mt-2'>Please check again later.</p>
          <Link
            href='/products'
            className='text-blue-600 hover:underline block mt-4'
          >
            Back to all products
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className='relative rounded-lg shadow-md p-4 hover:shadow-lg transition bg-white group text-center overflow-hidden'
            >
              <div className='absolute inset-0 z-10 bg-blue-800/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-lg'>
                <span className='text-white font-semibold'>View Details</span>
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
                <div className='h-56 bg-gray-200 flex items-center justify-center rounded-lg'>
                  <span className='text-gray-500'>Invalid Image URL</span>
                </div>
              )}
              <h2 className='text-lg font-semibold mt-4'>{product.title}</h2>
              <p className='text-blue-600 font-bold mt-1'>
                ${product.price.toFixed(2)}
              </p>
              <p className='text-gray-500 text-sm capitalize mt-1'>
                {product.category.replace(/-/g, ' ')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
