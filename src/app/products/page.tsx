import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

async function fetchProductsData(): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products', {
    next: { revalidate: 14400 },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch products (Status: ${res.status})`);
  return res.json();
}

async function fetchCategoriesData(): Promise<string[]> {
  const res = await fetch('https://fakestoreapi.com/products/categories', {
    next: { revalidate: 86400 },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch categories (Status: ${res.status})`);
  return res.json();
}

const ALLOWED_PRODUCT_CATEGORIES = [
  'electronics',
  'jewelery',
  "men's clothing",
  "women's clothing",
];

function encodeRFC3986URIComponent(str: string) {
  return encodeURIComponent(str).replace(
    /[!'()*]/g,
    (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

const validateImageUrl = (url: string) => {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
};

export default async function ProductsPage() {
  let products: Product[] = [],
    categories: string[] = [],
    error: string | null = null;

  try {
    const [fetchedProducts, fetchedCategories] = await Promise.all([
      fetchProductsData(),
      fetchCategoriesData(),
    ]);
    products = fetchedProducts;
    categories = [
      'all',
      ...new Set(
        fetchedCategories.filter((cat) =>
          ALLOWED_PRODUCT_CATEGORIES.includes(cat)
        )
      ),
    ];
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unexpected error';
    console.error('ProductsPage error', err);
    categories = ['all', ...ALLOWED_PRODUCT_CATEGORIES];
  }

  return (
    <main className='max-w-7xl mx-auto px-4 py-10'>
      <h1 className='text-4xl font-bold text-blue-800 mb-8 text-center'>
        All Products
      </h1>

      <div className='mb-14 flex justify-center'>
        <ul className='flex flex-wrap justify-center gap-2'>
          {categories.map((category) => (
            <li key={category}>
              <Link
                href={
                  category === 'all'
                    ? '/products'
                    : `/products/categories/${encodeRFC3986URIComponent(
                        category
                      )}`
                }
                className={`inline-block px-4 py-2 rounded-full transition duration-200 capitalize ${
                  category === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-blue-100 text-gray-800 hover:text-blue-800'
                }`}
              >
                {category.replace(/-/g, ' ')}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {error ? (
        <div className='bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-center'>
          <p className='font-semibold'>Error loading products:</p>
          <p>{error}</p>
          <p className='mt-2 text-sm'>Please try refreshing the page.</p>
        </div>
      ) : products.length === 0 ? (
        <div className='text-center text-gray-600 p-8'>
          <p className='text-lg'>No products found at the moment.</p>
          <p className='text-md mt-2'>Please check back later!</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className='relative rounded-lg shadow-md p-4 hover:shadow-lg transition bg-white overflow-hidden group flex flex-col items-center text-center'
            >
              {/* تراكب "View Details" */}
              <div className='absolute inset-0 bg-blue-800/70 opacity-0 group-hover:opacity-100 z-10 flex items-center justify-center transition duration-300 rounded-lg'>
                <span className='text-white text-lg font-semibold'>
                  View Details
                </span>
              </div>

              {validateImageUrl(product.image) ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  width={250}
                  height={250}
                  className='mx-auto object-contain h-56 w-auto transition-transform duration-300 group-hover:scale-105 z-0 relative'
                  priority
                />
              ) : (
                <div className='h-56 w-full bg-gray-200 flex items-center justify-center rounded-lg'>
                  <span className='text-gray-500'>Invalid Image URL</span>
                </div>
              )}

              <h2 className='text-lg font-semibold mt-4 truncate relative z-20 w-full px-2'>
                {product.title}
              </h2>
              <p className='text-blue-600 font-bold mt-1 relative z-20'>
                ${product.price.toFixed(2)}
              </p>
              <p className='text-gray-500 text-sm mt-1 capitalize relative z-20'>
                {product.category.replace(/-/g, ' ')}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
