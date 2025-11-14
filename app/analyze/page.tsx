'use client';

import { useCallback, useEffect, useState } from 'react';
import { Image as ImageIcon, Loader2, Mic, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VoiceModal } from '@/components/voice-modal';
import { VoiceInput, isSTTSupported } from '@/lib/stt';
import { analyzeCropImage } from '@/lib/llm';
import { useAppStore } from '@/lib/store';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AnalyzePage() {
  const { setFarmingContext, selectedLanguage } = useAppStore();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceInput, setVoiceInput] = useState<VoiceInput | null>(null);
  const [transcript, setTranscript] = useState('');
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  useEffect(() => {
    setFarmingContext('diagnosis');
  }, [setFarmingContext]);

  // Initialize optional voice note capture
  useEffect(() => {
    if (!isSTTSupported()) return;
    const lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
    const voice = new VoiceInput({
      continuous: true,
      interimResults: true,
      lang,
      onResult: (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          setTranscript('');
        }
      },
      onError: () => {
        setIsListening(false);
        setShowVoiceModal(false);
      },
      onEnd: () => setIsListening(false),
    });
    setVoiceInput(voice);
    return () => voice.stop();
  }, [selectedLanguage]);

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return alert(selectedLanguage === 'hi' ? 'कृपया इमेज फाइल चुनें' : 'Please select an image file');
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      setAnalyzing(true);
      setResult(null);
      try {
        // Ensure base64 without prefix
        const base64Reader = new FileReader();
        base64Reader.onloadend = async () => {
          const dataUrl = base64Reader.result as string;
          const base64 = dataUrl.startsWith('data:') ? dataUrl.split(',')[1] : dataUrl;
          const analysis = await analyzeCropImage(base64);
          setResult(analysis);
        };
        base64Reader.readAsDataURL(file);
      } catch (e) {
        console.error('Analyze error:', e);
        setResult(selectedLanguage === 'hi' ? 'विश्लेषण विफल। कृपया पुनः प्रयास करें।' : 'Analysis failed. Please try again.');
      } finally {
        setAnalyzing(false);
      }
    },
    [selectedLanguage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer?.files?.[0];
      if (file) handleImageUpload(file);
    },
    [handleImageUpload]
  );

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    setResult(null);
    setAnalyzing(false);
  };

  const toggleVoiceInput = () => {
    if (!voiceInput) return;
    if (isListening) {
      voiceInput.stop();
      setIsListening(false);
      setShowVoiceModal(false);
    } else {
      voiceInput.start();
      setIsListening(true);
      setShowVoiceModal(true);
    }
  };

  const handlePauseAndSend = () => {
    if (!voiceInput) return;
    voiceInput.stop();
    setIsListening(false);
    setShowVoiceModal(false);
  };

  return (
    <div className="min-h-screen bg-background/95">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            <ImageIcon className="h-4 w-4" />
            <span>{selectedLanguage === 'hi' ? 'AI फोटो निदान' : 'AI Photo Diagnosis'}</span>
          </div>
          <h1 className="mt-6 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
            {selectedLanguage === 'hi' ? 'फसल की फोटो से बीमारी पहचानें' : 'Detect crop issues from a photo'}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-foreground/70">
            {selectedLanguage === 'hi' ? 'स्पष्ट फोटो अपलोड करें — हम हिंदी और अंग्रेज़ी में सलाह देंगे।' : 'Upload a clear photo — we’ll advise in both Hindi and English.'}
          </p>
          {isSTTSupported() && (
            <div className="mt-4">
              
            </div>
          )}
        </div>

        {/* Main grid: Upload/Preview | Analysis */}
  <div className="grid items-start gap-6 lg:grid-cols-2">
          {/* Upload or Preview */}
          <Card
            className={`transition-colors ${!imagePreview ? 'border border-dashed border-border/60' : ''} ${dragActive ? 'border-primary/60 bg-primary/10' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDrag}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {!imagePreview ? (selectedLanguage === 'hi' ? 'फोटो अपलोड करें' : 'Upload Photo') : selectedLanguage === 'hi' ? 'अपलोड की गई फोटो' : 'Uploaded Photo'}
              </CardTitle>
              {imagePreview && (
                <Button variant="ghost" size="icon" onClick={clearImage}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!imagePreview ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Upload className="mb-4 h-14 w-14 text-primary" />
                  <p className="text-lg font-display text-foreground mb-1">{selectedLanguage === 'hi' ? 'यहां खींचें और छोड़ें' : 'Drag & drop your photo here'}</p>
                  <p className="mb-6 text-sm text-foreground/60">{selectedLanguage === 'hi' ? 'या नीचे बटन से फाइल चुनें' : 'or choose a file below'}</p>
                  <label htmlFor="file-upload">
                    <Button asChild>
                      <span>{selectedLanguage === 'hi' ? 'फाइल चुनें' : 'Choose File'}</span>
                    </Button>
                  </label>
                  <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                  <div className="mt-8 text-left max-w-md">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-foreground/60">{selectedLanguage === 'hi' ? '📸 सुझाव:' : '📸 Tips:'}</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground/60">
                      <li>{selectedLanguage === 'hi' ? 'तस्वीर साफ और रोशनी में लें' : 'Take clear photos in good lighting'}</li>
                      <li>{selectedLanguage === 'hi' ? 'प्रभावित हिस्से को पास से दिखाएं' : 'Show affected areas up close'}</li>
                      <li>{selectedLanguage === 'hi' ? 'पूरे पौधे और पत्तियां भी कैप्चर करें' : 'Capture whole plants and leaves'}</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="relative w-full aspect-[4/3]">
                  <Image src={imagePreview} alt="Crop analysis" fill className="object-contain rounded-lg" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedLanguage === 'hi' ? 'AI विश्लेषण' : 'AI Analysis'}</CardTitle>
            </CardHeader>
            <CardContent>
              {!imagePreview ? (
                <p className="text-foreground/60">{selectedLanguage === 'hi' ? 'पहले फोटो अपलोड करें' : 'Upload a photo to begin analysis'}</p>
              ) : analyzing ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{selectedLanguage === 'hi' ? 'AI विश्लेषण कर रहा है...' : 'AI is analyzing your photo...'}</span>
                </div>
              ) : result ? (
                <div className="prose prose-h2:mt-6 prose-h3:mt-5 prose-h4:mt-4 prose-p:leading-relaxed prose-ul:marker:text-primary prose-li:text-foreground/75 prose-strong:text-foreground dark:prose-invert max-w-none font-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-foreground/60">{selectedLanguage === 'hi' ? 'तैयार' : 'Ready when you are'}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {imagePreview && (
          <div className="mt-6 flex items-center justify-end">
            <Button variant="soft" onClick={clearImage} disabled={analyzing}>
              {selectedLanguage === 'hi' ? 'नई फोटो' : 'Upload another photo'}
            </Button>
          </div>
        )}
      </div>

      {/* Shared Voice Modal */}
      <VoiceModal
        isOpen={showVoiceModal}
        onClose={() => {
          if (isListening) voiceInput?.stop();
          setIsListening(false);
          setShowVoiceModal(false);
          setTranscript('');
        }}
        onPauseAndSend={handlePauseAndSend}
        transcript={transcript}
        isListening={isListening}
        language={selectedLanguage}
      />
    </div>
  );
}
