import { NextRequest, NextResponse } from 'next/server';
import { OutreachAutomationSystem, campaignTemplates } from '@/lib/outreach-automation';

export async function POST(request: NextRequest) {
  try {
    const { campaignType, customConfig } = await request.json();

    // Validate admin access (in production, implement proper admin auth)
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const outreachSystem = new OutreachAutomationSystem();

    let campaignConfig;
    
    if (campaignType && campaignTemplates[campaignType as keyof typeof campaignTemplates]) {
      // Use pre-configured template
      campaignConfig = campaignTemplates[campaignType as keyof typeof campaignTemplates];
    } else if (customConfig) {
      // Use custom configuration
      campaignConfig = customConfig;
    } else {
      return NextResponse.json({ error: 'Invalid campaign configuration' }, { status: 400 });
    }

    console.log('🚀 Starting outreach campaign with config:', campaignConfig);

    const result = await outreachSystem.runOutreachCampaign(campaignConfig);

    return NextResponse.json({
      success: true,
      result,
      message: `Campaign completed successfully. Contacted ${result.leadsContacted} leads.`
    });

  } catch (error) {
    console.error('Error running outreach campaign:', error);
    return NextResponse.json({
      error: 'Failed to run outreach campaign',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Get campaign status
export async function GET(request: NextRequest) {
  try {
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return available campaign templates
    return NextResponse.json({
      templates: Object.keys(campaignTemplates),
      campaignTemplates
    });

  } catch (error) {
    console.error('Error getting campaign status:', error);
    return NextResponse.json({
      error: 'Failed to get campaign status'
    }, { status: 500 });
  }
}