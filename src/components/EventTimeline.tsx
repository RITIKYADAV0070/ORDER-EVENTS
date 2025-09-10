import { Event, EventType } from "@/types/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Package, CreditCard, Truck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventTimelineProps {
  events: Event[];
}

const getEventIcon = (eventType: EventType) => {
  switch (eventType) {
    case EventType.ORDER_CREATED:
      return <Package className="h-4 w-4" />;
    case EventType.PAYMENT_RECEIVED:
      return <CreditCard className="h-4 w-4" />;
    case EventType.SHIPPING_SCHEDULED:
      return <Truck className="h-4 w-4" />;
    case EventType.ORDER_CANCELLED:
      return <XCircle className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getEventColor = (eventType: EventType) => {
  switch (eventType) {
    case EventType.ORDER_CREATED:
      return "primary";
    case EventType.PAYMENT_RECEIVED:
      return "success";
    case EventType.SHIPPING_SCHEDULED:
      return "primary";
    case EventType.ORDER_CANCELLED:
      return "destructive";
    default:
      return "muted";
  }
};

export const EventTimeline = ({ events }: EventTimelineProps) => {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Event Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {sortedEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No events processed yet
            </p>
          ) : (
            sortedEvents.map((event, index) => {
              const isLast = index === sortedEvents.length - 1;
              const eventColor = getEventColor(event.eventType);
              const orderId = 'orderId' in event ? (event as any).orderId : 'Unknown';
              
              return (
                <div key={event.eventId} className="relative">
                  {!isLast && (
                    <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
                  )}
                  
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "rounded-full p-2 border-2 bg-background",
                      `border-${eventColor} text-${eventColor}`
                    )}>
                      {getEventIcon(event.eventType)}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={eventColor as any} className="text-xs">
                          {event.eventType}
                        </Badge>
                        <span className="text-sm font-medium">
                          Order: {orderId}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      
                      {'reason' in event && (
                        <p className="text-sm text-muted-foreground italic">
                          Reason: {(event as any).reason}
                        </p>
                      )}
                      
                      {'amountPaid' in event && (
                        <p className="text-sm text-muted-foreground">
                          Amount: ${(event as any).amountPaid.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};