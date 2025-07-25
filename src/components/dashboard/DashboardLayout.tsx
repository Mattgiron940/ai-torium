'use client'

import React, { useState } from 'react';
import { 
  Brain, 
  Search, 
  BookOpen, 
  Trophy, 
  MessageCircle, 
  Settings, 
  User, 
  Bell,
  Menu,
  X,
  Zap,
  Camera,
  Upload,
  Sparkles,
  Target,
  TrendingUp,
  Crown
} from 'lucide-react';
import { Database } from '@/types/database.types';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface DashboardLayoutProps {
  user: UserProfile;
}

const DashboardLayout = ({ user }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Brain, current: true },
    { name: 'Ask Question', href: '/dashboard/ask', icon: Search },
    { name: 'AI Tutor', href: '/dashboard/tutor', icon: MessageCircle },
    { name: 'Study Hub', href: '/dashboard/study', icon: BookOpen },
    { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy },
    { name: 'Progress', href: '/dashboard/progress', icon: TrendingUp },
  ];

  const QuestionInput = () => {
    const [question, setQuestion] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    
    const subjects = [
      'Mathematics', 'Physics', 'Chemistry', 'Biology', 
      'Computer Science', 'English', 'History', 'Economics'
    ];

    return (
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI-Powered Learning</h2>
              <p className="text-white/80">Get instant answers with step-by-step explanations</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject} className="text-gray-900">{subject}</option>
                ))}
              </select>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                OCR
              </button>
            </div>

            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask me anything... I can solve math problems, explain concepts, help with homework!"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none h-32"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
                  <Upload className="w-5 h-5" />
                </button>
                <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-white/90 transition-colors flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Ask AI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StatsCard = ({ icon: Icon, title, value, subtitle, color = "blue" }: {
    icon: React.ElementType;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => {
    const colorClasses = {
      blue: "from-blue-500 to-cyan-500",
      purple: "from-purple-500 to-pink-500",
      green: "from-green-500 to-emerald-500",
      orange: "from-orange-500 to-red-500"
    };

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-2xl flex items-center justify-center`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    );
  };

  const RecentActivity = () => {
    const activities = [
      {
        type: "question",
        subject: "Mathematics",
        title: "Solve quadratic equation: x² + 5x + 6 = 0",
        time: "2 minutes ago",
        status: "answered",
        points: 15
      },
      {
        type: "achievement",
        title: "Math Wizard Badge Earned!",
        description: "Solved 10 algebra problems in a row",
        time: "1 hour ago",
        points: 50
      },
      {
        type: "tutor",
        subject: "Physics",
        title: "AI Tutor session on Newton's Laws",
        time: "3 hours ago",
        duration: "45 min"
      },
      {
        type: "milestone",
        title: "Level " + user.level_id + " Achieved!",
        description: "You're now in the top 5% of learners",
        time: "1 day ago",
        points: 100
      }
    ];

    const getActivityIcon = (type: string) => {
      switch(type) {
        case 'question': return <Search className="w-5 h-5 text-blue-500" />;
        case 'achievement': return <Trophy className="w-5 h-5 text-yellow-500" />;
        case 'tutor': return <MessageCircle className="w-5 h-5 text-purple-500" />;
        case 'milestone': return <Target className="w-5 h-5 text-green-500" />;
        default: return <Brain className="w-5 h-5 text-gray-500" />;
      }
    };

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-500" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{activity.title}</p>
                {activity.description && (
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                )}
                {activity.subject && (
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mt-2">
                    {activity.subject}
                  </span>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{activity.time}</span>
                  {activity.points && (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <Zap className="w-3 h-3" />
                      +{activity.points} XP
                    </span>
                  )}
                  {activity.duration && (
                    <span>Duration: {activity.duration}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const UpgradePrompt = () => (
    <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Crown className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">Upgrade to Pro</h3>
            <p className="text-white/80">Unlock unlimited questions & AI tutoring</p>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Unlimited daily questions</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Priority AI responses</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>Advanced OCR & voice input</span>
          </div>
        </div>
        <button className="w-full bg-white text-orange-600 font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors">
          Start Free Trial
        </button>
      </div>
    </div>
  );

  function SidebarContent() {
    return (
      <div className="flex flex-col h-full bg-white border-r border-gray-200">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI-TORIUM</h1>
            <p className="text-xs text-gray-600">Smart Learning</p>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User profile */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name}&background=3B82F6&color=fff`}
              alt={user.full_name || 'User'}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user.full_name || 'Anonymous'}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Level {user.level_id}</span>
                <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full">
                  {user.subscription_tier}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-left rounded-xl hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Settings</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.full_name || 'there'}!</h1>
                <p className="text-gray-600">Ready to learn something new today?</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-sm font-medium">
                <Zap className="w-4 h-4" />
                {user.total_points.toLocaleString()} XP
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
              <QuestionInput />
              
              {/* Stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  icon={Target}
                  title="Daily Progress"
                  value={`${user.questions_used_today}/${user.questions_limit}`}
                  subtitle="Questions asked"
                  color="blue"
                />
                <StatsCard
                  icon={TrendingUp}
                  title="Current Level"
                  value={user.level_id}
                  subtitle="Top 5%"
                  color="purple"
                />
                <StatsCard
                  icon={Zap}
                  title="Streak"
                  value={`${user.current_streak} days`}
                  subtitle="Keep it up!"
                  color="orange"
                />
                <StatsCard
                  icon={Trophy}
                  title="Total Points"
                  value={user.total_points.toLocaleString()}
                  subtitle="All time"
                  color="green"
                />
              </div>

              <RecentActivity />
            </div>

            {/* Right column */}
            <div className="space-y-8">
              {user.subscription_tier === 'free' && <UpgradePrompt />}
              
              {/* Quick actions */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left">
                    <MessageCircle className="w-6 h-6 text-purple-500" />
                    <div>
                      <p className="font-semibold">Start AI Tutoring</p>
                      <p className="text-sm text-gray-600">Get personalized help</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left">
                    <Camera className="w-6 h-6 text-blue-500" />
                    <div>
                      <p className="font-semibold">Scan Problem</p>
                      <p className="text-sm text-gray-600">Upload image for OCR</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left">
                    <BookOpen className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-semibold">Study Guide</p>
                      <p className="text-sm text-gray-600">Review concepts</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;