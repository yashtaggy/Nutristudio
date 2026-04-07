import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, Info } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

interface Meal {
  mealName: string;
  estimatedCost: number;
  nutritionalReasoning: string;
}

interface RecommendationCardProps {
  meal: Meal;
  isPrimary?: boolean;
}

export default function RecommendationCard({ meal, isPrimary = false }: RecommendationCardProps) {
  const placeholderImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
  
  return (
    <Card className={cn("flex flex-col", isPrimary && "border-primary border-2")}>
      {isPrimary && (
        <div className="relative h-48 w-full">
            <Image 
                src={placeholderImage.imageUrl} 
                alt={meal.mealName}
                fill
                className="object-cover rounded-t-lg"
                data-ai-hint={placeholderImage.imageHint}
            />
        </div>
      )}
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="font-headline text-lg">{meal.mealName}</span>
          <Badge variant={isPrimary ? "default" : "secondary"}>₹{meal.estimatedCost}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-1 shrink-0 text-primary" />
            <p>{meal.nutritionalReasoning}</p>
        </div>
      </CardContent>
      {isPrimary && (
        <CardFooter>
            <Badge variant="outline" className="border-green-300 bg-green-50 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1"/>
                Top Recommendation
            </Badge>
        </CardFooter>
      )}
    </Card>
  );
}
