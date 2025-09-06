import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudyResources, StudyResource } from "@/ai/flows/get-study-resources";
import { ArrowUpRight, BookCopy } from "lucide-react";
import Image from "next/image";

export default async function ResourcesPage() {
  const studyResourcesData = await getStudyResources({ query: 'free study resources in India' });

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-headline text-lg font-semibold md:text-2xl">Free Study Resources</h1>
        </div>
        <p className="text-muted-foreground">
          A curated collection of free study materials from top Indian educational platforms like SWAYAM, NPTEL, and more.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {studyResourcesData.resources.map((resource, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="relative aspect-video mb-4">
                  <Image 
                    src={resource.imageUrl} 
                    alt={resource.title} 
                    fill
                    data-ai-hint="online learning"
                    className="rounded-lg object-cover"
                  />
                </div>
                <CardTitle className="flex items-start gap-2">
                  <BookCopy className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <span>{resource.title}</span>
                </CardTitle>
                <CardDescription>From {resource.platform}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </CardContent>
              <CardFooter>
                <a 
                  href={resource.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center w-full text-sm font-medium transition-colors rounded-md h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Visit Resource
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
