import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, Lightbulb, School, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <AppLayout>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                      Find Your Direction with Disha Portal
                    </h1>
                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                      Your personalized guide to discovering the perfect academic and career path after 10th & 12th grade. Let's navigate your future, together.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    <Button asChild size="lg">
                      <Link href="/quiz">
                        <Lightbulb className="mr-2 h-5 w-5" />
                        Start Your Assessment
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg">
                      <Link href="/courses">
                        Explore Careers
                      </Link>
                    </Button>
                  </div>
                </div>
                <Image
                  src="https://picsum.photos/600/400"
                  width="600"
                  height="400"
                  alt="Hero"
                  data-ai-hint="students guidance"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Our Features</div>
                  <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">Tools for Your Tomorrow</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    We provide a comprehensive suite of tools to help you make informed decisions about your education and career.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
                <div className="grid gap-1 text-center">
                  <GraduationCap className="h-10 w-10 mx-auto text-primary" />
                  <h3 className="text-lg font-bold">Personalized Recommendations</h3>
                  <p className="text-sm text-muted-foreground">Take our AI-powered quiz to find the stream that best fits your interests and aptitude.</p>
                </div>
                <div className="grid gap-1 text-center">
                  <School className="h-10 w-10 mx-auto text-primary" />
                  <h3 className="text-lg font-bold">College & Scholarship Search</h3>
                  <p className="text-sm text-muted-foreground">Find nearby government colleges and discover scholarships you're eligible for.</p>
                </div>
                <div className="grid gap-1 text-center">
                  <BookOpen className="h-10 w-10 mx-auto text-primary" />
                  <h3 className="text-lg font-bold">Career & Course Mapping</h3>
                  <p className="text-sm text-muted-foreground">Explore detailed information on courses, career paths, and necessary exams.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </AppLayout>
  );
}
