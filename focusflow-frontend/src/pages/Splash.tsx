import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Logo } from '@/components/mobile/Logo';

export default function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(isAuthenticated ? '/home' : '/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, isAuthenticated]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      <Logo size="xl" animate={true} showText={true} />

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-8 text-muted-foreground text-center relative z-10"
      >
        Prioritize focus. Not noise.
      </motion.p>
    </div>
  );
}
