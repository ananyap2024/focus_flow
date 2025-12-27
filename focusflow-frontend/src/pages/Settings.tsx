import { motion } from 'framer-motion';
import { Bell, Moon, Clock, Shield, Bot, LogOut } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Settings() {
  const { settings, updateSettings, logout } = useApp();
  const navigate = useNavigate();

  const settingItems = [
    { id: 'notificationRules', icon: Bell, label: 'Notification Rules', description: 'Smart filtering of notifications' },
    { id: 'autoDarkMode', icon: Moon, label: 'Auto Dark Mode', description: 'Dim screen during focus sessions' },
    { id: 'focusReminders', icon: Clock, label: 'Focus Reminders', description: 'Remind me to take focus breaks' },
    { id: 'strictMode', icon: Shield, label: 'Strict Mode', description: 'Block all notifications during focus' },
    { id: 'aiEnabled', icon: Bot, label: 'AI Assistant', description: 'Show AI tab in navigation' },
  ];

  const handleLogout = () => { logout(); toast.success('Logged out'); navigate('/login'); };

  return (
    <MobileLayout>
      <div className="px-6 py-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-foreground mb-6">Settings</motion.h1>
        <div className="space-y-3 mb-8">
          {settingItems.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><item.icon className="w-5 h-5 text-primary" /></div>
                <div><p className="font-medium text-foreground">{item.label}</p><p className="text-sm text-muted-foreground">{item.description}</p></div>
              </div>
              <Switch checked={settings[item.id as keyof typeof settings]} onCheckedChange={(checked) => updateSettings({ [item.id]: checked })} />
            </motion.div>
          ))}
        </div>
        <Button variant="destructive" onClick={handleLogout} className="w-full h-12 touch-active"><LogOut className="w-5 h-5 mr-2" />Logout</Button>
      </div>
    </MobileLayout>
  );
}
