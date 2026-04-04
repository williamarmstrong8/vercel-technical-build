'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, Suspense } from 'react';
import Image from 'next/image';
import {Conversation, ConversationContent, ConversationScrollButton} from '@/components/ai-elements/conversation';
import {Message, MessageContent, MessageResponse} from '@/components/ai-elements/message';

const SUGGESTIONS = [
  'Find tech clubs for college students',
  'What fitness clubs do you have?',
  'I have a $500 budget, what can I sponsor?',
];

// Shows the user what the agent is doing while tools run (e.g. "Searching...").
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
  // v6 pattern: DefaultChatTransport replaces the old `api` string param.
  // We manage input state ourselves and call sendMessage() directly.
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  const isLoading = status === 'streaming' || status === 'submitted';
  const hasMessages = messages.length > 0;

  function handleSend(text?: string) {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    setInput('');
  }

  // Empty state: show a hero with search input and suggestion chips.
  if (!hasMessages) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background px-4">
        <Image
          src="/clubpack-logo-full.png"
          alt="ClubPack"
          width={185}
          height={28}
          className="mb-10"
          priority
        />

        <h1 className="text-4xl font-semibold tracking-tight text-foreground text-center mb-3">
          Find your perfect club sponsorship
        </h1>
        <p className="text-muted-foreground text-base text-center mb-10 max-w-sm leading-relaxed">
          Tell us about your brand and we will match you with the right clubs.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="w-full max-w-xl mb-5"
        >
          <div className="flex items-center bg-background border border-border rounded-2xl px-4 py-3 shadow-sm focus-within:border-foreground/20 transition-colors gap-3">
            <input
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Find tech clubs for college students..."
              className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-1.5 text-xs font-medium bg-foreground text-background rounded-full disabled:opacity-30 hover:opacity-80 transition-opacity"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="px-4 py-2 text-sm border border-border rounded-full text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Conversation state: header, scrollable message list, and input area.
  return (
    <div className="flex flex-col h-screen bg-background">

      <header className="flex-none flex items-center gap-3 px-6 py-4 border-b border-border">
        <a href="/">
          <Image
            src="/clubpack-logo-full.png"
            alt="ClubPack"
            width={159}
            height={24}
          />
        </a>
        <span className="text-xs text-muted-foreground tracking-wide">Sponsor Concierge</span>
      </header>

      <Conversation className="flex-1">
        <ConversationContent>
          {/* v6: iterate message.parts instead of message.content.
              Text parts use MessageResponse for markdown rendering.
              Tool parts show inline status indicators. */}
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                {message.parts.map((part, i) => {
                  const key = `${message.id}-${i}`;

                  if (part.type === 'text') {
                    return <MessageResponse key={key}>{part.text}</MessageResponse>;
                  }

                  if (part.type.startsWith('tool-') && 'state' in part) {
                    const { label, done } = getToolStatus(part.type, part.state as string);
                    return (
                      <div key={key} className="flex items-center gap-1.5 py-0.5">
                        {done ? (
                          <svg className="w-3 h-3 text-muted-foreground flex-none" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse flex-none" />
                        )}
                        <span className="text-xs text-muted-foreground">{label}</span>
                      </div>
                    );
                  }

                  return null;
                })}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="flex-none px-4 pb-6 pt-2">
        <div className="max-w-2xl mx-auto bg-muted rounded-2xl px-4 pt-3 pb-3 flex flex-col gap-3 border border-border">
          <textarea
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
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none disabled:opacity-50 leading-relaxed min-h-[52px]"
          />
          <div className="flex justify-end">
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              className="px-4 py-1.5 text-xs font-medium tracking-wide bg-foreground text-background rounded-full hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              Send
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

// Suspense boundary needed for client side data fetching.
export default function Chat() {
  return (
    <Suspense>
      <ChatInner />
    </Suspense>
  );
}
