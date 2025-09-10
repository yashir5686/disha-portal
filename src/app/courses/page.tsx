
'use client';

import AppLayout from "@/components/layout/AppLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GraduationCap, Info, BookOpen, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";


export default function CoursesPage() {
  const { recommendation, loading } = useAuth();

  const recommendedDegrees = recommendation?.degreeOptions || [];
  const recommendedCourses = recommendation?.recommendedCourses || [];

  const renderLoading = () => (
    <div className="space-y-8">
        <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-6 w-2/3 mb-6" />
            <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
        </div>
         <div>
            <Skeleton className="h-8 w-1/3 mb-4" />
            <Skeleton className="h-6 w-2/3 mb-6" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    </div>
  );

  const renderNoRecommendation = () => (
     <Card className="text-center py-12">
        <CardContent className="flex flex-col items-center gap-4">
            <Info className="w-10 h-10 text-muted-foreground"/>
            <CardTitle>Get Your Personalized Course Recommendations</CardTitle>
            <CardDescription>Take our AI-powered quiz to unlock degree and course suggestions tailored just for you.</CardDescription>
            <Button asChild>
                <Link href="/quiz">Take the Quiz</Link>
            </Button>
        </CardContent>
    </Card>
  );

  const renderContent = () => (
    <div className="space-y-12">
        {/* Recommended Degrees Section */}
        {recommendedDegrees.length > 0 && (
            <div>
                <h2 className="font-headline text-xl font-semibold mb-2 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    Your Recommended Degree Paths
                </h2>
                <p className="text-muted-foreground mb-6">
                    Based on your quiz results, here are some degree paths that align with your interests and strengths.
                </p>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                    {recommendedDegrees.map((degree, index) => (
                        <AccordionItem key={degree.name} value={`item-${index}`} className="border-b-0 mb-4 bg-card rounded-lg border shadow-sm">
                            <AccordionTrigger className="text-lg font-semibold hover:no-underline p-6">
                                {degree.name}
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 px-6 text-sm space-y-4">
                                <p className="text-muted-foreground">{degree.description}</p>
                                
                                <Accordion type="multiple" className="w-full space-y-2">
                                    <AccordionItem value={`career-options-${index}`} className="border rounded-md">
                                        <AccordionTrigger className="px-4 py-3 text-base font-medium">Career Options</AccordionTrigger>
                                        <AccordionContent className="px-4 pt-2 grid md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                                            <div>
                                                <h5 className="font-semibold mb-2">Private Sector Jobs</h5>
                                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                                    {degree.careerOptions.privateJobs.map(j => <li key={j}>{j}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="font-semibold mb-2">Government Jobs/Exams</h5>
                                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                                    {degree.careerOptions.govtJobs.map(j => <li key={j}>{j}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="font-semibold mb-2">Higher Education</h5>
                                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                                    {degree.careerOptions.higherEducation.map(j => <li key={j}>{j}</li>)}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="font-semibold mb-2">Entrepreneurship</h5>
                                                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                                    {degree.careerOptions.entrepreneurship.map(j => <li key={j}>{j}</li>)}
                                                </ul>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        )}

        {/* Recommended Online Courses Section */}
        {recommendedCourses.length > 0 && (
             <div>
                <h2 className="font-headline text-xl font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Recommended Online Courses
                </h2>
                <p className="text-muted-foreground mb-6">
                    Get a head start in your chosen field with these online courses from reputable platforms.
                </p>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {recommendedCourses.map((course, index) => (
                        <Card key={index} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{course.title}</CardTitle>
                                <CardDescription>Platform: {course.platform}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <Badge variant={course.price.toLowerCase() === 'free' ? 'default' : 'secondary'}>{course.price}</Badge>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                <a href={course.link} target="_blank" rel="noopener noreferrer">
                                    Go to Course <ArrowUpRight className="ml-2 h-4 w-4" />
                                </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
             </div>
        )}
    </div>
  );

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-headline text-lg font-semibold md:text-2xl">Your Courses & Careers</h1>
        </div>
        
        {loading 
            ? renderLoading() 
            : recommendation 
                ? renderContent()
                : renderNoRecommendation()
        }

      </main>
    </AppLayout>
  );
}
