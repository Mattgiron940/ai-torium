'use client'

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Settings,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

interface CampaignResult {
  success: boolean;
  leadsProcessed: number;
  leadsIdentified: number;
  leadsContacted: number;
  campaignId: string;
}

const OutreachDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({
    totalLeads: 0,
    contactedToday: 0,
    responseRate: 0,
    conversionRate: 0
  });

  const runCampaign = async (campaignType: string) => {
    setIsRunning(true);
    toast.loading('Starting outreach campaign...');

    try {
      const response = await fetch('/api/outreach/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'demo_key'
        },
        body: JSON.stringify({ campaignType })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Campaign completed! Contacted ${data.result.leadsContacted} leads.`);
        // Refresh stats
        await loadStats();
      } else {
        throw new Error(data.error || 'Campaign failed');
      }
    } catch (error) {
      console.error('Campaign error:', error);
      toast.error('Campaign failed to complete');
    } finally {
      setIsRunning(false);
    }
  };

  const loadStats = async () => {
    try {
      // Mock stats for demo
      setStats({
        totalLeads: 1247,
        contactedToday: 23,
        responseRate: 12.5,
        conversionRate: 3.2
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const campaignTemplates = [
    {
      id: 'redditMathHelp',
      name: 'Reddit Math Help',
      description: 'Target students seeking math help on Reddit',
      estimatedLeads: '20-50',
      status: 'ready'
    },
    {
      id: 'physicsStudents',
      name: 'Physics Students',
      description: 'Target physics students on educational forums',
      estimatedLeads: '15-30',
      status: 'ready'
    }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }: {
    icon: React.ElementType;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => {
    const colorClasses = {
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500",
      purple: "from-purple-500 to-pink-500",
      orange: "from-orange-500 to-red-500"
    };

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Outreach Dashboard</h1>
          <p className="text-gray-600">Automated lead generation and outreach campaigns</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Leads"
            value={stats.totalLeads.toLocaleString()}
            subtitle="All time"
            color="blue"
          />
          <StatCard
            icon={MessageSquare}
            title="Contacted Today"
            value={stats.contactedToday}
            subtitle="SMS sent"
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            title="Response Rate"
            value={`${stats.responseRate}%`}
            subtitle="Last 30 days"
            color="purple"
          />
          <StatCard
            icon={CheckCircle}
            title="Conversion Rate"
            value={`${stats.conversionRate}%`}
            subtitle="Leads to signups"
            color="orange"
          />
        </div>

        {/* Campaign Templates */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Campaign Templates</h2>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaignTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{template.description}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    template.status === 'ready' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {template.status}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Est. leads: {template.estimatedLeads}
                  </div>
                  <Button
                    onClick={() => runCampaign(template.id)}
                    disabled={isRunning || template.status !== 'ready'}
                    size="sm"
                  >
                    {isRunning ? (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Run Campaign
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          
          <div className="space-y-4">
            {[
              {
                type: 'campaign',
                message: 'Reddit Math Help campaign completed',
                details: '23 leads contacted, 3 responses',
                time: '2 hours ago',
                status: 'success'
              },
              {
                type: 'response',
                message: 'New SMS response received',
                details: 'Lead interested in premium features',
                time: '4 hours ago',
                status: 'info'
              },
              {
                type: 'signup',
                message: 'Lead converted to paid user',
                details: 'Premium subscription activated',
                time: '6 hours ago',
                status: 'success'
              },
              {
                type: 'campaign',
                message: 'Physics Students campaign started',
                details: 'Targeting 15-30 potential leads',
                time: '1 day ago',
                status: 'info'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.status === 'success' 
                    ? 'bg-green-100' 
                    : activity.status === 'error'
                    ? 'bg-red-100'
                    : 'bg-blue-100'
                }`}>
                  {activity.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                  {activity.status === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {activity.status === 'info' && <MessageSquare className="w-5 h-5 text-blue-600" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{activity.message}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Important Notice</h3>
              <p className="text-sm text-yellow-700 mt-1">
                This outreach system is for demonstration purposes. In production, ensure compliance with all applicable laws including CAN-SPAM Act, TCPA, and GDPR. Always obtain proper consent before sending marketing messages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutreachDashboard;