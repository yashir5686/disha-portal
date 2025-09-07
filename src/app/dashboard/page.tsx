
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Compass,
  School,
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  LogIn,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { PersonalizedStreamRecommendationOutput } from "@/ai/flows/personalized-stream-recommendation-from-quiz";

const RECOMMENDATION_STORAGE_KEY = 'disha-portal-recommendation';

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recommendation, setRecommendation] = useState<PersonalizedStreamRecommendationOutput | null>(null);

  useEffect(() => {
    // Check for saved recommendation in local storage
    const savedRecommendation = localStorage.getItem(RECOMMENDATION_STORAGE_KEY);
    if (savedRecommendation) {
      try {
        setRecommendation(JSON.parse(savedRecommendation));
      } catch (e) {
        console.error("Failed to parse recommendation from localStorage", e);
        localStorage.removeItem(RECOMMENDATION_STORAGE_KEY);
      }
    }
  }, [isLoggedIn]);

  const user = {
    name: "Arjun",
    profilePicture: "https://picsum.photos/100/100",
    profileCompletion: isLoggedIn ? 65 : 0,
    journeyProgress: {
      profileComplete: isLoggedIn,
      quizComplete: !!recommendation,
      exploredCareers: isLoggedIn, 
      searchedColleges: false 
    }
  };
  
  const featuredResource = {
    title: "CUET 2024 Preparation Guide",
    description: "Complete guide for Common University Entrance Test with tips, syllabus, and important dates.",
    image: "https://picsum.photos/400/225",
    link: "/resources/cuet-guide"
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setRecommendation(null); // Clear recommendation on logout
  };

  return (
    <AppLayout>
      <main>
        <div className="container mx-auto px-4 py-8">
          
          {/* Header Section */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={isLoggedIn ? user.profilePicture : undefined} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold font-headline">
                  {isLoggedIn ? `Welcome back, ${user.name}!` : "Welcome to Disha Portal!"}
                </h1>
                <p className="text-muted-foreground">
                  {isLoggedIn ? "Let's continue charting your path to success." : "Your AI-powered guide to a bright future."}
                </p>
              </div>
            </div>
            {!isLoggedIn ? (
              <Button onClick={() => setIsLoggedIn(true)}><LogIn className="mr-2"/> Login</Button>
            ) : (
                 <Button variant="outline" onClick={handleLogout}>Logout</Button>
            )}
          </div>
          
          {/* Main Call-to-Action Card */}
          <div className="mb-12">
           {isLoggedIn ? (
               <Card className={`shadow-lg border-2 ${recommendation ? 'border-accent' : 'border-primary'}`}>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="flex-shrink-0">
                      {recommendation ? (
                        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center ring-4 ring-accent/20">
                          <Compass className="w-12 h-12 text-accent" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center ring-4 ring-primary/20">
                          <Lightbulb className="w-12 h-12 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <CardTitle className="text-3xl font-headline mb-2">
                        {recommendation ? "Your Report is Ready!" : "Find Your True Calling"}
                      </CardTitle>
                      <CardDescription className="text-lg mb-4">
                        {recommendation ? (
                          <>
                            Our AI has analyzed your results and recommends the <strong className="text-accent">{recommendation.recommendation}</strong> path for you.
                          </>
                        ) : (
                          "Take our comprehensive AI-powered assessment to discover your perfect career path."
                        )}
                      </CardDescription>
                      <Link href="/quiz">
                        <Button size="lg" variant={recommendation ? "default" : "default"} className={`${recommendation ? 'bg-accent hover:bg-accent/90' : 'bg-primary hover:bg-primary/90'}`}>
                          {recommendation ? "View Full Report" : "Start Your Assessment"}
                          <ArrowRight className="ml-2"/>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
           ) : (
                <Card className="bg-primary/5 border-primary border-dashed">
                    <CardContent className="p-8 text-center">
                        <UserCheck className="mx-auto h-12 w-12 text-primary mb-4"/>
                        <CardTitle className="text-2xl font-headline mb-2">Unlock Your Personalized Dashboard</CardTitle>
                        <CardDescription className="text-lg mb-4 max-w-2xl mx-auto">
                            Log in to take the assessment, save your progress, and get a personalized career roadmap built just for you.
                        </CardDescription>
                        <Button size="lg" onClick={() => setIsLoggedIn(true)}>
                           <LogIn className="mr-2"/> Login to Get Started
                        </Button>
                    </CardContent>
                </Card>
           )}
          </div>
          
          {/* Journey Tracker - only show if logged in */}
          {isLoggedIn && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold font-headline mb-6">Your Journey So Far</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Complete Profile</span>
                      {user.journeyProgress.profileComplete ? <CheckCircle2 className="text-green-500"/> : <Circle className="text-muted-foreground"/>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={user.profileCompletion} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Take the Quiz</span>
                       {user.journeyProgress.quizComplete ? <CheckCircle2 className="text-green-500"/> : <Circle className="text-muted-foreground"/>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{user.journeyProgress.quizComplete ? "Completed! You can view your report." : "Let's find your path."}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Explore Careers</span>
                      {user.journeyProgress.exploredCareers ? <CheckCircle2 className="text-green-500"/> : <Circle className="text-muted-foreground"/>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Discover courses and career maps.</p>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Find Colleges</span>
                      {user.journeyProgress.searchedColleges ? <CheckCircle2 className="text-green-500"/> : <Circle className="text-muted-foreground"/>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Search for colleges near you.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Quick Links Feature Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold font-headline mb-6">Explore Our Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/colleges" className="block"><Card className="h-full hover:border-primary transition-colors"><CardHeader><div className="mb-2"><School className="w-8 h-8 text-primary"/></div><CardTitle>College Explorer</CardTitle><CardDescription>Find government colleges.</CardDescription></CardHeader></Card></Link>
              <Link href="/courses" className="block"><Card className="h-full hover:border-primary transition-colors"><CardHeader><div className="mb-2"><BookOpen className="w-8 h-8 text-primary"/></div><CardTitle>Career & Course Map</CardTitle><CardDescription>See where degrees lead.</CardDescription></CardHeader></Card></Link>
              <Link href="/scholarships" className="block"><Card className="h-full hover:border-primary transition-colors"><CardHeader><div className="mb-2"><Award className="w-8 h-8 text-primary"/></div><CardTitle>Scholarship Finder</CardTitle><CardDescription>Get financial aid information.</CardDescription></CardHeader></Card></Link>
              <Link href="/timeline" className="block"><Card className="h-full hover:border-primary transition-colors"><CardHeader><div className="mb-2"><Calendar className="w-8 h-8 text-primary"/></div><CardTitle>Important Timelines</CardTitle><CardDescription>Track key application dates.</CardDescription></CardHeader></Card></Link>
            </div>
          </div>
          
          {/* Resource Spotlight */}
           <div>
            <h2 className="text-2xl font-bold font-headline mb-6">Resource Spotlight</h2>
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2">
                 <div className="p-6 flex flex-col justify-center">
                   <Badge variant="secondary" className="w-fit mb-2">Featured Guide</Badge>
                   <CardTitle className="text-xl mb-2">{featuredResource.title}</CardTitle>
                   <CardDescription className="mb-4">{featuredResource.description}</CardDescription>
                   <Link href={featuredResource.link}>
                      <Button>Learn More</Button>
                   </Link>
                </div>
                <div className="relative h-64 md:h-full">
                   <Image 
                    src={featuredResource.image} 
                    alt={featuredResource.title} 
                    fill
                    data-ai-hint="exam preparation"
                    className="object-cover"
                  />
                </div>
              </div>
            </Card>
          </div>

        </div>
      </main>
    </AppLayout>
  );
}

    