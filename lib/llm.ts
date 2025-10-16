/**
 * LLM Integration using Groq API for Agricultural Assistance
 * Supports multilingual queries (Hindi + English)
 * Get your free API key at: https://console.groq.com
 * 
 * Free tier limits: 30 req/min, 6000 req/day, 7000 tokens/min
 */

// Get API key from environment variable
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

/**
 * Types for farming assistance contexts
 */
export type FarmingContext = 'diagnosis' | 'inventory' | 'general';

/**
 * System prompts for different farming contexts
 */
function getFarmingSystemPrompt(context: FarmingContext): string {
  const prompts = {
    diagnosis: `You are FarmGuide, an expert agricultural AI assistant helping Indian farmers diagnose crop problems.

Your role:
- Understand farmers speaking in Hindi or English about crop issues
- Identify diseases, pests, nutrient deficiencies, or environmental problems
- Provide practical, actionable solutions suitable for Indian farming
- Recommend organic solutions first, then chemical if needed
- Suggest preventive measures

Response format:
- Start with likely problem diagnosis
- List confirming symptoms
- Provide 2-3 treatment options (prioritize organic/affordable)
- Include preventive tips
- If farmer speaks Hindi, respond in Hindi. If English, respond in English.

Keep responses concise (under 250 words) and farmer-friendly.`,

    inventory: `You are FarmGuide Inventory Manager. Parse voice commands to manage farm inventory.

Your role:
- Understand Hindi/English voice commands about inventory changes
- Extract: action (add/remove/use), category (fertilizer/seed/crop), item name, quantity, unit
- Create structured data for system processing
- Respond with confirmation in farmer's language

Example: "मैंने 50 किलो यूरिया खरीदा" → Extract: {action:"add", category:"fertilizer", item:"Urea", quantity:50, unit:"kg"}

Respond with:
1. Confirmation message in farmer's language
2. JSON structure: {"action":"...", "category":"...", "item":"...", "quantity":..., "unit":"..."}

Be accurate and confirm clearly.`,

    general: `You are FarmGuide, a friendly AI farming assistant for Indian farmers.

Help with:
- Crop selection and planning
- Seasonal advice for Indian agriculture
- Government schemes (PM-KISAN, Kisan Credit Card, etc.)
- Best farming practices for Indian conditions
- Market and mandi price guidance
- Weather-related farming advice

Language: Respond in the same language the farmer uses (Hindi/English).
Keep responses practical, specific to India, and under 200 words.

Be supportive and empathetic. Remember, farming is their livelihood.`
  };

  return prompts[context];
}

/**
 * Query Groq LLM for farming assistance
 */
export async function queryFarmingLLM(
  userMessage: string,
  context: FarmingContext = 'diagnosis'
): Promise<string> {
  // Fallback if no API key
  if (!GROQ_API_KEY) {
    console.warn('Groq API key not found. Using fallback responses.');
    return getFallbackFarmingResponse(userMessage, context);
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: getFarmingSystemPrompt(context),
          },
          {
            role: 'user',
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || getFallbackFarmingResponse(userMessage, context);
  } catch (error) {
    console.error('LLM API Error:', error);
    return getFallbackFarmingResponse(userMessage, context);
  }
}

/**
 * Fallback responses when API is unavailable
 */
function getFallbackFarmingResponse(query: string, context: FarmingContext): string {
  const lowerQuery = query.toLowerCase();

  if (context === 'diagnosis') {
    // Common crop diseases
    if (lowerQuery.includes('पत्त') || lowerQuery.includes('leaf') || lowerQuery.includes('पीला')) {
      return `**संभावित समस्या: पत्ती पीली होना / Leaf Yellowing**

**लक्षण:**
- पत्तियों का पीला पड़ना
- विकास रुकना
- उपज में कमी

**उपचार:**
1. **जैविक:** गोबर की खाद या कम्पोस्ट डालें (Organic manure)
2. **रासायनिक:** NPK उर्वरक (19:19:19) - 5 किलो प्रति एकड़
3. **तत्काल:** जिंक सल्फेट का छिड़काव (Zinc sulfate spray)

**रोकथाम:** नियमित मिट्टी परीक्षण करें और संतुलित उर्वरक डालें।

*Note: यह सामान्य सलाह है। विस्तृत मदद के लिए Groq API key कॉन्फ़िगर करें।*`;
    }

    if (lowerQuery.includes('कीट') || lowerQuery.includes('pest') || lowerQuery.includes('insect')) {
      return `**संभावित समस्या: कीट प्रकोप / Pest Attack**

**सामान्य उपचार:**
1. **जैविक:** नीम के तेल का छिड़काव (Neem oil spray)
2. **प्राकृतिक:** लहसुन-मिर्च का घोल
3. **रासायनिक:** Imidacloprid या Chlorpyrifos (अंतिम विकल्प)

**रोकथाम:**
- फसल चक्र अपनाएं
- साफ-सफाई रखें
- नियमित निगरानी करें

*API key कॉन्फ़िगर करने पर विस्तृत निदान मिलेगा।*`;
    }

    return `मुझे आपकी फसल की समस्या को बेहतर समझने में मदद चाहिए। कृपया बताएं:
- कौनसी फसल है?
- क्या लक्षण दिख रहे हैं?
- समस्या कब शुरू हुई?

Please share: Which crop? What symptoms? When did it start?

*Groq API key कॉन्फ़िगर करने पर मैं बेहतर मदद कर सकता हूं।*`;
  }

  if (context === 'inventory') {
    return `कृपया अपने इन्वेंटरी परिवर्तन के बारे में बताएं। उदाहरण:
- "मैंने 50 किलो यूरिया खरीदा"
- "10 किलो गेहूं के बीज इस्तेमाल किए"

Please share inventory changes like:
- "Added 50 kg urea"
- "Used 10 kg wheat seeds"

*For automatic inventory updates, configure Groq API key.*`;
  }

  return `नमस्ते! मैं FarmGuide हूं। मैं आपकी कैसे मदद कर सकता हूं?

Hello! I'm FarmGuide. How can I help you today?

I can assist with:
- फसल समस्याओं का निदान / Crop diagnosis  
- इन्वेंटरी प्रबंधन / Inventory management
- खेती की सलाह / Farming advice

*Configure Groq API key for best experience.*`;
}

/**
 * Analyze uploaded image for crop/soil disease detection
 * Uses Google Gemini Flash (free tier) - Direct API
 */
export async function analyzeCropImage(imageBase64: string): Promise<string> {
  // Use Google Gemini Flash directly (free tier, always works)
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

  if (GEMINI_API_KEY) {
    try {
      const base64 = imageBase64.startsWith('data:') ? imageBase64.split(',')[1] : imageBase64;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: 'You are an agricultural pathologist for Indian farmers. Analyze this crop/soil image. Identify any diseases, pests, or nutrient deficiencies. Give practical treatments (prefer organic), preventive tips, and risk level. Respond in both Hindi and English in 8-12 bullet lines total.'
                  },
                  {
                    inline_data: {
                      mime_type: 'image/jpeg',
                      data: base64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error(`Gemini API error: ${response.status}`, errorText);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof text === 'string' && text.trim()) {
        return text;
      }
      throw new Error('Empty Gemini response');
    } catch (e) {
      console.error('Gemini Vision analysis failed, falling back locally:', e);
      // Continue to local fallback below
    }
  }

  // Local client-only heuristic fallback: fast, deterministic, helpful
  try {
    // Very basic pixel inspection to infer green ratio (health proxy)
    const img = new Image();
    const dataUrl = imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`;
    const result = await new Promise<string>((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const w = 160;
        const h = Math.round((img.height / img.width) * w) || 160;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(localHeuristicMessage());
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);
        let greenish = 0;
        let yellowish = 0;
        let brownish = 0;
        let total = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // crude buckets
          if (g > r + 15 && g > b + 10) greenish++;
          if (r > 140 && g > 140 && b < 100) yellowish++; // yellow
          if (r > 80 && g < 60 && b < 60) brownish++; // brown/necrotic
          total++;
        }
        const gPct = (greenish / total) * 100;
        const yPct = (yellowish / total) * 100;
        const bPct = (brownish / total) * 100;

        resolve(localHeuristicMessage(gPct, yPct, bPct));
      };
      img.onerror = () => resolve(localHeuristicMessage());
      img.src = dataUrl;
    });
    return result;
  } catch (e) {
    console.error('Local analysis failed:', e);
    return localHeuristicMessage();
  }
}

function localHeuristicMessage(g = 0, y = 0, b = 0): string {
  const overall = g > 60 ? 'Low' : g > 40 ? 'Medium' : 'High';
  const hints: string[] = [];
  if (y > 8) hints.push('Yellowing may indicate nitrogen deficiency or water stress.');
  if (b > 4) hints.push('Brown/necrotic spots may indicate fungal/bacterial disease or pest damage.');
  if (hints.length === 0) hints.push('No obvious severe issues detected visually. Monitor regularly.');

  return `Hindi:
• समग्र जोखिम: ${overall}
• संकेत: ${hints.join(' ')}
• सुझाव: सिंचाई/उर्वरक संतुलित रखें, प्रभावित पत्तियों का निरीक्षण करें, ज़रूरत पर नीम तेल छिड़काव करें।

English:
• Overall risk: ${overall}
• Hints: ${hints.join(' ')}
• Tips: Balance irrigation/fertilizer, inspect affected leaves, consider neem oil spray if pests suspected.`;
}
