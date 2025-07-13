/// <reference types="google.maps" />
import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RouteTrackerProps {
  route: {
    id: string;
    driver: string;
    vehicle: string;
    currentLocation: string;
    nextStop: string;
  };
  onClose: () => void;
}

export const RouteTracker = ({ route, onClose }: RouteTrackerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  // Mock driver and customer locations (you can replace with real data)
  const driverLocation = { lat: 32.7767, lng: -96.7970 }; // Dallas
  const customerLocation = { lat: 32.7849, lng: -96.8083 }; // Dallas - slightly different location

  const loadMap = async (key: string) => {
    if (!mapRef.current || !key.trim()) return;

    try {
      const loader = new Loader({
        apiKey: key,
        version: "weekly",
        libraries: ["geometry", "places"]
      });

      await loader.load();
      
      const map = new google.maps.Map(mapRef.current, {
        center: driverLocation,
        zoom: 13,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#1a1a1a" }]
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#ffffff" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#2563eb" }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Driver marker
      new google.maps.Marker({
        position: driverLocation,
        map: map,
        title: `${route.driver} - ${route.vehicle}`,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#3b82f6"/>
              <path d="M12 10h8v4h-2v6h-4v-6h-2v-4z" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32)
        }
      });

      // Customer marker
      new google.maps.Marker({
        position: customerLocation,
        map: map,
        title: "Customer Location",
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#ef4444"/>
              <circle cx="16" cy="12" r="3" fill="white"/>
              <path d="M10 20h12v2h-12v-2z" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32)
        }
      });

      // Direction service
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#3b82f6",
          strokeWeight: 4
        },
        suppressMarkers: true
      });

      directionsRenderer.setMap(map);

      directionsService.route({
        origin: driverLocation,
        destination: customerLocation,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === "OK" && result) {
          directionsRenderer.setDirections(result);
          
          const leg = result.routes[0].legs[0];
          toast({
            title: "Route Calculated",
            description: `Distance: ${leg.distance?.text}, Duration: ${leg.duration?.text}`,
          });
        }
      });

      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading Google Maps:", error);
      toast({
        title: "Error",
        description: "Failed to load Google Maps. Please check your API key.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/95 backdrop-blur-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Live Route Tracking - {route.id}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {route.driver} driving {route.vehicle}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isLoaded && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your Google Maps API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
              />
              <Button onClick={() => loadMap(apiKey)}>
                Load Map
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your API key from{" "}
              <a 
                href="https://developers.google.com/maps/documentation/javascript/get-api-key" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Maps Platform
              </a>
            </p>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg bg-secondary/20 border border-border"
          style={{ minHeight: "400px" }}
        />
        
        {isLoaded && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse-glow"></div>
              <div>
                <p className="text-sm font-medium">Driver Location</p>
                <p className="text-xs text-muted-foreground">{route.currentLocation}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg">
              <MapPin className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm font-medium">Destination</p>
                <p className="text-xs text-muted-foreground">{route.nextStop}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};