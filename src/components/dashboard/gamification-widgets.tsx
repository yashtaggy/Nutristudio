'use client';

import { ShieldCheck, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import BadgeCard from './badge-card';

// Mock data for gamification elements. In a real app, this would be dynamic.
const healthScore = 78;
const badges = [
  { icon: TrendingUp, title: 'Healthy Streak', description: '5 days in a row' },
  { icon: Target, title: 'Goal Crusher', description: 'Met protein goal' },
  { icon: ShieldCheck, title: 'Budget Master', description: 'Stayed under budget' },
];

export default function GamificationWidgets() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Health Score</CardTitle>
          <span className="text-2xl font-bold text-primary">{healthScore}</span>
        </CardHeader>
        <CardContent>
          <Progress value={healthScore} aria-label={`${healthScore}% health score`} className="h-2" />
          <p className="text-xs text-muted-foreground pt-2">Your wellness score for today.</p>
        </CardContent>
      </Card>
      {badges.map((badge, index) => (
        <BadgeCard key={index} {...badge} />
      ))}
    </div>
  );
}
