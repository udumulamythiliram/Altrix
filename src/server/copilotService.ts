import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (process.env.GEMINI_API_KEY) {
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }
  return null;
}

export interface CopilotChatRequest {
  message: string;
  language?: 'en' | 'te' | 'hi';
  patientProfile?: {
    name: string;
    age: number;
    conditions: string[];
    medications: Array<{ name: string; timing: string; note: string; status: string }>;
    vitals: { bp: string; glucose: string; hb: string };
  };
}

export async function handleCopilotChat(req: CopilotChatRequest): Promise<{ text: string; source: 'gemini' | 'clinical_engine' }> {
  const { message, language = 'en', patientProfile } = req;
  const ai = getAiClient();

  const systemInstruction = `You are Vitalis Clinical Copilot, an empathetic, clinically rigorous, and reassuring health assistant specifically supporting patient Savithri Devi (72 yrs old, Type 2 Diabetes, Mild Hypertension) and her primary family caregiver Anand Kumar.
Patient's current records:
- Morning: Amlodipine 5mg (Taken)
- Lunch: Metformin 500mg (Scheduled with meals)
- Night: Atorvastatin 10mg (Scheduled bedtime)
- Latest Vitals: Blood Pressure 128/82 mmHg (Normal), Fasting Glucose 118 mg/dL (Stable target 100-125), Hemoglobin 10.2 g/dL (Low, reference 12.0-15.0 g/dL - mild iron deficiency pattern)
- Treating Physician: Dr. R. Sharma (Consultation - Cardiopulmonary Care)

Guidelines:
1. Explain medical terms, drug interactions, and lab findings in plain, compassionate, clear language.
2. If the user asks in or selects Telugu (te), answer in friendly conversational Telugu script or English with clear explanations. If Hindi (hi), answer in clear Hindi. If English (en), answer in English.
3. Distinguish verified EMR data from medical guidance.
4. Always include a brief note recommending confirmation with Dr. Sharma for dosage changes.
5. Keep answers concise, highly readable, structured with bullet points.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `User Query: "${message}"\nSelected Language: ${language}`,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      if (response && response.text) {
        return {
          text: response.text,
          source: 'gemini',
        };
      }
    } catch (err) {
      console.error("Gemini API call failed, falling back to clinical engine:", err);
    }
  }

  // Clinical Rule-Based Engine Fallback
  const q = message.toLowerCase();
  let fallbackReply = "";

  if (q.includes("hba1c") || q.includes("sugar") || q.includes("glucose") || q.includes("diabetes")) {
    if (language === 'te') {
      fallbackReply = `సవిత్రి దేవి గారి ప్రస్తుత ఫాస్టింగ్ షుగర్ 118 mg/dL - ఇది సరైన లక్ష్య పరిధిలోనే (100-125 mg/dL) స్థిరంగా ఉంది.\n\n• HbA1c పరీక్ష గత 3 నెలల సగటు చక్కెర స్థాయిని కొలుస్తుంది.\n• మధ్యాహ్నం తీసుకోబోయే మెట్‌ఫార్మిన్ (Metformin 500mg) ఆహారంతో పాటు తీసుకోవడం ముఖ్యం.\n• తీపి పదార్థాలు, అధిక కార్బోహైడ్రేట్లు తగ్గించి, సమతుల్య ఆహారం తీసుకోవాలి.`;
    } else if (language === 'hi') {
      fallbackReply = `सावित्री देवी जी का वर्तमान फास्टिंग ब्लड शुगर 118 mg/dL है - यह सामान्य लक्ष्य (100-125 mg/dL) में स्थिर है।\n\n• HbA1c टेस्ट पिछले 3 महीनों का औसत शुगर स्तर बताता है।\n• दोपहर की मेटफॉर्मिन (Metformin 500mg) भोजन के साथ समय पर लें।\n• समय पर फाइबर युक्त आहार और पर्याप्त पानी का सेवन रखें।`;
    } else {
      fallbackReply = `Savithri Devi's latest fasting blood sugar is 118 mg/dL, which is stable and within her target range (100–125 mg/dL).\n\n• HbA1c measures 3-month average blood glucose. Her last recorded HbA1c is 6.8%.\n• Metformin 500mg at 2:00 PM is designed to be taken with meals to minimize stomach upset.\n• Continue balanced meals with leafy greens, complex grains, and adequate hydration.`;
    }
  } else if (q.includes("hemoglobin") || q.includes("cbc") || q.includes("blood count") || q.includes("iron") || q.includes("apollo")) {
    if (language === 'te') {
      fallbackReply = `అపోలో ల్యాబ్ రిపోర్టు ప్రకారం హిమోగ్లోబిన్ 10.2 g/dL గా ఉంది (సాధారణ స్థాయి: 12.0 - 15.0 g/dL). ఇది స్వల్ప రక్తహీనతను (Mild Anemia) సూచిస్తుంది.\n\nడాక్టర్ శర్మ గారిని అడగవలసినవి:\n1. ఐరన్ సప్లిమెంట్స్ లేదా ఆహార మార్పులు అవసరమా?\n2. తదుపరి సిబిసి (CBC) పరీక్ష ఎప్పుడు చేసుకోవాలి?\n3. అలసట లేదా నీరసం రాకుండా తీసుకోవాల్సిన జాగ్రత్తలు.`;
    } else {
      fallbackReply = `According to the latest Apollo CBC report, Hemoglobin is 10.2 g/dL (normal reference range: 12.0 - 15.0 g/dL), indicating mild microcytic/iron-deficiency anemia.\n\nKey Recommendations for Dr. Sharma:\n1. Inquire if mild oral iron therapy or vitamin B12/folate supplementation is advised alongside Amlodipine.\n2. Incorporate iron-rich dietary items: cooked spinach, lentils, pomegranate, and beetroot.\n3. Schedule a follow-up CBC panel in 6–8 weeks to verify recovery.`;
    }
  } else if (q.includes("pill") || q.includes("medicine") || q.includes("metformin") || q.includes("timing") || q.includes("amlodipine") || q.includes("atorvastatin")) {
    fallbackReply = `Today's Medication Schedule for Savithri Devi:\n\n• 08:00 AM (Morning): Amlodipine 5mg - TAKEN (Blood Pressure control)\n• 02:00 PM (Lunch): Metformin 500mg - DUE SOON (Take with food for blood sugar regulation)\n• 08:30 PM (Night): Atorvastatin 10mg - SCHEDULED (Bedtime for lipid & cholesterol balance)\n\nNote: If Metformin is missed, take it with a snack as soon as remembered, but never double the dose.`;
  } else if (q.includes("emergency") || q.includes("doctor") || q.includes("112") || q.includes("urgent")) {
    fallbackReply = `For urgent medical conditions:\n\n• Emergency Ambulance / SOS: Dial 112\n• Dr. R. Sharma (Cardiopulmonary Specialist): Available on priority caregiver line\n• Apollo Emergency Triage Desk: 1066\n\nSymptoms requiring immediate attention include acute chest discomfort, sudden shortness of breath, severe dizziness, or confusion.`;
  } else {
    fallbackReply = `I am here to assist with Savithri Devi's health records. Her current profile is stable:\n\n• Blood Pressure: 128/82 mmHg (Normal)\n• Fasting Glucose: 118 mg/dL (On target)\n• Pending Action: Metformin 500mg due at 2:00 PM with lunch.\n• Unreviewed: Apollo CBC lab report (Hemoglobin 10.2 g/dL).\n\nFeel free to ask about any medications, lab values, or meal recommendations!`;
  }

  return {
    text: fallbackReply,
    source: 'clinical_engine',
  };
}
