import AuthForm from '@/components/auth/auth-form';
import Logo from '@/components/icons/logo';

export default function LoginPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Logo className="h-12 w-12 text-primary" />
          <h1 className="mt-4 font-headline text-3xl font-bold">
            Welcome to NutriNudge
          </h1>
          <p className="mt-2 text-center text-muted-foreground">
            Your smart food decision companion.
          </p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
