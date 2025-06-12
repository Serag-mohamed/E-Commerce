import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className='max-w-5xl mx-auto px-4 py-16 text-center'>
      <h1 className='text-4xl font-bold text-blue-700 mb-6'>About Us</h1>
      <div className='relative w-full max-h-[400px] aspect-[3/1] rounded-xl overflow-hidden shadow-md mb-10'>
        <Image
          src='/images/store.png'
          alt='About Us'
          fill
          className='object-cover'
        />
      </div>

      <p className='text-gray-700 text-lg mb-6 leading-relaxed'>
        Welcome to our store! We are dedicated to providing high-quality
        products at fair prices. Our mission is to make your online shopping
        experience easy, enjoyable, and secure.
      </p>

      <p className='text-gray-700 text-lg mb-6 leading-relaxed'>
        Whether you&apos;re looking for the latest electronics, stylish
        clothing, or everyday essentials, we&apos;ve got you covered. We
        carefully select our products to meet your needs and exceed your
        expectations.
      </p>

      <p className='text-gray-700 text-lg leading-relaxed'>
        Thank you for choosing us. We look forward to being part of your
        shopping journey.
      </p>
    </main>
  );
}
