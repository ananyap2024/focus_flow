import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FocusSession {
  isActive: boolean;
  startTime: Date | null;
  duration: number; // in seconds
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'slack' | 'email' | 'social' | 'calendar';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
}

interface SessionSummary {
  totalDuration: number;
  notificationsQueued: number;
  notificationsMuted: number;
  focusScore: number;
  notifications: Notification[];
  aiSummary?: string;
}

interface Settings {
  notificationRules: boolean;
  autoDarkMode: boolean;
  focusReminders: boolean;
  strictMode: boolean;
  aiEnabled: boolean;
}

interface User {
  email: string;
  name: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  user: User | null;
  focusSession: FocusSession;
  lastSummary: SessionSummary | null;
  settings: Settings;
  isFocusMode: boolean;
  isThemeTransitioning: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  startFocusSession: () => void;
  endFocusSession: () => void;
  addNotification: (type: Notification['type']) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  generateAiSummary: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockNotifications: Record<Notification['type'], { titles: string[], messages: string[] }> = {
  slack: {
    titles: ['#general', 'Direct Message', '#engineering', '@John'],
    messages: ['New message from team', 'Quick question about the project', 'Meeting reminder', 'Can we sync?']
  },
  email: {
    titles: ['Newsletter', 'Work Update', 'Team Alert', 'Weekly Report'],
    messages: ['Your weekly digest is ready', 'Project deadline updated', 'New task assigned', 'Review requested']
  },
  social: {
    titles: ['Instagram', 'Twitter', 'LinkedIn', 'Facebook'],
    messages: ['New like on your post', 'Someone mentioned you', 'New connection request', 'New comment']
  },
  calendar: {
    titles: ['Team Standup', '1:1 Meeting', 'Review Session', 'Sprint Planning'],
    messages: ['Starting in 15 min', 'Starting in 30 min', 'Rescheduled', 'New invite']
  }
};

const THEME_TRANSITION_DURATION = 400; // ms

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  // Load initial state from localStorage
  const [focusSession, setFocusSession] = useState<FocusSession>(() => {
    const saved = localStorage.getItem('focusSession');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          startTime: parsed.startTime ? new Date(parsed.startTime) : null,
          notifications: parsed.notifications.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp)
          }))
        };
      } catch (e) {
        console.error('Failed to parse focus session', e);
      }
    }
    return {
      isActive: false,
      startTime: null,
      duration: 0,
      notifications: []
    };
  });

  const [lastSummary, setLastSummary] = useState<SessionSummary | null>(null);
  const [settings, setSettings] = useState<Settings>({
    notificationRules: true,
    autoDarkMode: true,
    focusReminders: true,
    strictMode: false,
    aiEnabled: true
  });
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);

  // Persist focusSession changes
  useEffect(() => {
    localStorage.setItem('focusSession', JSON.stringify(focusSession));
  }, [focusSession]);

  // Apply focus-mode class to document root when isFocusMode changes
  useEffect(() => {
    const root = document.documentElement;
    // ... rest of effect
    if (isFocusMode) {
      root.classList.add('focus-mode');
    } else {
      root.classList.remove('focus-mode');
    }
  }, [isFocusMode]);

  // Sync isFocusMode with session state on mount
  useEffect(() => {
    if (focusSession.isActive) {
      setIsFocusMode(true);
    }
  }, []); // Run once on mount

  const login = async (email: string, password: string) => {
    // Mock login
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ email, name: email.split('@')[0] });
    setIsAuthenticated(true);
  };

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ email, name });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsFocusMode(false);
  };

  const startFocusSession = () => {
    // Start theme transition
    setIsThemeTransitioning(true);

    // Activate focus mode
    setIsFocusMode(true);

    // Start the session
    setFocusSession({
      isActive: true,
      startTime: new Date(),
      duration: 0,
      notifications: []
    });
    setLastSummary(null);

    // End transition state after animation completes
    setTimeout(() => {
      setIsThemeTransitioning(false);
    }, THEME_TRANSITION_DURATION);
  };

  const endFocusSession = () => {
    // Start theme transition
    setIsThemeTransitioning(true);

    const endTime = new Date();
    const duration = focusSession.startTime
      ? Math.floor((endTime.getTime() - focusSession.startTime.getTime()) / 1000)
      : 0;

    const summary: SessionSummary = {
      totalDuration: duration,
      notificationsQueued: focusSession.notifications.filter(n => n.priority === 'high').length,
      notificationsMuted: focusSession.notifications.filter(n => n.priority !== 'high').length,
      focusScore: Math.min(100, Math.floor(70 + Math.random() * 30)),
      notifications: focusSession.notifications
    };

    setLastSummary(summary);
    setFocusSession({
      isActive: false,
      startTime: null,
      duration: 0,
      notifications: []
    });

    // Deactivate focus mode
    setIsFocusMode(false);

    // End transition state after animation completes
    setTimeout(() => {
      setIsThemeTransitioning(false);
    }, THEME_TRANSITION_DURATION);
  };

  const addNotification = (type: Notification['type']) => {
    const mock = mockNotifications[type];
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title: mock.titles[Math.floor(Math.random() * mock.titles.length)],
      message: mock.messages[Math.floor(Math.random() * mock.messages.length)],
      timestamp: new Date(),
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
    };

    setFocusSession(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications]
    }));
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const generateAiSummary = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (lastSummary) {
      setLastSummary(prev => prev ? {
        ...prev,
        aiSummary: `During your ${Math.floor(prev.totalDuration / 60)} minute focus session, you maintained excellent concentration. ${prev.notificationsQueued} important notifications were queued for your review, while ${prev.notificationsMuted} low-priority alerts were silently muted. Your focus score of ${prev.focusScore}% indicates strong productivity. Consider scheduling similar sessions in the morning for optimal results.`
      } : null);
    }
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      user,
      focusSession,
      lastSummary,
      settings,
      isFocusMode,
      isThemeTransitioning,
      login,
      signup,
      logout,
      startFocusSession,
      endFocusSession,
      addNotification,
      updateSettings,
      generateAiSummary
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}