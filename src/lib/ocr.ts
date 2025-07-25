interface OCRResult {
  text: string;
  confidence: number;
  latex?: string;
  boundingBoxes?: Array<{
    text: string;
    bbox: { x: number; y: number; width: number; height: number };
  }>;
  processingTime: number;
  method: 'tesseract' | 'mathpix' | 'hybrid';
}

class AdvancedOCRProcessor {
  
  async processImage(imageUrl: string, options: {
    preferMath?: boolean;
    language?: string;
    extractBoundingBoxes?: boolean;
  } = {}): Promise<OCRResult> {
    const startTime = Date.now();
    
    try {
      // For demo purposes, we'll simulate OCR processing
      // In production, you would use actual OCR services like Mathpix and Tesseract
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock OCR result based on image analysis
      const mockResult = this.generateMockOCRResult(imageUrl, options);
      
      mockResult.processingTime = Date.now() - startTime;
      
      return this.enhanceOCRResult(mockResult);
      
    } catch (error) {
      console.error('OCR processing failed:', error);
      
      return this.processFallback(imageUrl, options, Date.now() - startTime);
    }
  }

  private generateMockOCRResult(imageUrl: string, options: any): OCRResult {
    // Mock different types of content based on preferences
    if (options.preferMath) {
      return {
        text: 'Solve for x: 2x + 5 = 13\nStep 1: Subtract 5 from both sides\n2x = 8\nStep 2: Divide by 2\nx = 4',
        latex: '2x + 5 = 13 \\\\2x = 8 \\\\x = 4',
        confidence: 0.92,
        method: 'mathpix',
        processingTime: 0,
        boundingBoxes: options.extractBoundingBoxes ? [
          { text: '2x + 5 = 13', bbox: { x: 10, y: 20, width: 120, height: 25 } },
          { text: '2x = 8', bbox: { x: 10, y: 50, width: 80, height: 25 } },
          { text: 'x = 4', bbox: { x: 10, y: 80, width: 60, height: 25 } }
        ] : undefined
      };
    }
    
    return {
      text: 'What is the capital of France?\nParis is the capital and most populous city of France.',
      confidence: 0.87,
      method: 'tesseract',
      processingTime: 0,
      boundingBoxes: options.extractBoundingBoxes ? [
        { text: 'What is the capital of France?', bbox: { x: 10, y: 20, width: 200, height: 25 } },
        { text: 'Paris is the capital and most populous city of France.', bbox: { x: 10, y: 50, width: 300, height: 25 } }
      ] : undefined
    };
  }

  private enhanceOCRResult(result: OCRResult): OCRResult {
    // Clean up common OCR errors
    let cleanedText = result.text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add spaces between camelCase
      .replace(/(\d)([a-zA-Z])/g, '$1 $2') // Add spaces between numbers and letters
      .replace(/([a-zA-Z])(\d)/g, '$1 $2') // Add spaces between letters and numbers
      .trim();

    // Fix common mathematical notation
    if (result.method === 'tesseract') {
      cleanedText = this.fixMathNotation(cleanedText);
    }

    // Enhance confidence based on content analysis
    const enhancedConfidence = this.calculateEnhancedConfidence(result);

    return {
      ...result,
      text: cleanedText,
      confidence: enhancedConfidence
    };
  }

  private fixMathNotation(text: string): string {
    return text
      // Fix fractions
      .replace(/(\d+)\s*\/\s*(\d+)/g, '$1/$2')
      // Fix exponents
      .replace(/\^(\d+)/g, '^$1')
      // Fix square roots
      .replace(/sqrt\s*\(\s*([^)]+)\s*\)/g, '√($1)')
      // Fix common symbol substitutions
      .replace(/\bx\b/g, '×')
      .replace(/\+\-/g, '±')
      .replace(/\-\+/g, '∓')
      // Fix parentheses spacing
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')')
      // Fix equals signs
      .replace(/\s*=\s*/g, ' = ');
  }

  private calculateEnhancedConfidence(result: OCRResult): number {
    let confidence = result.confidence;
    
    // Boost confidence for Mathpix results
    if (result.method === 'mathpix') {
      confidence = Math.min(0.95, confidence + 0.1);
    }
    
    // Reduce confidence for very short text (likely errors)
    if (result.text.length < 10) {
      confidence *= 0.8;
    }
    
    // Boost confidence for mathematical content with proper notation
    if (this.containsMathNotation(result.text)) {
      confidence = Math.min(0.95, confidence + 0.05);
    }
    
    return Math.max(0.1, confidence);
  }

  private containsMathNotation(text: string): boolean {
    const mathPatterns = [
      /\d+\/\d+/, // fractions
      /[xyz]\s*=/, // equations
      /\^|\²|\³/, // exponents
      /√|∫|∑|∏/, // mathematical symbols
      /sin|cos|tan|log|ln/, // functions
      /\([^)]*\)/, // parentheses with content
    ];
    
    return mathPatterns.some(pattern => pattern.test(text));
  }

  private processFallback(imageUrl: string, options: any, elapsedTime: number): OCRResult {
    return {
      text: 'OCR processing failed. Please try uploading a clearer image or type your question manually.',
      confidence: 0,
      method: 'tesseract',
      processingTime: elapsedTime
    };
  }
}

// Singleton instance
const ocrProcessor = new AdvancedOCRProcessor();

export async function analyzeImageWithOCR(imageUrl: string, options?: {
  preferMath?: boolean;
  language?: string;
  extractBoundingBoxes?: boolean;
}): Promise<string> {
  try {
    const result = await ocrProcessor.processImage(imageUrl, options);
    return result.text;
  } catch (error) {
    console.error('OCR analysis failed:', error);
    return 'Failed to extract text from image. Please try uploading a clearer image or type your question manually.';
  }
}

export async function analyzeImageWithOCRDetailed(imageUrl: string, options?: {
  preferMath?: boolean;
  language?: string;
  extractBoundingBoxes?: boolean;
}): Promise<OCRResult> {
  return ocrProcessor.processImage(imageUrl, options);
}