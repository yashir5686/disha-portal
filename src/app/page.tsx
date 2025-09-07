
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Compass, BookOpen, School, Award, ArrowRight, UserPlus } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";


export default function HomePage() {
  return (
    <AppLayout>
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 via-background to-background text-center py-20 px-4">
          <Compass className="mx-auto h-16 w-16 text-primary mb-4"/>
          <h1 className="text-4xl md:text-5xl font-bold font-headline max-w-3xl mx-auto">
            Your Compass to a Brighter Future
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Disha Portal uses AI to understand your unique strengths and interests, guiding you to the perfect career and educational path in India.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/quiz">
              <Button size="lg">
                Start Your Free Assessment <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link href="/profile">
               <Button size="lg" variant="outline">
                Create Your Profile <UserPlus className="ml-2" />
               </Button>
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 font-headline">How It Works: Your Path in 3 Steps</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-4 ring-4 ring-primary/20">
                  <div className="text-2xl font-bold text-primary">1</div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Discover</h3>
                <p className="text-muted-foreground">Take our insightful AI-driven quiz to uncover your passions and aptitudes.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-4 ring-4 ring-primary/20">
                  <div className="text-2xl font-bold text-primary">2</div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Plan</h3>
                <p className="text-muted-foreground">Receive a personalized roadmap with career, course, and college recommendations.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-4 ring-4 ring-primary/20">
                  <div className="text-2xl font-bold text-primary">3</div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Succeed</h3>
                <p className="text-muted-foreground">Explore resources, track deadlines, and find scholarships to achieve your goals.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 font-headline">Everything You Need to Succeed</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/quiz" className="block group">
                 <Card className="h-full hover:border-primary hover:shadow-lg transition-all">
                  <CardHeader className="p-6">
                    <Compass className="h-10 w-10 text-primary mb-3"/>
                    <CardTitle>AI Recommendation Quiz</CardTitle>
                    <CardDescription>Our core feature. Get a personalized report in minutes.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/courses" className="block group">
                <Card className="h-full hover:border-primary hover:shadow-lg transition-all">
                  <CardHeader className="p-6">
                    <BookOpen className="h-10 w-10 text-primary mb-3"/>
                    <CardTitle>Career & Course Maps</CardTitle>
                    <CardDescription>Understand how degrees connect to real-world job opportunities.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/colleges" className="block group">
                 <Card className="h-full hover:border-primary hover:shadow-lg transition-all">
                  <CardHeader className="p-6">
                    <School className="h-10 w-10 text-primary mb-3"/>
                    <CardTitle>College Explorer</CardTitle>
                    <CardDescription>Search our database of government colleges across India.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
              <Link href="/scholarships" className="block group">
                <Card className="h-full hover:border-primary hover:shadow-lg transition-all">
                  <CardHeader className="p-6">
                    <Award className="h-10 w-10 text-primary mb-3"/>
                    <CardTitle>Scholarship Finder</CardTitle>
                    <CardDescription>Discover financial aid opportunities to fund your education.</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold font-headline">Ready to find your direction?</h2>
             <p className="mt-2 text-muted-foreground">Let's build your future, together.</p>
             <div className="mt-6">
                <Link href="/quiz">
                    <Button size="lg">Take the First Step <ArrowRight className="ml-2" /></Button>
                </Link>
             </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
}

    