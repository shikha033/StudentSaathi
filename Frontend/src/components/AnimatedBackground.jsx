

import { GraduationCap, BookOpen, Award, Star, Rocket, Lightbulb } from 'lucide-react';

const shapes = [
    { Icon: GraduationCap, className: 'top-[8%] left-[6%] w-14 h-14 float-a', delay: '0s' },
    { Icon: BookOpen, className: 'top-[65%] left-[10%] w-10 h-10 float-b', delay: '0.5s' },
    { Icon: Award, className: 'top-[20%] right-[8%] w-12 h-12 float-c', delay: '1s' },
    { Icon: Star, className: 'top-[75%] right-[14%] w-8 h-8 float-a', delay: '1.5s' },
    { Icon: Rocket, className: 'top-[40%] left-[45%] w-9 h-9 float-b hidden md:block', delay: '2s' },
    { Icon: Lightbulb, className: 'top-[12%] left-[40%] w-8 h-8 float-c hidden md:block', delay: '2.5s' },
];

export default function AnimatedBackground({ className = '' }) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {/* Moving gradient base */}
            <div className="absolute inset-0 animated-gradient bg-gradient-to-br from-[var(--brand-navy)] via-[var(--brand-blue)] to-[var(--brand-navy-light)]" />

            {/* Soft blurred color blobs */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-20 blur-3xl float-a" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-300 rounded-full opacity-20 blur-3xl float-b" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-300 rounded-full opacity-10 blur-3xl float-c" style={{ animationDelay: '2s' }} />

            {/* Floating education-themed icons */}
            {shapes.map(({ Icon, className: shapeClass, delay }, i) => (
                <div
                    key={i}
                    className={`absolute text-white/20 ${shapeClass}`}
                    style={{ animationDelay: delay }}
                >
                    <Icon className="w-full h-full" strokeWidth={1.5} />
                </div>
            ))}
        </div>
    );
}
