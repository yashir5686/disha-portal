'use server';
/**
 * @fileOverview A dynamic quiz generation AI agent.
 *
 * - getQuizQuestion - A function that generates a quiz question.
 * - QuizQuestionInput - The input type for the getQuizQuestion function.
 * - QuizQuestionOutput - The return type for the getQuizQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { v4 as uuidv4 } from 'uuid';

// Schemas for the questions
const BaseQuestionSchema = z.object({
  id: z.string().describe("A unique identifier for the question."),
  question: z.string().describe("The question text presented to the user."),
});

const TextQuestionSchema = BaseQuestionSchema.extend({
  type: z.enum(['text']),
  options: z.array(z.object({
    id: z.string(),
    value: z.string().describe("The text for the option."),
  })).describe('A list of possible answers.'),
});

const ImageQuestionSchema = BaseQuestionSchema.extend({
  type: z.enum(['image']),
  options: z.array(z.object({
    id: z.string(),
    imageUrl: z.string().url().describe("A URL for the image option. Use picsum.photos for placeholders."),
    alt: z.string().describe("Alt text for the image, describing the activity or concept."),
  })).describe('A list of image-based answers.'),
});

const QuizQuestionOutputSchema = z.discriminatedUnion('type', [
  TextQuestionSchema,
  ImageQuestionSchema,
]);

export type QuizQuestion = z.infer<typeof QuizQuestionOutputSchema>;

const QuizQuestionInputSchema = z.object({
  history: z.array(z.object({
    question: z.string(),
    answer: z.string()
  })).optional().describe('The history of questions and answers from the current quiz session.'),
});

export type QuizQuestionInput = z.infer<typeof QuizQuestionInputSchema>;

export async function getQuizQuestion(input: QuizQuestionInput): Promise<QuizQuestion> {
  const question = await getQuizQuestionFlow(input);
  
  // If it's an image question, we need to generate images for the options
  if (question.type === 'image') {
    const imagePromises = question.options.map(async (option) => {
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `A vibrant, clear, and engaging photo representing the concept: "${option.alt}". The image should be suitable for a career quiz.`,
        config: {
          aspectRatio: "1:1",
        },
      });
      return {
        ...option,
        imageUrl: media.url,
      };
    });
    question.options = await Promise.all(imagePromises);
  }
  
  return question;
}

const prompt = ai.definePrompt({
  name: 'getQuizQuestionPrompt',
  input: { schema: QuizQuestionInputSchema },
  output: { schema: QuizQuestionOutputSchema },
  prompt: `You are a career counseling expert designing an adaptive quiz for students in India (after 10th/12th grade) to recommend a career stream (Science, Commerce, Arts, Vocational).

Generate the NEXT quiz question. The quiz should have a good mix of question types (text, image).
- The quiz should be around 5-7 questions long.
- Use the provided history of previous answers to make the next question more relevant and insightful.
- Vary the question format. Sometimes ask about preferences, sometimes about problem-solving styles, sometimes about ideal work environments.
- Questions should be designed to uncover the student's underlying interests, personality, and aptitudes, mapping to frameworks like RIASEC (Realistic, Investigative, Artistic, Social, Enterprising, Conventional) without mentioning the framework directly.

Conversation History:
{{#if history}}
{{#each history}}
  Q: {{question}}
  A: {{answer}}
{{/each}}
{{else}}
  This is the first question. Start with a broad question to understand the user's general inclination.
{{/if}}

Based on the history, generate the next question.
- For text questions, provide 4 diverse options.
- For image questions, provide 4 diverse options with descriptive alt text that can be used to generate an image. Do not provide image URLs, only alt text. I will generate the images. Use picsum.photos URLs as placeholders in the output schema.
- Ensure all option values and IDs are unique.
`,
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
    output.options.forEach(o => o.id = uuidv4());
    
    return output;
  }
);
