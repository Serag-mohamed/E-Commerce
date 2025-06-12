'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  // 1. ابدأ الحالة بـ null أولاً
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const isFirst = useRef(true);

  // 2. احمل بيانات السلة من localStorage داخل useEffect
  useEffect(() => {
    const stored = localStorage.getItem('cart');
    setCart(stored ? JSON.parse(stored) : []);
  }, []);

  // 3. بعد أول كتابة، سماح للحفظ لاحقًا فقط
  useEffect(() => {
    if (cart === null) return; // تجاوز الكتابة الأولى
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 4. تعديل الكمية والحساب
  const updateQty = (id: number, qty: number) => {
    setCart(
      (prev) =>
        prev
          ?.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
          .filter((item) => item.quantity > 0) || []
    );
  };

  // 5. انتظار تحميل البيانات
  if (cart === null) {
    return <main className='p-10'>Loading...</main>;
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <main className='max-w-5xl mx-auto px-4 py-10'>
      <h1 className='text-4xl font-bold mb-8 text-center'>🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <div className='text-center text-gray-600 py-20'>
          <p className='text-xl mb-4'>Your cart is empty.</p>
          <Link
            href='/products'
            className='inline-block px-6 py-3 border-2 text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white rounded-full transition'
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className='space-y-6'>
            {cart.map((item) => (
              <div
                key={item.id}
                className='flex items-center gap-4 bg-white p-4 rounded-lg shadow-md'
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  priority
                  width={80}
                  height={80}
                  className='object-contain'
                />
                <div className=''>
                  <h2 className='text-lg font-semibold'>{item.title}</h2>
                  <div className='flex justify-between'>
                    <p className='text-gray-600'>${item.price.toFixed(2)}</p>
                    <p className='font-bold'>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className='mt-2 flex items-center gap-2'>
                    <label>
                      Qty:&nbsp;
                      <input
                        type='number'
                        min='1'
                        value={item.quantity}
                        onChange={(e) =>
                          updateQty(item.id, parseInt(e.target.value, 10))
                        }
                        className='w-16 border border-gray-300 rounded px-2 py-1'
                      />
                    </label>
                    <button
                      onClick={() => updateQty(item.id, 0)}
                      className='ml-4 text-red-600 hover:underline'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='mt-8 flex justify-end items-center gap-6'>
            <span className='text-2xl font-bold'>
              Total: ${total.toFixed(2)}
            </span>
            <button className='cursor-pointer px-6 py-3 border-2 border-blue-600 text-blue-600 hover:text-white rounded-full hover:bg-blue-600 transition'>
              Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}
