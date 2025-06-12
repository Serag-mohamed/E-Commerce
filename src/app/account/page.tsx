import Image from 'next/image';

interface User {
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
}

export default function AccountPage() {
  const user: User = {
    name: 'Siraj Mohamed',
    email: 'siraj@example.com',
    avatar: '/images/myPhoto.jpg',
    joinedAt: '2024-11-02',
  };

  return (
    <main className='max-w-3xl mx-auto px-4 py-10'>
      <h1 className='text-center text-3xl font-bold mb-8 text-blue-700'>
        My Account
      </h1>

      <div className='bg-white text-center sm:text-left shadow-md rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6'>
        <div>
          <Image
            src={user.avatar}
            alt={user.name}
            width={120}
            height={120}
            className='rounded-full border-4 border-blue-600'
          />
        </div>

        <div>
          <h2 className='text-xl font-semibold text-gray-900'>{user.name}</h2>
          <p className='text-gray-600'>{user.email}</p>
          <p className='text-gray-500 text-sm mt-2'>
            Joined on: <span className='font-medium'>{user.joinedAt}</span>
          </p>

          <div className='mt-6 flex gap-4'>
            <button className='cursor-pointer px-4 py-2 border border-blue-600 text-blue-600  rounded-full hover:bg-blue-700 hover:text-white transition'>
              Edit Profile
            </button>
            <button className='cursor-pointer px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition'>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
