import ProfileForm from '@/components/profile/profile-form';

export default function ProfilePage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Your Profile
        </h1>
      </div>
      <div className="flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm p-4 md:p-8">
        <ProfileForm />
      </div>
    </>
  );
}
