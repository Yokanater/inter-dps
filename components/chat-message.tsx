'use client';

import { cn } from '@/lib/utils';
import type { Message } from '@/lib/store';
import { Volume2, VolumeX, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { speakText, stopSpeaking } from '@/lib/tts';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: Message;
}

/**
 * Beautiful, minimal chat message bubble with avatar
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isUser = message.role === 'user';

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(message.content, () => setIsSpeaking(false));
    }
  };

  return (
    <div
      className={cn(
        'flex w-full gap-4 group',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Avatar - only show for assistant */}
      {!isUser && (
        <div className="mt-1 flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-primary/12 text-primary">
            <Bot className="h-5 w-5" />
          </div>
        </div>
      )}

      {/* Message Content */}
      <div
        className={cn(
          'flex max-w-[75%] flex-col gap-2 rounded-[28px] px-5 py-4 shadow-honey-sm transition-all duration-200',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'border border-border/60 bg-background/85 text-foreground hover:border-primary/40 hover:bg-primary/5'
        )}
      >
        {/* Message Text */}
        <div className={cn(
          'prose prose-sm max-w-none font-body text-[15px] leading-relaxed',
          isUser ? 'text-primary-foreground prose-invert' : 'text-foreground',
          // Custom prose styles for better formatting
          'prose-headings:font-display prose-headings:font-semibold prose-headings:mb-2',
          'prose-p:my-2 prose-p:leading-relaxed',
          'prose-ul:my-2 prose-ul:list-disc prose-ul:pl-5',
          'prose-ol:my-2 prose-ol:list-decimal prose-ol:pl-5',
          'prose-li:my-1',
          'prose-strong:font-bold prose-strong:text-inherit',
          'prose-em:italic prose-em:text-inherit',
          'prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
          'prose-pre:bg-primary/10 prose-pre:p-3 prose-pre:rounded-lg prose-pre:overflow-x-auto',
          'prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic',
          'prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80'
        )}>
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Footer with timestamp and TTS */}
        <div
          className={cn(
            'mt-1 flex items-center justify-between gap-3 text-xs',
            isUser ? 'text-primary-foreground/75' : 'text-foreground/50'
        )}>
          <time className="opacity-70">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>
          
          {!isUser && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 px-2 opacity-0 transition-opacity group-hover:opacity-100',
                isSpeaking && 'opacity-100'
              )}
              onClick={handleSpeak}
              aria-label={isSpeaking ? 'Stop speaking' : 'Read aloud'}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Listen</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Avatar - only show for user */}
      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary text-primary-foreground shadow-honey-sm">
            <User className="h-5 w-5" />
          </div>
        </div>
      )}
    </div>
  );
}
