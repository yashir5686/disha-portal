"use client";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { scholarshipData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, DollarSign } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function ScholarshipsPage() {
  const [filteredScholarships, setFilteredScholarships] = useState(scholarshipData);

  const levels = [...new Set(scholarshipData.map(s => s.level))];
  const streams = [...new Set(scholarshipData.flatMap(s => s.tags).filter(t => ["Science", "Commerce", "Arts", "Vocational"].includes(t)))];

  const handleFilterChange = (type: 'level' | 'stream', value: string) => {
    let results = scholarshipData;
    if (value) {
      if (type === 'level') {
        results = results.filter(s => s.level === value);
      }
      if (type === 'stream') {
        results = results.filter(s => s.tags.includes(value));
      }
    }
    setFilteredScholarships(results);
  };


  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-headline text-lg font-semibold md:text-2xl">Scholarship Information</h1>
        </div>
         <p className="text-muted-foreground">
          Discover a curated database of Indian scholarships. Filter by level, stream, region, and more.
        </p>

        <Card>
            <CardHeader>
                <CardTitle>Filter Scholarships</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Education Level</Label>
                        <Select onValueChange={(value) => handleFilterChange('level', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">All Levels</SelectItem>
                                {levels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Stream</Label>
                        <Select onValueChange={(value) => handleFilterChange('stream', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by stream" />
                            </SelectTrigger>
                            <SelectContent>
                                 <SelectItem value="">All Streams</SelectItem>
                                {streams.map(stream => <SelectItem key={stream} value={stream}>{stream}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredScholarships.map((scholarship, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-start gap-2">
                    <DollarSign className="w-5 h-5 text-primary mt-1 shrink-0" />
                    <span>{scholarship.name}</span>
                </CardTitle>
                <CardDescription>By {scholarship.provider}</CardDescription>
                <div className="flex flex-wrap gap-2 pt-2">
                  {scholarship.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{scholarship.description}</p>
                <div className="mt-4">
                    <h4 className="font-semibold text-sm">Eligibility</h4>
                    <p className="text-sm text-muted-foreground">{scholarship.eligibility}</p>
                </div>
              </CardContent>
              <CardFooter>
                 <Button asChild className="w-full">
                  <a href={scholarship.link} target="_blank" rel="noopener noreferrer">
                    Apply Now <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
           {filteredScholarships.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No scholarships found matching your criteria.</p>
            </div>
           )}
        </div>
      </main>
    </AppLayout>
  );
}
