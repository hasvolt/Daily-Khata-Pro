import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface GenericCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function GenericCard3D({ children, className = "", intensity = 10 }: GenericCard3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${intensity}deg`, `-${intensity}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${intensity}deg`, `${intensity}deg`]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full relative group">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative bg-gradient-to-br from-[var(--theme-card,#132438)] to-[var(--theme-surface,#0E1A29)] border border-[var(--theme-border,#213E61)] rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300 ${className}`}
      >
        {/* Animated Glare */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)",
            x: useTransform(mouseXSpring, [-0.5, 0.5], ["-50%", "50%"]),
            y: useTransform(mouseYSpring, [-0.5, 0.5], ["-50%", "50%"]),
          }}
        />
        <div className="relative z-10 h-full w-full" style={{ transform: "translateZ(20px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
