import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Route, Zap, X, CheckCircle, Clock, Fuel, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RouteOptimizerProps {
  route: {
    id: string;
    driver: string;
    vehicle: string;
    stops: number;
    completedStops: number;
    fuelEfficiency: number;
    estimatedTime: string;
  };
  onClose: () => void;
  onOptimized: (optimizedData: any) => void;
}

export const RouteOptimizer = ({ route, onClose, onOptimized }: RouteOptimizerProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationStep, setOptimizationStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [optimizedResults, setOptimizedResults] = useState<any>(null);
  const { toast } = useToast();

  const optimizationSteps = [
    "Analyzing current route data...",
    "Processing traffic patterns...",
    "Calculating fuel-efficient paths...",
    "Optimizing delivery sequence...",
    "Generating recommendations..."
  ];

  const startOptimization = () => {
    setIsOptimizing(true);
    setOptimizationStep(0);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          completeOptimization();
          return 100;
        }
        
        // Update step based on progress
        const stepIndex = Math.floor((newProgress / 100) * optimizationSteps.length);
        setOptimizationStep(Math.min(stepIndex, optimizationSteps.length - 1));
        
        return newProgress;
      });
    }, 800);
  };

  const cancelOptimization = () => {
    setIsOptimizing(false);
    setProgress(0);
    setOptimizationStep(0);
    toast({
      title: "Optimization Canceled",
      description: "Route optimization has been stopped",
    });
  };

  const completeOptimization = () => {
    const optimized = {
      timeSaved: Math.floor(Math.random() * 45) + 15, // 15-60 minutes
      fuelSaved: Math.floor(Math.random() * 25) + 10, // 10-35%
      distanceReduced: Math.floor(Math.random() * 20) + 5, // 5-25%
      newEstimatedTime: route.estimatedTime.replace(/\d+/, (match) => 
        String(Math.max(1, parseInt(match) - Math.floor(Math.random() * 60) - 30))
      ),
      recommendedStops: [
        "Stop 1: Walmart Supercenter #1425",
        "Stop 2: Neighborhood Market #3847",
        "Stop 3: Sam's Club #6234",
        "Stop 4: Distribution Center North"
      ],
      improvements: [
        "Avoid high-traffic downtown area",
        "Use Highway 35 for better fuel efficiency",
        "Reschedule stop #3 to reduce backtracking",
        "Take advantage of off-peak hours"
      ]
    };

    setOptimizedResults(optimized);
    setIsOptimizing(false);
    
    toast({
      title: "Route Optimized!",
      description: `Saved ${optimized.timeSaved} minutes and ${optimized.fuelSaved}% fuel`,
    });
  };

  const applyOptimization = () => {
    onOptimized(optimizedResults);
    toast({
      title: "Optimization Applied",
      description: "New route has been sent to the driver",
    });
    onClose();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card/95 backdrop-blur-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            Route Optimization - {route.id}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            AI-powered route optimization for {route.driver}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Route Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-secondary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Stops</p>
            <p className="text-2xl font-bold">{route.stops}</p>
          </div>
          <div className="p-4 bg-secondary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold">{route.completedStops}</p>
          </div>
          <div className="p-4 bg-secondary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">Fuel Efficiency</p>
            <p className="text-2xl font-bold">{route.fuelEfficiency}%</p>
          </div>
          <div className="p-4 bg-secondary/20 rounded-lg">
            <p className="text-sm text-muted-foreground">ETA</p>
            <p className="text-2xl font-bold">{route.estimatedTime}</p>
          </div>
        </div>

        {/* Optimization Process */}
        {!optimizedResults && (
          <div className="space-y-4">
            {!isOptimizing ? (
              <div className="text-center py-8">
                <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Optimize</h3>
                <p className="text-muted-foreground mb-6">
                  AI will analyze traffic patterns, fuel efficiency, and delivery windows to create the optimal route
                </p>
                <Button onClick={startOptimization} size="lg" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Start AI Optimization
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold">Optimizing Route...</h3>
                  <p className="text-sm text-muted-foreground">{optimizationSteps[optimizationStep]}</p>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="text-center text-sm text-muted-foreground">
                  {progress.toFixed(0)}% Complete
                </p>
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={cancelOptimization} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancel Optimization
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Optimization Results */}
        {optimizedResults && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-success-green mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-success-green mb-2">Optimization Complete!</h3>
              <p className="text-muted-foreground">Your route has been optimized with significant improvements</p>
            </div>

            {/* Improvement Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-success-green/10 rounded-lg border border-success-green/20">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-success-green" />
                  <p className="text-sm text-muted-foreground">Time Saved</p>
                </div>
                <p className="text-2xl font-bold text-success-green">{optimizedResults.timeSaved} min</p>
              </div>
              <div className="p-4 bg-success-green/10 rounded-lg border border-success-green/20">
                <div className="flex items-center gap-2 mb-2">
                  <Fuel className="h-4 w-4 text-success-green" />
                  <p className="text-sm text-muted-foreground">Fuel Saved</p>
                </div>
                <p className="text-2xl font-bold text-success-green">{optimizedResults.fuelSaved}%</p>
              </div>
              <div className="p-4 bg-success-green/10 rounded-lg border border-success-green/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-success-green" />
                  <p className="text-sm text-muted-foreground">Distance Reduced</p>
                </div>
                <p className="text-2xl font-bold text-success-green">{optimizedResults.distanceReduced}%</p>
              </div>
            </div>

            {/* Recommended Route */}
            <div className="space-y-4">
              <h4 className="font-semibold">Optimized Route Sequence</h4>
              <div className="space-y-2">
                {optimizedResults.recommendedStops.map((stop: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                      {index + 1}
                    </Badge>
                    <span className="text-sm">{stop}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div className="space-y-4">
              <h4 className="font-semibold">Key Improvements</h4>
              <div className="space-y-2">
                {optimizedResults.improvements.map((improvement: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success-green flex-shrink-0" />
                    <span>{improvement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button onClick={applyOptimization} className="flex-1">
                Apply Optimization
              </Button>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Keep Current Route
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};