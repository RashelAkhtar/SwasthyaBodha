import { useEffect, useRef, useState } from "react";

const parseSampleRate = (mimeType = "") => {
  const match = /rate=(\d+)/i.exec(mimeType);
  return match ? Number(match[1]) : 24000;
};

const pcm16ToWavBlob = (pcmBytes, sampleRate = 24000) => {
  const headerSize = 44;
  const buffer = new ArrayBuffer(headerSize + pcmBytes.length);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  const writeString = (offset, value) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + pcmBytes.length, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, pcmBytes.length, true);
  bytes.set(pcmBytes, headerSize);

  return new Blob([buffer], { type: "audio/wav" });
};

function VoiceOutputToggle({ text, language, t, className = "", autoPlay = false, onReady, onEnded }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const audioRef = useRef(null);
  const audioUrlRef = useRef("");
  const cacheRef = useRef(new Map());
  const lastPlayedText = useRef("");
  useEffect(() => {
    if (autoPlay && text?.trim() && text !== lastPlayedText.current) {
      lastPlayedText.current = text;
      toggleSpeech();
    }
  }, [autoPlay, text]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (
        audioUrlRef.current &&
        !Array.from(cacheRef.current.values()).includes(audioUrlRef.current)
      ) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      for (const url of cacheRef.current.values()) {
        URL.revokeObjectURL(url);
      }
      cacheRef.current.clear();
    };
  }, []);

  const stopAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsSpeaking(false);
  };

  const toggleSpeech = async () => {
    if (isSpeaking) {
      stopAudio();
      return;
    }

    const content = text?.trim();
    if (!content) return;
    const cacheKey = `${language}::${content}`;

    if (cacheRef.current.has(cacheKey)) {
      setError("");
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(cacheRef.current.get(cacheKey));
      audioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
        if (onEnded) onEnded();
      };
      audio.oncanplaythrough = () => {
        if (onReady) onReady();
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        setError(t("voice_failed"));
      };
      setIsSpeaking(true);
      try {
        await audio.play();
      } catch (err) {
        console.log("Error:", err)
        setIsSpeaking(false);
        setError(t("voice_failed"));
      }
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/voice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: content, language }),
      });

      if (!response.ok) {
        throw new Error(`Voice API failed with status ${response.status}`);
      }

      const payload = await response.json();
      const audioBase64 = payload?.audioBase64;
      const mimeType = payload?.mimeType || "audio/wav";

      if (!audioBase64) {
        throw new Error("No audio payload received.");
      }

      const binary = atob(audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }

      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (
        audioUrlRef.current &&
        !Array.from(cacheRef.current.values()).includes(audioUrlRef.current)
      ) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      const blob = /^audio\/l16/i.test(mimeType)
        ? pcm16ToWavBlob(bytes, parseSampleRate(mimeType))
        : new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      cacheRef.current.set(cacheKey, url);

      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => {
        setIsSpeaking(false);
        if (onEnded) onEnded();
      };
      audio.oncanplaythrough = () => {
        if (onReady) onReady();
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        setError(t("voice_failed"));
      };

      setIsSpeaking(true);
      await audio.play();
    } catch (err) {
      console.error("Voice playback error:", err);
      setIsSpeaking(false);
      setError(t("voice_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={toggleSpeech}
        disabled={!text?.trim() || isLoading}
      >
        {isLoading
          ? t("voice_loading")
          : isSpeaking
            ? t("voice_stop")
            : t("voice_play")}
      </button>
      {error ? <p className="voice-unsupported">{error}</p> : null}
    </>
  );
}

export default VoiceOutputToggle;
