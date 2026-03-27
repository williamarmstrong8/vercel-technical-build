'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const EXAMPLE_PROMPTS = [
  'Find tech clubs for college students',
  'What run clubs do you have?',
  'I have a $500 budget, what can I sponsor?',
];

export default function Home() {
  const [input, setInput] = useState('');
  const router = useRouter();

  function handleSend(text: string) {
    const q = text.trim();
    if (!q) return;
    router.push(`/chat?q=${encodeURIComponent(q)}`);
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 gap-8">
      <Image
        src="/clubpack-logo-full.png"
        alt="ClubPack"
        width={320}
        height={80}
        className="object-contain"
        priority
      />

      <div className="flex flex-wrap justify-center gap-2">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="px-4 py-2 text-sm border border-zinc-300 rounded-full text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="flex items-center w-full max-w-xl border border-zinc-300 rounded-full px-5 py-3 shadow-sm">
        <input
          className="flex-1 text-base outline-none text-zinc-800 placeholder:text-zinc-400"
          placeholder="type your questions about clubs here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend(input);
          }}
        />
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim()}
          className="ml-3 w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </main>
  );
}
