
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
  LogIn,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getStudyResources, type StudyResource } from "@/ai/flows/get-study-resources";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, userProfile, loading, recommendation, logout } = useAuth();
  const router = useRouter();
  const [featuredResource, setFeaturedResource] = useState<StudyResource | null>(null);

  useEffect(() => {
    async function fetchResource() {
        try {
            const resourceData = await getStudyResources({ query: 'any interesting study resource for students', type: 'resource' });
            if (resourceData.resources.length > 0) {
                // Pick a random resource
                const randomIndex = Math.floor(Math.random() * resourceData.resources.length);
                setFeaturedResource(resourceData.resources[randomIndex]);
            }
        } catch (error) {
            console.error("Failed to fetch featured resource:", error);
        }
    }

    fetchResource();
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const hasTakenQuiz = !!recommendation;
  const profileCompletion = user ? (hasTakenQuiz ? 65 : 30) : 0;

  const defaultResource = {
    title: "Resource Spotlight",
    platform: "Disha Portal",
    description: "Discover a new study resource, an upcoming exam, or an interesting career fact to keep you engaged.",
    imageUrl: "https://picsum.photos/seed/dashboard-resource/600/400",
    link: "/resources"
  };

  const resourceToDisplay = featuredResource || defaultResource;
  
  if (loading) {
    return (
        <AppLayout>
            <main className="flex flex-1 items-center justify-center">
                {/* Full page loader can be added here */}
            </main>
        </AppLayout>
    )
  }

  return (
    <AppLayout>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8">
          
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-4">
              {userProfile && (
                <Avatar className="h-16 w-16">
                  <AvatarImage src={"https://picsum.photos/seed/avatar/100/100"} alt={userProfile.name} />
                  <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div>
                <h1 className="text-2xl font-bold font-headline">
                  {userProfile ? `Welcome back, ${userProfile.name}!` : "Welcome to Disha Portal!"}
                </h1>
                <p className="text-muted-foreground">
                  {user ? "Let's continue charting your path to success." : "Your compass to a brighter future."}
                </p>
              </div>
            </div>
            {user ? (
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            ) : (
               <Button onClick={handleLogin}><LogIn className="mr-2 h-4 w-4" /> Login</Button>
            )}
          </div>

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
                    {hasTakenQuiz ? (
                      <>
                        <CardTitle className="text-3xl font-headline mb-2">
                          Your Personalized Report is Ready!
                        </CardTitle>
                        <CardDescription className="text-lg mb-4">
                          We recommend the "{recommendation?.recommendation}" path for you. View the full report for more details.
                        </CardDescription>
                        <Link href="/quiz" passHref>
                          <Button size="lg" variant="secondary">
                            View My Report
                          </Button>
                        </Link>
                      </>
                    ) : user ? (
                      <>
                        <CardTitle className="text-3xl font-headline mb-2">
                          Find Your True Calling
                        </CardTitle>
                        <CardDescription className="text-lg mb-4">
                          Take our comprehensive AI-powered assessment to discover your perfect career path.
                        </CardDescription>
                        <Link href="/quiz" passHref>
                          <Button size="lg">
                            Start Your Assessment
                          </Button>
                        </Link>
                      </>
                    ) : (
                       <>
                        <CardTitle className="text-3xl font-headline mb-2">Discover Your Path</CardTitle>
                        <CardDescription className="text-lg mb-4">
                          Login to take our AI-powered assessment, save your progress, and get personalized recommendations.
                        </CardDescription>
                         <Button size="lg" onClick={handleLogin}><LogIn className="mr-2 h-5 w-5" /> Login to Continue</Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {user && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold font-headline mb-6">Your Journey So Far</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={profileCompletion} className="mb-2" />
                    <p className="text-sm text-muted-foreground">{profileCompletion}% complete</p>
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
          )}
          
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
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{resourceToDisplay.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                  <Image 
                    src={resourceToDisplay.imageUrl} 
                    alt={resourceToDisplay.title} 
                    width={600}
                    height={400}
                    data-ai-hint="books studying"
                    className="rounded-lg object-cover"
                  />
                </div>
                <div className="md:w-2/3">
                  <p className="text-muted-foreground mb-4">{resourceToDisplay.description}</p>
                  <Button asChild>
                    <Link href={'/resources'}>Learn More</Link>
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
