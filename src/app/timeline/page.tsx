import AppLayout from "@/components/layout/AppLayout";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { timelineData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

function TimelineIcon({ type }: { type: string }) {
  let colorClass = "bg-gray-500";
  if (type === "Exam") colorClass = "bg-red-500";
  if (type === "Admission") colorClass = "bg-blue-500";
  if (type === "Scholarship") colorClass = "bg-green-500";
  return <div className={`h-3 w-3 rounded-full ${colorClass}`} />;
}

export default function TimelinePage() {
  const sortedTimeline = [...timelineData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-headline text-lg font-semibold md:text-2xl">Important Timelines</h1>
        </div>
        <p className="text-muted-foreground">
          Track important dates for admissions, exams, and scholarships. Never miss a deadline again.
        </p>

        <div className="relative pl-6">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2"></div>
          
          {sortedTimeline.map((item, index) => (
            <div key={index} className="relative mb-8">
              <div className="absolute top-1 left-0 -translate-x-1/2 -translate-y-1/2 z-10">
                <TimelineIcon type={item.type} />
              </div>
              <div className="pl-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>
                          {new Date(item.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </CardDescription>
                      </div>
                      <Badge variant={
                        item.type === 'Exam' ? 'destructive' :
                        item.type === 'Scholarship' ? 'default' :
                        'secondary'
                      }>{item.type}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}
