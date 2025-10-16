/**
 * Text-to-Speech Integration
 * Using Web Speech API (browser native, free) as primary
 * Fallback: External TTS API can be added
 */

/**
 * Check if browser supports Web Speech API
 */
export function isTTSSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Speak text using Web Speech API
 */
export async function speakText(text: string, onEnd?: () => void): Promise<void> {
  if (!isTTSSupported()) {
    console.warn('Text-to-Speech not supported in this browser');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text for better pronunciation
  const cleanText = text
    .replace(/\*\*/g, '') // Remove markdown bold
    .replace(/\*/g, '') // Remove markdown italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
    .replace(/#{1,6}\s/g, '') // Remove markdown headers
    .replace(/`([^`]+)`/g, '$1'); // Remove code blocks

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Configure voice settings
  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  utterance.lang = 'en-US';

  // Try to use a good quality voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (voice) =>
      voice.lang.startsWith('en') &&
      (voice.name.includes('Google') ||
        voice.name.includes('Microsoft') ||
        voice.name.includes('Enhanced'))
  );

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  // Setup event handlers
  utterance.onend = () => {
    onEnd?.();
  };

  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    onEnd?.();
  };

  // Speak
  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (isTTSSupported()) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Alternative: External TTS API integration (e.g., ElevenLabs, Play.ht free tier)
 * Uncomment and configure if you want to use external API
 */

/*
export async function speakTextExternal(text: string): Promise<void> {
  const TTS_API_KEY = process.env.NEXT_PUBLIC_TTS_API_KEY;
  
  if (!TTS_API_KEY) {
    console.warn('TTS API key not configured');
    return;
  }

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error('TTS API error');

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    await audio.play();
  } catch (error) {
    console.error('External TTS error:', error);
  }
}
*/
