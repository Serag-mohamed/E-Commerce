'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSent, setisSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setisSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => {
      setisSent(false);
    }, 1000);
  };

  return (
    <section className='max-w-3xl mx-auto px-4 py-16'>
      <h1 className='text-3xl font-bold text-blue-700 mb-8 text-center'>
        Contact Us
      </h1>

      <form
        onSubmit={handleSubmit}
        className='space-y-6 bg-white p-6 rounded-2xl'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='relative h-8 my-2.5'>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='peer w-full h-full text-lg outline-none border-b-2 border-gray-300 bg-transparent p-2 focus:border-blue-800'
              required
            />
            <label
              htmlFor='name'
              className='absolute top-1/2 -translate-y-[80%] start-0 text-gray-500 transition-all duration-500 ease-in-out peer-focus:-translate-y-[180%] peer-focus:text-sm peer-focus:text-blue-800 peer-valid:-translate-y-[180%] peer-valid:text-sm cursor-text'
            >
              Name
            </label>
          </div>

          <div className='relative h-8 my-2.5'>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='peer w-full h-full text-lg outline-none border-b-2 border-gray-300 bg-transparent p-2 focus:border-blue-800'
              required
            />
            <label
              htmlFor='email'
              className='absolute top-1/2 -translate-y-[80%] start-0 text-gray-500 transition-all duration-500 ease-in-out peer-focus:-translate-y-[180%] peer-focus:text-sm peer-focus:text-blue-800 peer-valid:-translate-y-[180%] peer-valid:text-sm cursor-text'
            >
              Email
            </label>
          </div>

          <div className='relative h-8 my-2.5 md:col-span-2'>
            <input
              type='text'
              id='subject'
              name='subject'
              value={formData.subject}
              onChange={handleChange}
              className='peer w-full h-full text-lg outline-none border-b-2 border-gray-300 bg-transparent p-2 focus:border-blue-800'
              required
            />
            <label
              htmlFor='subject'
              className='absolute top-1/2 -translate-y-[80%] start-0 text-gray-500 transition-all duration-500 ease-in-out peer-focus:-translate-y-[180%] peer-focus:text-sm peer-focus:text-blue-800 peer-valid:-translate-y-[180%] peer-valid:text-sm cursor-text'
            >
              Subject
            </label>
          </div>
        </div>

        <div>
          <textarea
            id='message'
            name='message'
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className='w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:border-blue-800'
            placeholder='Your message...'
            required
          ></textarea>
        </div>

        <div className='pt-2 flex items-center justify-center'>
          <button
            type='submit'
            className='bg-white border border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white rounded-full px-6 py-2 transition-colors duration-300 ease-in-out'
          >
            Send Message
          </button>
        </div>
      </form>
      <div
        className={`${
          isSent ? 'opacity-100' : 'opacity-0'
        } mt-4 text-center font-bold text-xl text-blue-800 bg-green-100 border border-green-400 rounded-lg p-4 transition-opacity duration-300 ease-in-out`}
      >
        <span>Message sent successfully</span>
      </div>
    </section>
  );
}
