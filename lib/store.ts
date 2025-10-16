import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Message interface for chat conversations
 */
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Inventory item interface
 */
export interface InventoryItem {
  id: string;
  category: 'fertilizer' | 'seed' | 'crop' | 'pesticide' | 'equipment';
  name: string;
  quantity: number;
  unit: string;
  lastUpdated: Date;
  notes?: string;
}

/**
 * Language support
 */
export type Language = 'hi' | 'en';

/**
 * Farming context
 */
export type FarmingContext = 'diagnosis' | 'inventory' | 'general';

/**
 * Global app state using Zustand with persistence for inventory
 */
interface AppState {
  // Chat state
  messages: Message[];
  isLoading: boolean;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;

  // Language
  selectedLanguage: Language;
  setLanguage: (language: Language) => void;

  // Farming context
  farmingContext: FarmingContext;
  setFarmingContext: (context: FarmingContext) => void;

  // Inventory management
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  removeInventoryItem: (id: string) => void;
  getInventoryByCategory: (category: InventoryItem['category']) => InventoryItem[];

  // TTS state
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
}

/**
 * Main store for application state with persistence
 */
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Chat state
      messages: [],
      isLoading: false,
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: crypto.randomUUID(),
              timestamp: new Date(),
            },
          ],
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      clearMessages: () => set({ messages: [] }),

      // Language state
      selectedLanguage: 'hi', // Default to Hindi for Indian farmers
      setLanguage: (language) => set({ selectedLanguage: language }),

      // Farming context
      farmingContext: 'diagnosis',
      setFarmingContext: (context) => set({ farmingContext: context }),

      // Inventory management
      inventory: [],
      addInventoryItem: (item) =>
        set((state) => ({
          inventory: [
            ...state.inventory,
            {
              ...item,
              id: crypto.randomUUID(),
              lastUpdated: new Date(),
            },
          ],
        })),
      updateInventoryItem: (id, updates) =>
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.id === id
              ? { ...item, ...updates, lastUpdated: new Date() }
              : item
          ),
        })),
      removeInventoryItem: (id) =>
        set((state) => ({
          inventory: state.inventory.filter((item) => item.id !== id),
        })),
      getInventoryByCategory: (category) => {
        return get().inventory.filter((item) => item.category === category);
      },

      // TTS state
      isSpeaking: false,
      setIsSpeaking: (speaking) => set({ isSpeaking: speaking }),
    }),
    {
      name: 'farmguide-storage',
      partialize: (state) => ({ inventory: state.inventory }), // Only persist inventory
    }
  )
);
