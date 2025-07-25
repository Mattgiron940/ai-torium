import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ScrapingTarget {
  platform: 'reddit' | 'google' | 'forum' | 'social';
  url: string;
  keywords: string[];
  selectors?: {
    title?: string;
    content?: string;
    author?: string;
    contact?: string;
  };
}

interface Lead {
  email?: string;
  phone?: string;
  fullName?: string;
  source: string;
  sourceUrl: string;
  scrapedContent: string;
  interestKeywords: string[];
  leadScore: number;
  predictedConversionProbability: number;
  recommendedOutreachMessage: string;
}

class OutreachAutomationSystem {
  private textrApiKey: string;

  constructor() {
    this.textrApiKey = process.env.TEXTR_API_KEY || '';
  }

  // Main orchestration method
  async runOutreachCampaign(campaignConfig: {
    targets: ScrapingTarget[];
    maxLeads: number;
    outreachMethod: 'email' | 'sms' | 'both';
    messageTemplate?: string;
  }) {
    console.log('🚀 Starting outreach campaign...');
    
    try {
      // Step 1: Scrape data from targets
      const scrapedData = await this.scrapeAllTargets(campaignConfig.targets);
      console.log(`📊 Scraped ${scrapedData.length} posts/content pieces`);

      // Step 2: Extract and analyze leads with Claude
      const rawLeads = await this.extractLeadsWithAI(scrapedData);
      console.log(`👥 Identified ${rawLeads.length} potential leads`);

      // Step 3: Score and rank leads
      const scoredLeads = await this.scoreLeads(rawLeads);
      const topLeads = scoredLeads
        .sort((a, b) => b.leadScore - a.leadScore)
        .slice(0, campaignConfig.maxLeads);

      console.log(`⭐ Selected top ${topLeads.length} leads for outreach`);

      // Step 4: Store leads in database
      await this.storeLeads(topLeads);

      // Step 5: Generate personalized outreach messages
      const leadsWithMessages = await this.generateOutreachMessages(topLeads, campaignConfig.messageTemplate);

      // Step 6: Execute outreach
      if (campaignConfig.outreachMethod !== 'email') {
        await this.sendSMSOutreach(leadsWithMessages);
      }

      // Step 7: Set up follow-up automation
      await this.scheduleFollowups(leadsWithMessages);

      return {
        success: true,
        leadsProcessed: scrapedData.length,
        leadsIdentified: rawLeads.length,
        leadsContacted: topLeads.length,
        campaignId: `campaign_${Date.now()}`
      };

    } catch (error) {
      console.error('❌ Outreach campaign failed:', error);
      throw error;
    }
  }

  private async scrapeAllTargets(targets: ScrapingTarget[]) {
    const allData = [];

    for (const target of targets) {
      try {
        let scrapedData;

        switch (target.platform) {
          case 'reddit':
            scrapedData = await this.scrapeReddit(target);
            break;
          case 'google':
            scrapedData = await this.scrapeGoogleResults(target);
            break;
          case 'forum':
            scrapedData = await this.scrapeForums(target);
            break;
          default:
            scrapedData = await this.scrapeGeneric(target);
        }

        allData.push(...scrapedData);
      } catch (error) {
        console.error(`Failed to scrape ${target.platform}:`, error);
      }
    }

    return allData;
  }

  private async scrapeReddit(target: ScrapingTarget) {
    // Mock Reddit scraping results for demo
    return [
      {
        url: 'https://reddit.com/r/HomeworkHelp/post1',
        title: 'Need help with calculus derivatives',
        content: 'I\'m struggling with finding derivatives of complex functions. Can anyone explain the chain rule better?',
        author: 'student_math_2024',
        upvotes: 15,
        comments: 8
      },
      {
        url: 'https://reddit.com/r/learnmath/post2',
        title: 'Physics problem - kinematics',
        content: 'Having trouble with projectile motion problems. The formulas are confusing me.',
        author: 'physics_newbie',
        upvotes: 12,
        comments: 5
      },
      {
        url: 'https://reddit.com/r/chemistry/post3',
        title: 'Organic chemistry exam prep',
        content: 'Struggling with naming compounds and reaction mechanisms. Any good study resources?',
        author: 'chem_student_2024',
        upvotes: 8,
        comments: 12
      }
    ];
  }

  private async scrapeGoogleResults(target: ScrapingTarget) {
    // Mock Google search results for demo
    return [
      {
        url: 'https://stackoverflow.com/questions/programming-help',
        title: 'How to debug JavaScript async/await',
        content: 'I\'m having trouble understanding async/await in JavaScript. Can someone help?',
        author: 'dev_beginner',
        score: 5
      },
      {
        url: 'https://mathoverflow.net/calculus-question',
        title: 'Complex analysis integral problem',
        content: 'Need help solving this complex integral using residue theorem.',
        author: 'math_grad_student',
        score: 8
      }
    ];
  }

  private async scrapeForums(target: ScrapingTarget) {
    // Mock forum scraping for demo
    return [
      {
        url: 'https://physicsforums.com/thread123',
        title: 'Quantum mechanics homework question',
        content: 'Can someone help me understand the Schrödinger equation?',
        author: 'quantum_learner',
        replies: 6
      }
    ];
  }

  private async scrapeGeneric(target: ScrapingTarget) {
    // Generic web scraping fallback
    return [];
  }

  private async extractLeadsWithAI(scrapedData: any[]): Promise<Lead[]> {
    const leads: Lead[] = [];

    // Process in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < scrapedData.length; i += batchSize) {
      const batch = scrapedData.slice(i, i + batchSize);
      const batchLeads = await this.processBatchWithClaude(batch);
      leads.push(...batchLeads);
    }

    return leads;
  }

  private async processBatchWithClaude(batch: any[]): Promise<Lead[]> {
    const prompt = `You are an expert lead generation analyst. Analyze the following scraped content and extract potential leads for an AI tutoring platform called AI-TORIUM.

SCRAPED CONTENT:
${batch.map((item, index) => `
${index + 1}. URL: ${item.url}
Title: ${item.title}
Content: ${item.content}
Author: ${item.author || 'Unknown'}
---`).join('\n')}

TASK:
For each piece of content, determine:
1. Is this person likely a student who needs tutoring help?
2. What subject areas are they struggling with?
3. What's their apparent education level?
4. How urgent is their need?
5. Can you extract any contact information?

RESPONSE FORMAT:
Return a JSON array of leads. For each lead, include:
{
  "sourceUrl": "URL of the post",
  "scrapedContent": "Original content",
  "fullName": "Extracted name if available",
  "email": "Email if found",
  "phone": "Phone if found",
  "interestKeywords": ["subject1", "subject2"],
  "needsAssessment": {
    "subjects": ["math", "physics", etc.],
    "urgency": "high/medium/low",
    "educationLevel": "high school/college/graduate",
    "specificTopics": ["calculus", "algebra", etc.]
  },
  "leadQuality": "high/medium/low",
  "reasonForInterest": "Why they would be interested in AI tutoring"
}

Only include leads that show genuine academic need. Skip promotional content, spam, or non-educational posts.`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      
      // Extract JSON from Claude's response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('No JSON found in Claude response');
        return [];
      }

      const parsedLeads = JSON.parse(jsonMatch[0]);
      
      return parsedLeads.map((lead: any) => ({
        email: lead.email,
        phone: lead.phone,
        fullName: lead.fullName,
        source: this.extractSourceType(lead.sourceUrl),
        sourceUrl: lead.sourceUrl,
        scrapedContent: lead.scrapedContent,
        interestKeywords: lead.interestKeywords,
        leadScore: this.calculateInitialScore(lead),
        predictedConversionProbability: this.calculateConversionProbability(lead),
        recommendedOutreachMessage: ''
      }));

    } catch (error) {
      console.error('Error processing batch with Claude:', error);
      return [];
    }
  }

  private extractSourceType(url: string): string {
    if (url.includes('reddit.com')) return 'reddit_scrape';
    if (url.includes('stackoverflow.com')) return 'forum_scrape';
    if (url.includes('google.com')) return 'google_ads';
    return 'organic';
  }

  private calculateInitialScore(lead: any): number {
    let score = 50; // Base score

    // Quality indicators
    if (lead.leadQuality === 'high') score += 30;
    else if (lead.leadQuality === 'medium') score += 15;

    // Urgency boost
    if (lead.needsAssessment?.urgency === 'high') score += 20;
    else if (lead.needsAssessment?.urgency === 'medium') score += 10;

    // Contact info bonus
    if (lead.email) score += 15;
    if (lead.phone) score += 10;

    // Subject relevance
    const highValueSubjects = ['math', 'physics', 'chemistry', 'calculus'];
    const hasHighValueSubject = lead.interestKeywords?.some((keyword: string) => 
      highValueSubjects.some(subject => keyword.toLowerCase().includes(subject))
    );
    if (hasHighValueSubject) score += 15;

    return Math.min(100, Math.max(0, score));
  }

  private calculateConversionProbability(lead: any): number {
    // Simplified probability calculation
    const baseProb = 0.15; // 15% base conversion
    
    let multiplier = 1;
    if (lead.needsAssessment?.urgency === 'high') multiplier += 0.5;
    if (lead.email || lead.phone) multiplier += 0.3;
    if (lead.leadQuality === 'high') multiplier += 0.4;

    return Math.min(0.95, baseProb * multiplier);
  }

  private async scoreLeads(leads: Lead[]): Promise<Lead[]> {
    // Additional AI-powered lead scoring
    for (const lead of leads) {
      const enhancedScore = await this.getEnhancedLeadScore(lead);
      lead.leadScore = enhancedScore;
    }

    return leads;
  }

  private async getEnhancedLeadScore(lead: Lead): Promise<number> {
    // Use Claude to provide more sophisticated lead scoring
    const prompt = `Analyze this lead for an AI tutoring platform and provide a score from 0-100:

LEAD DATA:
- Source: ${lead.source}
- Content: ${lead.scrapedContent}
- Keywords: ${lead.interestKeywords.join(', ')}
- Has contact info: ${lead.email || lead.phone ? 'Yes' : 'No'}

Consider:
1. Academic need urgency
2. Likelihood to pay for tutoring
3. Match with our AI tutoring services
4. Quality of contact information

Respond with just a number from 0-100.`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 100,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      const score = parseInt(content.match(/\d+/)?.[0] || '50');
      
      return Math.min(100, Math.max(0, score));
    } catch (error) {
      console.error('Error getting enhanced lead score:', error);
      return lead.leadScore; // Fallback to original score
    }
  }

  private async storeLeads(leads: Lead[]) {
    const leadsToInsert = leads.map(lead => ({
      email: lead.email,
      phone: lead.phone,
      full_name: lead.fullName,
      source: lead.source,
      source_url: lead.sourceUrl,
      scraped_content: lead.scrapedContent,
      interest_keywords: lead.interestKeywords,
      lead_score: lead.leadScore,
      predicted_conversion_probability: lead.predictedConversionProbability,
      recommended_outreach_message: lead.recommendedOutreachMessage,
      outreach_status: 'new'
    }));

    const { error } = await supabase
      .from('leads')
      .insert(leadsToInsert);

    if (error) {
      console.error('Error storing leads:', error);
      throw error;
    }
  }

  private async generateOutreachMessages(leads: Lead[], template?: string): Promise<Lead[]> {
    for (const lead of leads) {
      lead.recommendedOutreachMessage = await this.generatePersonalizedMessage(lead, template);
    }

    return leads;
  }

  private async generatePersonalizedMessage(lead: Lead, template?: string): Promise<string> {
    const prompt = `Create a personalized outreach message for this lead interested in AI tutoring:

LEAD CONTEXT:
- Source: ${lead.source}
- Interest areas: ${lead.interestKeywords.join(', ')}
- Original content: ${lead.scrapedContent}
- Lead score: ${lead.leadScore}/100

PRODUCT: AI-TORIUM - Advanced AI tutoring platform with:
- Instant AI explanations
- Step-by-step problem solving
- OCR for photo uploads
- 24/7 availability

REQUIREMENTS:
- Keep message under 160 characters for SMS
- Be helpful, not pushy
- Reference their specific academic need
- Include clear call-to-action
- Sound natural and friendly

${template ? `BASE TEMPLATE: ${template}` : ''}

Generate a personalized SMS message:`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0].type === 'text' ? response.content[0].text : '';
      return content.trim();
    } catch (error) {
      console.error('Error generating personalized message:', error);
      return `Hi! Saw you need help with ${lead.interestKeywords[0] || 'studies'}. AI-TORIUM gives instant step-by-step explanations 24/7. Try free: ai-torium.com`;
    }
  }

  private async sendSMSOutreach(leads: Lead[]) {
    for (const lead of leads) {
      if (lead.phone && lead.recommendedOutreachMessage) {
        try {
          await this.sendSMS(lead.phone, lead.recommendedOutreachMessage);
          
          // Update lead status
          await supabase
            .from('leads')
            .update({
              outreach_status: 'contacted',
              contact_attempts: 1,
              last_contacted_at: new Date().toISOString()
            })
            .eq('phone', lead.phone);

          console.log(`📱 SMS sent to ${lead.phone}`);
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to send SMS to ${lead.phone}:`, error);
        }
      }
    }
  }

  private async sendSMS(phone: string, message: string) {
    if (!this.textrApiKey) {
      console.log(`Mock SMS to ${phone}: ${message}`);
      return;
    }

    // Mock SMS API call for demo
    console.log(`SMS API call to ${phone}: ${message}`);
  }

  private async scheduleFollowups(leads: Lead[]) {
    // Schedule follow-up messages for non-responders
    const followupData = leads.map(lead => ({
      lead_id: lead.email || lead.phone,
      scheduled_for: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days later
      message_type: 'followup',
      message_content: `Still need help with ${lead.interestKeywords[0]}? AI-TORIUM offers free trials: ai-torium.com/trial`
    }));

    console.log('📅 Scheduled followups for', followupData.length, 'leads');
  }
}

// Webhook handler for SMS responses
export async function handleSMSResponse(phoneNumber: string, message: string) {
  try {
    // Find the lead
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('phone', phoneNumber)
      .single();

    if (!lead) {
      console.log('Lead not found for phone:', phoneNumber);
      return;
    }

    // Analyze response with Claude
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `A lead responded to our AI tutoring outreach with: "${message}"

Analyze their response and:
1. Determine their interest level (high/medium/low/negative)
2. Generate an appropriate follow-up response
3. Suggest next action (schedule_demo/send_info/nurture/stop)

Original lead context: ${lead.scraped_content}
Interest areas: ${lead.interest_keywords?.join(', ')}`
      }]
    });

    const analysisContent = response.content[0].type === 'text' ? response.content[0].text : '';

    // Update lead status
    await supabase
      .from('leads')
      .update({
        outreach_status: 'responded',
      })
      .eq('phone', phoneNumber);

    // Send auto-response if appropriate
    if (analysisContent.includes('high interest') || message.toLowerCase().includes('yes')) {
      const autoResponse = "Great! I'll send you a free trial link. AI-TORIUM can help with instant explanations & step-by-step solutions. Check it out: ai-torium.com/trial";
      
      console.log(`Auto-response sent to ${phoneNumber}: ${autoResponse}`);
    }

  } catch (error) {
    console.error('Error handling SMS response:', error);
  }
}

// Export the main class and utility functions
export { OutreachAutomationSystem };

// Pre-configured campaign templates
export const campaignTemplates = {
  redditMathHelp: {
    targets: [
      {
        platform: 'reddit' as const,
        url: 'https://reddit.com/r/HomeworkHelp',
        keywords: ['math', 'calculus', 'algebra', 'geometry', 'statistics']
      },
      {
        platform: 'reddit' as const,
        url: 'https://reddit.com/r/learnmath',
        keywords: ['help', 'stuck', 'confused', 'exam']
      }
    ],
    maxLeads: 50,
    outreachMethod: 'sms' as const,
    messageTemplate: "Hi! Saw you need help with {subject}. AI-TORIUM gives instant step-by-step explanations. Try free: ai-torium.com"
  },

  physicsStudents: {
    targets: [
      {
        platform: 'reddit' as const,
        url: 'https://reddit.com/r/AskPhysics',
        keywords: ['homework', 'problem', 'help', 'stuck']
      }
    ],
    maxLeads: 30,
    outreachMethod: 'sms' as const
  }
};