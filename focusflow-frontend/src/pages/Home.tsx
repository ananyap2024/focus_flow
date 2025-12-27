import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Shield, Bell, Zap, Brain, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { Logo } from '@/components/mobile/Logo';
import { useApp } from '@/contexts/AppContext';

const features = [
  {
    icon: Shield,
    title: 'Smart Filtering',
    description: 'Intelligent notification prioritization'
  },
  {
    icon: Bell,
    title: 'Queue Important',
    description: 'Never miss what matters'
  },
  {
    icon: Zap,
    title: 'Instant Focus',
    description: 'One tap to deep work mode'
  },
  {
    icon: Brain,
    title: 'AI Insights',
    description: 'Understand your patterns'
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { startFocusSession, focusSession } = useApp();

  const handleSessionAction = () => {
    if (!focusSession.isActive) {
      startFocusSession();
    }
    navigate('/focus');
  };

  return (
    <MobileLayout>
      <div className="flex flex-col items-center px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Logo size="lg" animate />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-muted-foreground mt-6 max-w-xs mx-auto theme-transition"
          >
            Prioritize focus. Not noise.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-muted-foreground/70 mt-2 theme-transition"
          >
            We don't block notifications. We prioritize them.
          </motion.p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          className="w-full max-w-xs mb-12"
        >
          <Button
            onClick={handleSessionAction}
            size="lg"
            className="w-full h-14 text-lg font-semibold touch-active glow-primary theme-transition"
          >
            {focusSession.isActive ? (
              <>
                <Clock className="w-5 h-5 mr-2" />
                Resume Focus Session
              </>
            ) : (
              <>
                <Target className="w-5 h-5 mr-2" />
                Start Focus Session
              </>
            )}
          </Button>
        </motion.div>

        {/* Feature Cards */}
        <div className="w-full max-w-sm space-y-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-card rounded-xl p-4 border border-border flex items-center gap-4 theme-transition"
              >
                <div className="p-3 bg-primary/10 rounded-lg theme-transition">
                  <Icon className="w-5 h-5 text-primary theme-transition" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground theme-transition">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground theme-transition">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
}