# 🧠 Unbabel Mind — AI-Powered IELTS Practice

Practice smarter across Reading, Listening, Writing, and Speaking — with AI reviews, context-aware explanations, and personalized suggestions that turn practice into real progress.

<img width="2236" height="840" alt="Home — interactive demo with Instant Translation, AI Review, AI Suggestions" src="https://github.com/user-attachments/assets/062d679e-4329-4740-9a50-d6a0450ebea2" />

## 🎥 Video Walkthrough & Demo

[![Watch the walkthrough & demo](https://img.youtube.com/vi/wlHTPwZr7Nw/hqdefault.jpg)](https://www.youtube.com/watch?v=wlHTPwZr7Nw&t=4s)

Prefer a direct link? Go to (https://youtu.be/wlHTPwZr7Nw)

## ✨ What You Can Do

- **Instant Translation & Explanations**: Right‑click selected text to translate, paraphrase, or ask for context‑aware explanations while practicing.
- **AI Review on Submission**: For each wrong answer, see why it’s wrong, your mistake, and how to improve.
- **Unbabel Suggestions**: A concise summary of your strengths, weaknesses, and targeted improvement tips after each session.
- **In‑Context Dictionary & Paraphrase**: Understand tricky words, sentences, or paragraphs in context — English‑to‑English.
- **Profile & Token Control**: Manage your OpenAI token in the Profile page; the value is kept local and used only to power AI features.

<img width="1680" height="868" alt="Context menu on selection with translate, explain, and paraphrase" src="https://github.com/user-attachments/assets/14a6b47e-37b6-4617-be86-d3f5f9155fe0" />

## 🚀 Product Tour

### Home — Interactive Demo
- Try highlights before signing up: Instant Translation, AI Review, and AI Suggestions.
- Get a feel for the interface and feedback workflow in seconds.

<img width="1659" height="865" alt="Interactive demo on the home page" src="https://github.com/user-attachments/assets/ae80ab00-fed4-4f85-8557-a78f85faf4b2" />
  
### Reading
- Attempt IELTS‑style questions (TF/NG, MCQ, fill‑in‑the‑blank) on a passage library.
- Right‑click any text or question to translate, paraphrase, or ask for help.
- After submitting, open the AI panel for per‑question review and overall Unbabel Suggestions.

<img width="1680" height="868" alt="Reading attempt — selection tools and questions" src="https://github.com/user-attachments/assets/d93b2fe4-5388-4b0c-b53d-53627d8e8c06" />
<img width="1678" height="863" alt="Reading review — Unbabel AI explanation and suggestions" src="https://github.com/user-attachments/assets/35ab42ae-927b-4402-ab79-68eb030f6462" />

### Listening
- Built‑in audio player for practice; all UI controls included.
- Review page shows the full recording transcript to spot what you missed.
- AI feedback is tailored for listening mistakes and strategies.

<img width="1665" height="864" alt="Listening review — transcript with AI feedback" src="https://github.com/user-attachments/assets/7aef9969-52ee-4b8d-935e-186c4bede471" />

### Writing
- Modern scoring aligned with official IELTS criteria:
  Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.
- Submit your essay to see your score breakdown and actionable suggestions.

<img width="1680" height="864" alt="Writing — score breakdown across four criteria" src="https://github.com/user-attachments/assets/ba9e6bb3-42fa-48a1-81a3-66bcbbf442fd" />

### Speaking
- Speaking practice available; AI tutor feedback is ready today.
- Automatic scoring is in progress as we train our own model.

### AI Quiz (Bite‑Size Learning)
- Practice in short, fun sessions with three dynamic types:
  Context Understanding, English‑to‑English, Grammar MCQs.
- Infinite question bank — every item is generated on the fly.
- Instant result and explanation after submission.

<img width="1680" height="865" alt="AI Quiz — cards and instant result" src="https://github.com/user-attachments/assets/a1953df6-3b94-4065-947a-bb3cda7523c1" />
<img width="1680" height="861" alt="AI Quiz — cards and instant result" src="https://github.com/user-attachments/assets/f08efbaa-aa03-4640-8d94-ea59c9fd3e5d" />
<img width="1680" height="866" alt="AI Quiz — cards and instant result" src="https://github.com/user-attachments/assets/90706d7b-cc81-4c9e-bcef-3727b775295a" />

## 🧩 How It Works

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Node.js + Express (TypeScript)
- **Database**: PostgreSQL 17
- **AI**: OpenAI API for reviews, explanations, and quizzes
- **Containerization**: Docker + Docker Compose

## 🐳 Quick Start (Docker)

Prerequisites: Docker, Docker Compose, and an OpenAI API key.

1) Clone and enter the repo
```bash
git clone https://github.com/your-org/unbabel-mind.git
cd unbabel-mind
```

2) Start the stack (pass your key)
```bash
OPENAI_API_KEY=sk-xxxxx docker-compose up --build
```

3) Open the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

4) First run
- Sign up, then open Profile to confirm or update your token.
- Your token powers AI features and is kept local to your session.

## 🔐 Notes on Content
- Listening audio may be muted or not included for copyright reasons; the player UI is fully functional.
- AI explanations are generated dynamically; results vary with prompts and context.

## 🗺️ Roadmap
- Speaking auto‑scoring model (in progress)
- Expanded passage/library coverage
- More quiz templates and skills

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR. See component-level docs in:
- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)
- [Docker Documentation](./DOCKER_README.md)

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.

## 🆘 Support

- 📧 Email: support@unbabelmind.com
- 💬 Discord: Join our community


---

Built to make IELTS practice efficient, explainable, and motivating.
