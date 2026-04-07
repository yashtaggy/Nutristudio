import type { User as FirebaseUser } from 'firebase/auth';

export type UserProfile = {
  uid: string;
  email: string | null;
  name: string | null;
  age?: number;
  dietaryPreference?: 'veg' | 'non-veg' | 'vegan' | 'pescatarian' | 'no preference';
  healthGoal?: 'weight loss' | 'muscle gain' | 'maintenance';
};

export type AuthContextType = {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  refetchProfile: () => void;
};
