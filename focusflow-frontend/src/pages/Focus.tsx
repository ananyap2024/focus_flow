import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, MessageSquare, Mail, Share2, Calendar, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { useApp } from '@/contexts/AppContext';

const notificationTypes = [
  { type: 'slack' as const, icon: MessageSquare, label: 'Slack', color: 'bg-purple-500/20 text-purple-400' },
  { type: 'email' as const, icon: Mail, label: 'Email', color: 'bg-blue-500/20 text-blue-400' },
  { type: 'social' as const, icon: Share2, label: 'Social', color: 'bg-pink-500/20 text-pink-400' },
  { type: 'calendar' as const, icon: Calendar, label: 'Calendar', color: 'bg-green-500/20 text-green-400' },
];

function formatTime(seconds: number) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function Focus() {
  const navigate = useNavigate();
  const { focusSession, startFocusSession, endFocusSession, addNotification, isFocusMode, isThemeTransitioning } = useApp();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Robust timer logic: Always calculate delta from start time
    const updateTime = () => {
      if (focusSession.isActive && focusSession.startTime) {
        const now = new Date();
        const start = new Date(focusSession.startTime); // Ensure Date object
        const seconds = Math.floor((now.getTime() - start.getTime()) / 1000);
        setElapsed(Math.max(0, seconds));
      }
    };

    // Calculate immediately
    updateTime();

    // Regular interval
    const interval = setInterval(updateTime, 1000);

    // Handle tab visibility changes (crucial for accurate resuming)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [focusSession.isActive, focusSession.startTime]);

  const handleEndSession = () => {
    endFocusSession();
    navigate('/summary');
  };

  if (!focusSession.isActive) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mb-8">
              <div className="inline-flex p-6 bg-card rounded-3xl border border-border theme-transition">
                <Target className="w-16 h-16 text-muted-foreground theme-transition" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-3 theme-transition">Ready to Focus?</h1>
            <p className="text-muted-foreground mb-8 max-w-xs theme-transition">
              Start a focus session to filter distractions and prioritize what matters.
            </p>

            <Button
              onClick={startFocusSession}
              size="lg"
              className="h-14 px-8 text-lg font-semibold touch-active glow-primary theme-transition"
            >
              <Target className="w-5 h-5 mr-2" />
              Start Session
            </Button>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="flex flex-col min-h-[calc(100vh-5rem)] px-6 py-8">
        {/* Focus Mode Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mb-8"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-success/20 rounded-full border border-success/30 theme-transition"
            initial={{ scale: 1 }}
            animate={{
              scale: isThemeTransitioning ? 1 : 1,
              boxShadow: isFocusMode && !isThemeTransitioning
                ? '0 0 20px hsl(142 71% 45% / 0.4)'
                : 'none'
            }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-medium text-success theme-transition">Focus Mode ON</span>
          </motion.div>
        </motion.div>

        {/* Timer - Focus Emphasis */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10 focus-emphasis"
        >
          <motion.div
            className="inline-flex items-center justify-center w-48 h-48 rounded-full bg-card border-4 border-primary/30 theme-transition"
            animate={{
              boxShadow: isFocusMode && !isThemeTransitioning
                ? '0 0 40px hsl(217 100% 65% / 0.4)'
                : 'none'
            }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div>
              <Clock className="w-6 h-6 text-primary mx-auto mb-2 theme-transition" />
              <span className="text-4xl font-bold text-foreground tabular-nums theme-transition">
                {formatTime(elapsed)}
              </span>
            </div>
          </motion.div>
        </motion.div>


        {/* Categorized Notification Feed */}
        <motion.div
          className="flex-1 min-h-0 mb-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Allowed Notifications (High Priority) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-success rounded-full" />
            <p className="text-sm font-medium text-success theme-transition">
                Allowed ({focusSession.notifications.filter(n => n.type === 'slack' || n.type === 'calendar').length})
              </p>
            </div>
            <div className="bg-card rounded-xl border border-success/20 max-h-32 overflow-y-auto scrollbar-hide p-3 space-y-2 theme-transition">
              <AnimatePresence mode="popLayout">
                {focusSession.notifications.filter(n => n.type === 'slack' || n.type === 'calendar').length === 0 ? (
                  <p className="text-center text-muted-foreground/50 py-4 text-xs theme-transition">
                    No priority notifications
                  </p>
                ) : (
                  focusSession.notifications.filter(n => n.type === 'slack' || n.type === 'calendar').map((notification) => {
                    const typeConfig = notificationTypes.find(t => t.type === notification.type);
                    const Icon = typeConfig?.icon || MessageSquare;

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: 'auto' }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        className="flex items-center gap-3 p-2.5 bg-success/10 rounded-lg border border-success/20 theme-transition"
                      >
                        <div className={`p-1.5 rounded-lg ${typeConfig?.color} theme-transition`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate theme-transition">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate theme-transition">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-0.5 bg-success/20 text-success rounded-full theme-transition">
                          Urgent
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Queued Notifications (Medium/Low Priority) */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-muted-foreground rounded-full" />
            <p className="text-sm font-medium text-muted-foreground theme-transition">
                Queued ({focusSession.notifications.filter(n => n.type === 'email' || n.type === 'social').length})
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border max-h-32 overflow-y-auto scrollbar-hide p-3 space-y-2 theme-transition focus-dim">
              <AnimatePresence mode="popLayout">
                {focusSession.notifications.filter(n => n.type === 'email' || n.type === 'social').length === 0 ? (
                  <p className="text-center text-muted-foreground/50 py-4 text-xs theme-transition">
                    No queued notifications
                  </p>
                ) : (
                  focusSession.notifications.filter(n => n.type === 'email' || n.type === 'social').map((notification) => {
                    const typeConfig = notificationTypes.find(t => t.type === notification.type);
                    const Icon = typeConfig?.icon || MessageSquare;

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20, height: 0 }}
                        animate={{ opacity: isFocusMode ? 0.6 : 1, x: 0, height: 'auto' }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        className="flex items-center gap-3 p-2.5 bg-background/50 rounded-lg theme-transition"
                      >
                        <div className={`p-1.5 rounded-lg ${typeConfig?.color} opacity-60 theme-transition`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground/70 truncate theme-transition">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground/70 truncate theme-transition">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full theme-transition">
                          Later
                        </span>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* End Session Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleEndSession}
            variant="destructive"
            size="lg"
            className="w-full h-14 text-lg font-semibold touch-active theme-transition"
          >
            <X className="w-5 h-5 mr-2" />
            End Session
          </Button>
        </motion.div>
      </div>
    </MobileLayout>
  );
}