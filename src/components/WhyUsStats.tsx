import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

const AnimatedCounter: React.FC<CounterProps> = ({ value, prefix = "", suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const range = end - start;
    if (range === 0) return;

    const increment = end / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className="font-serif font-light text-5xl md:text-7xl lg:text-8xl tracking-tighter text-ink">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export const WhyUsStats: React.FC = () => {
  return (
    <section className="py-40 bg-white text-ink overflow-hidden relative border-t border-ink/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(26,26,26,0.015),transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-3 gap-16 md:gap-12 lg:gap-8">
          
          {/* Stat 1 */}
          <div className="space-y-6 flex flex-col justify-between p-8 rounded-none bg-white border border-ink/15 hover:border-brand/40 shadow-none transition-all duration-300">
            <div>
              <div className="h-16 flex items-center mb-6">
                {/* Thin Line Geometric Icon 1 */}
                <svg className="w-12 h-12 text-brand" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                    d="M10 50 H90 M50 10 V90 M30 30 L70 70 M30 70 L70 30" 
                    stroke="currentColor" 
                    strokeWidth="0.75"
                  />
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4" />
                </svg>
              </div>
              <p className="architect-label text-ink/40 mb-2">Sourcing & Depth</p>
              <h2 className="flex items-baseline gap-1">
                <AnimatedCounter value={70000} prefix="OVER " suffix="+" />
              </h2>
            </div>
            <div className="pt-6 border-t border-ink/5 space-y-2">
              <span className="architect-label text-brand block">Materials Library</span>
              <p className="text-xs text-ink/70 font-light leading-relaxed">
                Unrestricted by local coastal supply limits. We directly source exceptional Italian marble slabs, Belgian linens, and exotic woods.
              </p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="space-y-6 flex flex-col justify-between p-8 rounded-none bg-white border border-ink/15 hover:border-brand/40 shadow-none transition-all duration-300">
            <div>
              <div className="h-16 flex items-center mb-6">
                {/* Thin Line Geometric Icon 2 */}
                <svg className="w-12 h-12 text-brand" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                    d="M10 90 L50 10 L90 90 Z M50 10 V90 M23 60 H77" 
                    stroke="currentColor" 
                    strokeWidth="0.75"
                  />
                  <rect x="25" y="45" width="50" height="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                </svg>
              </div>
              <p className="architect-label text-ink/40 mb-2">Proven Track Record</p>
              <h2 className="flex items-baseline gap-1">
                <AnimatedCounter value={145} suffix=" +" />
              </h2>
            </div>
            <div className="pt-6 border-t border-ink/5 space-y-2">
              <span className="architect-label text-brand block">Coastal Sanctuaries</span>
              <p className="text-xs text-ink/70 font-light leading-relaxed">
                High-performance architectural structures. Expertly designed and carefully built to stay beautiful against intense maritime sea-salt atmospheres.
              </p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="space-y-6 flex flex-col justify-between p-8 rounded-none bg-white border border-ink/15 hover:border-brand/40 shadow-none transition-all duration-300">
            <div>
              <div className="h-16 flex items-center mb-6">
                {/* Thin Line Geometric Icon 3 */}
                <svg className="w-12 h-12 text-brand" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.4 }}
                    d="M50 10 L60 38 L90 38 L65 57 L75 87 L50 68 L25 87 L35 57 L10 38 L40 38 Z" 
                    stroke="currentColor" 
                    strokeWidth="0.75"
                  />
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" />
                </svg>
              </div>
              <p className="architect-label text-ink/40 mb-2">Global Standing</p>
              <h2 className="flex items-baseline gap-1">
                <AnimatedCounter value={12} prefix="TOP " />
              </h2>
            </div>
            <div className="pt-6 border-t border-ink/5 space-y-2">
              <span className="architect-label text-brand block">Design Accolades</span>
              <p className="text-xs text-ink/70 font-light leading-relaxed">
                Direct validation of our core devotion to sublime proportions, monochrome tranquility, and physical structural integrity.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
