
'use server';
/**
 * @fileOverview A dynamic quiz generation AI agent.
 *
 * - getQuizQuestion - A function that generates a quiz question.
 * - QuizQuestionInput - The input type for the getQuizQuestion function.
 * - QuizQuestion - The return type for the getQuizQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { v4 as uuidv4 } from 'uuid';

// Schemas for the questions
const BaseQuestionSchema = z.object({
  id: z.string().describe("A unique identifier for the question."),
  question: z.string().describe("The question text presented to the user."),
});

const SingleChoiceQuestionSchema = BaseQuestionSchema.extend({
  type: z.enum(['single-choice']),
  options: z.array(z.object({
    id: z.string(),
    value: z.string().describe("The text for the option."),
  })).describe('A list of possible answers for a single-choice question.'),
});

const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
  type: z.enum(['multiple-choice']),
  options: z.array(z.object({
    id: z.string(),
    value: z.string().describe("The text for the option."),
  })).describe('A list of possible answers for a multiple-choice question.'),
});


const QuizQuestionOutputSchema = z.discriminatedUnion('type', [
  SingleChoiceQuestionSchema,
  MultipleChoiceQuestionSchema,
]);

export type QuizQuestion = z.infer<typeof QuizQuestionOutputSchema>;

const QuizQuestionInputSchema = z.object({
  grade: z.enum(['10th', '12th']),
  stream: z.string().optional().describe('The student\'s stream if they are in 12th grade (e.g., "Science (PCM)", "Commerce", "Arts").'),
  history: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional().describe('The history of questions and answers from the current quiz session.'),
});

export type QuizQuestionInput = z.infer<typeof QuizQuestionInputSchema>;

export async function getQuizQuestion(input: QuizQuestionInput): Promise<QuizQuestion> {
  const question = await getQuizQuestionFlow(input);
  return question;
}

const prompt = ai.definePrompt({
  name: 'getQuizQuestionPrompt',
  input: { schema: QuizQuestionInputSchema },
  output: { schema: QuizQuestionOutputSchema },
  prompt: `You are a psychometrics-aware content designer for Indian students. Your task is to generate the NEXT adaptive interest + capability quiz question based on the user's progress.

CONTEXT
- Student's Grade Level: {{{grade}}}
{{#if stream}}- Student's Stream: {{{stream}}}{{/if}}
- Locale: "en"
- Current Quiz Length: This is question {{history.length}} of a 5-7 question quiz.
- Conversation History (Previous Q&A):
{{#if history}}
{{#each history}}
  Q: {{question}}
  A: {{answer}}
{{/each}}
{{else}}
  This is the first question.
{{/if}}

QUIZ DESIGN & ADAPTATION RULES

1.  **Adapt by Class Level:**
    *   **Class 10:** Use simpler, everyday school scenarios. Keep language direct. Focus on foundational interests.
    *   **Class 12:** Use deeper, subject-specific contexts involving labs, projects, or tools.

2.  **Adapt by Stream (Scenario Emphasis):**
    *   **Science (PCM):** Focus on problem-solving, mechanics/circuits, coding simulations, data analysis, lab troubleshooting.
    *   **Science (PCB):** Focus on biology labs, field observations, healthcare contexts, environment/sustainability, people-service.
    *   **Science (PCMB):** Create a balanced mix of PCM and PCB contexts.
    *   **Arts:** Focus on research, writing/analysis, debates, presentations, media/design tasks.
    *   **Commerce:** Focus on ledgers/budgeting, small business cases, marketing experiments, spreadsheet/data tasks, operations.
    *   **Vocational:** Focus on hands-on builds/repairs, safety and tools, basic electronics, maker/ITI-style projects.

3.  **Question Type & Structure:**
    *   The quiz primarily uses **scenario-based forced-choice questions**.
    *   Stems must be ≤ 18 words. Options must be ≤ 14 words.
    *   Provide 4 balanced options (A-D) with no obviously "right" or "wrong" answer.
    *   Each option in a scenario must clearly separate different traits (e.g., a lab task vs. a data analysis task vs. a coding task vs. a teamwork task).

4.  **Content Requirements:**
    *   **Indian Context:** Use only Indian school contexts (e.g., NCERT labs, state board projects, science fairs, hackathons, NSS/NCC drives, community issues like water/waste, kirana inventory, UPI payments, school magazines, commerce clubs).
    *   **Unique Questions:** Generate ONE unique and concrete question that has not been asked before in the history.
    *   **Guidance-only Tone:** Avoid clinical or diagnostic language. This is for career guidance, not assessment of disorders.

Based on the student's profile and quiz history, generate the single next question now.`,
});

const getQuizQuestionFlow = ai.defineFlow(
  {
    name: 'getQuizQuestionFlow',
    inputSchema: QuizQuestionInputSchema,
    outputSchema: QuizQuestionOutputSchema,
  },
  async (input) => {
    // Map the input to a format the prompt understands better if needed, but the current prompt is flexible.
    const { output } = await prompt(input);
    
    if (!output) {
      throw new Error("Failed to generate quiz question.");
    }
    
    // Add unique IDs to the output
    output.id = uuidv4();
    if (output.options) {
      output.options.forEach(o => o.id = uuidv4());
    }
    
    return output;
  }
);
