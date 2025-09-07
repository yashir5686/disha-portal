'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-stream-recommendation-from-quiz.ts';
import '@/ai/flows/get-colleges';
import '@/ai/flows/get-courses-and-careers';
import '@/ai/flows/get-scholarships';
import '@/ai/flows/get-study-resources';
import '@/ai/flows/get-timeline';
import '@/ai/flows/get-quiz-questions';
