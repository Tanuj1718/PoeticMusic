# Music from Poetry - Full Stack Next.js Application

A modern full-stack application that transforms poems and song lyrics into instrumental music using AI. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🎵 Features

- **Dual Input Modes**: Provide your own lyrics or generate them using AI
- **AI-Powered Lyrics Generation**: Create poems or song lyrics with customizable mood, length, and language
- **Intelligent Music Analysis**: Automatically analyzes lyrics to determine mood, tempo, style, and instruments
- **Music Generation**: Creates instrumental tracks that match the emotional tone of your lyrics
- **Generation History**: Save and replay your previous generations
- **Audio Playback**: Built-in music player with timeline controls
- **Download**: Save generated music files to your device

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Services**: 
  - Google Gemini (Lyrics generation & analysis)
  - ElevenLabs (Music generation)
- **Icons**: Lucide React

## 📁 Project Structure

```
music-from-poetry/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── generate-lyrics/    # Gemini lyrics generation
│   │   │   ├── analyze-lyrics/     # Lyrics analysis & prompt creation
│   │   │   └── generate-music/     # ElevenLabs music generation
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Main page
│   │   └── globals.css             # Global styles
│   ├── components/                  # React components
│   │   ├── LyricsInput.tsx         # Manual lyrics input
│   │   ├── LyricsGenerator.tsx     # AI lyrics generation
│   │   ├── MusicPlayer.tsx         # Audio player & analysis display
│   │   └── GenerationHistory.tsx   # Saved generations list
│   ├── lib/                         # Utility libraries
│   │   ├── gemini.ts               # Gemini API integration
│   │   ├── elevenlabs.ts           # ElevenLabs API integration
│   │   └── storage.ts              # LocalStorage utilities
│   └── types/
│       └── index.ts                # TypeScript type definitions
├── public/                          # Static assets
├── .env.local                       # Environment variables
├── next.config.js                   # Next.js configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
└── package.json                    # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- API Keys:
  - Google Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))
  - ElevenLabs API Key ([Get it here](https://elevenlabs.io/app/settings/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd music-from-poetry
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Option 1: Provide Your Own Lyrics

1. Click "Provide Your Own" tab
2. Paste your poem or song lyrics
3. Click "Use These Lyrics"
4. Click "Generate Music" to create the instrumental track

### Option 2: Generate Lyrics with AI

1. Click "Generate with AI" tab
2. Select your preferences:
   - Content Type (Poem or Song)
   - Mood (sad, happy, peaceful, energetic, etc.)
   - Length (10-50 lines)
   - Language
3. Click "Generate Lyrics"
4. Review the generated lyrics
5. Click "Generate Music" to create the instrumental track

### Playback & Download

- Use the play/pause button to control playback
- Drag the timeline slider to seek
- Click the download button to save the music file
- View all your generations in the History panel

## 🔧 Configuration

### API Rate Limits

- **Gemini**: Free tier includes 60 requests per minute
- **ElevenLabs**: Check your plan limits at their dashboard

### Customizing Music Duration

Edit `src/lib/elevenlabs.ts`:
```typescript
duration_seconds: 60, // Change this value (in seconds)
```

### Adjusting Lyrics Length Range

Edit `src/components/LyricsGenerator.tsx`:
```typescript
<input
  type="number"
  min="10"    // Minimum lines
  max="50"    // Maximum lines
  ...
/>
```

## 📝 File Explanations

### Core Files

- **`package.json`**: Project dependencies and scripts
- **`tsconfig.json`**: TypeScript compiler configuration
- **`tailwind.config.ts`**: Tailwind CSS customization
- **`next.config.js`**: Next.js framework configuration

### Application Files

- **`src/app/page.tsx`**: Main page component that orchestrates the entire user flow
- **`src/app/layout.tsx`**: Root layout with metadata and global styles
- **`src/app/globals.css`**: Global CSS styles and Tailwind directives

### API Routes

- **`src/app/api/generate-lyrics/route.ts`**: Handles AI lyrics generation requests
- **`src/app/api/analyze-lyrics/route.ts`**: Analyzes lyrics and creates music prompts
- **`src/app/api/generate-music/route.ts`**: Generates music files from prompts

### Components

- **`LyricsInput.tsx`**: Manual text input with character/line count
- **`LyricsGenerator.tsx`**: AI-powered lyrics generation interface
- **`MusicPlayer.tsx`**: Audio player with analysis display and controls
- **`GenerationHistory.tsx`**: List of saved generations with replay/delete

### Libraries

- **`lib/gemini.ts`**: Gemini AI API integration for text generation
- **`lib/elevenlabs.ts`**: ElevenLabs API integration for music creation
- **`lib/storage.ts`**: Browser localStorage management utilities

### Types

- **`types/index.ts`**: TypeScript interfaces and type definitions

## 🐛 Troubleshooting

### API Errors

- Verify your API keys are correct in `.env.local`
- Check API rate limits on your provider dashboards
- Ensure you have sufficient credits/quota

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Audio Not Playing

- Check browser console for errors
- Verify the audio blob is being created successfully
- Try a different browser (Chrome/Firefox recommended)


## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Gemini AI, and ElevenLabs