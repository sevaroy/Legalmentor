# LegalMentor

AI-powered legal study assistant with generative answers and case law search.

## 🚀 Features

- **Legal-Focused AI**: Tailored for law students and legal professionals
- **Case Law Search**: Search through legal precedents and case law
- **Exam Preparation**: Practice with AI-generated legal questions
- **Multi-Provider Support**: OpenAI, Anthropic, Google, and more
- **Chat History**: Save and review your legal research sessions
- **Real-time Search**: Web search for latest legal developments

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **AI Integration**: Vercel AI SDK
- **Database**: Supabase (Auth + Storage)
- **Search**: Tavily API for web search
- **Deployment**: Vercel, Docker, Cloudflare Pages

## 📦 Installation

### Prerequisites

- Node.js 18+ or Bun
- OpenAI API Key
- Tavily API Key (for web search)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/legalmentor.git
   cd legalmentor
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_key
   TAVILY_API_KEY=your_tavily_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Flegalmentor)

### Docker

```bash
# Build and run with Docker
docker compose up -d

# Or pull prebuilt image
docker pull ghcr.io/your-username/legalmentor:latest
```

## 🔧 Configuration

See [Configuration Guide](docs/CONFIGURATION.md) for:
- Additional AI providers (Anthropic, Google, Groq)
- Redis setup for chat history
- Custom search providers
- Environment variables

## 🤝 Contributing

We welcome contributions to LegalMentor! Please see [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🎯 Legal Use Cases

- **Law Students**: Case briefing, exam prep, legal research
- **Legal Professionals**: Quick case law lookup, precedent analysis
- **Paralegals**: Document review assistance, legal research
- **Researchers**: Legal trend analysis, comparative law studies
