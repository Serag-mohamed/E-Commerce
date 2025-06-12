// components/Footer.tsx
import Link from 'next/link';
import { ShoppingCart, CircleUserRound } from 'lucide-react';

const Footer = () => {
  return (
    <footer className='bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-16'>
      <div className='max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8'>
        {/* Logo & Description */}
        <div className='text-center md:text-left col-span-1 md:col-span-1'>
          <h2 className='text-2xl font-bold text-blue-600'>Siraj Store</h2>
          <p className='mt-4 text-sm max-w-sm mx-auto md:mx-0'>
            Shop the best products with ease and comfort. Quality you can trust!
          </p>
        </div>

        {/* Wrapper for other sections */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 col-span-1 md:col-span-3'>
          {/* Navigation Links */}
          <div className='text-center sm:text-left'>
            <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link href='/' className='hover:text-blue-600'>
                  Home
                </Link>
              </li>
              <li>
                <Link href='/products' className='hover:text-blue-600'>
                  Products
                </Link>
              </li>
              <li>
                <Link href='/about' className='hover:text-blue-600'>
                  About Us
                </Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-blue-600'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className='text-center sm:text-left'>
            <h3 className='text-lg font-semibold mb-4'>Legal</h3>
            <ul className='space-y-2 text-sm'>
              <li className='hover:text-blue-600 cursor-pointer'>
                Privacy Policy
              </li>
              <li className='hover:text-blue-600 cursor-pointer'>
                Terms of Service
              </li>
            </ul>
          </div>

          {/* Icons: Cart + Account */}
          <div className='text-center sm:text-left'>
            <h3 className='text-lg font-semibold mb-4'>Your Area</h3>
            <div className='flex justify-center sm:justify-start space-x-6'>
              <Link href='/cart' className='hover:text-blue-600' title='Cart'>
                <ShoppingCart size={24} />
              </Link>
              <Link
                href='/account'
                className='hover:text-blue-600'
                title='Account'
              >
                <CircleUserRound size={24} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-gray-300 dark:border-gray-700 py-4 text-center text-sm'>
        © {new Date().getFullYear()} Serag Store. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
