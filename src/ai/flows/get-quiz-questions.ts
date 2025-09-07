
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
  input: { schema: z.object({
    grade: z.enum(['10th', '12th']),
    stream: z.string().optional(),
    history: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
    questionNumber: z.number(),
  }) },
  output: { schema: QuizQuestionOutputSchema },
  prompt: `You are a psychometrics-aware content designer for Indian students. Your task is to generate the NEXT adaptive interest + capability quiz question based on the user's progress.

CONTEXT
- Student's Grade Level: {{{grade}}}
{{#if stream}}- Student's Stream: {{{stream}}}{{/if}}
- Locale: "en"
- Previous Questions Asked:
{{#if history}}
{{#each history}}
  - "{{question}}"
{{/each}}
{{else}}
  This is the first question.
{{/if}}

QUIZ STRUCTURE & ADAPTATION RULES
The quiz length depends on the grade level. You must generate the next question in the sequence.

- **Class 10 (Quick Quiz - 14 questions total):**
  - Questions 1-6: Scenario forced-choice (4 options)
  - Questions 7-14: Likert scale (1-5 agreement)
- **Class 12 (Deep Quiz - 21 questions total):**
  - Questions 1-10: Scenario forced-choice (4 options)
  - Questions 11-16: Likert scale (1-5 agreement)
  - Questions 17-21: Micro-skill snapshots (scenario-based, single-choice)

**Current Question Number: {{questionNumber}}**

**Based on the current question number and the student's grade, determine the correct question type to generate NOW.**

QUESTION TYPE DETAILS

1.  **Scenario Forced-Choice (A-D):**
    *   **Goal:** Assess interests and work style.
    *   **Format:** A concrete school-day situation with 4 balanced options. No obviously "right" or "wrong" answer.
    *   **Contexts:** Labs, project weeks, science fairs, community problems (NSS/NCC), computer lab tasks, market/shop-floor visits.
    *   **Adaptation by Stream:**
        *   **PCM:** problem-solving, mechanics, circuits, coding simulations.
        *   **PCB:** biology labs, field observations, healthcare contexts, environment.
        *   **Arts:** research, writing, debates, media/design tasks.
        *   **Commerce:** budgeting, business cases, marketing experiments, data tasks.
        *   **Vocational:** hands-on builds, repairs, safety, tools, maker projects.

2.  **Likert Scale (1-5):**
    *   **Goal:** Assess self-efficacy and preferences.
    *   **Format:** A statement like "I can..." or "I enjoy...".
    *   **Options (Implied):** Strongly Disagree, Disagree, Neutral, Agree, Strongly Agree. (You only generate the question stem).
    *   **Example:** "I can break tough problems into smaller steps."
    *   **Reverse-Keyed Example:** "I lose interest when tasks need precise measurements."

3.  **Micro-skill Snapshots (Class 12 Only):**
    *   **Goal:** Assess foundational capability in a specific skill.
    *   **Format:** A mini-scenario asking the user to choose the best approach, not solve a long problem.
    *   **Examples:**
        *   **Math/Data Logic:** "To find the trend in exam scores over 5 years, which approach is best?" (Options: Calculate the average, Plot a line graph, Find the median, Count the total students).
        *   **Writing:** "To start an essay arguing for renewable energy, which is the strongest opening sentence?" (Provide 4 options).
        *   **Spreadsheet/Ops:** "To track daily sales for a small shop, what's the most efficient method?" (Options: A notebook, A spreadsheet with formulas, A calculator, A wall chart).

REQUIREMENTS
- **Unique Questions:** Generate ONE unique question that is NOT in the "Previous Questions Asked" list.
- **Word Limits:** Question stems must be ≤ 18 words. Options must be ≤ 14 words.
- **Indian Context:** Use only Indian school contexts (NCERT, CBSE/State board projects, etc.).

Generate the single next question now, following all rules for the specified grade and question number.
`,
});

const getQuizQuestionFlow = ai.defineFlow(
  {
    name: 'getQuizQuestionFlow',
    inputSchema: QuizQuestionInputSchema,
    outputSchema: QuizQuestionOutputSchema,
  },
  async (input) => {
    const questionNumber = (input.history?.length || 0) + 1;
    const promptInput = { ...input, questionNumber };
    const { output } = await prompt(promptInput);
    
    if (!output) {
      throw new Error("Failed to generate quiz question.");
    }
    
    // Add unique IDs to the output
    output.id = uuidv4();
    if ('options' in output && output.options) {
      output.options.forEach(o => o.id = uuidvv4());
    }
    
    return output;
  }
);
