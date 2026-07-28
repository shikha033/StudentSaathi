import AnimatedBackground from './AnimatedBackground';

const tickerItems = [
    '📚 100+ Guides & Resources',
    '🎓 5 Categories Covered',
    '🤖 AI Assistant Built In',
    '🔍 Instant Search',
    '🚨 Emergency Helplines',
    '🚀 Always Free for Students',
];

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden text-white py-20 px-4">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto text-center relative z-10 animate-fade-in-up">
        <h1 className="mb-4 text-4xl md:text-5xl font-extrabold drop-shadow-lg">StudentSaathi</h1>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          Your One-Stop Digital Guide for Student Empowerment
        </p>
      </div>

      {/* Moving text ticker */}
      <div className="relative z-10 mt-10 overflow-hidden border-y border-white/20 bg-white/10 backdrop-blur-sm py-3">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="text-white/90 text-sm md:text-base font-medium">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
