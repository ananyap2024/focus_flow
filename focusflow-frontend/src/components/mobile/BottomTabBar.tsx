import { Home, Target, BarChart3, MessageSquare, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

const tabs = [
  { id: 'home', icon: Home, label: 'Home', path: '/home' },
  { id: 'focus', icon: Target, label: 'Focus', path: '/focus' },
  { id: 'summary', icon: BarChart3, label: 'Summary', path: '/summary' },
  { id: 'ai', icon: MessageSquare, label: 'AI', path: '/ai' },
  { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' },
];

export function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, isFocusMode } = useApp();

  const visibleTabs = tabs.filter(tab => {
    if (tab.id === 'ai' && !settings.aiEnabled) return false;
    return true;
  });

  return (
    <nav className={`fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom z-50 theme-transition ${isFocusMode ? 'focus-dim' : ''}`}>
      <div className="flex items-center justify-around h-16 px-2">
        {visibleTabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          const isFocusTab = tab.id === 'focus';
          
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full touch-active theme-transition ${
                isFocusMode && !isFocusTab ? 'opacity-60' : 'opacity-100'
              }`}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1 : 0.9,
                  y: isActive ? -2 : 0
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute -inset-2 bg-primary/20 rounded-xl theme-transition"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon 
                  className={`w-6 h-6 relative z-10 transition-colors theme-transition ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`} 
                />
              </motion.div>
              <span className={`text-xs mt-1 transition-colors theme-transition ${
                isActive ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}