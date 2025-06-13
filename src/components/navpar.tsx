'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, CircleUserRound } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

const iconLinks = [
  { href: '/cart', icon: ShoppingCart, label: 'Cart' },
  { href: '/account', icon: CircleUserRound, label: 'Account' },
];
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  // دالة لحساب العدد الإجمالي للعناصر في السلة من localStorage
  const getTotalItems = () => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      return cart.reduce(
        (total: number, item: CartItem) => total + item.quantity,
        0
      );
    }
    return 0;
  };

  useEffect(() => {
    setTotalItems(getTotalItems());
  }, [pathname]);

  return (
    <nav className='bg-white shadow-md sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
        {/* الشعار */}
        <Link
          href='/'
          className='text-3xl font-bold text-blue-600 hover:text-blue-800 transition-colors duration-300'
        >
          Siraj Store
        </Link>

        {/* قائمة سطح المكتب */}
        <div className='hidden md:flex items-center space-x-6 text-gray-700 font-medium'>
          <ul className='flex space-x-6'>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative pb-1 transition-colors duration-300 
                      ${
                        isActive
                          ? 'text-blue-600 font-bold'
                          : 'hover:text-blue-600'
                      }
                      after:content-[''] after:absolute after:left-1/2 after:bottom-0 
                      after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300
                      after:w-0 hover:after:left-0 hover:after:w-full`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* روابط الأيقونات */}
          <div className='flex items-center space-x-4 ml-4'>
            {iconLinks.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative hover:text-blue-600 transition-colors duration-300 ${
                    isActive ? 'text-blue-600' : 'text-gray-700'
                  }`}
                  title={label}
                >
                  <Icon className='w-6 h-6' />
                  {/* عرض عدد العناصر فوق أيقونة السلة فقط */}
                  {label === 'Cart' && totalItems > 0 && (
                    <span className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold'>
                      {totalItems}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* زر القائمة للموبايل */}
        <button
          onClick={toggleMenu}
          className='md:hidden text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-300'
        >
          {isOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
        </button>
      </div>

      {/* قائمة الموبايل */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[500px]' : 'max-h-0'
        }`}
      >
        <ul className='bg-white px-4 pb-4 pt-2 space-y-3 text-gray-700 font-medium'>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative block pb-1 transition-colors duration-300 
                    ${
                      isActive
                        ? 'text-blue-600 font-bold'
                        : 'hover:text-blue-600'
                    }
                    hover:translate-x-2 transition-transform duration-300`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}

          {/* روابط الأيقونات في الموبايل */}
          <div className='flex items-center space-x-6 pt-2 pl-1'>
            {iconLinks.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative hover:text-blue-600 transition-colors duration-300 ${
                    isActive ? 'text-blue-600' : 'text-gray-700'
                  }`}
                  title={label}
                >
                  <Icon className='w-5 h-5' />
                  {/* عرض العدد في الموبايل أيضا فوق أيقونة السلة */}
                  {label === 'Cart' && totalItems > 0 && (
                    <span className='absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-semibold'>
                      {totalItems}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
