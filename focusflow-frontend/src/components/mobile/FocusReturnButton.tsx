import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export function FocusReturnButton() {
    const navigate = useNavigate();
    const location = useLocation();
    const { focusSession } = useApp();

    // Show if session is active AND we are NOT on the focus page
    const shouldShow = focusSession.isActive && location.pathname !== '/focus';

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    onClick={() => navigate('/focus')}
                    className="fixed bottom-24 right-4 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 touch-manipulation"
                    whileTap={{ scale: 0.95 }}
                >
                    <Target className="w-6 h-6 animate-pulse" />
                    <span className="sr-only">Return to Focus</span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
