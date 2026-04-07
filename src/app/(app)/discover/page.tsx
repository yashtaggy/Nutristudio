import MapView from "@/components/discover/map-view";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function DiscoverPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <>
      <div className="flex items-center">
        <h1 className="font-headline text-lg font-semibold md:text-2xl">
          Discover Healthy Eateries
        </h1>
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm overflow-hidden">
        {apiKey ? (
          <MapView apiKey={apiKey} />
        ) : (
          <div className="flex flex-1 items-center justify-center p-4">
             <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>API Key Missing</AlertTitle>
                <AlertDescription>
                  Please add your Google Maps API key to your <code>.env.local</code> file to enable this feature.
                </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </>
  );
}
