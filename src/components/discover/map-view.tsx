'use client';

import { useEffect, useState, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import LoadingSpinner from '../shared/loading-spinner';
import { Button } from '../ui/button';
import { LocateFixed } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MapViewProps {
  apiKey: string;
}

interface Place {
  id: string;
  location: google.maps.LatLngLiteral;
  displayName: string;
}

function Places({ onPlacesChange }: { onPlacesChange: (places: Place[]) => void }) {
  const map = useMap();
  const [places, setPlaces] = useState<Place[]>([]);
  
  useEffect(() => {
    if (!map) return;
    
    const service = new google.maps.places.PlacesService(map);
    
    // Default search when map is ready
    const request = {
      location: map.getCenter()!,
      radius: 5000, // 5km radius
      query: 'healthy food',
    };

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const newPlaces: Place[] = results.map(p => ({
            id: p.place_id!,
            location: p.geometry!.location!.toJSON(),
            displayName: p.name!
        })).slice(0, 10); // limit to 10
        
        setPlaces(newPlaces);
        onPlacesChange(newPlaces);
      }
    });

  }, [map, onPlacesChange]);

  return (
    <>
      {places.map((place) => (
        <AdvancedMarker key={place.id} position={place.location} title={place.displayName} />
      ))}
    </>
  );
}


export default function MapView({ apiKey }: MapViewProps) {
  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          variant: 'destructive',
          title: 'Location Error',
          description: "Couldn't access your location. Defaulting to a sample location.",
        });
        // Default to a central location if geolocation fails
        setPosition({ lat: 28.6139, lng: 77.2090 });
        setLoading(false);
      }
    );
  }, [toast]);

  const [places, setPlaces] = useState<Place[]>([]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner className="h-8 w-8 text-primary" />
        <p className="ml-2">Getting your location...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
        <APIProvider apiKey={apiKey}>
            <Map
                defaultCenter={position!}
                defaultZoom={13}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                mapId="nutrinudge-map"
                className="w-full h-full"
            >
                <AdvancedMarker position={position!} title="Your Location">
                    <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg"></div>
                </AdvancedMarker>
                <Places onPlacesChange={setPlaces}/>
            </Map>
        </APIProvider>
        <div className="absolute top-4 left-4 bg-card p-4 rounded-lg shadow-lg max-w-xs w-full max-h-[calc(100%-4rem)] overflow-y-auto">
            <h2 className="font-headline text-lg mb-2">Nearby Healthy Spots</h2>
            <ul className="space-y-2">
                {places.map(p => (
                    <li key={p.id} className="text-sm text-muted-foreground">{p.displayName}</li>
                ))}
            </ul>
        </div>
    </div>
  );
}
