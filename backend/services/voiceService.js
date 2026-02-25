import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const modelByLanguage = {
  English: "gemini-2.5-flash-preview-tts",
  Hindi: "gemini-2.5-flash-preview-tts",
  Assamese: "gemini-2.5-flash-preview-tts",
};

const voiceByLanguage = {
  English: "Zephyr",
  Hindi: "Puck",
  Assamese: "Kore",
};

const languageCodeByLanguage = {
  English: "en-US",
  Hindi: "hi-IN",
  Assamese: "as-IN",
};

const VOICE_CACHE_TTL_MS = 20 * 60 * 1000;
const voiceCache = new Map();

const parseSampleRate = (mimeType = "") => {
  const match = /rate=(\d+)/i.exec(mimeType);
  return match ? Number(match[1]) : 24000;
};

const pcm16ToWavBuffer = (pcmBuffer, sampleRate = 24000, channels = 1) => {
  const bitsPerSample = 16;
  const blockAlign = channels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  const dataSize = pcmBuffer.length;
  const headerSize = 44;
  const wav = Buffer.alloc(headerSize + dataSize);

  wav.write("RIFF", 0);
  wav.writeUInt32LE(36 + dataSize, 4);
  wav.write("WAVE", 8);
  wav.write("fmt ", 12);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(channels, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(byteRate, 28);
  wav.writeUInt16LE(blockAlign, 32);
  wav.writeUInt16LE(bitsPerSample, 34);
  wav.write("data", 36);
  wav.writeUInt32LE(dataSize, 40);
  pcmBuffer.copy(wav, headerSize);

  return wav;
};

export const generateVoiceAudio = async ({ text, language = "English" }) => {
  // Use voice key if present, fallback to primary key
  const apiKey = process.env.GEMINI_API_KEY_VOICE || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const model = modelByLanguage[language] || "gemini-1.5-flash"; // Fallback to 1.5-flash for broader support
  const voiceName = voiceByLanguage[language] || voiceByLanguage.English;
  const languageCode = languageCodeByLanguage[language] || "en-US";

  const inputText = text.slice(0, 7000);
  const cacheKey = crypto
    .createHash("sha1")
    .update(`${language}:${inputText}`)
    .digest("hex");

  const cached = voiceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < VOICE_CACHE_TTL_MS) {
    return cached.payload;
  }

  const requestBody = {
    contents: [
      {
        parts: [{ text: inputText }],
      },
    ],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName,
          },
        },
      },
    },
  };

  // If not English, sometimes specific language instructions in the config help
  if (language !== "English") {
    // Some API versions support language codes in speechConfig
    requestBody.generationConfig.speechConfig.languageCode = languageCode;
  }

  console.log(`Generating voice for ${language} using model ${model} and voice ${voiceName}...`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error(`Gemini TTS error (${response.status}) for ${language}:`, errText);
    throw new Error(`Gemini TTS error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const audioPart = parts.find((part) => part.inlineData?.data);

  if (!audioPart?.inlineData?.data) {
    console.warn("No audio data returned. Response parts types:", parts.map(p => Object.keys(p)));
    throw new Error("No audio data returned from Gemini TTS.");
  }

  const rawMimeType = audioPart.inlineData.mimeType || "audio/wav";
  let payload;

  if (/^audio\/l16/i.test(rawMimeType)) {
    const sampleRate = parseSampleRate(rawMimeType);
    const pcmBuffer = Buffer.from(audioPart.inlineData.data, "base64");
    const wavBuffer = pcm16ToWavBuffer(pcmBuffer, sampleRate, 1);
    payload = {
      audioBase64: wavBuffer.toString("base64"),
      mimeType: "audio/wav",
    };
  } else {
    payload = {
      audioBase64: audioPart.inlineData.data,
      mimeType: rawMimeType,
    };
  }

  voiceCache.set(cacheKey, {
    timestamp: Date.now(),
    payload,
  });

  return payload;
};
