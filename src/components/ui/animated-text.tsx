import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextProps {
  text: string;
  delay?: number;
  duration?: number;
  ease?: string;
  className?: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0.05,
  duration = 0.6,
  ease = 'power3.out',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll('.char');

    gsap.set(chars, { opacity: 0, y: 40 });

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger: delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [text, delay, duration, ease]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll('.char');

    gsap.set(chars, { opacity: 0, y: 40 });

    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    timeline.to(chars, {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger: delay,
    });

    timeline.to(chars, {
      opacity: 0,
      y: 40,
      duration,
      ease,
      stagger: delay,
      delay: 2,
    });

    return () => {
      timeline.kill();
    };
  }, [text, delay, duration, ease]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="char inline-block"
          style={{ willChange: 'opacity, transform' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export default AnimatedText;
