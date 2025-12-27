import { ReactNode } from 'react';
import { BottomTabBar } from './BottomTabBar';
import { FocusReturnButton } from './FocusReturnButton';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

interface MobileLayoutProps {
  children: ReactNode;
  showTabs?: boolean;
}

export function MobileLayout({ children, showTabs = true }: MobileLayoutProps) {
  const { isFocusMode, isThemeTransitioning } = useApp();

  return (
    <div className="min-h-screen bg-background flex flex-col theme-transition focus-vignette">
      <FocusReturnButton />
      {/* Theme transition overlay */}
      <AnimatePresence>
        {isThemeTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 pointer-events-none"
            style={{
              background: isFocusMode
                ? 'radial-gradient(circle at center, transparent 0%, hsl(216 33% 6% / 0.3) 100%)'
                : 'radial-gradient(circle at center, transparent 0%, hsl(40 20% 96% / 0.3) 100%)',
              backdropFilter: 'blur(2px)',
            }}
          />
        )}
      </AnimatePresence>

      <motion.main
        className={`flex-1 ${showTabs ? 'pb-20' : ''} safe-top overflow-y-auto scrollbar-hide theme-transition`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.main>
      {showTabs && <BottomTabBar />}
    </div>
  );
}