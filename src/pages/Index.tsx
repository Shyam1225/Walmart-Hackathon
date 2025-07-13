import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  TrendingUp, 
  MapPin, 
  Users, 
  Activity,
  Truck,
  BarChart3,
  Shield,
  Clock,
  DollarSign
} from "lucide-react";
import { MetricsOverview } from "@/components/MetricsOverview";
import { SupplyChainTracker } from "@/components/SupplyChainTracker";
import { AIForecastingDashboard } from "@/components/AIForecastingDashboard";
import { DeliveryOptimization } from "@/components/DeliveryOptimization";
import { EmployeePaymentSystem } from "@/components/EmployeePaymentSystem";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLive(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-walmart-blue rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Walmart Supply Chain AI</h1>
                <p className="text-sm text-muted-foreground">Smart Supply Chain & Payment Ecosystem</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={isLive ? "default" : "secondary"} className="animate-pulse-glow">
                <Activity className="h-3 w-3 mr-1" />
                {isLive ? "LIVE" : "UPDATING"}
              </Badge>
              <Button variant="outline" size="sm">
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="supply-chain" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Supply Chain
            </TabsTrigger>
            <TabsTrigger value="forecasting" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              AI Forecasting
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Delivery
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="animate-fade-in">
            <MetricsOverview />
          </TabsContent>

          <TabsContent value="supply-chain" className="animate-fade-in">
            <SupplyChainTracker />
          </TabsContent>

          <TabsContent value="forecasting" className="animate-fade-in">
            <AIForecastingDashboard />
          </TabsContent>

          <TabsContent value="delivery" className="animate-fade-in">
            <DeliveryOptimization />
          </TabsContent>

          <TabsContent value="payments" className="animate-fade-in">
            <EmployeePaymentSystem />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
