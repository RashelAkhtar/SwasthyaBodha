# Swasthya-Bodha (স্বাস্থ্য-বোধ) 🩺
### AI-Powered Medical Clarity Platform

**Swasthya-Bodha** is a state-of-the-art medical interpretation platform designed to bridge the gap between complex clinical reports and patient understanding. By using multimodal Artificial Intelligence, it transforms dense medical jargon into clear, calm, and actionable insights in local languages.

---

## 🚀 Vision
Medical reports are often intimidating and filled with technical terms. Our goal is to empower patients with "Complete Clarity"—giving them a grade-school level understanding of their health status, identifying critical findings without causing unnecessary alarm, and preparing them for productive conversations with their doctors.

---

## ✨ Key Features

### 1. Multimodal AI Interpretation
- **X-Ray Analysis**: Deep-scan analysis of chest X-ray images to identify radiological findings.
- **Report Interpretation**: Specialized analysis of lab reports, discharge summaries, and prescriptions.
- **Risk Coding**: Semantic visual coding (Green, Yellow, Red) to help patients categorize findings at a glance.

### 2. Full Localization (English, Hindi, Assamese)
- **Native Experience**: The entire platform, from buttons to AI-generated medical explanations, is available in English, Hindi (हिन्दी), and Assamese (অসমীয়া).
- **Styled Headers**: Professional UI styling preserved across all languages using selective translation key-splitting.

### 3. Synchronized Voice Narration
- **Guided Results**: High-quality regional TTS (Text-to-Speech) that reads out findings slide-by-slide.
- **Accessibility**: Optimized for patients who prefer listening over reading, with synchronized UI transitions.

### 4. Patient-Safe Design
- **Calm Tone**: AI prompts are strictly tuned to avoid diagnosis/prescription while maintaining a reassuring and clinical tone.
- **Doctor Preparation**: Automatically generates "Questions to ask your Doctor" based on specific findings.
- **Emergency Detection**: Clearly surfaces critical items and when to seek urgent care.

---

## 🛠 Technology Stack

- **Frontend**: React (Vite) with Vanilla CSS (Modern, Responsive, 60fps animations).
- **Backend**: Node.js & Express.js (High-performance API handling).
- **AI Engine**: Google Gemini Multimodal Models (Gemini-2.5-Flash).
- **TTS**: Multimodal Audio Modality via v1beta Gemini API.
- **Security**: Multer for secure file parsing, environment-based key management.

---

## 📂 Project Structure

- `/frontend`: Modern Vite application containing all UI components, state management, and translations.
- `/backend`: Specialized AI service handling image processing, prompt engineering, and voice generation.
- `.env.example`: Template for quick environment setup and portability.

---

## 🛠 Setup & Run

1. **Clone the repo** to your local machine.
2. **Setup Backend**:
   - `cd backend`
   - `npm install`
   - Create a `.env` file based on `.env.example` and add your Gemini API keys.
   - `node index.js`
3. **Setup Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

---

## 🏆 Development Milestones
1. ✅ Established dual-stack architecture (Vite + Express).
2. ✅ Integrated Gemini Multimodal AI for X-ray & Text analysis.
3. ✅ Developed the "Medical Clarity" UI/UX with smooth staggered animations.
4. ✅ Implemented full I18n support for Hindi and Assamese.
5. ✅ Built the Synchronized Voice + Slider results viewer.
6. ✅ Optimized for security and portable developer handoff.

---
*Disclaimer: This platform provides educational information and is not a medical diagnosis. Always consult a licensed healthcare professional.*
