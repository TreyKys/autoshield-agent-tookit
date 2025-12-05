import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Menu, Activity, Zap, Lock, CheckCircle, Search, AlertOctagon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 h-10 px-4 py-2",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
