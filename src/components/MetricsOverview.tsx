import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck, 
  DollarSign, 
  Users,
  Clock,
  Target,
  Zap,
  Shield
} from "lucide-react";

export const MetricsOverview = () => {
  const [metrics, setMetrics] = useState({
    totalShipments: 15247,
    onTimeDelivery: 94.2,
    costSavings: 2.3,
    activeEmployees: 125890,
    avgDeliveryTime: 2.1,
    blockchainTransactions: 45821,
    aiAccuracy: 97.8,
    sustainabilityScore: 89
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalShipments: prev.totalShipments + Math.floor(Math.random() * 10),
        onTimeDelivery: Math.max(90, Math.min(99, prev.onTimeDelivery + (Math.random() - 0.5) * 0.5)),
        activeEmployees: prev.activeEmployees + Math.floor(Math.random() * 20) - 10,
        blockchainTransactions: prev.blockchainTransactions + Math.floor(Math.random() * 50)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    trend, 
    icon: Icon, 
    color = "primary",
    progress 
  }: {
    title: string;
    value: number;
    unit?: string;
    trend?: number;
    icon: any;
    color?: "primary" | "success" | "warning" | "chart";
    progress?: number;
  }) => (
    <Card className="bg-card/80 backdrop-blur-sm border-border shadow-card hover:shadow-glow/20 transition-all duration-500 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${
          color === 'success' ? 'text-success-green' :
          color === 'warning' ? 'text-warning-orange' :
          color === 'chart' ? 'text-chart-purple' :
          'text-primary'
        } group-hover:scale-110 transition-transform`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground animate-counter-up">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {unit && <span className="text-sm text-muted-foreground ml-1">{unit}</span>}
        </div>
        {trend !== undefined && (
          <div className="flex items-center text-xs mt-1">
            {trend > 0 ? (
              <TrendingUp className="h-3 w-3 text-success-green mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive mr-1" />
            )}
            <span className={trend > 0 ? "text-success-green" : "text-destructive"}>
              {Math.abs(trend)}% from last hour
            </span>
          </div>
        )}
        {progress !== undefined && (
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-muted-foreground mt-1">{progress}% efficiency</div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Shipments Today"
          value={metrics.totalShipments}
          trend={12.5}
          icon={Package}
          color="primary"
        />
        <MetricCard
          title="On-Time Delivery Rate"
          value={metrics.onTimeDelivery}
          unit="%"
          trend={2.1}
          icon={Clock}
          color="success"
          progress={metrics.onTimeDelivery}
        />
        <MetricCard
          title="Cost Savings (M)"
          value={metrics.costSavings}
          unit="M"
          trend={8.3}
          icon={DollarSign}
          color="warning"
        />
        <MetricCard
          title="Active Employees"
          value={metrics.activeEmployees}
          trend={-0.2}
          icon={Users}
          color="chart"
        />
      </div>

      {/* Advanced Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Avg Delivery Time"
          value={metrics.avgDeliveryTime}
          unit="days"
          trend={-15.2}
          icon={Truck}
          color="success"
        />
        <MetricCard
          title="Blockchain Transactions"
          value={metrics.blockchainTransactions}
          trend={45.1}
          icon={Shield}
          color="primary"
        />
        <MetricCard
          title="AI Prediction Accuracy"
          value={metrics.aiAccuracy}
          unit="%"
          trend={3.2}
          icon={Target}
          color="chart"
          progress={metrics.aiAccuracy}
        />
        <MetricCard
          title="Sustainability Score"
          value={metrics.sustainabilityScore}
          unit="/100"
          trend={5.7}
          icon={Zap}
          color="success"
          progress={metrics.sustainabilityScore}
        />
      </div>

      {/* System Status */}
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm font-medium">Blockchain Network</span>
              <Badge variant="default" className="bg-success-green hover:bg-success-green/90">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse-glow"></div>
                Operational
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm font-medium">AI Processing</span>
              <Badge variant="default" className="bg-success-green hover:bg-success-green/90">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse-glow"></div>
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm font-medium">Payment System</span>
              <Badge variant="default" className="bg-success-green hover:bg-success-green/90">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse-glow"></div>
                Secure
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};