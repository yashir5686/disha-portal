"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getPersonalizedStreamRecommendation,
  type PersonalizedStreamRecommendationOutput,
} from "@/ai/flows/personalized-stream-recommendation-from-quiz";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, Lightbulb, Sparkles, BrainCircuit } from "lucide-react";

const quizQuestions = [
  {
    id: "q1",
    question: "Which activity sounds most interesting to you?",
    options: [
      { value: "4", label: "Building or fixing things (like computers, bikes)" }, // Realistic
      { value: "3", label: "Solving complex puzzles or math problems" }, // Investigative
      { value: "1", label: "Creating art, music, or writing stories" }, // Artistic
      { value: "2", label: "Leading a team or organizing an event" }, // Enterprising
    ],
  },
  {
    id: "q2",
    question: "When faced with a problem, you prefer to:",
    options: [
      { value: "3", label: "Analyze data and research to find a logical solution" }, // Investigative
      { value: "1", label: "Brainstorm creative and unconventional ideas" }, // Artistic
      { value: "4", label: "Take practical, hands-on steps to solve it" }, // Realistic
      { value: "2", label: "Persuade and negotiate with others to reach a consensus" }, // Enterprising
    ],
  },
  {
    id: "q3",
    question: "Which subjects do you enjoy most in school?",
    options: [
      { value: "1", label: "Languages, History, or Social Studies" }, // Artistic/Social
      { value: "3", label: "Physics, Chemistry, or Biology" }, // Investigative
      { value: "2", label: "Business Studies, Economics, or Accounting" }, // Conventional/Enterprising
      { value: "4", label: "Computer Science, Woodwork, or a technical subject" }, // Realistic
    ],
  },
   {
    id: "q4",
    question: "Your ideal work environment would be:",
    options: [
      { value: "4", label: "A workshop, a lab, or outdoors" }, // Realistic
      { value: "1", label: "A studio, a library, or a theater" }, // Artistic
      { value: "2", label: "An office, leading projects and making decisions" }, // Enterprising
      { value: "3", label: "A research institution or a university" }, // Investigative
    ],
  },
];

const totalSteps = quizQuestions.length + 1; // +1 for profile info

const formSchema = z.object({
  ...quizQuestions.reduce((acc, q) => {
    acc[q.id] = z.string({ required_error: "Please select an option." });
    return acc;
  }, {} as Record<string, z.ZodString>),
  profileInformation: z.string().min(30, {
    message: "Please tell us a bit more about yourself (at least 30 characters).",
  }),
});

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<PersonalizedStreamRecommendationOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profileInformation: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    setRecommendation(null);
    try {
      const quizResults = Object.fromEntries(
        Object.entries(data)
          .filter(([key]) => key.startsWith('q'))
          .map(([key, value]) => [key, parseInt(value, 10)])
      );
      
      const result = await getPersonalizedStreamRecommendation({
        quizResults,
        profileInformation: data.profileInformation,
      });
      setRecommendation(result);
    } catch (error) {
      console.error("Error getting recommendation:", error);
      // Handle error display to user
    } finally {
      setLoading(false);
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = step < quizQuestions.length ? [quizQuestions[step].id] : ['profileInformation'];
    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      if (step < totalSteps - 1) {
        setStep(s => s + 1);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const prevStep = () => setStep(s => s - 1);
  const restartQuiz = () => {
    setStep(0);
    setRecommendation(null);
    form.reset();
  }

  const progressValue = (step / (totalSteps-1)) * 100;

  if (loading) {
    return (
      <AppLayout>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center">
            <Card className="w-full max-w-lg text-center">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
                        <BrainCircuit className="w-8 h-8 text-primary"/>
                        Analyzing Your Results
                    </CardTitle>
                    <CardDescription>Our AI is crafting your personalized recommendation. Please wait a moment.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">This shouldn't take long...</p>
                </CardContent>
            </Card>
        </main>
      </AppLayout>
    );
  }

  if (recommendation) {
    return (
      <AppLayout>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <Sparkles className="mx-auto h-12 w-12 text-accent" />
              <CardTitle className="font-headline text-3xl mt-4">Your Personalized Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
                    <p className="text-sm text-primary font-semibold">Recommended Stream</p>
                    <p className="text-2xl font-bold text-primary">{recommendation.streamRecommendation}</p>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg flex items-center gap-2"><Lightbulb className="w-5 h-5"/> Reasoning</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{recommendation.reasoning}</p>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button onClick={restartQuiz} className="w-full">Take Quiz Again</Button>
              <p className="text-xs text-muted-foreground">This is an AI-generated suggestion. Consider it as one of many inputs for your final decision.</p>
            </CardFooter>
          </Card>
        </main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 justify-center items-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Stream Recommendation Quiz</CardTitle>
            <CardDescription>Answer a few questions to find the stream that's right for you.</CardDescription>
            <Progress value={progressValue} className="mt-4" />
          </CardHeader>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CardContent>
                {step < quizQuestions.length && (
                  <FormField
                    control={form.control}
                    name={quizQuestions[step].id}
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-lg font-semibold">{quizQuestions[step].question}</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                          >
                            {quizQuestions[step].options.map(option => (
                              <FormItem key={option.value} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 has-[[data-state=checked]]:border-primary">
                                <FormControl>
                                  <RadioGroupItem value={option.value} />
                                </FormControl>
                                <FormLabel className="font-normal">{option.label}</FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {step === quizQuestions.length && (
                  <FormField
                    control={form.control}
                    name="profileInformation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">Tell us about yourself</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your interests, academic strengths, weaknesses, and any career goals you have in mind. The more details, the better the recommendation!"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep} disabled={step === 0}>
                  Previous
                </Button>
                <Button type="button" onClick={nextStep}>
                  {step === totalSteps - 1 ? 'Get Recommendation' : 'Next'}
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </Card>
      </main>
    </AppLayout>
  );
}
