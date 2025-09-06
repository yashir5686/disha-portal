'use client';
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getColleges, College } from "@/ai/flows/get-colleges";
import { School, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { indianStatesAndDistricts } from "@/lib/india-data";

function CollegeList({ initialColleges }: { initialColleges: College[] }) {
  const [colleges, setColleges] = useState<College[]>(initialColleges);
  const [filteredColleges, setFilteredColleges] = useState<College[]>(initialColleges);
  const allStates = Object.keys(indianStatesAndDistricts);
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState('');

  const handleStateChange = (state: string) => {
    const isAllStates = state === 'all';
    setSelectedState(isAllStates ? '' : state);
    const districtList = state && !isAllStates ? indianStatesAndDistricts[state as keyof typeof indianStatesAndDistricts] : [];
    setDistricts(districtList || []);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const state = formData.get('state') as string;
    const district = formData.get('district') as string;
    const program = (formData.get('program') as string).toLowerCase();

    const results = colleges.filter(college => {
      const stateMatch = !state || state === 'all' || college.state === state;
      const districtMatch = !district || district === 'all' || college.district === district;
      const programMatch = !program || college.programs.some(p => p.toLowerCase().includes(program));
      return stateMatch && districtMatch && programMatch;
    });

    setFilteredColleges(results);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Search Filters</CardTitle>
          <CardDescription>Use the filters below to find colleges that match your criteria.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSearch}>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select name="state" onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {allStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                  <Select name="district" key={selectedState} disabled={!selectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a district" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {districts.map(district => <SelectItem key={district} value={district}>{district}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="program">Program / Course</Label>
                <Input name="program" placeholder="e.g., B.Sc. Computer Science" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search Colleges
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
        {filteredColleges.map((college, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="w-5 h-5 text-primary" />
                {college.name}
              </CardTitle>
              <CardDescription>{college.district}, {college.state}</CardDescription>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2">Popular Programs:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {college.programs.slice(0, 3).map(p => <li key={p}>{p}</li>)}
                {college.programs.length > 3 && <li>... and more</li>}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <a href={college.website} target="_blank" rel="noopener noreferrer">Visit Website</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
        {filteredColleges.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No colleges found matching your criteria. Try broadening your search.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchColleges() {
      try {
        setLoading(true);
        setError(null);
        const collegeData = await getColleges({ query: 'top government colleges in India' });
        setColleges(collegeData.colleges);
      } catch (error) {
        console.error("Failed to fetch colleges:", error);
        setError("Failed to load college data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchColleges();
  }, []);

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-headline text-lg font-semibold md:text-2xl">Find Government Colleges</h1>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading colleges...</p>
          </div>
        ) : error ? (
           <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <CollegeList initialColleges={colleges} />
        )}
      </main>
    </AppLayout>
  );
}
