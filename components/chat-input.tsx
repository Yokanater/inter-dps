'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { Send, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VoiceModal } from '@/components/voice-modal';
import { useAppStore } from '@/lib/store';
import { queryFarmingLLM } from '@/lib/llm';
import { VoiceInput, isSTTSupported } from '@/lib/stt';

/**
 * Chat input component for farmer messages with Hindi voice input support
 */
export function ChatInput() {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [voiceInput, setVoiceInput] = useState<VoiceInput | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const { addMessage, setLoading, selectedLanguage, farmingContext } = useAppStore();

  // Initialize voice input with language
  useEffect(() => {
    if (isSTTSupported()) {
      const lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
      const voice = new VoiceInput({
        continuous: true,
        interimResults: true,
        lang,
        onResult: (transcript, isFinal) => {
          setVoiceTranscript(transcript);
          if (isFinal) {
            setInput((prev) => (prev + ' ' + transcript).trim());
            setVoiceTranscript('');
          }
        },
        onError: (error) => {
          console.error('Voice input error:', error);
          setIsListening(false);
          setShowVoiceModal(false);
          setVoiceTranscript('');
        },
        onEnd: () => {
          setIsListening(false);
        },
      });
      setVoiceInput(voice);

      return () => {
        if (voice) {
          voice.stop();
        }
      };
    }
  }, [selectedLanguage]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const message = input.trim();
    if (!message) return;

    // Add user message
    addMessage({
      role: 'user',
      content: message,
    });

    setInput('');
    setLoading(true);

    try {
      // Get LLM response with farming context
      const response = await queryFarmingLLM(message, farmingContext);

      // Add assistant response
      addMessage({
        role: 'assistant',
        content: response,
      });
    } catch (error) {
      console.error('Error getting response:', error);
      addMessage({
        role: 'assistant',
        content: selectedLanguage === 'hi' 
          ? 'क्षमा करें, कोई त्रुटि हुई। कृपया पुनः प्रयास करें।'
          : 'I apologize, but I encountered an error. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!voiceInput) return;

    if (isListening) {
      voiceInput.stop();
      setIsListening(false);
      setShowVoiceModal(false);
      setVoiceTranscript('');
    } else {
      voiceInput.start();
      setIsListening(true);
      setShowVoiceModal(true);
    }
  };

  const handlePauseAndSend = async () => {
    if (!voiceInput) return;

    // Stop listening
    voiceInput.stop();
    setIsListening(false);
    setShowVoiceModal(false);
    setVoiceTranscript('');

    // Auto-submit if there's content in the input
    const message = input.trim();
    if (message) {
      // Add user message
      addMessage({
        role: 'user',
        content: message,
      });

      setInput('');
      setLoading(true);

      try {
        // Get LLM response with farming context
        const response = await queryFarmingLLM(message, farmingContext);

        // Add assistant response
        addMessage({
          role: 'assistant',
          content: response,
        });
      } catch (error) {
        console.error('Error getting response:', error);
        addMessage({
          role: 'assistant',
          content: selectedLanguage === 'hi' 
            ? 'क्षमा करें, कोई त्रुटि हुई। कृपया पुनः प्रयास करें।'
            : 'I apologize, but I encountered an error. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseVoiceModal = () => {
    if (voiceInput && isListening) {
      voiceInput.stop();
    }
    setIsListening(false);
    setShowVoiceModal(false);
    setVoiceTranscript('');
  };

  const placeholder = selectedLanguage === 'hi'
    ? 'अपनी फसल की समस्या बताएं...'
    : 'Tell us about your crop problem...';

  return (
    <>
      <VoiceModal
        isOpen={showVoiceModal}
        onClose={handleCloseVoiceModal}
        onPauseAndSend={handlePauseAndSend}
        transcript={voiceTranscript || input}
        isListening={isListening}
        language={selectedLanguage}
      />
      
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 border-t border-border/60 bg-background/85 p-4 backdrop-blur-sm"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="flex-1 rounded-full border-border/60 bg-background/80 px-5 py-3 text-sm"
          disabled={useAppStore.getState().isLoading}
        />
        
        {/* Voice input button */}
        {isSTTSupported() && (
          <Button
            type="button"
            size="icon"
            variant={isListening ? 'default' : 'outline'}
            onClick={toggleVoiceInput}
            disabled={useAppStore.getState().isLoading}
            title={isListening ? 'रिकॉर्डिंग बंद करें' : 'आवाज़ से बोलें'}
            className={isListening ? 'animate-pulse' : 'border-primary/60 text-primary hover:bg-primary/10'}
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}

        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || useAppStore.getState().isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </>
  );
}
