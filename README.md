# MyJapan

A personalized travel planning web application for tourists visiting Japan. Create custom travel itineraries by answering 6 simple questions about your preferences.

🌸 **Live Demo:** [https://my-japan-seven.vercel.app/](https://my-japan-seven.vercel.app/)

> **Note:** Currently optimized for desktop and tablet devices. Mobile support coming soon!

## Features

- **Personalized Itineraries**: Get custom travel plans based on your preferences
- **Interactive Questionnaire**: Answer 6 questions about your travel style and interests
- **AI-Powered Recommendations**: Uses OpenAI to generate detailed daily schedules
- **Interactive Maps**: View your destinations with integrated Google Maps
- **Flipbook Interface**: Beautiful page-turning experience to browse your itinerary
- **PDF Export**: Download your travel plan for offline use
- **Cherry Blossom Effects**: Enjoy animated sakura petals while planning

## How It Works

1. **Choose Your Destination**: Select from popular Japanese cities (Tokyo, Kyoto, Osaka, Hokkaido, Okinawa)
2. **Set Trip Duration**: Plan for 1-7 days
3. **Share Your Preferences**: Tell us about your age, adventure level, and travel priorities
4. **Get Your Plan**: Receive a detailed day-by-day itinerary with timeslots and recommendations
5. **Explore & Export**: Browse your plan in the flipbook interface and download as PDF

## Tech Stack

- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **AI Integration**: OpenAI API
- **Maps**: Google Maps API
- **UI Effects**: page-flip library, sakura-js
- **Export**: html2canvas, jsPDF

## Getting Started

### Prerequisites

- Node.js 18+ 
- OpenAI API key
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd myjapan
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Status

🚧 **Work in Progress** - Currently in active development

### Current Limitations
- Desktop/tablet only (mobile responsive design in development)
- Limited to 7-day trips
- 5 destination options available

### Planned Features
- Mobile responsive design
- More destination options
- Multi-language support
- User accounts and saved itineraries
- Social sharing features

## API Usage

The application integrates with two main APIs:

- **OpenAI API**: Generates personalized travel recommendations based on user preferences
- **Google Maps API**: Provides interactive maps for each destination in the itinerary
