import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Package,
  Truck,
  Building,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Link2,
  Eye
} from "lucide-react";

interface BlockchainTransaction {
  id: string;
  timestamp: string;
  action: string;
  location: string;
  status: "completed" | "pending" | "verified";
  hash: string;
}

interface Product {
  id: string;
  name: string;
  status: "in-transit" | "delivered" | "warehouse" | "processing";
  progress: number;
  location: string;
  nextLocation: string;
  eta: string;
  blockchain: BlockchainTransaction[];
}

export const SupplyChainTracker = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "PRD-001",
      name: "Electronics Shipment",
      status: "in-transit",
      progress: 65,
      location: "Distribution Center TX",
      nextLocation: "Store Dallas #1242",
      eta: "2 hours",
      blockchain: [
        { id: "1", timestamp: "10:30 AM", action: "Shipment Created", location: "Supplier", status: "completed", hash: "0x7a8f..." },
        { id: "2", timestamp: "12:15 PM", action: "Quality Verified", location: "Warehouse", status: "completed", hash: "0x9b2e..." },
        { id: "3", timestamp: "2:45 PM", action: "In Transit", location: "Distribution Center", status: "verified", hash: "0xc4d1..." }
      ]
    },
    {
      id: "PRD-002", 
      name: "Grocery Items",
      status: "warehouse",
      progress: 40,
      location: "Warehouse AR",
      nextLocation: "Distribution Center TX",
      eta: "4 hours",
      blockchain: [
        { id: "4", timestamp: "9:00 AM", action: "Received", location: "Supplier", status: "completed", hash: "0xe6f3..." },
        { id: "5", timestamp: "10:20 AM", action: "Inventory Check", location: "Warehouse", status: "pending", hash: "0xa1b7..." }
      ]
    },
    {
      id: "PRD-003",
      name: "Clothing & Apparel",
      status: "delivered",
      progress: 100,
      location: "Store Miami #0875",
      nextLocation: "Customer",
      eta: "Delivered",
      blockchain: [
        { id: "6", timestamp: "8:00 AM", action: "Shipment Started", location: "Supplier", status: "completed", hash: "0x2c9d..." },
        { id: "7", timestamp: "11:30 AM", action: "Delivered", location: "Store", status: "completed", hash: "0x5e1f..." }
      ]
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setProducts(prev => prev.map(product => {
        if (product.status === "in-transit" && product.progress < 100) {
          return {
            ...product,
            progress: Math.min(100, product.progress + Math.random() * 5)
          };
        }
        return product;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-success-green";
      case "in-transit": return "bg-primary";
      case "warehouse": return "bg-warning-orange";
      case "processing": return "bg-chart-purple";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return CheckCircle;
      case "in-transit": return Truck;
      case "warehouse": return Building;
      case "processing": return Package;
      default: return Clock;
    }
  };

  const BlockchainViewer = ({ transactions }: { transactions: BlockchainTransaction[] }) => (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm flex items-center gap-2">
        <Link2 className="h-4 w-4 text-primary" />
        Blockchain Trail
      </h4>
      <div className="space-y-2">
        {transactions.map((tx, index) => (
          <div key={tx.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg relative">
            {index < transactions.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-4 bg-border"></div>
            )}
            <div className={`w-3 h-3 rounded-full ${
              tx.status === 'completed' ? 'bg-success-green' :
              tx.status === 'verified' ? 'bg-primary' :
              'bg-warning-orange animate-pulse-glow'
            }`}></div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{tx.action}</span>
                <Badge variant="outline" className="text-xs">
                  {tx.hash}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {tx.location} • {tx.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Supply Chain Tracker</h2>
          <p className="text-muted-foreground">Blockchain-powered transparency and traceability</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Eye className="h-4 w-4" />
          View All Transactions
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const StatusIcon = getStatusIcon(product.status);
          return (
            <Card 
              key={product.id} 
              className="bg-card/80 backdrop-blur-sm border-border cursor-pointer hover:shadow-glow/20 transition-all duration-300 group"
              onClick={() => setSelectedProduct(product)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <StatusIcon className={`h-5 w-5 ${getStatusColor(product.status)} text-white rounded p-1 group-hover:scale-110 transition-transform`} />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {product.location}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{product.progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={product.progress} className="h-2" />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="secondary" className={`${getStatusColor(product.status)} text-white`}>
                      {product.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next:</span>
                    <span className="font-medium">{product.nextLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ETA:</span>
                    <span className="font-medium">{product.eta}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Blockchain Entries:</span>
                    <span className="font-medium">{product.blockchain.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedProduct.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Product ID: {selectedProduct.id}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedProduct(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Current Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{selectedProduct.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <span className="font-medium">{selectedProduct.progress.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ETA:</span>
                      <span className="font-medium">{selectedProduct.eta}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Next Destination</h4>
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-medium">{selectedProduct.nextLocation}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <BlockchainViewer transactions={selectedProduct.blockchain} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};