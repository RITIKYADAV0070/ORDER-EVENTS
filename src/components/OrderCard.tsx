import { Order } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, User, DollarSign, Clock } from "lucide-react";

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const statusColor = order.getStatusColor();
  
  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4" 
          style={{ borderLeftColor: `hsl(var(--${statusColor}))` }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            {order.orderId}
          </CardTitle>
          <Badge variant={statusColor as any} className="font-medium">
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>Customer: {order.customerId}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Created: {order.createdAt.toLocaleDateString()}</span>
        </div>
        
        {order.eventHistory.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <span className="text-xs text-muted-foreground">
              {order.eventHistory.length} event{order.eventHistory.length !== 1 ? 's' : ''} processed
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};