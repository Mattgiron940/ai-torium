'use client'

import React, { useState } from 'react';
import { Check, Crown, Zap, Brain, Star, X } from 'lucide-react';
import { subscriptionTiers } from '@/lib/stripe';
import { Database } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface SubscriptionPageProps {
  user: UserProfile;
}

const SubscriptionPage = ({ user }: SubscriptionPageProps) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = async (tierId: string, priceId: string) => {
    if (user.subscription_tier !== 'free' && tierId !== 'free') {
      // Redirect to billing portal for existing subscribers
      handleManageBilling();
      return;
    }

    setIsLoading(tierId);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          tierId,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setIsLoading(null);
    }
  };

  const handleManageBilling = async () => {
    setIsLoading('billing');

    try {
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No billing portal URL received');
      }
    } catch (error) {
      console.error('Error accessing billing portal:', error);
      toast.error('Failed to access billing portal');
    } finally {
      setIsLoading(null);
    }
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const getCurrentTierFeatures = () => {
    const currentTier = subscriptionTiers.find(tier => tier.id === user.subscription_tier);
    return currentTier?.features || [];
  };

  const PricingCard = ({ tier, isCurrentTier }: { tier: any; isCurrentTier: boolean }) => {
    const price = billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly;
    const priceId = billingCycle === 'monthly' ? tier.stripePriceIdMonthly : tier.stripePriceIdYearly;
    const monthlyPrice = billingCycle === 'yearly' ? price / 12 : price;

    return (
      <div className={`relative rounded-3xl p-8 ${
        tier.popular 
          ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white transform scale-105' 
          : 'bg-white border-2 border-gray-200'
      } ${isCurrentTier ? 'ring-4 ring-green-500' : ''}`}>
        
        {tier.popular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Star className="w-4 h-4" />
              Most Popular
            </div>
          </div>
        )}

        {isCurrentTier && (
          <div className="absolute -top-4 right-4">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Current Plan
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            tier.popular ? 'bg-white/20' : 'bg-gradient-to-br from-blue-500 to-purple-600'
          }`}>
            {tier.id === 'free' && <Brain className={`w-8 h-8 ${tier.popular ? 'text-white' : 'text-white'}`} />}
            {tier.id === 'premium' && <Zap className={`w-8 h-8 ${tier.popular ? 'text-white' : 'text-white'}`} />}
            {tier.id === 'pro' && <Crown className={`w-8 h-8 ${tier.popular ? 'text-white' : 'text-white'}`} />}
          </div>

          <h3 className={`text-2xl font-bold ${tier.popular ? 'text-white' : 'text-gray-900'}`}>
            {tier.name}
          </h3>
          <p className={`mt-2 ${tier.popular ? 'text-white/80' : 'text-gray-600'}`}>
            {tier.description}
          </p>

          <div className="mt-6">
            {price === 0 ? (
              <div className={`text-4xl font-bold ${tier.popular ? 'text-white' : 'text-gray-900'}`}>
                Free
              </div>
            ) : (
              <>
                <div className={`text-4xl font-bold ${tier.popular ? 'text-white' : 'text-gray-900'}`}>
                  ${formatPrice(monthlyPrice)}
                  <span className={`text-lg font-normal ${tier.popular ? 'text-white/80' : 'text-gray-600'}`}>
                    /month
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className={`text-sm ${tier.popular ? 'text-white/80' : 'text-gray-600'}`}>
                    Billed annually (${formatPrice(price)}/year)
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <ul className="space-y-4 mb-8">
          {tier.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-start gap-3">
              <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                tier.popular ? 'text-white' : 'text-green-500'
              }`} />
              <span className={`${tier.popular ? 'text-white/90' : 'text-gray-700'}`}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <Button
          onClick={() => handleSubscribe(tier.id, priceId)}
          disabled={isLoading === tier.id || (isCurrentTier && tier.id !== 'free')}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
            tier.popular
              ? 'bg-white text-blue-600 hover:bg-white/90'
              : isCurrentTier
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
          }`}
        >
          {isLoading === tier.id ? (
            'Loading...'
          ) : isCurrentTier ? (
            tier.id === 'free' ? 'Current Plan' : 'Manage Billing'
          ) : tier.id === 'free' ? (
            'Downgrade'
          ) : (
            `Upgrade to ${tier.name}`
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Learning Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered learning with our flexible subscription plans
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="bg-gray-200 p-1 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Current Plan Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                Current Plan: {user.subscription_tier.charAt(0).toUpperCase() + user.subscription_tier.slice(1)}
              </h3>
              <p className="text-blue-700 mt-1">
                Questions used today: {user.questions_used_today} / {user.questions_limit === -1 ? '∞' : user.questions_limit}
              </p>
            </div>
            {user.subscription_tier !== 'free' && (
              <Button
                onClick={handleManageBilling}
                disabled={isLoading === 'billing'}
                variant="outline"
              >
                {isLoading === 'billing' ? 'Loading...' : 'Manage Billing'}
              </Button>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {subscriptionTiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              isCurrentTier={tier.id === user.subscription_tier}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change or cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade, downgrade, or cancel your subscription at any time. 
                Changes take effect at your next billing cycle, and you'll continue to have access until then.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my daily question limit?
              </h3>
              <p className="text-gray-600">
                Free users are limited to 5 questions per day. Premium and Pro users have unlimited questions. 
                You can always upgrade to continue learning without limits.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer student discounts?
              </h3>
              <p className="text-gray-600">
                Yes! We offer special pricing for students. Contact our support team with your student ID 
                for more information about available discounts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is my payment information secure?
              </h3>
              <p className="text-gray-600">
                Absolutely. We use Stripe for payment processing, which is trusted by millions of businesses worldwide. 
                We never store your payment information on our servers.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center mt-16">
          <p className="text-gray-600">
            Have questions? {' '}
            <a href="mailto:support@ai-torium.com" className="text-blue-600 hover:text-blue-500 font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;