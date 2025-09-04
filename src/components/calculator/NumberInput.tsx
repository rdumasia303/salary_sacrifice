import React from 'react';
import clsx from 'clsx';

interface NumberInputProps {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  step?: string | number;
  className?: string;
}

export default function NumberInput({ value, onChange, placeholder, step = '1', className = '' }: NumberInputProps) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      step={step}
      className={clsx(
        'input input-bordered w-full bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/30',
        className
      )}
      placeholder={placeholder}
    />
  );
}
