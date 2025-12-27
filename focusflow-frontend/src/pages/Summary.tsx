import { motion } from 'framer-motion';
import { Clock, Bell, BellOff, Zap, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { useApp } from '@/contexts/AppContext';
import { useState } from 'react';

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  if (hrs > 0) return `${hrs}h ${mins % 60}m`;
  return `${mins}m ${seconds % 60}s`;
}

export default function Summary() {
  const { lastSummary, generateAiSummary } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    await generateAiSummary();
    setIsGenerating(false);
  };

  if (!lastSummary) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
          <div className="p-6 bg-card rounded-3xl border border-border mb-6">
            <Clock className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">No Session Yet</h1>
          <p className="text-muted-foreground">Complete a focus session to see your summary.</p>
        </div>
      </MobileLayout>
    );
  }

  const stats = [
    { icon: Clock, label: 'Duration', value: formatDuration(lastSummary.totalDuration), color: 'text-primary' },
    { icon: Bell, label: 'Queued', value: lastSummary.notificationsQueued.toString(), color: 'text-warning' },
    { icon: BellOff, label: 'Muted', value: lastSummary.notificationsMuted.toString(), color: 'text-muted-foreground' },
    { icon: Zap, label: 'Focus Score', value: `${lastSummary.focusScore}%`, color: 'text-success' },
  ];

  return (
    <MobileLayout>
      <div className="px-6 py-8">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-foreground mb-6">
          Session Summary
        </motion.h1>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-4 border border-border">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setExpanded(!expanded)}
          className="w-full bg-card rounded-xl p-4 border border-border flex items-center justify-between mb-6">
          <span className="font-medium text-foreground">Notifications ({lastSummary.notifications.length})</span>
          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </motion.button>

        {expanded && (
          <div className="bg-card rounded-xl border border-border p-3 mb-6 max-h-48 overflow-y-auto space-y-2">
            {lastSummary.notifications.map(n => (
              <div key={n.id} className="p-2 bg-background/50 rounded-lg text-sm">
                <span className="font-medium text-foreground">{n.title}</span>
                <span className="text-muted-foreground ml-2">{n.message}</span>
              </div>
            ))}
          </div>
        )}

        {!lastSummary.aiSummary ? (
          <Button onClick={handleGenerateSummary} disabled={isGenerating} className="w-full h-12 touch-active" size="lg">
            <Sparkles className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generating...' : 'Summarize Session'}
          </Button>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-primary/10 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI Summary</span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{lastSummary.aiSummary}</p>
          </motion.div>
        )}
      </div>
    </MobileLayout>
  );
}
