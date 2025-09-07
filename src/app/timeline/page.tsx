
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function TimelinePage() {
  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-headline text-lg font-semibold md:text-2xl">Important Timelines</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md text-center py-12">
            <CardHeader>
                <Construction className="w-16 h-16 mx-auto text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <CardTitle className="text-2xl font-bold">Coming Soon!</CardTitle>
                <CardDescription className="mt-2">
                    We're building a timeline feature to help you track important dates. Stay tuned!
                </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
