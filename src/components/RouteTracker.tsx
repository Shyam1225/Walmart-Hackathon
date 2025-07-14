import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const mapInstanceRef = useRef<L.Map | null>(null);
  const { toast } = useToast();

  // Mock driver and customer locations
  const driverLocation: [number, number] = [32.7767, -96.7970]; // Dallas
  const customerLocation: [number, number] = [32.7849, -96.8083]; // Dallas - slightly different location

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current).setView(driverLocation, 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create custom icons
    const driverIcon = L.divIcon({
      html: `<div style="background: #3b82f6; border-radius: 50%; width: 20px; height: 20px; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>`,
      className: 'driver-marker',
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    const customerIcon = L.divIcon({
      html: `<div style="background: #ef4444; border-radius: 50%; width: 20px; height: 20px; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>`,
      className: 'customer-marker',
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    // Add markers
    L.marker(driverLocation, { icon: driverIcon })
      .addTo(map)
      .bindPopup(`${route.driver} - ${route.vehicle}`);

    L.marker(customerLocation, { icon: customerIcon })
      .addTo(map)
      .bindPopup('Customer Location');

    // Draw route line
    const routeLine = L.polyline([driverLocation, customerLocation], {
      color: '#3b82f6',
      weight: 4,
      opacity: 0.8
    }).addTo(map);

    // Fit map to show both markers
    map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });

    mapInstanceRef.current = map;

    // Calculate distance
    const distance = map.distance(driverLocation, customerLocation);
    const distanceKm = (distance / 1000).toFixed(1);
    const estimatedTime = Math.round(distance / 1000 * 2.5); // Rough estimate: 2.5 minutes per km

    toast({
      title: "Route Calculated",
      description: `Distance: ${distanceKm} km, Estimated time: ${estimatedTime} min`,
    });

    return () => {
      map.remove();
    };
  }, [route, toast]);

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
        <div 
          ref={mapRef} 
          className="w-full h-96 rounded-lg bg-secondary/20 border border-border"
          style={{ minHeight: "400px" }}
        />
        
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
      </CardContent>
    </Card>
  );
};