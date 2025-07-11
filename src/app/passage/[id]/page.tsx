'use client';

import { useParams, useRouter } from 'next/navigation';

const types = ['1', '2', '3', '4'];

export default function PassageTypeSelector() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-12">Choose {id}</h1>

      <div className="flex flex-col space-y-6">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => router.push(`/passage/${id}/${type}`)}
            className="w-64 h-16 bg-gray-800 hover:bg-gray-700 transition rounded-xl text-lg font-semibold"
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}