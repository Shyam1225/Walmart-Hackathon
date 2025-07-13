import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquare, X, Send, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactDriverProps {
  route: {
    id: string;
    driver: string;
    vehicle: string;
    currentLocation: string;
    status: string;
  };
  onClose: () => void;
}

export const ContactDriver = ({ route, onClose }: ContactDriverProps) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "driver",
      text: "Hello! I'm currently en route to your location. ETA is about 15 minutes.",
      timestamp: "2 min ago"
    }
  ]);
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: chatMessages.length + 1,
      sender: "customer",
      text: message,
      timestamp: "now"
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessage("");

    // Simulate driver response
    setTimeout(() => {
      const driverResponse = {
        id: chatMessages.length + 2,
        sender: "driver",
        text: "Thanks for the update! I'll be there shortly.",
        timestamp: "now"
      };
      setChatMessages(prev => [...prev, driverResponse]);
    }, 2000);

    toast({
      title: "Message Sent",
      description: "Your message has been sent to the driver.",
    });
  };

  const handleCall = () => {
    toast({
      title: "Calling Driver",
      description: "Connecting you with the driver...",
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/95 backdrop-blur-sm border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Contact Driver - {route.driver}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {route.vehicle} • Route {route.id}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Driver Info */}
        <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{route.driver}</p>
              <p className="text-sm text-muted-foreground">{route.currentLocation}</p>
            </div>
          </div>
          <Badge className={
            route.status === "active" ? "bg-success-green text-white" :
            route.status === "delayed" ? "bg-destructive text-white" :
            "bg-primary text-white"
          }>
            {route.status.toUpperCase()}
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={handleCall} className="gap-2">
            <Phone className="h-4 w-4" />
            Call Driver
          </Button>
          <Button variant="outline" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Emergency Contact
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="space-y-3">
          <h4 className="font-semibold">Chat Messages</h4>
          <div className="bg-secondary/10 rounded-lg p-4 max-h-64 overflow-y-auto space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "customer" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.sender === "customer"
                      ? "bg-primary text-white"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === "customer" ? "text-white/70" : "text-muted-foreground"
                  }`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Send Message */}
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message to the driver..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 min-h-[80px]"
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} className="self-end">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};