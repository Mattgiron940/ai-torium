import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/stripe';
import { getUser } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { priceId, tierId } = await request.json();

    // Get current user
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?canceled=true`;

    const session = await createCheckoutSession(
      user.id,
      user.email!,
      priceId,
      tierId,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({ 
      sessionId: session.sessionId, 
      url: session.url 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}