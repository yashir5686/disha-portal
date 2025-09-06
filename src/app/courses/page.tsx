import AppLayout from "@/components/layout/AppLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { courseToCareerData } from "@/lib/data";
import { Briefcase, ChevronRight, GraduationCap } from "lucide-react";

export default function CoursesPage() {
  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-headline text-lg font-semibold md:text-2xl">Course to Career Mapping</h1>
        </div>
        <p className="text-muted-foreground">
          Explore various degree programs to understand the subjects, potential career paths, and higher education opportunities available in the Indian context.
        </p>

        <Accordion type="single" collapsible className="w-full">
          {courseToCareerData.map((stream, index) => (
            <AccordionItem key={stream.streamName} value={`item-${index}`}>
              <AccordionTrigger className="text-xl font-headline hover:no-underline">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  {stream.streamName}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-4">
                <Accordion type="single" collapsible className="w-full">
                  {stream.degrees.map((degree, degreeIndex) => (
                    <AccordionItem key={degree.name} value={`degree-${degreeIndex}`} className="border-b-0">
                      <AccordionTrigger className="font-semibold">{degree.name}</AccordionTrigger>
                      <AccordionContent className="pb-4 text-sm space-y-4 pl-6">
                        <p className="text-muted-foreground">{degree.description}</p>
                        <div>
                          <h4 className="font-bold mb-2">Core Subjects</h4>
                          <div className="flex flex-wrap gap-2">
                            {degree.subjects.map((subject) => (
                              <div key={subject} className="flex items-center rounded-full border px-3 py-1 text-xs">
                                {subject}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                           <h4 className="font-bold mb-2 flex items-center gap-2"><Briefcase className="w-4 h-4"/> Potential Career Paths</h4>
                           <ul className="space-y-1 list-inside">
                             {degree.careerPaths.map((path) => (
                               <li key={path} className="flex items-center gap-2 text-muted-foreground">
                                 <ChevronRight className="w-4 h-4 text-primary" />
                                 {path}
                               </li>
                             ))}
                           </ul>
                        </div>
                         <div>
                           <h4 className="font-bold mb-2 flex items-center gap-2"><GraduationCap className="w-4 h-4"/> Higher Education Options</h4>
                           <p className="text-muted-foreground">{degree.higherEducation}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </AppLayout>
  );
}
