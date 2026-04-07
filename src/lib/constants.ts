import { LayoutDashboard, Apple, Map, User, BotMessageSquare } from 'lucide-react';

export const NAV_LINKS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/plan',
    label: 'Meal Plan',
    icon: Apple,
  },
  {
    href: '/discover',
    label: 'Discover',
    icon: Map,
  },
];

export const DIETARY_PREFERENCES = [
  { value: 'no preference', label: 'No Preference' },
  { value: 'veg', label: 'Vegetarian' },
  { value: 'non-veg', label: 'Non-Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'pescatarian', label: 'Pescatarian' },
] as const;

export const HEALTH_GOALS = [
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'weight loss', label: 'Weight Loss' },
  { value: 'muscle gain', label: 'Muscle Gain' },
] as const;

export const TIME_OF_DAY_OPTIONS = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'late night', label: 'Late Night' },
] as const;

export const HUNGER_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
] as const;
