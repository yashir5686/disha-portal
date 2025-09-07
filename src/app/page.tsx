import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Bot, GraduationCap, Lightbulb, Map, School, Search, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/icons";

export default function Home() {
  return (
    <AppLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-4">
                     <div className="inline-block rounded-lg bg-primary/10 text-primary px-3 py-1 text-sm font-semibold">
                      AI-Powered Career Guidance
                    </div>
                    <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                      Your Compass to a Brighter Future
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Navigate the complexities of college and career choices with personalized guidance. Find your <span className="font-semibold text-primary">disha</span> (direction) and unlock your true potential after 10th & 12th grade.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button asChild size="lg">
                      <Link href="/quiz">
                        <Lightbulb className="mr-2 h-5 w-5" />
                        Start Free Assessment
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg">
                      <Link href="/courses">
                        Explore Careers <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <Image
                  src="https://picsum.photos/600/600"
                  width="600"
                  height="600"
                  alt="A student looking towards a bright future, guided by a compass."
                  data-ai-hint="student future direction"
                  className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
                />
              </div>
            </div>
          </section>

          {/* How it works Section */}
           <section className="w-full py-12 md:py-24 lg:py-32">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">How It Works</div>
                        <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Your Journey Starts Here</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Follow three simple steps to find the perfect career path for you.
                        </p>
                        </div>
                    </div>
                    <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                        <div className="grid gap-1 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                <Bot className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">1. Discover</h3>
                            <p className="text-muted-foreground">
                                Take our intelligent quiz to analyze your interests, skills, and personality.
                            </p>
                        </div>
                        <div className="grid gap-1 text-center">
                             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                <Map className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">2. Plan</h3>
                            <p className="text-muted-foreground">
                                Receive a detailed AI-generated report with personalized stream, course, and career recommendations.
                            </p>
                        </div>
                         <div className="grid gap-1 text-center">
                             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                                <GraduationCap className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold">3. Succeed</h3>
                            <p className="text-muted-foreground">
                                Explore colleges, scholarships, and resources to build a concrete roadmap for your future.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

          {/* Features Section */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Tools for Your Tomorrow</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We provide a comprehensive suite of tools to help you make informed decisions about your education and career.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid grid-cols-1 gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary"/> Recommendation Quiz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Our AI-powered quiz helps you discover the perfect stream and career path based on your unique profile.</p>
                  </CardContent>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full"><Link href="/quiz">Take the Quiz</Link></Button>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><School className="text-primary"/> College Finder</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Search and filter through a comprehensive database of government colleges across India.</p>
                  </CardContent>
                   <CardContent>
                    <Button asChild variant="outline" className="w-full"><Link href="/colleges">Find Colleges</Link></Button>
                  </CardContent>
                </Card>
                 <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Career & Course Map</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Explore detailed information on degrees, career paths, and the exams you'll need to clear.</p>
                  </CardContent>
                   <CardContent>
                    <Button asChild variant="outline" className="w-full"><Link href="/courses">Explore Courses</Link></Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Award className="text-primary"/> Scholarship Search</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Find and apply for scholarships you're eligible for to fund your education and achieve your dreams.</p>
                  </CardContent>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full"><Link href="/scholarships">Discover Scholarships</Link></Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container flex flex-col items-center gap-4 px-4 text-center md:px-6">
                <Logo className="h-12 w-12 text-primary"/>
                <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Find Your Path?</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Let Disha Portal be your guide. Start your free assessment today and take the first step towards a confident and successful future.
                </p>
                <Button asChild size="lg">
                    <Link href="/quiz">
                        Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
            </section>
        </main>
      </div>
    </AppLayout>
  );
}
