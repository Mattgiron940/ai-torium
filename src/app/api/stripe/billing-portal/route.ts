import { NextRequest, NextResponse } from 'next/server';
import { createBillingPortalSession } from '@/lib/stripe';
import { getUser } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Get current user
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription`;

    const session = await createBillingPortalSession(user.id, returnUrl);

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Error creating billing portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create billing portal session' },
      { status: 500 }
    );
  }
}