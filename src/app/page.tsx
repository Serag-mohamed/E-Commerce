// app/home/page.tsx
'use client';

import useSWR from 'swr';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// واجهة المنتج
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

// الفئات المسموح بها
const ALLOWED_PRODUCT_CATEGORIES = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
];

// تحقق من رابط صورة HTTPS
const validateImageUrl = (url: string) => {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
};

// دالة fetch لـ SWR
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const productsPerPage = 4;

  const { data: products, error: prodErr } = useSWR<Product[]>(
    'https://fakestoreapi.com/products',
    fetcher
  );
  const { data: categories, error: catErr } = useSWR<string[]>(
    'https://fakestoreapi.com/products/categories',
    fetcher
  );

  const loading = !products || !categories;
  const error = prodErr || catErr;

  const paginated = products
    ? products.slice((page - 1) * productsPerPage, page * productsPerPage)
    : [];

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', p.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <main className='max-w-7xl mx-auto px-4 py-10'>
      {/* Hero */}
      <section className='bg-blue-100 py-16 rounded-xl text-center mb-16'>
        <h1 className='text-5xl font-bold text-blue-800'>Siraj Store</h1>
        <p className='mt-4 text-lg text-gray-700'>
          Explore electronics, fashion, jewelery, and more.
        </p>
        <Link
          href='/products'
          className='mt-6 inline-block px-8 py-3 border border-blue-600 bg-white text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition'
        >
          Shop Now
        </Link>
      </section>

      {/* Error */}
      {error && (
        <div className='bg-red-50 text-red-600 p-4 mb-6 rounded'>
          <p>Error: {(error as Error).message}</p>
          <button
            onClick={() => router.replace(pathname)}
            className='mt-2 underline'
          >
            Try Again
          </button>
        </div>
      )}

      {/* Featured Products */}
      <section>
        <h2 className='text-center text-3xl font-bold mb-6 text-blue-700'>
          Featured Products
        </h2>
        {loading ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-pulse'>
            {Array.from({ length: productsPerPage }).map((_, i) => (
              <div key={i} className='h-64 bg-gray-200 rounded-lg'></div>
            ))}
          </div>
        ) : !products?.length ? (
          <p className='text-red-500'>No products available.</p>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
              {paginated.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className='relative group bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col items-center text-center'
                >
                  <div className='absolute z-10 inset-0 bg-blue-800/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-lg'>
                    <span className='text-white text-lg font-semibold'>
                      View Details
                    </span>
                  </div>
                  {validateImageUrl(product.image) ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      priority
                      width={200}
                      height={200}
                      className='mx-auto object-contain h-48 group-hover:scale-105 transition-transform duration-300'
                    />
                  ) : (
                    <div className='h-48 bg-gray-200 flex items-center justify-center'>
                      <span className='text-gray-500'>Invalid Image</span>
                    </div>
                  )}
                  <h3 className='mt-4 font-semibold'>{product.title}</h3>
                  <p className='text-blue-600 font-bold'>
                    ${product.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
            {products.length > productsPerPage && (
              <div className='flex justify-center mt-8 gap-2'>
                {Array.from({
                  length: Math.ceil(products.length / productsPerPage),
                }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`px-4 py-2 rounded-full ${
                      page === i + 1
                        ? 'bg-blue-600 text-white  cursor-pointer'
                        : 'bg-gray-200 hover:bg-blue-300 transition duration-300 cursor-pointer'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Browse Categories */}
      <section className='mt-20'>
        <h2 className='text-center text-2xl font-bold mb-6 text-gray-800'>
          Browse Categories
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
          {categories
            ?.filter((cat) => ALLOWED_PRODUCT_CATEGORIES.includes(cat))
            .map((category) => {
              const example = products?.find((p) => p.category === category);
              return (
                <Link
                  key={category}
                  href={`/products/categories/${encodeURIComponent(category)}`}
                  className='relative group bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition overflow-hidden flex flex-col items-center text-center'
                >
                  <div className='absolute z-10 inset-0 bg-blue-800/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-lg'>
                    <span className='text-white text-lg font-semibold'>
                      View Products
                    </span>
                  </div>
                  {example && validateImageUrl(example.image) ? (
                    <Image
                      src={example.image}
                      alt={example.title}
                      priority
                      width={200}
                      height={200}
                      className='mx-auto object-contain h-40 group-hover:scale-105 transition-transform duration-300'
                    />
                  ) : (
                    <div className='h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500'>
                      لا توجد صورة
                    </div>
                  )}
                  <h3 className='mt-4 text-lg font-semibold capitalize text-blue-800'>
                    {category.replace(/-/g, ' ')}
                  </h3>
                </Link>
              );
            })}
        </div>
      </section>

      {/* Newsletter */}
      <section className='bg-blue-100 py-20 mt-24 rounded-xl text-center'>
        <h3 className='text-3xl font-bold text-blue-800 mb-4'>Stay Updated!</h3>
        <p className='mb-8 text-lg text-gray-700'>
          Subscribe to get the latest offers.
        </p>
        <form className='flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto px-4'>
          <div className='relative h-12 w-full sm:flex-1'>
            <input
              type='email'
              required
              placeholder=''
              className='peer w-full h-full bg-transparent border-b-2 border-gray-300 focus:border-blue-500 px-2 transition'
            />
            <label className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-blue-500 peer-placeholder-shown:top-1/2'>
              Email
            </label>
          </div>
          <button
            type='submit'
            className='bg-white border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full px-6 py-2 transition'
          >
            Subscribe
          </button>
        </form>
      </section>
    </main>
  );
}
