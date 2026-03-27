'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ReactMarkdown, { Components } from 'react-markdown';
import Image from 'next/image';

const EXAMPLE_PROMPTS = [
  'Find tech clubs for college students',
  'What run clubs do you have?',
  'I have a $500 budget, what can I sponsor?',
];

// Styled markdown components — no typography plugin needed
const mdComponents: Components = {
  p:      ({ children }) => <p className="mb-2 last:mb-0 leading-[1.65]">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-zinc-900">{children}</strong>,
  em:     ({ children }) => <em className="italic text-zinc-700">{children}</em>,
  ul:     ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
  ol:     ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
  li:     ({ children }) => <li className="leading-relaxed">{children}</li>,
  h1:     ({ children }) => <h1 className="text-base font-semibold text-zinc-900 mb-1 mt-3 first:mt-0">{children}</h1>,
  h2:     ({ children }) => <h2 className="text-base font-semibold text-zinc-900 mb-1 mt-3 first:mt-0">{children}</h2>,
  h3:     ({ children }) => <h3 className="text-sm font-semibold text-zinc-900 mb-1 mt-2 first:mt-0">{children}</h3>,
  hr:     () => <hr className="border-zinc-200 my-3" />,
  code:   ({ children }) => (
    <code className="font-[family-name:var(--font-geist-mono)] text-[11px] bg-zinc-200 text-zinc-800 px-1.5 py-0.5 rounded">
      {children}
    </code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-zinc-300 pl-3 text-zinc-500 italic my-2">{children}</blockquote>
  ),
};

function getToolStatus(type: string, state: string): { label: string; done: boolean } {
  const done = state === 'output-available';
  if (type.includes('searchClubs'))
    return { label: done ? 'Found matching clubs' : 'Searching ClubPack database…', done };
  if (type.includes('getPricing'))
    return { label: done ? 'Pricing retrieved' : 'Fetching pricing…', done };
  if (type.includes('escalateToHuman'))
    return { label: done ? 'Lead sent to sales team' : 'Escalating to sales team…', done };
  return { label: 'Working…', done };
}

function ChatInner() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'streaming' || status === 'submitted';
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasSentInitial = useRef(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !hasSentInitial.current) {
      hasSentInitial.current = true;
      sendMessage({ text: q });
      router.replace('/chat', { scroll: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSend() {
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput('');
  }

  return (
    <div className="flex flex-col h-screen bg-white font-[family-name:var(--font-geist-sans)]">

      {/* Header */}
      <header className="flex-none flex items-center gap-3 px-6 py-4 border-b border-zinc-100">
        <a href="/">
          <Image src="/clubpack-logo-full.png" alt="ClubPack" width={120} height={32} className="object-contain" />
        </a>
        <span className="text-xs text-zinc-400 tracking-wide">Sponsor Concierge</span>
      </header>

      {/* Message area */}
      <main className="flex-1 overflow-y-auto px-4 py-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-6">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-900 mb-2 tracking-tight">
                Welcome to ClubPack Sponsor Concierge
              </h1>
              <p className="text-zinc-400 text-sm max-w-sm leading-relaxed">
                Tell me about your brand and campaign goals and I will find the
                perfect clubs for your sponsorship.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage({ text: prompt })}
                  className="px-4 py-2 text-sm border border-zinc-200 rounded-full text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 max-w-2xl mx-auto">
            {messages.map((message) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={message.id}
                  className={`flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[11px] text-zinc-400 px-1 tracking-wide uppercase">
                    {isUser ? 'You' : 'ClubPack AI'}
                  </span>

                  {isUser ? (
                    // User bubble — dark, compact
                    <div className="bg-zinc-900 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] leading-relaxed">
                      {message.parts.map((part, i) =>
                        part.type === 'text'
                          ? <span key={`${message.id}-${i}`}>{part.text}</span>
                          : null
                      )}
                    </div>
                  ) : (
                    // AI message — no heavy bubble, clean card feel
                    <div className="bg-zinc-50 border border-zinc-100 rounded-2xl rounded-tl-sm px-5 py-4 max-w-[92%] text-sm text-zinc-700 space-y-0.5">
                      {message.parts.map((part, i) => {
                        const key = `${message.id}-${i}`;

                        if (part.type === 'text') {
                          return (
                            <div key={key}>
                              <ReactMarkdown components={mdComponents}>
                                {part.text}
                              </ReactMarkdown>
                            </div>
                          );
                        }

                        if (part.type.startsWith('tool-') && 'state' in part) {
                          const { label, done } = getToolStatus(part.type, part.state as string);
                          return (
                            <div key={key} className="flex items-center gap-1.5 py-0.5">
                              {done ? (
                                <svg className="w-3 h-3 text-zinc-400 flex-none" viewBox="0 0 12 12" fill="none">
                                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse flex-none" />
                              )}
                              <span className="text-xs text-zinc-400">{label}</span>
                            </div>
                          );
                        }

                        return null;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Input box */}
      <div className="flex-none px-4 pb-6 pt-2">
        <div className="max-w-2xl mx-auto bg-zinc-50 rounded-2xl px-4 pt-3 pb-3 flex flex-col gap-3 border border-zinc-200">
          <textarea
            className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 outline-none resize-none disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed min-h-[52px]"
            rows={2}
            value={input}
            placeholder="Describe your sponsorship goals..."
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-4 py-1.5 text-xs font-medium tracking-wide bg-zinc-900 text-white rounded-full hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function Chat() {
  return (
    <Suspense>
      <ChatInner />
    </Suspense>
  );
}
