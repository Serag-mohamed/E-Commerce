'use client';
import { useCart } from '@/contexts/CartContext';

export default function AddToCartButton({
  product,
}: {
  product: { id: number; title: string; price: number; image: string };
}) {
  const { addItem } = useCart();
  return (
    <button
      onClick={() =>
        addItem({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        })
      }
      className='cursor-pointer w-auto rounded-full border-2 text-blue-600 border-blue-600 hover:bg-blue-700 hover:text-white font-bold py-3 px-6 shadow-md transition duration-300'
    >
      Add to Cart
    </button>
  );
}
