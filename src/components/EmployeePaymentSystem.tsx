import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User,
  Clock,
  DollarSign,
  Fingerprint,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Users,
  TrendingUp,
  Eye
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  department: string;
  hoursWorked: number;
  hourlyRate: number;
  dailyEarnings: number;
  weeklyEarnings: number;
  status: "active" | "clocked-out" | "break" | "overtime";
  lastClockIn: string;
  biometricVerified: boolean;
  paymentStatus: "pending" | "processed" | "completed";
}

interface BiometricLog {
  id: string;
  employeeId: string;
  employeeName: string;
  action: "clock-in" | "clock-out" | "break-start" | "break-end";
  timestamp: string;
  device: string;
  verified: boolean;
}

export const EmployeePaymentSystem = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "EMP-001",
      name: "John Anderson",
      department: "Warehouse",
      hoursWorked: 7.5,
      hourlyRate: 18.50,
      dailyEarnings: 138.75,
      weeklyEarnings: 693.75,
      status: "active",
      lastClockIn: "9:00 AM",
      biometricVerified: true,
      paymentStatus: "processed"
    },
    {
      id: "EMP-002",
      name: "Maria Garcia",
      department: "Customer Service",
      hoursWorked: 8.0,
      hourlyRate: 16.25,
      dailyEarnings: 130.00,
      weeklyEarnings: 650.00,
      status: "break",
      lastClockIn: "8:30 AM",
      biometricVerified: true,
      paymentStatus: "completed"
    },
    {
      id: "EMP-003",
      name: "David Kim",
      department: "Security",
      hoursWorked: 9.2,
      hourlyRate: 22.00,
      dailyEarnings: 202.40,
      weeklyEarnings: 1012.00,
      status: "overtime",
      lastClockIn: "7:00 AM",
      biometricVerified: true,
      paymentStatus: "pending"
    },
    {
      id: "EMP-004",
      name: "Lisa Thompson",
      department: "Management",
      hoursWorked: 0,
      hourlyRate: 28.75,
      dailyEarnings: 0,
      weeklyEarnings: 1150.00,
      status: "clocked-out",
      lastClockIn: "N/A",
      biometricVerified: false,
      paymentStatus: "pending"
    }
  ]);

  const [biometricLogs, setBiometricLogs] = useState<BiometricLog[]>([
    { id: "1", employeeId: "EMP-001", employeeName: "John Anderson", action: "clock-in", timestamp: "9:00 AM", device: "Terminal #A1", verified: true },
    { id: "2", employeeId: "EMP-002", employeeName: "Maria Garcia", action: "break-start", timestamp: "12:30 PM", device: "Terminal #B2", verified: true },
    { id: "3", employeeId: "EMP-003", employeeName: "David Kim", action: "clock-in", timestamp: "7:00 AM", device: "Terminal #C3", verified: true },
    { id: "4", employeeId: "EMP-004", employeeName: "Lisa Thompson", action: "clock-out", timestamp: "5:30 PM", device: "Terminal #A1", verified: false }
  ]);

  const [systemMetrics, setSystemMetrics] = useState({
    totalEmployees: 1258,
    activeNow: 847,
    todayPayments: 156780.50,
    weeklyPayments: 1134465.75,
    biometricAccuracy: 99.7,
    fraudPrevented: 23540.25
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEmployees(prev => prev.map(emp => ({
        ...emp,
        hoursWorked: emp.status === "active" || emp.status === "overtime" 
          ? Math.min(12, emp.hoursWorked + 0.1) 
          : emp.hoursWorked,
        dailyEarnings: emp.status === "active" || emp.status === "overtime"
          ? emp.hoursWorked * emp.hourlyRate
          : emp.dailyEarnings
      })));

      setSystemMetrics(prev => ({
        ...prev,
        todayPayments: prev.todayPayments + Math.random() * 1000,
        activeNow: prev.activeNow + Math.floor((Math.random() - 0.5) * 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-success-green text-white";
      case "overtime": return "bg-warning-orange text-white";
      case "break": return "bg-chart-purple text-white";
      case "clocked-out": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-success-green bg-success-green/10";
      case "processed": return "text-primary bg-primary/10";
      case "pending": return "text-warning-orange bg-warning-orange/10";
      default: return "text-muted-foreground bg-muted/10";
    }
  };

  const BiometricScanner = () => (
    <Card className="bg-card/80 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5 text-primary" />
          Biometric Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center p-8 bg-secondary/20 rounded-lg relative">
          <div className="w-24 h-24 border-4 border-primary rounded-full flex items-center justify-center relative">
            <Fingerprint className="h-12 w-12 text-primary animate-pulse-glow" />
            <div className="absolute -inset-2 border border-primary/30 rounded-full animate-pulse-glow"></div>
            <div className="absolute -inset-4 border border-primary/20 rounded-full animate-pulse-glow"></div>
          </div>
        </div>
        <div className="text-center">
          <p className="font-medium text-foreground">Ready for Scan</p>
          <p className="text-sm text-muted-foreground">Place finger on scanner to clock in/out</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-2 bg-success-green/10 rounded">
            <p className="font-medium text-success-green">1,247</p>
            <p className="text-muted-foreground">Verified Today</p>
          </div>
          <div className="text-center p-2 bg-destructive/10 rounded">
            <p className="font-medium text-destructive">3</p>
            <p className="text-muted-foreground">Failed Attempts</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Employee Payment System</h2>
          <p className="text-muted-foreground">Biometric + IoT powered payroll automation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            View All Logs
          </Button>
          <Button variant="default" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Process Payments
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-xl font-bold text-foreground">{systemMetrics.totalEmployees.toLocaleString()}</p>
              </div>
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="text-xl font-bold text-foreground">{systemMetrics.activeNow}</p>
              </div>
              <Clock className="h-6 w-6 text-success-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today Payments</p>
                <p className="text-xl font-bold text-foreground">${systemMetrics.todayPayments.toLocaleString()}</p>
              </div>
              <DollarSign className="h-6 w-6 text-warning-orange" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Total</p>
                <p className="text-xl font-bold text-foreground">${systemMetrics.weeklyPayments.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-success-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Biometric Accuracy</p>
                <p className="text-xl font-bold text-foreground">{systemMetrics.biometricAccuracy}%</p>
              </div>
              <Shield className="h-6 w-6 text-chart-purple" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fraud Prevented</p>
                <p className="text-xl font-bold text-foreground">${systemMetrics.fraudPrevented.toLocaleString()}</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Employee Status */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="employees" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="employees">Active Employees</TabsTrigger>
              <TabsTrigger value="logs">Biometric Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="employees" className="space-y-4">
              {employees.map((employee) => (
                <Card key={employee.id} className="bg-card/80 backdrop-blur-sm border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{employee.name}</h4>
                          <p className="text-sm text-muted-foreground">{employee.department} • {employee.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getPaymentStatusColor(employee.paymentStatus)}>
                          {employee.paymentStatus.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Hours Today</p>
                        <p className="font-semibold">{employee.hoursWorked.toFixed(1)}h</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Hourly Rate</p>
                        <p className="font-semibold">${employee.hourlyRate}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Daily Earnings</p>
                        <p className="font-semibold text-success-green">${employee.dailyEarnings.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weekly Total</p>
                        <p className="font-semibold text-primary">${employee.weeklyEarnings.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-sm">
                        {employee.biometricVerified ? (
                          <CheckCircle className="h-4 w-4 text-success-green" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-warning-orange" />
                        )}
                        <span className="text-muted-foreground">
                          {employee.biometricVerified ? 'Biometric Verified' : 'Verification Required'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last: {employee.lastClockIn}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              {biometricLogs.map((log) => (
                <Card key={log.id} className="bg-card/80 backdrop-blur-sm border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          log.verified ? 'bg-success-green/10' : 'bg-destructive/10'
                        }`}>
                          {log.verified ? (
                            <CheckCircle className="h-4 w-4 text-success-green" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{log.employeeName}</p>
                          <p className="text-sm text-muted-foreground">{log.action.replace('-', ' ').toUpperCase()}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">{log.timestamp}</p>
                        <p className="text-muted-foreground">{log.device}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Biometric Scanner */}
        <div>
          <BiometricScanner />
        </div>
      </div>
    </div>
  );
};