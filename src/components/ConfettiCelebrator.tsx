import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiCelebrator({ run }: { run: boolean }) {
  useEffect(() => {
    if (!run) return;
    const end = Date.now() + 1_200;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b']
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [run]);
  return null;
}
