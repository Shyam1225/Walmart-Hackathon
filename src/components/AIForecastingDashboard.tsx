import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp,
  TrendingDown,
  Brain,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Package,
  ShoppingCart,
  Calendar,
  Target
} from "lucide-react";

interface ForecastData {
  category: string;
  currentStock: number;
  predictedDemand: number;
  recommendation: string;
  confidence: number;
  trend: "up" | "down" | "stable";
  urgency: "low" | "medium" | "high";
}

interface ChartDataPoint {
  date: string;
  actual: number;
  predicted: number;
  accuracy: number;
}

export const AIForecastingDashboard = () => {
  const [forecasts, setForecasts] = useState<ForecastData[]>([
    {
      category: "Electronics",
      currentStock: 2450,
      predictedDemand: 3200,
      recommendation: "Increase stock by 30%",
      confidence: 92,
      trend: "up",
      urgency: "high"
    },
    {
      category: "Groceries",
      currentStock: 8900,
      predictedDemand: 7500,
      recommendation: "Optimal stock level",
      confidence: 89,
      trend: "stable",
      urgency: "low"
    },
    {
      category: "Clothing",
      currentStock: 4200,
      predictedDemand: 3800,
      recommendation: "Consider reducing by 10%",
      confidence: 87,
      trend: "down",
      urgency: "medium"
    },
    {
      category: "Home & Garden",
      currentStock: 1850,
      predictedDemand: 2100,
      recommendation: "Restock recommended",
      confidence: 94,
      trend: "up",
      urgency: "medium"
    }
  ]);

  const [chartData, setChartData] = useState<ChartDataPoint[]>([
    { date: "Mon", actual: 2400, predicted: 2380, accuracy: 99.2 },
    { date: "Tue", actual: 3200, predicted: 3150, accuracy: 98.4 },
    { date: "Wed", actual: 2800, predicted: 2850, accuracy: 98.2 },
    { date: "Thu", actual: 3800, predicted: 3750, accuracy: 98.7 },
    { date: "Fri", actual: 4200, predicted: 4300, accuracy: 97.6 },
    { date: "Sat", actual: 5100, predicted: 5050, accuracy: 99.0 },
    { date: "Sun", actual: 3900, predicted: 3950, accuracy: 98.7 }
  ]);

  const [aiMetrics, setAiMetrics] = useState({
    overallAccuracy: 98.4,
    processedRequests: 847329,
    savedCosts: 4.2,
    alertsGenerated: 23
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setForecasts(prev => prev.map(forecast => ({
        ...forecast,
        confidence: Math.max(85, Math.min(98, forecast.confidence + (Math.random() - 0.5) * 2)),
        predictedDemand: Math.max(100, forecast.predictedDemand + Math.floor((Math.random() - 0.5) * 100))
      })));

      setAiMetrics(prev => ({
        ...prev,
        processedRequests: prev.processedRequests + Math.floor(Math.random() * 100),
        overallAccuracy: Math.max(95, Math.min(99.5, prev.overallAccuracy + (Math.random() - 0.5) * 0.5))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "text-destructive bg-destructive/10";
      case "medium": return "text-warning-orange bg-warning-orange/10";
      case "low": return "text-success-green bg-success-green/10";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-success-green" />;
      case "down": return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <BarChart3 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const SimpleChart = ({ data }: { data: ChartDataPoint[] }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">7-Day Prediction vs Actual</h4>
        <Badge variant="outline" className="bg-success-green/10 text-success-green">
          98.4% Accuracy
        </Badge>
      </div>
      <div className="h-48 flex items-end justify-between gap-2 bg-secondary/20 rounded-lg p-4">
        {data.map((point, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-1">
            <div className="flex gap-1 items-end h-32">
              <div 
                className="bg-primary rounded-sm w-4 opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${(point.actual / 5500) * 100}%` }}
                title={`Actual: ${point.actual}`}
              />
              <div 
                className="bg-chart-purple rounded-sm w-4 opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${(point.predicted / 5500) * 100}%` }}
                title={`Predicted: ${point.predicted}`}
              />
            </div>
            <span className="text-xs text-muted-foreground">{point.date}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-sm"></div>
          <span>Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-chart-purple rounded-sm"></div>
          <span>Predicted</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Demand Forecasting</h2>
          <p className="text-muted-foreground">Predictive analytics for inventory optimization</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Brain className="h-4 w-4" />
          Train Model
        </Button>
      </div>

      {/* AI Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Accuracy</p>
                <p className="text-2xl font-bold text-foreground animate-counter-up">
                  {aiMetrics.overallAccuracy.toFixed(1)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-success-green" />
            </div>
            <Progress value={aiMetrics.overallAccuracy} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Requests Processed</p>
                <p className="text-2xl font-bold text-foreground animate-counter-up">
                  {aiMetrics.processedRequests.toLocaleString()}
                </p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Savings</p>
                <p className="text-2xl font-bold text-foreground animate-counter-up">
                  ${aiMetrics.savedCosts}M
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-foreground animate-counter-up">
                  {aiMetrics.alertsGenerated}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning-orange" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="forecasts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="forecasts">Category Forecasts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {forecasts.map((forecast, index) => (
              <Card key={index} className="bg-card/80 backdrop-blur-sm border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{forecast.category}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(forecast.trend)}
                      <Badge variant="outline" className={getUrgencyColor(forecast.urgency)}>
                        {forecast.urgency.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current Stock</p>
                      <p className="font-semibold text-lg">{forecast.currentStock.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Predicted Demand</p>
                      <p className="font-semibold text-lg">{forecast.predictedDemand.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>AI Confidence</span>
                      <span>{forecast.confidence}%</span>
                    </div>
                    <Progress value={forecast.confidence} className="h-2" />
                  </div>

                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-success-green mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">AI Recommendation</p>
                        <p className="text-sm text-muted-foreground">{forecast.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Prediction Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleChart data={chartData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};