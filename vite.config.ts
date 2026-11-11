import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function aiEvaluationPlugin(): Plugin {
  return {
    name: 'evalpulse-ai-evaluation-plugin',
    configureServer(server) {
      server.middlewares.use('/api/evaluate-rubric', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');

          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) {
            // Signal client to use intelligent local rubric fallback
            res.statusCode = 503;
            res.end(JSON.stringify({ message: 'GEMINI_API_KEY not configured on server, falling back to local evaluator' }));
            return;
          }

          try {
            const data = JSON.parse(body);
            const { questionText, scenario, maxMarks, expectedKeywords, modelAnswer, studentAnswer } = data;

            const ai = new GoogleGenAI();
            const prompt = `You are a strict, fair academic examiner for higher education engineering examinations.
Evaluate the student's answer based on the question, expected concepts, and model answer.

Question: ${questionText}
${scenario ? `Context / Scenario: ${scenario}` : ''}
Maximum Marks: ${maxMarks}
Expected Keywords / Concepts: ${(expectedKeywords || []).join(', ')}
Faculty Model Answer: ${modelAnswer || 'Use standard engineering best practices.'}

Student's Answer:
"""
${studentAnswer}
"""

Evaluate across 4 rubric dimensions:
1. Relevance (25% weight): Does the answer directly address the specific prompt?
2. Technical Accuracy (35% weight): Are technical concepts, formulas, and domain mechanics correct?
3. Reasoning & Architecture (25% weight): Are trade-offs, rationale, and justifications sound?
4. Depth & Clarity (15% weight): Is the answer thorough and clear?

Return strict JSON only (no markdown, no backticks) with this structure:
{
  "relevanceScore": number,
  "technicalAccuracyScore": number,
  "reasoningScore": number,
  "depthScore": number,
  "totalScore": number,
  "reasoningText": "concise 2-sentence rationale for the awarded marks",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["suggestion 1", "suggestion 2"],
  "reviewRequired": boolean (true if borderline, ambiguous, or low confidence)
}`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                responseMimeType: 'application/json'
              }
            });

            const parsed = JSON.parse(response.text || '{}');
            const totalScore = Math.min(maxMarks, Math.max(0, parsed.totalScore || 0));

            res.statusCode = 200;
            res.end(JSON.stringify({
              awardedMarks: totalScore,
              maxMarks,
              aiEvaluation: {
                relevanceScore: parsed.relevanceScore || 0,
                technicalAccuracyScore: parsed.technicalAccuracyScore || 0,
                reasoningScore: parsed.reasoningScore || 0,
                depthScore: parsed.depthScore || 0,
                totalScore,
                reasoningText: parsed.reasoningText || 'Evaluated via Gemini Rubric Engine',
                strengths: parsed.strengths || [],
                improvements: parsed.improvements || [],
                reviewRequired: !!parsed.reviewRequired,
                evaluatedAt: new Date().toISOString()
              }
            }));
          } catch (err: any) {
            console.error('Server AI Evaluation error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Evaluation error' }));
          }
        });
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), aiEvaluationPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

