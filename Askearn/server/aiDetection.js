/**
 * AI Detection Algorithm
 * Analyzes text to determine if it's naturally written or AI-generated
 */

// Common AI patterns and characteristics
const AI_PATTERNS = {
  // Overly formal phrases
  formalPhrases: [
    'it is important to note',
    'it is worth mentioning',
    'in conclusion',
    'furthermore',
    'moreover',
    'nevertheless',
    'consequently',
    'it should be noted',
    'as previously mentioned',
    'in summary'
  ],
  
  // Perfect structure indicators
  perfectStructure: [
    /^(firstly|first|1\.).*\n.*(secondly|second|2\.).*\n.*(thirdly|third|3\.)/i,
    /^introduction:.*\n.*body:.*\n.*conclusion:/i
  ],
  
  // AI-like sentence starters
  aiStarters: [
    'as an ai',
    'as a language model',
    'i apologize',
    'i understand your',
    'certainly!',
    'absolutely!',
    'of course!'
  ]
};

/**
 * Calculate AI detection score (0-100)
 * Higher score = more likely AI-generated
 * Lower score = more likely natural/human
 */
function calculateAIScore(text) {
  if (!text || text.trim().length < 10) {
    return 100; // Too short, suspicious
  }

  let score = 0;
  const lowerText = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // 1. Check for AI-specific phrases (30 points max)
  let aiPhraseCount = 0;
  AI_PATTERNS.aiStarters.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      aiPhraseCount++;
    }
  });
  score += Math.min(aiPhraseCount * 15, 30);

  // 2. Check for overly formal language (20 points max)
  let formalCount = 0;
  AI_PATTERNS.formalPhrases.forEach(phrase => {
    if (lowerText.includes(phrase)) {
      formalCount++;
    }
  });
  score += Math.min(formalCount * 5, 20);

  // 3. Check for perfect structure (15 points)
  AI_PATTERNS.perfectStructure.forEach(pattern => {
    if (pattern.test(text)) {
      score += 15;
    }
  });

  // 4. Sentence length consistency (AI tends to have very consistent lengths)
  if (sentences.length >= 3) {
    const lengths = sentences.map(s => s.trim().length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
    const stdDev = Math.sqrt(variance);
    
    // Low variance = consistent = more AI-like
    if (stdDev < 20 && avgLength > 50) {
      score += 15;
    }
  }

  // 5. Check for natural imperfections (reduce score)
  const naturalIndicators = [
    /\b(um|uh|hmm|well|like|you know|i think|maybe|probably)\b/i,
    /[!]{2,}/, // Multiple exclamation marks
    /\.\.\./,  // Ellipsis
    /\b(lol|haha|omg|btw|tbh)\b/i, // Internet slang
    /[a-z][A-Z]/, // Mixed case (typo indicator)
  ];

  let naturalCount = 0;
  naturalIndicators.forEach(pattern => {
    if (pattern.test(text)) {
      naturalCount++;
    }
  });
  score -= naturalCount * 5;

  // 6. Check for typos and informal language (natural indicator)
  const informalPatterns = [
    /\b(gonna|wanna|gotta|kinda|sorta|dunno)\b/i,
    /\b(yeah|yep|nope|nah)\b/i,
  ];
  
  informalPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      score -= 8;
    }
  });

  // 7. Check for very short or very long answers
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 15) {
    score -= 10; // Short answers are more natural for simple questions
  } else if (wordCount > 200) {
    score += 10; // Very long, detailed answers can be AI
  }

  // 8. Check for repetitive patterns (AI sometimes repeats)
  const words = lowerText.split(/\s+/);
  const wordFreq = {};
  words.forEach(word => {
    if (word.length > 4) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  const maxFreq = Math.max(...Object.values(wordFreq));
  if (maxFreq > 5) {
    score += 10; // Repetitive
  }

  // Normalize score to 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  return score;
}

/**
 * Determine if answer is natural (human-written)
 * Returns true if natural, false if likely AI
 */
function isNaturalAnswer(text, threshold = 40) {
  const score = calculateAIScore(text);
  return score < threshold;
}

/**
 * Get detailed analysis of the text
 */
function analyzeText(text) {
  const score = calculateAIScore(text);
  const isNatural = score < 40;
  
  let confidence = 'medium';
  if (score < 25 || score > 75) {
    confidence = 'high';
  } else if (score < 35 || score > 60) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  let verdict = 'natural';
  if (score >= 60) {
    verdict = 'ai-generated';
  } else if (score >= 40) {
    verdict = 'uncertain';
  }

  return {
    score,
    isNatural,
    verdict,
    confidence,
    recommendation: isNatural ? 'Award full coins' : 'Review or reduce coins'
  };
}

module.exports = {
  calculateAIScore,
  isNaturalAnswer,
  analyzeText
};
