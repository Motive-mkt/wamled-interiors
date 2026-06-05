import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  title: string;
  description: string;
  location?: string;
}

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  title,
  description,
  location
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  return (
    <div className="flex flex-col gap-4 text-left">
      {/* Slider Interactive stage */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="w-full aspect-[4/3] relative select-none overflow-hidden rounded-2xl border border-gray-150 shadow-inner cursor-ew-resize bg-gray-100"
      >
        {/* Background Layer: "After" image (completed work) */}
        <img 
          src={afterUrl} 
          alt="After intervention" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        
        {/* Foreground Layer: "Before" image (clipped on slider position value) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`
          }}
        >
          <img 
            src={beforeUrl} 
            alt="Before condition" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none filter saturate-75 contrast-95"
          />
        </div>

        {/* Labels over the layout margins */}
        <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md text-[8px] font-mono tracking-widest text-white px-2.5 py-1 rounded-md border border-white/10 uppercase font-bold pointer-events-none shadow-sm z-10 transition-opacity duration-300">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-[#C5A059]/90 backdrop-blur-md text-[8px] font-mono tracking-widest text-white px-2.5 py-1 rounded-md border border-white/10 uppercase font-bold pointer-events-none shadow-sm z-10 transition-opacity duration-300">
          After
        </div>

        {/* Center Drag handle divider */}
        <div 
          className="absolute inset-y-0 z-20 w-1 bg-white cursor-ew-resize active:scale-x-[1.5] transition-all"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Circular Button badge grabber */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-300 shadow-md flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 border-l-2 border-b-2 border-gray-500 transform rotate-45 pointer-events-none block" />
            <span className="w-1.5 h-1.5 border-r-2 border-t-2 border-gray-500 transform rotate-45 pointer-events-none block" />
          </div>
        </div>
      </div>

      {/* Narrative details container */}
      <div className="space-y-2.5 px-1 sm:px-2">
        {location && (
          <div className="flex items-center gap-1.2 text-gray-400 text-[9.5px] font-mono tracking-widest uppercase font-bold">
            <MapPin size={10} className="text-[#C5A059]" />
            <span>{location}</span>
          </div>
        )}
        <h4 className="text-lg font-serif font-light text-[#121212] tracking-tight uppercase leading-snug">
          {title}
        </h4>
        <p className="text-[11px] text-gray-500 font-light leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
