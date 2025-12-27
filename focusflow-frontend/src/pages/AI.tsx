import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MobileLayout } from '@/components/mobile/MobileLayout';

interface Message { id: string; role: 'user' | 'ai'; content: string; }

const mockResponses = [
  "Based on your focus patterns, I recommend scheduling deep work sessions in the morning when your concentration is highest.",
  "Your notification filtering is working well. You've reduced interruptions by 40% this week!",
  "Try the Pomodoro technique - 25 minutes of focus followed by 5-minute breaks for optimal productivity.",
  "I noticed you receive most Slack messages between 2-4 PM. Consider setting that as your async communication time.",
];

export default function AI() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', content: "Hi! I'm your FocusFlow AI assistant. How can I help you focus better today?" }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    setTimeout(() => {
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: mockResponses[Math.floor(Math.random() * mockResponses.length)] };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <MobileLayout>
      <div className="flex flex-col h-[calc(100vh-5rem)]">
        <div className="px-6 py-4 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">AI Assistant</h1>
        </div>
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4">
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center"><Bot className="w-4 h-4 text-primary" /></div>}
              <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-foreground'}`}>
                <p className="text-sm">{msg.content}</p>
              </div>
              {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><User className="w-4 h-4 text-muted-foreground" /></div>}
            </motion.div>
          ))}
        </div>

        <div className="p-4 border-t border-border bg-card/50">
          <div className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..." className="flex-1 h-12" />
            <Button onClick={handleSend} size="icon" className="h-12 w-12 touch-active"><Send className="w-5 h-5" /></Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
