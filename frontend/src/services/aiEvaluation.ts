import { Question, StudentAnswer } from '../types';

interface EvaluationResult {
  awardedMarks: number;
  maxMarks: number;
  isCorrect?: boolean;
  aiEvaluation?: {
    relevanceScore: number;
    technicalAccuracyScore: number;
    reasoningScore: number;
    depthScore: number;
    totalScore: number;
    reasoningText: string;
    strengths: string[];
    improvements: string[];
    reviewRequired: boolean;
    evaluatedAt: string;
  };
}

export async function evaluateStudentAnswer(
  question: Question,
  submittedOption?: string | string[],
  submittedText?: string
): Promise<EvaluationResult> {
  const maxMarks = question.marks;

  // 1. Multiple Choice Evaluation
  if (question.type === 'multiple_choice') {
    const isCorrect = submittedOption === question.correctAnswer;
    let awarded = 0;
    if (isCorrect) {
      awarded = maxMarks;
    } else if (question.negativeMarks) {
      awarded = -question.negativeMarks;
    }
    return {
      awardedMarks: Math.max(0, awarded),
      maxMarks,
      isCorrect
    };
  }

  // 2. Text / Descriptive / Image-based / Situational Evaluation
  const answer = (submittedText || '').trim();
  if (!answer) {
    return {
      awardedMarks: 0,
      maxMarks,
      aiEvaluation: {
        relevanceScore: 0,
        technicalAccuracyScore: 0,
        reasoningScore: 0,
        depthScore: 0,
        totalScore: 0,
        reasoningText: 'No answer provided by the student.',
        strengths: [],
        improvements: ['Attempt the question to receive partial marks.'],
        reviewRequired: false,
        evaluatedAt: new Date().toISOString()
      }
    };
  }

  // Check if server endpoint /api/evaluate-rubric is available, otherwise intelligent rubric evaluation
  try {
    const response = await fetch('/api/evaluate-rubric', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionType: question.type,
        questionText: question.question,
        scenario: question.scenario,
        maxMarks: question.marks,
        expectedKeywords: question.expectedKeywords || [],
        modelAnswer: question.modelAnswer || '',
        studentAnswer: answer,
        rubricCriteria: question.rubricCriteria
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch {
    // Fall back to built-in intelligent rubric evaluator
  }

  return evaluateWithLocalRubric(question, answer);
}

function evaluateWithLocalRubric(question: Question, studentAnswer: string): EvaluationResult {
  const maxMarks = question.marks;
  const lowerAnswer = studentAnswer.toLowerCase();
  const words = studentAnswer.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const expectedKeywords = (question.expectedKeywords || []).map(k => k.toLowerCase());
  let matchedKeywordsCount = 0;
  expectedKeywords.forEach(kw => {
    if (lowerAnswer.includes(kw)) {
      matchedKeywordsCount++;
    }
  });

  const keywordRatio = expectedKeywords.length > 0 
    ? matchedKeywordsCount / expectedKeywords.length 
    : 0.7;

  // Criteria weights:
  // Relevance: 25%, Technical Accuracy: 35%, Reasoning: 25%, Depth: 15%
  let relevanceFraction = 0.5;
  let technicalFraction = 0.4;
  let reasoningFraction = 0.4;
  let depthFraction = 0.3;

  // Word count benchmarks
  const minExpectedWords = question.type === 'short_answer' ? 25 : 60;
  const optimalWords = question.type === 'short_answer' ? 50 : 120;

  if (wordCount >= minExpectedWords) {
    relevanceFraction = Math.min(1.0, 0.6 + keywordRatio * 0.4);
    technicalFraction = Math.min(1.0, 0.4 + keywordRatio * 0.6);
    reasoningFraction = Math.min(1.0, 0.5 + (wordCount / optimalWords) * 0.3 + keywordRatio * 0.2);
    depthFraction = Math.min(1.0, Math.min(1.0, wordCount / optimalWords) * 0.7 + keywordRatio * 0.3);
  } else {
    relevanceFraction = Math.max(0.3, keywordRatio * 0.8);
    technicalFraction = Math.max(0.2, keywordRatio * 0.7);
    reasoningFraction = Math.max(0.2, (wordCount / minExpectedWords) * 0.5);
    depthFraction = Math.max(0.1, (wordCount / minExpectedWords) * 0.4);
  }

  // Model answer cross-correlation check if provided
  if (question.modelAnswer) {
    const modelWords = question.modelAnswer.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const sharedStemWords = modelWords.filter(mw => lowerAnswer.includes(mw)).length;
    const similarityBonus = Math.min(0.2, (sharedStemWords / Math.max(5, modelWords.length)) * 0.3);
    technicalFraction = Math.min(1.0, technicalFraction + similarityBonus);
  }

  const compositeScoreRatio = (
    relevanceFraction * 0.25 +
    technicalFraction * 0.35 +
    reasoningFraction * 0.25 +
    depthFraction * 0.15
  );

  const rawAwarded = Math.round(compositeScoreRatio * maxMarks * 10) / 10;
  const awardedMarks = Math.min(maxMarks, Math.max(0.5, rawAwarded));

  // Determine strengths & suggestions
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (matchedKeywordsCount > 0) {
    strengths.push(`Accurately integrated core domain concepts (${matchedKeywordsCount} key terms identified).`);
  }
  if (wordCount >= minExpectedWords) {
    strengths.push('Provided structured rationale with sufficient explanatory coverage.');
  } else {
    improvements.push('Expand response with concrete architectural examples and deeper rationale.');
  }

  if (keywordRatio < 0.5 && expectedKeywords.length > 0) {
    improvements.push(`Consider addressing key topics such as: ${expectedKeywords.slice(0, 3).join(', ')}.`);
  }

  if (strengths.length === 0) {
    strengths.push('Demonstrated basic comprehension of the core subject question.');
  }

  const reviewRequired = compositeScoreRatio < 0.45 || (compositeScoreRatio > 0.85 && keywordRatio < 0.3);

  return {
    awardedMarks,
    maxMarks,
    aiEvaluation: {
      relevanceScore: Math.round(relevanceFraction * (maxMarks * 0.25) * 10) / 10,
      technicalAccuracyScore: Math.round(technicalFraction * (maxMarks * 0.35) * 10) / 10,
      reasoningScore: Math.round(reasoningFraction * (maxMarks * 0.25) * 10) / 10,
      depthScore: Math.round(depthFraction * (maxMarks * 0.15) * 10) / 10,
      totalScore: awardedMarks,
      reasoningText: `Evaluated using rubric parameters. Relevance scored at ${Math.round(relevanceFraction * 100)}%, Technical accuracy at ${Math.round(technicalFraction * 100)}%, with ${matchedKeywordsCount} matched domain keywords.`,
      strengths,
      improvements,
      reviewRequired,
      evaluatedAt: new Date().toISOString()
    }
  };
}
