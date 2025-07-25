import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  features: string[];
  limits: {
    questionsPerDay: number;
    aiTutorMinutes: number;
    advancedFeatures: boolean;
    prioritySupport: boolean;
    ocrUploads: number;
    voiceInput: boolean;
  };
  popular?: boolean;
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out AI-TORIUM',
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceIdMonthly: '',
    stripePriceIdYearly: '',
    features: [
      '5 questions per day',
      'Basic AI explanations',
      'Text input only',
      'Community support'
    ],
    limits: {
      questionsPerDay: 5,
      aiTutorMinutes: 0,
      advancedFeatures: false,
      prioritySupport: false,
      ocrUploads: 0,
      voiceInput: false
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Ideal for serious learners',
    priceMonthly: 1999, // $19.99
    priceYearly: 19999, // $199.99 (save ~17%)
    stripePriceIdMonthly: 'price_1RopUkA9v7MQ0ClCEv3cX1dh',
    stripePriceIdYearly: 'price_1RopUsA9v7MQ0ClCzM1B8Lmk',
    features: [
      'Unlimited questions',
      '2 hours AI tutoring daily',
      'OCR image uploads',
      'Step-by-step solutions',
      'Priority support',
      'Study analytics'
    ],
    limits: {
      questionsPerDay: -1, // unlimited
      aiTutorMinutes: 120,
      advancedFeatures: true,
      prioritySupport: true,
      ocrUploads: 50,
      voiceInput: true
    },
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For power users and exam prep',
    priceMonthly: 3999, // $39.99
    priceYearly: 39999, // $399.99 (save ~17%)
    stripePriceIdMonthly: 'price_1RopV2A9v7MQ0ClCcEISdvLp',
    stripePriceIdYearly: 'price_1RopVAA9v7MQ0ClCUeIJ0nds',
    features: [
      'Everything in Premium',
      'Unlimited AI tutoring',
      'Voice conversations',
      'Personalized study plans',
      'Advanced analytics',
      'API access',
      '1-on-1 expert sessions'
    ],
    limits: {
      questionsPerDay: -1,
      aiTutorMinutes: -1, // unlimited
      advancedFeatures: true,
      prioritySupport: true,
      ocrUploads: -1, // unlimited
      voiceInput: true
    }
  }
];

// Create or retrieve Stripe customer
export async function createOrRetrieveCustomer(userId: string, email: string): Promise<string> {
  // Check if user already has a Stripe customer ID
  const { data: userData } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (userData?.stripe_customer_id) {
    return userData.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabase_user_id: userId,
    },
  });

  // Store customer ID in database
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: customer.id,
      tier: 'free',
      status: 'active',
      amount_cents: 0,
      monthly_question_limit: 5,
      ai_tutor_minutes_limit: 0,
      advanced_features_enabled: false,
      priority_support: false
    });

  return customer.id;
}

// Create checkout session
export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  tierId: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string; url: string }> {
  const customerId = await createOrRetrieveCustomer(userId, email);
  
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    allow_promotion_codes: true,
    subscription_data: {
      metadata: {
        user_id: userId,
        tier_id: tierId,
      },
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      user_id: userId,
      tier_id: tierId,
    },
  });

  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
}

// Create billing portal session
export async function createBillingPortalSession(
  userId: string,
  returnUrl: string
): Promise<{ url: string }> {
  const { data } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (!data?.stripe_customer_id) {
    throw new Error('No customer found');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: returnUrl,
  });

  return { url: session.url };
}

// Handle webhook events
export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;
    
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      break;
    
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
    
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const tierId = session.metadata?.tier_id;
  
  if (!userId || !tierId) {
    console.error('Missing metadata in checkout session');
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
  const tier = subscriptionTiers.find(t => t.id === tierId);
  
  if (!tier) {
    console.error('Invalid tier ID:', tierId);
    return;
  }

  // Update subscription in database
  await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscription.id,
      tier: tierId,
      status: 'active',
      amount_cents: subscription.items.data[0].price.unit_amount || 0,
      currency: subscription.currency,
      billing_cycle: subscription.items.data[0].price.recurring?.interval === 'year' ? 'yearly' : 'monthly',
      monthly_question_limit: tier.limits.questionsPerDay,
      ai_tutor_minutes_limit: tier.limits.aiTutorMinutes,
      advanced_features_enabled: tier.limits.advancedFeatures,
      priority_support: tier.limits.prioritySupport,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    });

  // Update user tier
  await supabase
    .from('users')
    .update({
      subscription_tier: tierId,
      questions_limit: tier.limits.questionsPerDay === -1 ? 999999 : tier.limits.questionsPerDay,
    })
    .eq('id', userId);

  // Award upgrade bonus points
  await supabase.rpc('award_points', {
    user_uuid: userId,
    points: 100,
    reason: 'subscription_upgrade'
  });

  console.log(`Subscription activated for user ${userId} with tier ${tierId}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    const userId = subscription.metadata?.user_id;
    
    if (userId) {
      await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);
    }
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (invoice.subscription) {
    await supabase
      .from('subscriptions')
      .update({ status: 'past_due' })
      .eq('stripe_subscription_id', invoice.subscription as string);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  
  if (userId) {
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status === 'active' ? 'active' : subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  
  if (userId) {
    // Downgrade to free tier
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    await supabase
      .from('users')
      .update({
        subscription_tier: 'free',
        questions_limit: 5,
      })
      .eq('id', userId);
  }
}

// Utility functions
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

export async function checkSubscriptionStatus(userId: string): Promise<{
  tier: string;
  status: string;
  canAskQuestions: boolean;
  questionsRemaining: number;
}> {
  const { data: userData } = await supabase
    .from('users')
    .select('subscription_tier, questions_used_today, questions_limit, last_question_reset')
    .eq('id', userId)
    .single();

  if (!userData) {
    return {
      tier: 'free',
      status: 'inactive',
      canAskQuestions: false,
      questionsRemaining: 0
    };
  }

  // Check if we need to reset daily questions
  const lastReset = new Date(userData.last_question_reset);
  const now = new Date();
  const needsReset = lastReset.toDateString() !== now.toDateString();

  if (needsReset) {
    await supabase
      .from('users')
      .update({
        questions_used_today: 0,
        last_question_reset: now.toISOString()
      })
      .eq('id', userId);
    
    userData.questions_used_today = 0;
  }

  const questionsRemaining = Math.max(0, userData.questions_limit - userData.questions_used_today);
  const canAskQuestions = questionsRemaining > 0 || userData.questions_limit === -1;

  return {
    tier: userData.subscription_tier,
    status: 'active',
    canAskQuestions,
    questionsRemaining: userData.questions_limit === -1 ? -1 : questionsRemaining
  };
}