# Job8earch 🔍

**AI-Powered Job Search Platform**

Job8earch is a modern job search platform that combines job listings with AI-powered features to help job seekers find their perfect role. Built with React and powered by various AI models.

## ✨ Features

- **Job Search**: Browse job listings from Reed API
- **AI Chat Assistant**: Get help with career questions and general inquiries
- **Skills Analysis**: AI-powered analysis of job requirements and skills needed
- **Interview Preparation**: Get personalized interview guidance and tips
- **Job Analysis**: Detailed AI analysis of job postings
- **Multiple AI Models**: Choose from various free AI models via OpenRouter

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **AI Integration**: Multiple free models
- **Job Data**: Reed API for job listings
- **Styling**: Tailwind CSS with custom components
- **Build Tool**: Vite for fast development and building

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jeff9497/Job8earch.git
   cd Job8earch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_REED_API_KEY=your_reed_api_key_here
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   VITE_OPENROUTER_MODEL=google/gemma-3n-e2b-it:free
   ```

4. **Configure OpenRouter Privacy Settings**
   - Visit [OpenRouter Privacy Settings](https://openrouter.ai/settings/privacy)
   - You may be required to enable prompt training to access free models

5. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 API Configuration

### Reed API
- Get your API key from [Reed API](https://www.reed.co.uk/developers)
- Used for fetching  job listings

### OpenRouter API
- Sign up at [OpenRouter](https://openrouter.ai/)
- Get your API key from the dashboard
- You may be required to configure privacy settings to enable free models

## 🤖 Available AI Models

The platform supports multiple free AI models:
- Google: Gemma 3n 2B (Free)
- Tencent: Hunyuan A13B (Free)
- TNG: DeepSeek R1T2 Chimera (Free)
- Cypher Alpha (Free)
- Mistral: Small 3.2 24B (Free)

## 📱 Usage

1. **Job Search**: Use the search functionality to find jobs by title, location, or keywords
2. **AI Chat**: Click on "AI Chat" to get general assistance or career advice
3. **Skills Analysis**: Ask the AI to analyze skills required for specific job titles
4. **Interview Prep**: Get personalized interview preparation guidance
5. **Job Analysis**: Get detailed AI analysis of job postings

## 🧪 Testing

The platform includes an API connection test feature:
- Click "Test API Connection" in the chat interface
- Verifies OpenRouter API connectivity
- Shows available models and connection status

## 🚀 Deployment

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Geofrey Kamau**
- Email: jeffkamau9497@gmail.com
- GitHub: [@jeff9497](https://github.com/jeff9497)

