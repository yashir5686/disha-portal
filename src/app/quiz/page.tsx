
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  getPersonalizedStreamRecommendation,
  type PersonalizedStreamRecommendationOutput,
  type Grade,
} from "@/ai/flows/personalized-stream-recommendation-from-quiz";
import { getQuizQuestion, type QuizQuestion } from "@/ai/flows/get-quiz-questions";
import { getExamDetails, type ExamDetails } from "@/ai/flows/get-exam-details";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2, Lightbulb, Sparkles, BrainCircuit, RefreshCw, Briefcase, GraduationCap, Building, Search,ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const TOTAL_QUESTIONS = 5;
const RECOMMENDATION_STORAGE_KEY = 'disha-portal-recommendation';

type QuizStage = 'start' | 'quiz' | 'profile' | 'recommendation';

type QuizState = {
  questions: QuizQuestion[];
  answers: { question: string; answer: string }[];
  currentStep: number;
  profileInfo: string;
  stage: QuizStage;
  grade?: Grade;
  stream?: string;
};

type ExamDetailsState = {
  [examName: string]: {
    loading: boolean;
    data: ExamDetails | null;
    error: string | null;
  };
};

function RecommendationResult({ recommendation, onRestart }: { recommendation: PersonalizedStreamRecommendationOutput; onRestart: () => void; }) {
  const [examDetails, setExamDetails] = useState<ExamDetailsState>({});

  const fetchExamDetails = async (examName: string) => {
    if (examDetails[examName]?.data || examDetails[examName]?.loading) return;

    setExamDetails(prev => ({
      ...prev,
      [examName]: { loading: true, data: null, error: null }
    }));

    try {
      const details = await getExamDetails({ examName });
      setExamDetails(prev => ({
        ...prev,
        [examName]: { loading: false, data: details, error: null }
      }));
    } catch (err) {
      console.error(`Failed to fetch details for exam: ${examName}`, err);
      setExamDetails(prev => ({
        ...prev,
        [examName]: { loading: false, data: null, error: 'Could not load exam details.' }
      }));
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="text-center">
        <Sparkles className="mx-auto h-12 w-12 text-accent" />
        <CardTitle className="font-headline text-3xl mt-4">Your Personalized Recommendation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
          <p className="text-sm text-primary font-semibold">{recommendation.recommendationTitle}</p>
          <p className="text-2xl font-bold text-primary">{recommendation.recommendation}</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-xl flex items-center gap-2"><Lightbulb className="w-6 h-6" /> Reasoning</h3>
          <p className="text-muted-foreground whitespace-pre-line">{recommendation.reasoning}</p>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-xl flex items-center gap-2"><BrainCircuit className="w-6 h-6" /> Your Interest Analysis</h3>
          <div className="w-full h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recommendation.interestAnalysis} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="area" type="category" width={80} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                  <Bar dataKey="score" fill="hsl(var(--primary))" barSize={30} />
                </BarChart>
              </ResponsiveContainer>
          </div>
        </div>

        <Accordion type="multiple" className="w-full space-y-4">
          <AccordionItem value="degrees" className="border rounded-lg">
            <AccordionTrigger className="px-6 text-xl font-semibold"><GraduationCap className="mr-2"/>Recommended Degrees</AccordionTrigger>
            <AccordionContent className="px-6 pt-2">
              {recommendation.degreeOptions.map((degree, index) => (
                <div key={index} className="py-4 border-b last:border-b-0">
                  <h4 className="font-bold text-lg">{degree.name}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{degree.description}</p>
                  <Accordion type="multiple" className="w-full space-y-2">
                    <AccordionItem value={`career-${index}`} className="border rounded-md">
                        <AccordionTrigger className="px-4 text-base font-medium">Career Options</AccordionTrigger>
                         <AccordionContent className="px-4 pt-2 grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h5 className="font-semibold mb-2">Private Sector Jobs</h5>
                                <ul className="list-disc list-inside text-muted-foreground">
                                    {degree.careerOptions.privateJobs.map(j => <li key={j}>{j}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h5 className="font-semibold mb-2">Government Jobs/Exams</h5>
                                <ul className="list-disc list-inside text-muted-foreground">
                                    {degree.careerOptions.govtJobs.map(j => <li key={j}>{j}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h5 className="font-semibold mb-2">Higher Education</h5>
                                <ul className="list-disc list-inside text-muted-foreground">
                                    {degree.careerOptions.higherEducation.map(j => <li key={j}>{j}</li>)}
                                </ul>
                            </div>
                             <div>
                                <h5 className="font-semibold mb-2">Entrepreneurship</h5>
                                <ul className="list-disc list-inside text-muted-foreground">
                                    {degree.careerOptions.entrepreneurship.map(j => <li key={j}>{j}</li>)}
                                </ul>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="colleges" className="border rounded-lg">
            <AccordionTrigger className="px-6 text-xl font-semibold"><Building className="mr-2"/>College Suggestions</AccordionTrigger>
            <AccordionContent className="px-6 pt-2">
                {recommendation.collegeSuggestions.map((college, index) => (
                     <div key={index} className="py-4 border-b last:border-b-0">
                        <h4 className="font-bold text-lg">{college.name}</h4>
                        <p className="text-muted-foreground text-sm mb-2">{college.location}</p>
                        <Accordion type="single" collapsible>
                            <AccordionItem value={`exam-${index}`} className="border-0">
                                 <AccordionTrigger 
                                    onClick={() => fetchExamDetails(college.entranceExam)}
                                    className="p-0 hover:no-underline"
                                 >
                                    <Badge variant="secondary" className="cursor-pointer">
                                        Exam: {college.entranceExam} <ChevronRight className="w-4 h-4 ml-1"/>
                                    </Badge>
                                 </AccordionTrigger>
                                 <AccordionContent className="pt-4">
                                    {examDetails[college.entranceExam]?.loading && <Loader2 className="animate-spin" />}
                                    {examDetails[college.entranceExam]?.error && <p className="text-destructive text-sm">{examDetails[college.entranceExam]?.error}</p>}
                                    {examDetails[college.entranceExam]?.data && (
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <h5 className="font-semibold">Syllabus</h5>
                                                <p className="text-muted-foreground">{examDetails[college.entranceExam]?.data?.syllabus}</p>
                                            </div>
                                            <div>
                                                <h5 className="font-semibold">Cut-off Criteria</h5>
                                                <p className="text-muted-foreground">{examDetails[college.entranceExam]?.data?.cutoff}</p>
                                            </div>
                                            <div>
                                                <h5 className="font-semibold">Admission Process</h5>
                                                <p className="text-muted-foreground">{examDetails[college.entranceExam]?.data?.admissionProcess}</p>
                                            </div>
                                        </div>
                                    )}
                                 </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                     </div>
                ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="alternatives" className="border rounded-lg">
            <AccordionTrigger className="px-6 text-xl font-semibold"><Search className="mr-2"/>Alternative Paths</AccordionTrigger>
            <AccordionContent className="px-6 pt-2">
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                {recommendation.alternativeRecommendations.map((alt, index) => (
                  <li key={index}>{alt}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button onClick={onRestart} className="w-full">Take Quiz Again</Button>
        <p className="text-xs text-muted-foreground text-center">This is an AI-generated suggestion. Consider it as one of many inputs for your final decision.</p>
      </CardFooter>
    </Card>
  )
}

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>({
    questions: [],
    answers: [],
    currentStep: 0,
    profileInfo: "",
    stage: 'start',
  });
  const [loading, setLoading] = useState(false);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState<PersonalizedStreamRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      const savedRecommendation = localStorage.getItem(RECOMMENDATION_STORAGE_KEY);
      if (savedRecommendation) {
        setRecommendation(JSON.parse(savedRecommendation));
        setQuizState(prevState => ({ ...prevState, stage: 'recommendation' }));
      }
    } catch (e) {
      console.error("Could not parse saved recommendation", e);
      localStorage.removeItem(RECOMMENDATION_STORAGE_KEY);
    }
  }, []);

  const form = useForm();
  
  const currentQuestion = quizState.questions[quizState.currentStep];

  async function fetchFirstQuestion() {
    if (!quizState.grade) return;
    setLoading(true);
    setError(null);
    try {
      const firstQuestion = await getQuizQuestion({ 
        history: [],
        grade: quizState.grade,
        stream: quizState.stream,
       });
      setQuizState(prevState => ({ ...prevState, questions: [firstQuestion], stage: 'quiz' }));
    } catch (err) {
      console.error("Failed to fetch first question:", err);
      setError("Could not start the quiz. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchNextQuestion() {
    setLoading(true);
    setError(null);
    try {
      const nextQuestion = await getQuizQuestion({
        history: quizState.answers,
        grade: quizState.grade!,
        stream: quizState.stream,
      });
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

  const processAndNext = async (data: any) => {
    const rawAnswer = data[currentQuestion.id];
    let answerValue = '';

    if (currentQuestion.type === 'single-choice') {
        const selectedOption = currentQuestion.options.find(o => o.id === rawAnswer);
        answerValue = selectedOption?.value || '';
    } else if (currentQuestion.type === 'multiple-choice') {
        const selectedOptions = currentQuestion.options
            .filter(o => rawAnswer.includes(o.id))
            .map(o => o.value);
        answerValue = selectedOptions.join(', ');
    }
    
    if (!answerValue) return;
    
    const newAnswers = [...quizState.answers, { question: currentQuestion.question, answer: answerValue }];
    
    setQuizState(prevState => ({
      ...prevState,
      answers: newAnswers,
    }));
    
    if (quizState.currentStep >= TOTAL_QUESTIONS - 1) {
       setQuizState(prevState => ({ ...prevState, currentStep: prevState.currentStep + 1, stage: 'profile' }));
    } else {
      await fetchNextQuestion();
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
        grade: quizState.grade!,
        stream: quizState.stream,
      });
      setRecommendation(result);
      try {
         localStorage.setItem(RECOMMENDATION_STORAGE_KEY, JSON.stringify(result));
      } catch (e) {
          console.error("Could not save recommendation to local storage", e);
      }
      setQuizState(prevState => ({ ...prevState, stage: 'recommendation' }));
    } catch (error) {
      console.error("Error getting recommendation:", error);
      setError("We couldn't generate your recommendation. Please try again.");
    } finally {
      setLoadingRecommendation(false);
    }
  };
  
  const handleStartQuiz = (data: any) => {
      setQuizState(prevState => ({
          ...prevState,
          grade: data.grade,
          stream: data.stream,
      }));
      fetchFirstQuestion();
  }

  const restartQuiz = () => {
    localStorage.removeItem(RECOMMENDATION_STORAGE_KEY);
    setQuizState({
      questions: [],
      answers: [],
      currentStep: 0,
      profileInfo: "",
      stage: 'start',
      grade: undefined,
      stream: undefined,
    });
    setRecommendation(null);
    setError(null);
    setLoading(false);
    form.reset();
  };

  const retryFetch = () => {
    setError(null);
    if (quizState.questions.length === 0) {
      fetchFirstQuestion();
    } else {
      fetchNextQuestion();
    }
  };
  
  const prevStep = () => {
     if (quizState.stage === 'profile') {
        setQuizState(prevState => ({
            ...prevState,
            stage: 'quiz',
            currentStep: TOTAL_QUESTIONS - 1
        }))
        return;
     }

     if (quizState.currentStep > 0) {
        form.reset();
        const prevAnswer = form.getValues(quizState.questions[quizState.currentStep - 1].id)
        setQuizState(prevState => ({
          ...prevState,
          answers: prevState.answers.slice(0, -1),
          currentStep: prevState.currentStep - 1,
        }));
        form.setValue(quizState.questions[quizState.currentStep - 1].id, prevAnswer)
     } else if (quizState.stage === 'quiz' && quizState.currentStep === 0) {
        setQuizState(prevState => ({...prevState, stage: 'start', questions: [], answers: []}))
     }
  }

  const progressValue = (quizState.currentStep / TOTAL_QUESTIONS) * 100;
  
  const renderContent = () => {
    if (loadingRecommendation) {
        return (
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
        );
    }
    
    if (quizState.stage === 'recommendation' && recommendation) {
       return <RecommendationResult recommendation={recommendation} onRestart={restartQuiz} />;
    }

    return (
        <Card className="w-full max-w-2xl">
           <FormProvider {...form}>
           {quizState.stage === 'start' && (
              <form onSubmit={form.handleSubmit(handleStartQuiz)}>
                 <CardHeader>
                    <CardTitle className="font-headline text-2xl">First, a few details...</CardTitle>
                    <CardDescription>This will help us tailor the quiz for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="grade"
                        rules={{ required: "Please select your grade." }}
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel className="font-semibold text-base">Which grade are you in or have you completed?</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        form.setValue('stream', undefined); // Reset stream when grade changes
                                    }}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="10th" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Completed 10th Grade</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                        <RadioGroupItem value="12th" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Completed 12th Grade</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {form.watch('grade') === '12th' && (
                         <FormField
                            control={form.control}
                            name="stream"
                            rules={{ required: 'Please select your stream.' }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-base">Which stream did you study in 12th grade?</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                        <SelectValue placeholder="Select your stream" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Science">Science</SelectItem>
                                        <SelectItem value="Commerce">Commerce</SelectItem>
                                        <SelectItem value="Arts">Arts/Humanities</SelectItem>
                                        <SelectItem value="Vocational">Vocational</SelectItem>
                                    </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                         />
                    )}
                </CardContent>
                 <CardFooter>
                    <Button type="submit" disabled={loading}>
                         {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Start Quiz
                    </Button>
                </CardFooter>
              </form>
           )}

            {(quizState.stage === 'quiz' || quizState.stage === 'profile') && (
            <>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Stream Recommendation Quiz</CardTitle>
                <CardDescription>Answer a few questions to find the stream that's right for you.</CardDescription>
                {quizState.stage === 'quiz' && (
                    <>
                    <Progress value={progressValue} className="mt-4" />
                    <p className="text-sm text-muted-foreground text-center pt-2">Question {quizState.currentStep + 1} of {TOTAL_QUESTIONS}</p>
                    </>
                )}
            </CardHeader>
            <form onSubmit={form.handleSubmit(quizState.stage === 'profile' ? getRecommendation : processAndNext)}>
              <CardContent className="min-h-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                   <div className="text-center text-destructive flex flex-col items-center justify-center h-full gap-4">
                      <p>{error}</p>
                      <Button type="button" onClick={retryFetch} variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry
                      </Button>
                    </div>
                ) : quizState.stage === 'quiz' && currentQuestion ? (
                  <FormField
                    control={form.control}
                    name={currentQuestion.id}
                    rules={{ 
                      required: "Please select an option.",
                      validate: (value) => {
                        if (currentQuestion.type === 'multiple-choice' && (!Array.isArray(value) || value.length === 0)) {
                          return "Please select at least one option.";
                        }
                        return true;
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl font-semibold text-center block">{currentQuestion.question}</FormLabel>
                        <FormControl>
                          {currentQuestion.type === 'single-choice' ? (
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
                             <div className="flex flex-col space-y-2 pt-4">
                                {currentQuestion.options.map(option => (
                                  <FormField
                                    key={option.id}
                                    control={form.control}
                                    name={currentQuestion.id}
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={option.id}
                                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(option.id)}
                                              onCheckedChange={(checked) => {
                                                const currentValue = field.value || [];
                                                if (checked) {
                                                  field.onChange([...currentValue, option.id]);
                                                } else {
                                                  field.onChange(
                                                    currentValue.filter(
                                                      (value: string) => value !== option.id
                                                    )
                                                  );
                                                }
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal text-base">
                                            {option.value}
                                          </FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
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
                    rules={{ required: "Please tell us a bit more about yourself.", minLength: { value: 30, message: "Please tell us a bit more about yourself (at least 30 characters)." } }}
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
                <Button type="button" variant="outline" onClick={prevStep} disabled={loading}>
                  Previous
                </Button>
                <Button type="submit" disabled={loading || !!error}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {quizState.stage === 'profile' ? 'Get Recommendation' : 'Next'}
                </Button>
              </CardFooter>
            </form>
            </>
            )}
          </FormProvider>
        </Card>
    );
  }

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 justify-center items-center">
        {renderContent()}
      </main>
    </AppLayout>
  );
}

    