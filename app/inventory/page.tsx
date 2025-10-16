'use client';

import { useEffect, useState, useCallback } from 'react';
import { Package, Trash2, Mic, ClipboardList } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { queryFarmingLLM } from '@/lib/llm';
import { VoiceInput, isSTTSupported } from '@/lib/stt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceModal } from '@/components/voice-modal';

/**
 * Inventory Management Page
 * Voice-controlled inventory tracking for farmers
 */
export default function InventoryPage() {
  const {
    inventory,
    addInventoryItem,
    removeInventoryItem,
    updateInventoryItem,
    setFarmingContext,
    selectedLanguage,
  } = useAppStore();

  const [isListening, setIsListening] = useState(false);
  const [voiceInput, setVoiceInput] = useState<VoiceInput | null>(null);
  const [transcript, setTranscript] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  // Set farming context to inventory on mount
  useEffect(() => {
    setFarmingContext('inventory');
  }, [setFarmingContext]);

  const processVoiceCommand = useCallback(async (command: string) => {
    setProcessing(true);
    try {
      // Use LLM to parse the voice command
      const response = await queryFarmingLLM(
        `Parse this inventory command and respond ONLY with a JSON object: "${command}". 
        Format: {"action": "add|update|remove", "category": "fertilizer|seed|crop|pesticide|equipment", "name": "item name", "quantity": number, "unit": "kg|liters|bags|etc"}`,
        'inventory'
      );

      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        if (parsed.action === 'add') {
          addInventoryItem({
            category: parsed.category,
            name: parsed.name,
            quantity: parsed.quantity,
            unit: parsed.unit,
          });
        } else if (parsed.action === 'remove') {
          const item = inventory.find(i => 
            i.name.toLowerCase().includes(parsed.name.toLowerCase())
          );
          if (item) {
            removeInventoryItem(item.id);
          }
        } else if (parsed.action === 'update') {
          const item = inventory.find(i => 
            i.name.toLowerCase().includes(parsed.name.toLowerCase())
          );
          if (item) {
            updateInventoryItem(item.id, { quantity: parsed.quantity });
          }
        }
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
    } finally {
      setProcessing(false);
      setTranscript('');
    }
  }, [addInventoryItem, inventory, removeInventoryItem, updateInventoryItem]);

  // Initialize voice input
  useEffect(() => {
    if (isSTTSupported()) {
      const lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
      const voice = new VoiceInput({
        continuous: false,
        interimResults: false,
        lang,
        onResult: (text, isFinal) => {
          if (isFinal) {
            setTranscript(text);
            processVoiceCommand(text);
          }
        },
        onError: (error) => {
          console.error('Voice input error:', error);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        },
      });
      setVoiceInput(voice);
    }
  }, [selectedLanguage, processVoiceCommand]);


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
    // no-op: processing handled in onResult when isFinal
  };

  const groupedInventory = {
    fertilizer: inventory.filter(i => i.category === 'fertilizer'),
    seed: inventory.filter(i => i.category === 'seed'),
    crop: inventory.filter(i => i.category === 'crop'),
    pesticide: inventory.filter(i => i.category === 'pesticide'),
    equipment: inventory.filter(i => i.category === 'equipment'),
  };

  return (
    <div className="relative isolate min-h-screen bg-background/95 pb-24 pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-4 top-6 h-72 w-72 rounded-full bg-primary/18 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-secondary/45 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-[40px] border border-border/60 bg-card/90 p-8 shadow-honey-md">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/50">
                <ClipboardList className="h-4 w-4" />
                {selectedLanguage === 'hi' ? 'इन्वेंटरी प्रबंधन' : 'Inventory Management'}
              </span>
              <h1 className="flex items-center gap-3 font-display text-4xl text-foreground">
                <Package className="h-8 w-8 text-primary" />
                {selectedLanguage === 'hi' ? 'अपनी आपूर्ति क्रम में रखें' : 'Keep your supplies in rhythm'}
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-foreground/70">
                {selectedLanguage === 'hi'
                  ? 'खाद, बीज और उपकरण का रिकॉर्ड रखें। FarmGuide आवाज़ सुनते ही लॉग बनाता है और कमी होने पर याद दिलाता है।'
                  : 'Track fertilisers, seeds, and tools in one place. FarmGuide listens to your voice commands, logs them instantly, and nudges you before anything runs low.'}
              </p>
            </div>

            {isSTTSupported() && (
              <Button
                size="lg"
                variant={isListening ? 'default' : 'outline'}
                onClick={toggleVoiceInput}
                disabled={processing}
                className={isListening ? 'animate-pulse' : 'border-primary/60 text-primary hover:bg-primary/10'}
              >
                <Mic className="mr-2 h-5 w-5" />
                {isListening
                  ? selectedLanguage === 'hi'
                    ? 'सुन रहे हैं...'
                    : 'Listening...'
                  : selectedLanguage === 'hi'
                  ? 'आवाज़ से बोलें'
                  : 'Use voice'}
              </Button>
            )}
          </div>

          {(transcript || processing) && (
            <Card className="mt-6 border border-primary/25 bg-primary/5">
              <CardContent className="pt-4">
                <p className="text-sm text-foreground/70">
                  {processing
                    ? selectedLanguage === 'hi'
                      ? '⚙️ प्रोसेसिंग...'
                      : '⚙️ Processing...'
                    : `"${transcript}"`}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6 border border-primary/20 bg-primary/10">
            <CardContent className="flex flex-col gap-2 pt-6 text-sm leading-relaxed text-primary/80">
              {selectedLanguage === 'hi' ? (
                <>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em]">उदाहरण कमांड</span>
                  “10 किलो यूरिया खाद जोड़ें”, “कपास कीटनाशक 5 लीटर अपडेट करें”
                </>
              ) : (
                <>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em]">Example commands</span>
                  “Add 10 kg urea fertiliser”, “Update pesticide stock to 5 litres”, “Remove expired wheat seeds”
                </>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(groupedInventory).map(([category, items]) => (
            <Card key={category} className="bg-card/85">
              <CardHeader>
                <CardTitle className="capitalize text-foreground">
                  {selectedLanguage === 'hi'
                    ? category === 'fertilizer'
                      ? 'खाद'
                      : category === 'seed'
                      ? 'बीज'
                      : category === 'crop'
                      ? 'फसल'
                      : category === 'pesticide'
                      ? 'कीटनाशक'
                      : 'उपकरण'
                    : category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <p className="text-sm text-foreground/50">
                    {selectedLanguage === 'hi' ? 'कोई आइटम नहीं' : 'No items'}
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 p-3 shadow-honey-sm transition hover:border-primary/40 hover:bg-primary/10"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="text-xs uppercase tracking-[0.25em] text-foreground/50">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeInventoryItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </section>

        {inventory.length === 0 && (
          <Card className="mt-12 border border-primary/25 bg-primary/10 text-center">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-sm leading-relaxed text-foreground/70">
              <Package className="h-16 w-16 text-primary" />
              <h3 className="font-display text-2xl text-foreground">
                {selectedLanguage === 'hi' ? 'इन्वेंटरी खाली है' : 'Inventory is empty'}
              </h3>
              <p>
                {selectedLanguage === 'hi'
                  ? 'अपना पहला आइटम जोड़ने के लिए माइक्रोफोन दबाएं।'
                  : 'Press the microphone to add your first item.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Shared Voice Modal */}
      <VoiceModal
        isOpen={showVoiceModal}
        onClose={() => { if (isListening) voiceInput?.stop(); setIsListening(false); setShowVoiceModal(false); setTranscript(''); }}
        onPauseAndSend={handlePauseAndSend}
        transcript={transcript}
        isListening={isListening}
        language={selectedLanguage}
      />
    </div>
  );
}
