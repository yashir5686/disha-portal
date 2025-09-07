
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Lightbulb,
  Compass,
  School,
  BookOpen,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { PersonalizedStreamRecommendationOutput } from "@/ai/flows/personalized-stream-recommendation-from-quiz";

const RECOMMENDATION_STORAGE_KEY = 'disha-portal-recommendation';

export default function DashboardPage() {
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
  }, []);

  const hasTakenQuiz = !!recommendation;

  const user = {
    name: "Arjun",
    profilePicture: "https://picsum.photos/100/100",
    profileCompletion: hasTakenQuiz ? 65 : 30,
  };

  const featuredResource = {
    title: "Resource Spotlight",
    description: "Discover a new study resource, an upcoming exam, or an interesting career fact to keep you engaged.",
    image: "https://picsum.photos/600/400",
    link: "#"
  };

  return (
    <AppLayout>
      <main>
        <div className="container mx-auto px-4 py-8">
          
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold font-headline">Welcome back, {user.name}!</h1>
                <p className="text-muted-foreground">Let's continue charting your path to success.</p>
              </div>
            </div>
          </div>

          {/* Main Call-to-Action Card */}
          <div className="mb-12">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                  <div className="flex-shrink-0">
                    {hasTakenQuiz ? (
                      <Compass className="w-20 h-20 text-primary" />
                    ) : (
                      <Lightbulb className="w-20 h-20 text-primary" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <CardTitle className="text-3xl font-headline mb-2">
                      {hasTakenQuiz ? "Your Personalized Report is Ready!" : "Find Your True Calling"}
                    </CardTitle>
                    <CardDescription className="text-lg mb-4">
                      {hasTakenQuiz ? "Revisit your detailed career recommendations, college suggestions, and more." : "Take our comprehensive AI-powered assessment to discover your perfect career path."}
                    </CardDescription>
                    <Link href="/quiz" passHref>
                      <Button size="lg" variant={hasTakenQuiz ? "secondary" : "default"}>
                        {hasTakenQuiz ? "View My Report" : "Start Your Assessment"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* "Your Journey" Progress Tracker */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold font-headline mb-6">Your Journey So Far</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Complete Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={user.profileCompletion} className="mb-2" />
                  <p className="text-sm text-muted-foreground">{user.profileCompletion}% complete</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Take the Quiz</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  {hasTakenQuiz ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className={hasTakenQuiz ? "text-green-600" : "text-red-600"}>
                    {hasTakenQuiz ? "Completed" : "Incomplete"}
                  </span>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Explore Careers</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild>
                    <Link href="/courses">Explore</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Find Colleges</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" asChild>
                    <Link href="/colleges">Explore</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Quick Links / Feature Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold font-headline mb-6">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/colleges" className="block">
                <Card className="h-full hover:border-primary transition-colors">
                  <CardHeader>
                    <School className="w-8 h-8 text-primary mb-2"/>
                    <CardTitle>College Explorer</CardTitle>
                    <CardDescription>Find government colleges.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/courses" className="block">
                <Card className="h-full hover:border-primary transition-colors">
                  <CardHeader>
                    <BookOpen className="w-8 h-8 text-primary mb-2"/>
                    <CardTitle>Career & Course Map</CardTitle>
                    <CardDescription>See where degrees lead.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/scholarships" className="block">
                <Card className="h-full hover:border-primary transition-colors">
                  <CardHeader>
                    <Award className="w-8 h-8 text-primary mb-2"/>
                    <CardTitle>Scholarship Finder</CardTitle>
                    <CardDescription>Get financial aid info.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/timeline" className="block">
                <Card className="h-full hover:border-primary transition-colors">
                  <CardHeader>
                    <Calendar className="w-8 h-8 text-primary mb-2"/>
                    <CardTitle>Important Timelines</CardTitle>
                    <CardDescription>Track key application dates.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
          
          {/* "Did You Know?" or "Resource Spotlight" Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{featuredResource.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <Image 
                    src={featuredResource.image} 
                    alt={featuredResource.title} 
                    width={600}
                    height={400}
                    data-ai-hint="books studying"
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="md:w-2/3">
                  <p className="text-muted-foreground mb-4">{featuredResource.description}</p>
                  <Button asChild>
                    <Link href={featuredResource.link}>Learn More</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
