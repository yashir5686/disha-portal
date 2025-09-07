
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
  prompt: `You are a psychometrics-aware content designer for Indian students. Generate the NEXT adaptive interest + capability quiz question that changes based on the learner’s class and stream selection.

CONTEXT
- Student's grade: {{{grade}}}
{{#if stream}}- Student's stream: {{{stream}}}{{/if}}
- Locale: "en"
- Quiz Length: This is one question in a 5-7 question quiz.
- Conversation History (Previous Q&A):
{{#if history}}
{{#each history}}
  Q: {{question}}
  A: {{answer}}
{{/each}}
{{else}}
  This is the first question.
{{/if}}

GOAL FOR THE QUIZ
- Infer interests (RIASEC), self-efficacy (math, coding, lab, spatial, writing, business), and work-style (independent/team, structured/creative).
- Map to stream-aligned pathways:
  • Science (PCM/PCB/PCMB) → Pure Sciences, Engineering (Core), CS/IT & Data, Health & Life Sciences (for PCB), Applied/Design Tech.
  • Arts → Humanities & Social Sciences, Media & Design, Public Policy & Law, Education.
  • Commerce → Accounting & Finance, Business & Management, Analytics & Operations, Entrepreneurship & Marketing.
  • Vocational → Technical Trades, IT Support & Networking, Health Technician, Agri-Tech, Design & Fabrication.

ADAPTATION RULES FOR THIS QUESTION
- Class 10th: simpler scenarios, everyday school contexts, foundational skills; avoid advanced jargon.
- Class 12th: deeper subject contexts, labs/projects, specialized tools (e.g., titration, circuits, case studies, Excel/Sheets).
- Science (PCM): physics–math problem solving, circuits, mechanics, coding for simulations, data analysis.
- Science (PCB): biology labs, human/plant systems, healthcare contexts, field observations, environmental monitoring.
- Arts: reading/writing, debates, design/media, history/civics/psychology/sociology, research from credible sources.
- Commerce: accounts/ledgers, budgeting, business cases, marketing campaigns, data in spreadsheets, operations.
- Vocational: hands-on builds, repairs, safety, tools, basic electronics, maker projects, agriculture, community problem solving.

DESIGN PRINCIPLES
- Behavior-based: Use concrete school-day or real-life situations in India (labs, practicals, group projects, fairs, NSS/NCC, fests, hackathons).
- Reading level: ~Grade 8. Avoid jargon; one idea per item.
- Balanced options; no “all/none of the above.”
- Mix item types (single-choice and multiple-choice) to reduce bias.
- India context only (CBSE/State board labs, NCERT references, local examples). No foreign curricula.

REQUIREMENTS FOR THE GENERATED QUESTION
- Generate ONE unique and concrete question that has not been asked before in the history.
- Tailor the question and its options to the given grade and stream.
- Provide 4 diverse options for the question. Ensure all option values and IDs are unique.
- The question stem must be ≤ 18 words. Each option must be ≤ 14 words.
- Each option in a scenario must clearly separate trait mixes (e.g., lab vs data vs coding vs teamwork).
- Use Indian school contexts: NCERT labs/practicals, state board projects, science fairs/hackathons, community issues (water, waste, traffic), shop-floor visits, kirana inventory, UPI/digital payments, NSS/NCC drives, school magazine/debate, commerce club, maker lab/ITI/polytechnic.
- No medical/clinical language. Guidance-only tone.

Based on the context and history, generate the single next question now.`,
});

const getQuizQuestionFlow = ai.defineFlow(
  {
    name: 'getQuizQuestionFlow',
    inputSchema: QuizQuestionInputSchema,
    outputSchema: QuizQuestionOutputSchema,
  },
  async (input) => {
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
