
'use server';
/**
 * @fileOverview Fetches a list of study resources and articles.
 *
 * - getStudyResources - A function that returns a list of study resources.
 * - StudyResource - The type for a single study resource.
 * - ArticleResource - The type for a single article.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StudyResourceSchema = z.object({
    title: z.string(),
    platform: z.string(),
    description: z.string(),
    link: z.string().url(),
    imageUrl: z.string().url().describe("use picsum.photos for placeholder images"),
});

const ArticleResourceSchema = z.object({
    title: z.string().describe("The headline of the article."),
    source: z.string().describe("The name of the publication or website."),
    summary: z.string().describe("A brief, one-sentence summary of the article."),
    link: z.string().url().describe("A direct link to read the full article."),
});


export type StudyResource = z.infer<typeof StudyResourceSchema>;
export type ArticleResource = z.infer<typeof ArticleResourceSchema>;


const GetStudyResourcesInputSchema = z.object({
    query: z.string(),
    type: z.enum(['resource', 'article']).default('resource'),
});

const GetStudyResourcesOutputSchema = z.object({
    resources: z.array(StudyResourceSchema),
    articles: z.array(ArticleResourceSchema),
});

export async function getStudyResources(input: z.infer<typeof GetStudyResourcesInputSchema>): Promise<z.infer<typeof GetStudyResourcesOutputSchema>> {
    return getStudyResourcesFlow(input);
}

const prompt = ai.definePrompt({
    name: 'getStudyResourcesPrompt',
    input: { schema: GetStudyResourcesInputSchema },
    output: { schema: GetStudyResourcesOutputSchema },
    prompt: `You are an expert on Indian educational and career resources. Find a list of resources based on the following query: {{{query}}}.
    
    {{#if (eq type "article")}}
    Your goal is to find 4-5 relevant and insightful articles. For the output, only populate the 'articles' field. The 'resources' field should be an empty array.
    {{else}}
    Your goal is to find 4 study resources like online course platforms, tutorials, etc. For the output, only populate the 'resources' field. The 'articles' field should be an empty array. Use https://picsum.photos/400/225 for image urls.
    {{/if}}
    `,
});

const getStudyResourcesFlow = ai.defineFlow(
    {
        name: 'getStudyResourcesFlow',
        inputSchema: GetStudyResourcesInputSchema,
        outputSchema: GetStudyResourcesOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
