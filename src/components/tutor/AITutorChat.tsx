'use client'

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  Paperclip, 
  Bot, 
  User, 
  Sparkles, 
  Brain, 
  Clock, 
  Zap,
  Volume2,
  VolumeX,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Settings,
  BookOpen,
  Target,
  TrendingUp
} from 'lucide-react';
import { Database } from '@/types/database.types';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface AITutorChatProps {
  user: UserProfile;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  confidence?: number;
  processingTime?: number;
  isStreaming?: boolean;
  isError?: boolean;
}

const AITutorChat = ({ user }: AITutorChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi ${user.full_name || 'there'}! I'm your AI tutor. I'm here to help you learn and understand concepts step-by-step. What would you like to work on today?`,
      timestamp: new Date(),
      confidence: 0.95,
      processingTime: 150
    }
  ]);
  
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    questionsAsked: 0,
    conceptsLearned: 3,
    sessionTime: 0,
    currentStreak: user.current_streak
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        sessionTime: prev.sessionTime + 1
      }));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      // Call Claude API
      const response = await fetch('/api/claude-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({
          question: currentMessage,
          subject: 'General',
          difficulty: 'intermediate',
          questionType: 'text',
          userId: user.id,
          context: 'AI tutor chat session'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (data.success) {
        // Simulate streaming response
        await simulateStreamingResponse(data.answer.content, data.answer);
        
        setSessionStats(prev => ({
          ...prev,
          questionsAsked: prev.questionsAsked + 1
        }));
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Failed to get AI response:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I apologize, but I encountered an error. Please try again or rephrase your question.",
        timestamp: new Date(),
        confidence: 0.1,
        processingTime: 0,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateStreamingResponse = async (content: string, metadata: any) => {
    const responseId = Date.now().toString();
    
    // Add initial empty message
    setMessages(prev => [...prev, {
      id: responseId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      confidence: metadata.confidence || 0.9,
      processingTime: metadata.processingTime || 1000,
      isStreaming: true
    }]);

    // Simulate streaming by adding characters progressively
    for (let i = 0; i <= content.length; i += 3) {
      await new Promise(resolve => setTimeout(resolve, 50));
      
      setMessages(prev => prev.map(msg => 
        msg.id === responseId 
          ? { ...msg, content: content.slice(0, i), isStreaming: i < content.length }
          : msg
      ));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  const MessageBubble = ({ message, isUser }: { message: Message; isUser: boolean }) => (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      {!isUser && (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto'
            : 'bg-white border border-gray-200 text-gray-900'
        }`}>
          <div className="prose prose-sm max-w-none">
            {message.content.split('\n').map((line: string, index: number) => {
              if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <h4 key={index} className={`font-semibold mt-3 mb-2 ${isUser ? 'text-white' : 'text-gray-900'}`}>
                    {line.replace(/\*\*/g, '')}
                  </h4>
                );
              }
              if (line.startsWith('- ')) {
                return (
                  <li key={index} className={`ml-4 ${isUser ? 'text-white/90' : 'text-gray-700'}`}>
                    {line.substring(2)}
                  </li>
                );
              }
              return line && (
                <p key={index} className={`mb-2 ${isUser ? 'text-white/95' : 'text-gray-800'}`}>
                  {line}
                </p>
              );
            })}
          </div>
          
          {message.isStreaming && (
            <div className="flex items-center gap-1 mt-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          )}
        </div>
        
        {!isUser && !message.isStreaming && (
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            {message.confidence && (
              <span className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                {Math.round(message.confidence * 100)}% confident
              </span>
            )}
            {message.processingTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {message.processingTime}ms
              </span>
            )}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => copyMessage(message.content)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Copy className="w-3 h-3" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ThumbsUp className="w-3 h-3" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ThumbsDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Tutor Session</h1>
                <p className="text-sm text-gray-600">Mathematics • Personalized Learning</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Active Session
              </div>
              <button 
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                isUser={message.role === 'user'} 
              />
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {user.questions_used_today >= user.questions_limit && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                You've reached your daily question limit. <a href="/dashboard/subscription" className="underline font-medium">Upgrade to continue learning!</a>
              </div>
            )}
            
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything... I can help explain concepts, solve problems, or guide you through learning!"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  disabled={isLoading || user.questions_used_today >= user.questions_limit}
                />
                
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      console.log('File selected:', e.target.files?.[0]);
                    }}
                  />
                  
                  <button
                    onClick={handleFileUpload}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {}}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    disabled={isLoading}
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={toggleVoiceInput}
                    className={`p-2 rounded-lg ${
                      isListening 
                        ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    disabled={isLoading}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || isLoading || user.questions_used_today >= user.questions_limit}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Session Stats */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Progress</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">Questions</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{sessionStats.questionsAsked}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">Concepts</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{sessionStats.conceptsLearned}</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700">Time</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{formatTime(sessionStats.sessionTime)}</p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700">Streak</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">{sessionStats.currentStreak}</p>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Goals</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-700">Master quadratic equations</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-700">Practice factoring</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
              <span className="text-sm text-gray-500">Review graphing functions</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <RotateCcw className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">Start over</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <BookOpen className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">Study guide</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
              <TrendingUp className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">View progress</span>
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="p-6 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pro Tips</h3>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Get Better Explanations</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Ask me to explain concepts in different ways: "Can you explain this using a real-world example?" or "Show me a visual approach."
                </p>
                <div className="space-y-1 text-xs text-gray-500">
                  <p>• Upload images of problems</p>
                  <p>• Ask follow-up questions</p>
                  <p>• Request practice problems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITutorChat;