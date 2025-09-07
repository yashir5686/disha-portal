
'use client';
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getColleges, College } from "@/ai/flows/get-colleges";
import { School, Search, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { indianStatesAndDistricts } from "@/lib/india-data";

function CollegeSearch() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const allStates = Object.keys(indianStatesAndDistricts);
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState('');

  async function fetchInitialColleges() {
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

  useEffect(() => {
    fetchInitialColleges();
  }, []);


  const handleStateChange = (state: string) => {
    const isAllStates = state === 'all';
    setSelectedState(isAllStates ? '' : state);
    if (isAllStates || !state) {
      setDistricts([]);
    } else {
      const districtList = indianStatesAndDistricts[state as keyof typeof indianStatesAndDistricts] || [];
      setDistricts(districtList);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const state = formData.get('state') as string;
    const district = formData.get('district') as string;
    const program = formData.get('program') as string;
    
    let query = 'government colleges';
    if (program) query += ` offering ${program}`;
    if (district && district !== 'all') query += ` in ${district} district`;
    if (state && state !== 'all') query += `, ${state}`;
    if(!program && !district && !state) query = "top government colleges in India"

    setLoading(true);
    setError(null);
    try {
      const result = await getColleges({ query });
      setColleges(result.colleges);
    } catch (err) {
      setError('Failed to fetch colleges. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Search Government Colleges</CardTitle>
          <CardDescription>Use the filters below to find colleges that match your criteria in real-time.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSearch}>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select name="state" onValueChange={handleStateChange} defaultValue="all">
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
                  <Select name="district" key={selectedState} disabled={!selectedState} defaultValue="all">
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
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Search Colleges
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading colleges...</p>
        </div>
      ) : error ? (
         <div className="text-center py-12">
          <p className="text-destructive">{error}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {colleges.map((college, index) => (
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
          {colleges.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No colleges found matching your criteria. Try broadening your search.</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}


export default function CollegesPage() {
  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-headline text-lg font-semibold md:text-2xl">Find Government Colleges</h1>
        </div>
        <CollegeSearch />
      </main>
    </AppLayout>
  );
}
