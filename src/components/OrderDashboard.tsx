import { useState, useEffect } from "react";
import { OrderCard } from "./OrderCard";
import { EventTimeline } from "./EventTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EventProcessor } from "@/services/EventProcessor";
import { NotificationManager, LoggerObserver, AlertObserver } from "@/services/observers";
import { parseEvent } from "@/types/events";
import { sampleEventData } from "@/data/sampleEvents";
import { Play, BarChart3, Package, CreditCard, Truck, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const OrderDashboard = () => {
  const [processor] = useState(() => {
    const notificationManager = new NotificationManager();
    notificationManager.addObserver(new LoggerObserver());
    notificationManager.addObserver(new AlertObserver());
    return new EventProcessor(notificationManager);
  });
  
  const [orders, setOrders] = useState(processor.getOrders());
  const [events, setEvents] = useState(processor.getProcessedEvents());
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const processNextEvent = () => {
    if (currentEventIndex >= sampleEventData.length) {
      toast({
        title: "All Events Processed",
        description: "No more events to process",
      });
      return;
    }

    const eventJson = sampleEventData[currentEventIndex];
    const event = parseEvent(eventJson);
    
    if (event) {
      const success = processor.processEvent(event);
      if (success) {
        setOrders([...processor.getOrders()]);
        setEvents([...processor.getProcessedEvents()]);
        setCurrentEventIndex(prev => prev + 1);
        
        toast({
          title: "Event Processed",
          description: `${event.eventType} processed successfully`,
        });
      } else {
        toast({
          title: "Processing Failed",
          description: "Failed to process event",
          variant: "destructive",
        });
      }
    }
  };

  const processAllEvents = async () => {
    setIsProcessing(true);
    
    for (let i = currentEventIndex; i < sampleEventData.length; i++) {
      const eventJson = sampleEventData[i];
      const event = parseEvent(eventJson);
      
      if (event) {
        processor.processEvent(event);
        setCurrentEventIndex(i + 1);
        
        // Add a small delay for visual effect
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setOrders([...processor.getOrders()]);
        setEvents([...processor.getProcessedEvents()]);
      }
    }
    
    setIsProcessing(false);
    toast({
      title: "Batch Processing Complete",
      description: `Processed ${sampleEventData.length} events`,
    });
  };

  const getStatusCounts = () => {
    const counts = {
      PENDING: 0,
      PAID: 0,
      SHIPPED: 0,
      CANCELLED: 0,
    };
    
    orders.forEach(order => {
      if (order.status in counts) {
        counts[order.status as keyof typeof counts]++;
      }
    });
    
    return counts;
  };

  const statusCounts = getStatusCounts();
  const totalRevenue = orders
    .filter(order => order.status === 'PAID' || order.status === 'SHIPPED')
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Order Processing System
          </h1>
          <p className="text-muted-foreground">
            Event-driven order management with real-time processing
          </p>
        </div>

        {/* Controls */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Event Processing Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button 
              onClick={processNextEvent}
              disabled={isProcessing || currentEventIndex >= sampleEventData.length}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Process Next Event ({currentEventIndex + 1}/{sampleEventData.length})
            </Button>
            
            <Button 
              variant="outline" 
              onClick={processAllEvents}
              disabled={isProcessing || currentEventIndex >= sampleEventData.length}
              className="flex items-center gap-2"
            >
              {isProcessing ? "Processing..." : "Process All Events"}
            </Button>
            
            <div className="text-sm text-muted-foreground flex items-center">
              Events remaining: {sampleEventData.length - currentEventIndex}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-2xl font-bold">{statusCounts.PENDING}</p>
                </div>
                <Package className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Paid</p>
                  <p className="text-2xl font-bold">{statusCounts.PAID}</p>
                </div>
                <CreditCard className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Shipped</p>
                  <p className="text-2xl font-bold">{statusCounts.SHIPPED}</p>
                </div>
                <Truck className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Orders */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold">Orders</h2>
            {orders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No orders yet. Process some events to see orders appear.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders.map(order => (
                  <OrderCard key={order.orderId} order={order} />
                ))}
              </div>
            )}
          </div>

          {/* Event Timeline */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
            <EventTimeline events={events} />
          </div>
        </div>
      </div>
    </div>
  );
};