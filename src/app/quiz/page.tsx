"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  getPersonalizedStreamRecommendation,
  type PersonalizedStreamRecommendationOutput,
} from "@/ai/flows/personalized-stream-recommendation-from-quiz";
import { getQuizQuestion, type QuizQuestion } from "@/ai/flows/get-quiz-questions";

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
import Image from "next/image";
import { cn } from "@/lib/utils";

const TOTAL_QUESTIONS = 5;

type QuizState = {
  questions: QuizQuestion[];
  answers: { question: string; answer: string }[];
  currentStep: number;
  profileInfo: string;
};

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    answers: [],
    currentStep: 0,
    profileInfo: "",
  });
  const [loading, setLoading] = useState(true);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState<PersonalizedStreamRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm();

  // Fetch initial question
  useEffect(() => {
    async function fetchFirstQuestion() {
      setLoading(true);
      setError(null);
      try {
        const firstQuestion = await getQuizQuestion({ history: [] });
        setQuizState(prevState => ({ ...prevState, questions: [firstQuestion] }));
      } catch (err) {
        console.error("Failed to fetch first question:", err);
        setError("Could not start the quiz. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchFirstQuestion();
  }, []);

  const currentQuestion = quizState.questions[quizState.currentStep];

  const processAndNext = async (data: any) => {
    const answerId = data[currentQuestion.id];
    const selectedOption = currentQuestion.options.find(o => o.id === answerId);
    if (!selectedOption) return;

    const answerValue = currentQuestion.type === 'text' ? (selectedOption as any).value : selectedOption.alt;
    
    const newAnswers = [...quizState.answers, { question: currentQuestion.question, answer: answerValue }];
    
    setQuizState(prevState => ({
      ...prevState,
      answers: newAnswers,
    }));
    
    // If it's the last question, go to profile page. Otherwise, fetch next question.
    if (quizState.currentStep >= TOTAL_QUESTIONS - 1) {
       setQuizState(prevState => ({ ...prevState, currentStep: prevState.currentStep + 1 }));
    } else {
      setLoading(true);
      setError(null);
      try {
        const nextQuestion = await getQuizQuestion({ history: newAnswers });
        form.reset();
        setQuizState(prevState => ({
          ...prevState,
          questions: [...prevState.questions, nextQuestion],
          currentStep: prevState.currentStep + 1
        }));
      } catch (err) {
        console.error("Failed to fetch next question:", err);
        setError("Could not load the next question. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const getRecommendation = async (data: any) => {
    setLoadingRecommendation(true);
    setError(null);
    setRecommendation(null);
    try {
      const result = await getPersonalizedStreamRecommendation({
        quizResults: quizState.answers,
        profileInformation: data.profileInformation,
      });
      setRecommendation(result);
    } catch (error) {
      console.error("Error getting recommendation:", error);
      setError("We couldn't generate your recommendation. Please try again.");
    } finally {
      setLoadingRecommendation(false);
    }
  };

  const restartQuiz = () => {
    setQuizState({
      questions: [],
      answers: [],
      currentStep: 0,
      profileInfo: "",
    });
    setRecommendation(null);
    setError(null);
    setLoading(true);
    // Refetch the first question
    async function fetchFirstQuestion() {
      try {
        const firstQuestion = await getQuizQuestion({ history: [] });
        setQuizState(prevState => ({ ...prevState, questions: [firstQuestion] }));
      } catch (err) {
        console.error("Failed to fetch first question:", err);
        setError("Could not restart the quiz. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchFirstQuestion();
    form.reset();
  };
  
  const prevStep = () => {
     if (quizState.currentStep > 0) {
        form.reset();
        const prevAnswer = form.getValues(quizState.questions[quizState.currentStep - 1].id)
        setQuizState(prevState => ({
          ...prevState,
          answers: prevState.answers.slice(0, -1),
          currentStep: prevState.currentStep - 1,
        }));
        form.setValue(quizState.questions[quizState.currentStep - 1].id, prevAnswer)
     }
  }

  const progressValue = (quizState.currentStep / TOTAL_QUESTIONS) * 100;

  if (loadingRecommendation) {
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
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Stream Recommendation Quiz</CardTitle>
            <CardDescription>Answer a few questions to find the stream that's right for you.</CardDescription>
            <Progress value={progressValue} className="mt-4" />
             <p className="text-sm text-muted-foreground text-center pt-2">Question {quizState.currentStep + 1} of {TOTAL_QUESTIONS}</p>
          </CardHeader>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(currentQuestion && quizState.currentStep >= TOTAL_QUESTIONS ? getRecommendation : processAndNext)}>
              <CardContent className="min-h-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                   <div className="text-destructive text-center">{error}</div>
                ) : currentQuestion && quizState.currentStep < TOTAL_QUESTIONS ? (
                  <FormField
                    control={form.control}
                    name={currentQuestion.id}
                    rules={{ required: "Please select an option." }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl font-semibold text-center block">{currentQuestion.question}</FormLabel>
                        <FormControl>
                          {currentQuestion.type === 'text' ? (
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2 pt-4"
                            >
                              {currentQuestion.options.map(option => (
                                <FormItem key={option.id} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                                  <FormControl>
                                    <RadioGroupItem value={option.id} />
                                  </FormControl>
                                  <FormLabel className="font-normal text-base">{option.value}</FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          ) : (
                             <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
                            >
                              {currentQuestion.options.map(option => (
                                <FormItem key={option.id} className="space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={option.id} className="sr-only" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                      <div className={cn("rounded-lg border-2 p-2 cursor-pointer", field.value === option.id ? "border-primary" : "border-transparent")}>
                                        <div className="relative aspect-square w-full overflow-hidden rounded-md">
                                            <Image src={option.imageUrl} alt={option.alt} fill className="object-cover" />
                                        </div>
                                        <p className="text-center text-sm mt-2">{option.alt}</p>
                                      </div>
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </RadioGroup>
                          )}
                        </FormControl>
                        <FormMessage className="text-center" />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="profileInformation"
                    rules={{ minLength: { value: 30, message: "Please tell us a bit more about yourself (at least 30 characters)." } }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl font-semibold text-center block">Almost there! Tell us about yourself.</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your interests, academic strengths, weaknesses, and any career goals you have in mind. The more details, the better the recommendation!"
                            className="min-h-[150px] mt-4 text-base"
                            {...field}
                          />
                        </FormControl>
                         <FormDescription className="text-center pt-2">
                           This helps our AI provide a truly personalized recommendation.
                        </FormDescription>
                        <FormMessage className="text-center" />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={prevStep} disabled={quizState.currentStep === 0}>
                  Previous
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {quizState.currentStep >= TOTAL_QUESTIONS ? 'Get Recommendation' : 'Next'}
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </Card>
      </main>
    </AppLayout>
  );
}
