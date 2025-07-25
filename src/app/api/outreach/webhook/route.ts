import { NextRequest, NextResponse } from 'next/server';
import { handleSMSResponse } from '@/lib/outreach-automation';

export async function POST(request: NextRequest) {
  try {
    const { phone, message, source } = await request.json();

    // Validate webhook source (implement proper webhook validation in production)
    const webhookSecret = request.headers.get('x-webhook-secret');
    if (webhookSecret !== process.env.OUTREACH_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Invalid webhook secret' }, { status: 401 });
    }

    console.log(`📱 Received SMS response from ${phone}: ${message}`);

    // Process the SMS response
    await handleSMSResponse(phone, message);

    return NextResponse.json({ 
      success: true,
      message: 'SMS response processed successfully' 
    });

  } catch (error) {
    console.error('Error handling SMS webhook:', error);
    return NextResponse.json({
      error: 'Failed to process SMS response',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle different webhook sources
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Outreach webhook endpoint is active',
    supportedSources: ['textr', 'twilio', 'generic_sms']
  });
}