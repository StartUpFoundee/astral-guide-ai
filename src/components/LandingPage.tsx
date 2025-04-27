
import { useNavigate } from 'react-router-dom';
import StarBackground from './StarBackground';
import VideoBackground from './VideoBackground';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <VideoBackground />
      <StarBackground />
      
      <div className="relative z-10 text-center space-y-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white/90 tracking-wide">
          🔮 Welcome to AIPandit
        </h1>
        <p className="text-xl md:text-2xl text-purple-200/80 font-light">
          Your Personal Astrology Guide
        </p>
        <button
          onClick={() => navigate('/birth-details')}
          className="px-8 py-3 bg-gradient-to-r from-purple-500/80 to-fuchsia-600/80 rounded-full
                     text-white font-medium tracking-wide
                     transform hover:scale-105 transition-all duration-300
                     shadow-lg hover:shadow-purple-500/25
                     animate-scale-in"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
