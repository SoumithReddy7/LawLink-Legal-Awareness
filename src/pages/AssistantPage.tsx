import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain, Send, AlertTriangle, Sparkles, ArrowRight,
  ShieldCheck, ShoppingBag, Scale, Heart, BookOpen, Compass,
} from 'lucide-react';
import { getAIResponse } from '@/data/content';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  { icon: ShieldCheck, text: 'What is OTP fraud and how do I protect myself?', category: 'Cyber Safety' },
  { icon: ShoppingBag, text: 'What are my rights as a consumer in India?', category: 'Consumer Rights' },
  { icon: Scale, text: 'What are the fundamental rights in the Constitution?', category: 'Fundamental Rights' },
  { icon: Heart, text: 'What laws protect women from harassment?', category: "Women's Safety" },
  { icon: BookOpen, text: 'How do I file a consumer complaint?', category: 'Consumer Rights' },
  { icon: Compass, text: 'What should I do if I face cyberbullying?', category: 'Cyber Safety' },
];

export function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: getAIResponse(''),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function handleSend(text: string) {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAIResponse(text);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    handleSend(input.trim());
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-navy-700 to-blue-700 flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy-900">LawLink Assistant</h1>
            <p className="text-sm text-navy-500">Your guide to legal literacy and awareness</p>
          </div>
        </div>
      </div>

      {/* Disclaimer banner */}
      <div className="card p-3 mb-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-navy-700 leading-relaxed">
            LawLink Assistant provides general legal awareness information for educational purposes.
            It is not a substitute for advice from a qualified legal professional.
          </p>
        </div>
      </div>

      {/* Chat container */}
      <div className="card flex flex-col" style={{ minHeight: '60vh' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-navy-600 to-blue-600'
                  : 'bg-gradient-to-br from-amber-400 to-orange-500'
              }`}>
                {msg.role === 'user' ? (
                  <span className="text-xs font-bold text-white">U</span>
                ) : (
                  <Brain className="h-4 w-4 text-white" />
                )}
              </div>

              {/* Message bubble */}
              <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-navy-900 text-white rounded-tr-sm'
                    : 'bg-slate-100 text-navy-800 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'assistant' && (
                  <div className="mt-2 flex items-center gap-2">
                    <Link
                      to="/resources"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Browse verified resources <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm p-4">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested prompts (show when only welcome message) */}
        {messages.length === 1 && !isTyping && (
          <div className="px-4 sm:px-6 pb-4">
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-wide mb-3 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Suggested Questions
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => handleSend(prompt.text)}
                  className="flex items-start gap-2 p-3 rounded-xl border border-slate-200 hover:border-navy-300 hover:bg-slate-50 transition-all text-left group"
                >
                  <prompt.icon className="h-4 w-4 text-navy-400 group-hover:text-navy-700 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-navy-700 font-medium">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input flex-1"
              placeholder="Ask about legal concepts, rights, or scenarios..."
              aria-label="Ask a question"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="btn-primary px-4"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
