/**
 * Speech-to-Text Integration
 * Using Web Speech API (browser native, free) for voice input
 * Enhanced for Chrome and other browsers with webkitSpeechRecognition
 * Provides voice-to-text transcription for accessibility
 */

// Extend Window interface to include webkit prefix
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

/**
 * Check if browser supports Web Speech API (including webkit prefix)
 */
export function isSTTSupported(): boolean {
  if (typeof window === 'undefined') return false;
  
  return !!(
    window.SpeechRecognition ||
    window.webkitSpeechRecognition
  );
}

/**
 * Get SpeechRecognition constructor (handles browser prefixes)
 * Works on Chrome, Edge, Safari, and other webkit-based browsers
 */
function getSpeechRecognition() {
  if (typeof window === 'undefined') return null;
  
  // Try standard first, then webkit prefix (for Chrome)
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

/**
 * Options for speech recognition
 */
export interface SpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

/**
 * Speech recognition class for voice input with enhanced Chrome support
 */
export class VoiceInput {
  private recognition: any = null;
  private isListening = false;
  private restartTimeout: NodeJS.Timeout | null = null;

  constructor(options: SpeechRecognitionOptions = {}) {
    if (!isSTTSupported()) {
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = options.continuous ?? false;
      this.recognition.interimResults = options.interimResults ?? true;
      this.recognition.lang = options.lang ?? 'hi-IN';
      this.recognition.maxAlternatives = 1;

      // Handle results
      this.recognition.onresult = (event: any) => {
        try {
          const last = event.results.length - 1;
          const result = event.results[last];
          const transcript = result[0].transcript;
          const isFinal = result.isFinal;

          if (options.onResult) {
            options.onResult(transcript, isFinal);
          }
        } catch (error) {
          console.error('Error processing speech result:', error);
        }
      };

      // Handle errors with better error messages
      this.recognition.onerror = (event: any) => {
        const errorMessages: Record<string, string> = {
          'no-speech': 'No speech detected. Please try again.',
          'audio-capture': 'Microphone not available. Please check permissions.',
          'not-allowed': 'Microphone permission denied. Please allow access.',
          'network': 'Network error. Please check your connection.',
          'aborted': 'Speech recognition aborted.',
        };

        const message = errorMessages[event.error] || `Speech recognition error: ${event.error}`;
        console.error(message, event);

        if (options.onError) {
          options.onError(message);
        }
        
        this.isListening = false;

        // Auto-restart on certain errors (except permission denied)
        if (event.error === 'no-speech' && this.recognition.continuous) {
          this.restartAfterError();
        }
      };

      // Handle end
      this.recognition.onend = () => {
        this.isListening = false;
        if (options.onEnd) {
          options.onEnd();
        }
      };

      // Handle start
      this.recognition.onstart = () => {
        this.isListening = true;
      };
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
    }
  }

  /**
   * Restart recognition after an error
   */
  private restartAfterError(): void {
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
    }
    
    this.restartTimeout = setTimeout(() => {
      if (this.recognition && !this.isListening) {
        try {
          this.recognition.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
        }
      }
    }, 1000);
  }

  /**
   * Start listening for speech
   */
  start(): void {
    if (!this.recognition) {
      console.warn('Speech recognition not initialized');
      return;
    }

    if (this.isListening) {
      console.warn('Already listening');
      return;
    }

    try {
      this.recognition.start();
      this.isListening = true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }

  /**
   * Stop listening for speech
   */
  stop(): void {
    if (!this.recognition) return;

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Change language
   */
  setLanguage(lang: string): void {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }
}

/**
 * Simple function to get voice input as a promise
 */
export function getVoiceInput(lang: string = 'en-US'): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isSTTSupported()) {
      reject(new Error('Speech recognition not supported'));
      return;
    }

    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) {
      reject(new Error('Speech recognition not available'));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript);
    };

    recognition.onerror = (event: any) => {
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.start();
  });
}
