import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface QuestionRequest {
  question: string;
  subject?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  questionType?: 'text' | 'image' | 'mixed';
  imageUrls?: string[];
  userId: string;
  isUrgent?: boolean;
  context?: string;
}

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    const body: QuestionRequest = await request.json();
    const { question, subject, difficulty, questionType, imageUrls, userId, isUrgent, context } = body;

    // Validate user authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check daily question limit
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('questions_used_today, questions_limit, subscription_tier')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Reset daily questions if needed
    const resetResult = await supabase.rpc('check_daily_limit', { user_uuid: userId });
    
    if (!resetResult.data && userData.questions_used_today >= userData.questions_limit) {
      return NextResponse.json({
        error: 'Daily question limit reached',
        upgrade: true,
        currentUsage: userData.questions_used_today,
        limit: userData.questions_limit
      }, { status: 403 });
    }

    // Process images with OCR if provided
    let ocrText = '';
    if (imageUrls && imageUrls.length > 0) {
      try {
        // Simple OCR placeholder - in production, use actual OCR service
        ocrText = 'Image content extracted via OCR';
      } catch (ocrError) {
        console.error('OCR processing failed:', ocrError);
      }
    }

    // Construct enhanced prompt for Claude
    const enhancedPrompt = buildClaudePrompt({
      question,
      subject,
      difficulty,
      ocrText,
      context,
      userLevel: userData.subscription_tier
    });

    // Get AI response from Claude
    const aiResponse = await generateClaudeResponse(enhancedPrompt, {
      subject,
      difficulty,
      isUrgent: isUrgent || false,
      userTier: userData.subscription_tier
    });

    // Calculate processing metrics
    const processingTime = Date.now() - startTime;
    const tokensUsed = estimateTokens(enhancedPrompt + aiResponse.content);

    // Get subject ID
    const subjectId = await getSubjectId(subject);

    // Store question in database
    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .insert({
        user_id: userId,
        subject_id: subjectId,
        title: question.substring(0, 100),
        content: question,
        question_type: questionType || 'text',
        difficulty_level: difficulty,
        image_urls: imageUrls || [],
        ocr_extracted_text: ocrText,
        claude_complexity_score: aiResponse.complexityScore,
        estimated_solve_time_minutes: aiResponse.estimatedTime,
        required_knowledge_areas: aiResponse.knowledgeAreas,
        ai_generated_tags: aiResponse.tags,
        is_urgent: isUrgent || false,
        status: 'answered'
      })
      .select()
      .single();

    if (questionError) {
      console.error('Failed to store question:', questionError);
    }

    // Store AI answer
    const { data: answerData, error: answerError } = await supabase
      .from('answers')
      .insert({
        question_id: questionData?.id,
        content: aiResponse.content,
        answer_type: 'ai',
        confidence_score: aiResponse.confidence,
        claude_model_used: 'claude-3-5-sonnet-20241022',
        processing_time_ms: processingTime,
        tokens_used: tokensUsed,
        reasoning_steps: aiResponse.reasoningSteps,
        sources_cited: aiResponse.sources,
        has_latex: aiResponse.hasLatex,
        has_code: aiResponse.hasCode,
        has_diagrams: aiResponse.hasDiagrams,
        formatted_content: aiResponse.formattedContent,
        accuracy_rating: 0.9,
        helpfulness_score: 0.85,
        clarity_score: 0.88,
        completeness_score: 0.92
      })
      .select()
      .single();

    if (answerError) {
      console.error('Failed to store answer:', answerError);
    }

    // Update user statistics
    await supabase
      .from('users')
      .update({
        questions_used_today: userData.questions_used_today + 1,
        total_questions_asked: userData.total_questions_asked + 1
      })
      .eq('id', userId);

    // Award points for asking question
    const points = calculateQuestionPoints(difficulty, subject);
    await supabase.rpc('award_points', {
      user_uuid: userId,
      points,
      reason: 'question_asked'
    });

    // Return response
    return NextResponse.json({
      success: true,
      questionId: questionData?.id,
      answerId: answerData?.id,
      answer: {
        content: aiResponse.content,
        confidence: aiResponse.confidence,
        complexity: aiResponse.complexityScore,
        estimatedTime: aiResponse.estimatedTime,
        tags: aiResponse.tags,
        hasLatex: aiResponse.hasLatex,
        hasCode: aiResponse.hasCode,
        formattedContent: aiResponse.formattedContent,
        reasoningSteps: aiResponse.reasoningSteps,
        sources: aiResponse.sources
      },
      usage: {
        questionsUsed: userData.questions_used_today + 1,
        questionsLimit: userData.questions_limit,
        remaining: userData.questions_limit - userData.questions_used_today - 1
      },
      processingTime,
      tokensUsed,
      pointsEarned: points
    });

  } catch (error) {
    console.error('Error in Claude API route:', error);
    
    return NextResponse.json({
      error: 'Failed to process question',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function buildClaudePrompt({ question, subject, difficulty, ocrText, context, userLevel }: {
  question: string;
  subject?: string;
  difficulty?: string;
  ocrText?: string;
  context?: string;
  userLevel: string;
}): string {
  const basePrompt = `You are an expert AI tutor specializing in providing comprehensive, step-by-step educational assistance. Your goal is to not just answer questions, but to help students truly understand the concepts.

QUESTION CONTEXT:
${subject ? `Subject: ${subject}` : ''}
${difficulty ? `Difficulty Level: ${difficulty}` : ''}
${context ? `Additional Context: ${context}` : ''}
${ocrText ? `Extracted Text from Image: ${ocrText}` : ''}

STUDENT QUESTION:
${question}

RESPONSE REQUIREMENTS:
1. **Step-by-Step Solution**: Break down the problem into clear, logical steps
2. **Conceptual Explanation**: Explain the underlying concepts and principles
3. **Multiple Approaches**: When applicable, show different methods to solve the problem
4. **Real-World Applications**: Connect the concept to practical examples
5. **Common Mistakes**: Highlight typical errors students make with this type of problem
6. **Practice Suggestions**: Recommend what the student should practice next

FORMATTING GUIDELINES:
- Use LaTeX for mathematical expressions: $inline$ or $$display$$
- Include code blocks with syntax highlighting when relevant
- Use bullet points and numbered lists for clarity
- Bold important concepts and key terms
- Include diagrams descriptions when helpful

DIFFICULTY ADAPTATION:
${difficulty === 'beginner' ? 
  '- Use simple language and explain basic concepts thoroughly\n- Provide more detailed explanations for each step\n- Include fundamental background information' :
  difficulty === 'advanced' ?
  '- Use technical terminology appropriately\n- Include advanced insights and connections\n- Challenge the student with extensions or variations' :
  '- Balance technical accuracy with accessibility\n- Provide moderate detail in explanations\n- Include relevant background when needed'
}

${userLevel === 'premium' || userLevel === 'pro' ? 
`PREMIUM FEATURES:
- Provide detailed error analysis if this is a mistake correction
- Include advanced problem-solving strategies
- Suggest personalized learning paths
- Offer additional challenging problems` : ''}

Please provide a comprehensive response that helps the student learn effectively.`;

  return basePrompt;
}

async function generateClaudeResponse(prompt: string, options: {
  subject?: string;
  difficulty?: string;
  isUrgent: boolean;
  userTier: string;
}) {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: options.userTier === 'free' ? 2000 : 4000,
    temperature: 0.3,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const content = message.content[0].type === 'text' ? message.content[0].text : '';
  
  // Analyze response characteristics
  const analysis = analyzeResponse(content, options.subject);
  
  return {
    content,
    confidence: analysis.confidence,
    complexityScore: analysis.complexity,
    estimatedTime: analysis.estimatedTime,
    knowledgeAreas: analysis.knowledgeAreas,
    tags: analysis.tags,
    hasLatex: analysis.hasLatex,
    hasCode: analysis.hasCode,
    hasDiagrams: analysis.hasDiagrams,
    formattedContent: analysis.formattedContent,
    reasoningSteps: analysis.reasoningSteps,
    sources: analysis.sources
  };
}

function analyzeResponse(content: string, subject?: string) {
  const hasLatex = /\$.*?\$|\$\$.*?\$\$/s.test(content);
  const hasCode = /```[\s\S]*?```/.test(content);
  const hasDiagrams = /diagram|graph|chart|figure/i.test(content);
  
  // Extract reasoning steps
  const stepMatches = content.match(/step \d+|^\d+\./gmi) || [];
  const reasoningSteps = stepMatches.map(step => step.trim());
  
  // Calculate complexity based on content analysis
  let complexity = 0.5;
  if (hasLatex) complexity += 0.2;
  if (hasCode) complexity += 0.15;
  if (content.length > 1000) complexity += 0.1;
  if (stepMatches.length > 3) complexity += 0.05;
  
  // Extract knowledge areas based on content
  const knowledgeAreas = extractKnowledgeAreas(content, subject);
  
  // Generate tags
  const tags = generateTags(content, subject);
  
  return {
    confidence: Math.min(0.95, 0.7 + complexity * 0.3),
    complexity: Math.min(1.0, complexity),
    estimatedTime: Math.ceil(content.length / 200 * 2),
    knowledgeAreas,
    tags,
    hasLatex,
    hasCode,
    hasDiagrams,
    formattedContent: { html: content },
    reasoningSteps,
    sources: []
  };
}

function extractKnowledgeAreas(content: string, subject?: string): string[] {
  const areas: string[] = [];
  
  if (subject) areas.push(subject);
  
  const areaKeywords = {
    'algebra': /algebra|equation|variable|polynomial/i,
    'calculus': /derivative|integral|limit|differential/i,
    'geometry': /triangle|circle|angle|area|volume/i,
    'statistics': /probability|mean|variance|distribution/i,
    'physics': /force|energy|motion|wave|electricity/i,
    'chemistry': /molecule|reaction|bond|element/i,
    'programming': /code|function|algorithm|variable/i
  };
  
  Object.entries(areaKeywords).forEach(([area, regex]) => {
    if (regex.test(content) && !areas.includes(area)) {
      areas.push(area);
    }
  });
  
  return areas;
}

function generateTags(content: string, subject?: string): string[] {
  const tags: string[] = [];
  
  if (subject) tags.push(subject.toLowerCase());
  
  // Extract important terms (simplified approach)
  const words = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const wordFreq = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const commonWords = new Set(['that', 'this', 'with', 'have', 'will', 'from', 'they', 'been', 'than', 'were', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'where', 'much', 'before', 'right', 'through', 'when', 'should', 'these', 'very', 'what', 'know', 'just', 'make', 'good', 'over', 'think', 'help', 'problem', 'solution', 'answer', 'question', 'example', 'step']);
  
  const topWords = Object.entries(wordFreq)
    .filter(([word]) => !commonWords.has(word) && word.length > 4)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word);
  
  tags.push(...topWords);
  
  return [...new Set(tags)];
}

async function getSubjectId(subjectName?: string): Promise<string | null> {
  if (!subjectName) return null;
  
  const { data } = await supabase
    .from('subjects')
    .select('id')
    .ilike('name', subjectName)
    .single();
    
  return data?.id || null;
}

function calculateQuestionPoints(difficulty?: string, subject?: string): number {
  let basePoints = 5;
  
  switch (difficulty) {
    case 'beginner':
      basePoints = 5;
      break;
    case 'intermediate':
      basePoints = 10;
      break;
    case 'advanced':
      basePoints = 15;
      break;
  }
  
  // Bonus points for STEM subjects
  if (['Mathematics', 'Physics', 'Chemistry', 'Computer Science'].includes(subject || '')) {
    basePoints += 2;
  }
  
  return basePoints;
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}