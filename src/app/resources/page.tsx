
'use client';
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getStudyResources, type ArticleResource } from "@/ai/flows/get-study-resources";
import { ArrowUpRight, BookCopy, Newspaper, Loader2, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PersonalizedStreamRecommendationOutput } from "@/ai/flows/personalized-stream-recommendation-from-quiz";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const RECOMMENDATION_STORAGE_KEY = 'disha-portal-recommendation';

export default function ResourcesPage() {
  const [recommendation, setRecommendation] = useState<PersonalizedStreamRecommendationOutput | null>(null);
  const [articles, setArticles] = useState<ArticleResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedRecommendation = localStorage.getItem(RECOMMENDATION_STORAGE_KEY);
    let recommendationData: PersonalizedStreamRecommendationOutput | null = null;
    if (savedRecommendation) {
      try {
        recommendationData = JSON.parse(savedRecommendation);
        setRecommendation(recommendationData);
      } catch (e) {
        console.error("Failed to parse recommendation from localStorage", e);
      }
    }

    async function fetchArticles() {
      setLoading(true);
      try {
        const query = recommendationData?.recommendation 
          ? `articles about careers in ${recommendationData.recommendation}`
          : 'articles about career development for students in India';
        const result = await getStudyResources({ query, type: 'article' });
        setArticles(result.articles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  const recommendedCourses = recommendation?.recommendedCourses || [];

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
          <h1 className="font-headline text-lg font-semibold md:text-2xl">Your Personalized Resources</h1>
        </div>
        
        {recommendedCourses.length > 0 && (
          <div className="mb-8">
            <h2 className="font-headline text-xl font-semibold mb-4 flex items-center gap-2">
              <BookCopy className="w-6 h-6 text-primary" />
              Recommended Online Courses
            </h2>
            <p className="text-muted-foreground mb-6">
              Based on your quiz results, here are some online courses to help you get started on your recommended path.
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recommendedCourses.map((course, index) => (
                 <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-start gap-2">
                      <span>{course.title}</span>
                    </CardTitle>
                    <CardDescription>From {course.platform}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                      <Badge variant={course.price.toLowerCase() === 'free' ? 'default' : 'secondary'}>{course.price}</Badge>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <a href={course.link} target="_blank" rel="noopener noreferrer">
                        Go to Course <ArrowUpRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="font-headline text-xl font-semibold mb-4 flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-primary" />
            Further Reading & Articles
          </h2>
          <p className="text-muted-foreground mb-6">
            Explore these articles to gain more insight into your potential career field.
          </p>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-muted-foreground">Fetching relevant articles...</p>
            </div>
          ) : articles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>Source: {article.source}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{article.summary}</p>
                  </CardContent>
                  <CardFooter>
                     <Button asChild variant="outline" className="w-full">
                        <a href={article.link} target="_blank" rel="noopener noreferrer">
                          Read Full Article <ArrowUpRight className="ml-2 h-4 w-4" />
                        </a>
                     </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent className="flex flex-col items-center gap-4">
                <Info className="w-10 h-10 text-muted-foreground"/>
                <p className="text-muted-foreground">
                  No articles found. Take the quiz to get personalized article recommendations.
                </p>
                <Button asChild>
                  <Link href="/quiz">Take the Quiz</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </AppLayout>
  );
}
