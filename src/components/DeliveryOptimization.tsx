import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Truck,
  MapPin,
  Clock,
  Fuel,
  Route,
  Zap,
  Leaf,
  Navigation,
  AlertCircle,
  CheckCircle,
  TrendingDown
} from "lucide-react";

interface DeliveryRoute {
  id: string;
  driver: string;
  vehicle: string;
  status: "active" | "completed" | "delayed" | "optimizing";
  progress: number;
  stops: number;
  completedStops: number;
  estimatedTime: string;
  actualTime?: string;
  fuelEfficiency: number;
  carbonSaved: number;
  currentLocation: string;
  nextStop: string;
}

export const DeliveryOptimization = () => {
  const [routes, setRoutes] = useState<DeliveryRoute[]>([
    {
      id: "RT-001",
      driver: "Mike Johnson",
      vehicle: "Truck #A247",
      status: "active",
      progress: 68,
      stops: 12,
      completedStops: 8,
      estimatedTime: "4h 20m",
      fuelEfficiency: 94,
      carbonSaved: 23.5,
      currentLocation: "Downtown Dallas",
      nextStop: "Walmart Store #1242"
    },
    {
      id: "RT-002",
      driver: "Sarah Chen",
      vehicle: "Van #B189",
      status: "optimizing",
      progress: 25,
      stops: 8,
      completedStops: 2,
      estimatedTime: "2h 45m",
      fuelEfficiency: 87,
      carbonSaved: 18.2,
      currentLocation: "Distribution Center",
      nextStop: "Residential Area North"
    },
    {
      id: "RT-003",
      driver: "Carlos Rodriguez",
      vehicle: "Truck #C334",
      status: "completed",
      progress: 100,
      stops: 10,
      completedStops: 10,
      estimatedTime: "3h 30m",
      actualTime: "3h 15m",
      fuelEfficiency: 96,
      carbonSaved: 31.8,
      currentLocation: "Return to Base",
      nextStop: "Route Complete"
    },
    {
      id: "RT-004",
      driver: "Emma Wilson",
      vehicle: "Drone Fleet #D001",
      status: "delayed",
      progress: 45,
      stops: 6,
      completedStops: 3,
      estimatedTime: "1h 30m",
      fuelEfficiency: 98,
      carbonSaved: 12.4,
      currentLocation: "Weather Hold",
      nextStop: "Suburban District"
    }
  ]);

  const [metrics, setMetrics] = useState({
    totalRoutes: 24,
    avgEfficiency: 92.3,
    totalCarbonSaved: 156.8,
    costSavings: 78500,
    onTimeDeliveries: 94.2
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRoutes(prev => prev.map(route => {
        if (route.status === "active" && route.progress < 100) {
          const newProgress = Math.min(100, route.progress + Math.random() * 3);
          const newCompletedStops = Math.floor((newProgress / 100) * route.stops);
          return {
            ...route,
            progress: newProgress,
            completedStops: newCompletedStops,
            fuelEfficiency: Math.max(85, Math.min(98, route.fuelEfficiency + (Math.random() - 0.5) * 2))
          };
        }
        return route;
      }));

      setMetrics(prev => ({
        ...prev,
        avgEfficiency: Math.max(88, Math.min(96, prev.avgEfficiency + (Math.random() - 0.5) * 0.5)),
        totalCarbonSaved: prev.totalCarbonSaved + Math.random() * 2
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success-green text-white";
      case "active": return "bg-primary text-white";
      case "optimizing": return "bg-chart-purple text-white";
      case "delayed": return "bg-destructive text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "active": return Truck;
      case "optimizing": return Route;
      case "delayed": return AlertCircle;
      default: return Clock;
    }
  };

  const MetricCard = ({ title, value, unit, icon: Icon, trend, color = "primary" }: {
    title: string;
    value: number;
    unit?: string;
    icon: any;
    trend?: number;
    color?: string;
  }) => (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground animate-counter-up">
              {typeof value === 'number' ? value.toLocaleString() : value}
              {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
            </p>
            {trend && (
              <div className="flex items-center text-xs mt-1">
                <TrendingDown className="h-3 w-3 text-success-green mr-1" />
                <span className="text-success-green">{trend}% reduction</span>
              </div>
            )}
          </div>
          <Icon className={`h-8 w-8 ${
            color === 'success' ? 'text-success-green' :
            color === 'warning' ? 'text-warning-orange' :
            'text-primary'
          }`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Delivery Route Optimization</h2>
          <p className="text-muted-foreground">AI-powered last-mile delivery efficiency</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Navigation className="h-4 w-4" />
            Optimize All Routes
          </Button>
          <Button variant="default" className="gap-2">
            <Route className="h-4 w-4" />
            Create New Route
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-5">
        <MetricCard
          title="Active Routes"
          value={metrics.totalRoutes}
          icon={Truck}
          color="primary"
        />
        <MetricCard
          title="Avg Efficiency"
          value={metrics.avgEfficiency}
          unit="%"
          icon={Zap}
          trend={8.4}
          color="success"
        />
        <MetricCard
          title="Carbon Saved"
          value={metrics.totalCarbonSaved}
          unit="kg CO₂"
          icon={Leaf}
          trend={15.2}
          color="success"
        />
        <MetricCard
          title="Cost Savings"
          value={metrics.costSavings}
          unit="$"
          icon={TrendingDown}
          trend={12.7}
          color="warning"
        />
        <MetricCard
          title="On-Time Rate"
          value={metrics.onTimeDeliveries}
          unit="%"
          icon={CheckCircle}
          trend={3.8}
          color="success"
        />
      </div>

      {/* Routes Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {routes.map((route) => {
          const StatusIcon = getStatusIcon(route.status);
          return (
            <Card key={route.id} className="bg-card/80 backdrop-blur-sm border-border hover:shadow-glow/20 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{route.id}</CardTitle>
                    <p className="text-sm text-muted-foreground">{route.driver} • {route.vehicle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-4 w-4" />
                    <Badge className={getStatusColor(route.status)}>
                      {route.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Route Progress</span>
                    <span>{route.completedStops}/{route.stops} stops • {route.progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={route.progress} className="h-2" />
                </div>

                {/* Location Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Current Location</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span className="font-medium">{route.currentLocation}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Next Stop</p>
                    <div className="flex items-center gap-1">
                      <Navigation className="h-3 w-3 text-chart-purple" />
                      <span className="font-medium">{route.nextStop}</span>
                    </div>
                  </div>
                </div>

                {/* Time & Efficiency */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Time</p>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="font-medium">
                        {route.actualTime || route.estimatedTime}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Fuel Efficiency</p>
                    <div className="flex items-center gap-1">
                      <Fuel className="h-3 w-3 text-success-green" />
                      <span className="font-medium">{route.fuelEfficiency}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Carbon Saved</p>
                    <div className="flex items-center gap-1">
                      <Leaf className="h-3 w-3 text-success-green" />
                      <span className="font-medium">{route.carbonSaved}kg</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1">
                    Track Route
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Optimize
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Contact Driver
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Map Placeholder */}
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Live Route Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-secondary/20 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-chart-purple/10"></div>
            <div className="text-center z-10">
              <MapPin className="h-12 w-12 text-primary mb-4 mx-auto animate-pulse-glow" />
              <h3 className="text-lg font-semibold mb-2">Interactive Route Map</h3>
              <p className="text-muted-foreground">Real-time vehicle tracking with optimized routes</p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse-glow"></div>
                  <span className="text-xs">Active Routes</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-success-green rounded-full"></div>
                  <span className="text-xs">Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-warning-orange rounded-full"></div>
                  <span className="text-xs">Delayed</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};