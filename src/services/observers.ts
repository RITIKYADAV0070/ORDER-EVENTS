import { Order } from "../types/order";
import { Event } from "../types/events";
import { toast } from "@/hooks/use-toast";

export interface OrderObserver {
  onStatusChanged(order: Order): void;
  onEventProcessed(event: Event, order: Order): void;
}

export class LoggerObserver implements OrderObserver {
  onStatusChanged(order: Order): void {
    console.log(`📋 Order ${order.orderId} status changed to: ${order.status}`);
  }

  onEventProcessed(event: Event, order: Order): void {
    console.log(`🔄 Event processed: ${event.eventType} for Order ${order.orderId}`);
  }
}

export class AlertObserver implements OrderObserver {
  onStatusChanged(order: Order): void {
    console.log(`🚨 ALERT: Order ${order.orderId} status changed to ${order.status}`);
    
    // Show toast notification for critical status changes
    const criticalStatuses = ["SHIPPED", "CANCELLED"];
    if (criticalStatuses.includes(order.status)) {
      toast({
        title: "Order Status Update",
        description: `Order ${order.orderId} is now ${order.status}`,
        variant: order.status === "CANCELLED" ? "destructive" : "default",
      });
    }
  }

  onEventProcessed(event: Event, order: Order): void {
    console.log(`⚡ Event Alert: ${event.eventType} processed for Order ${order.orderId}`);
  }
}

export class NotificationManager {
  private observers: OrderObserver[] = [];

  addObserver(observer: OrderObserver): void {
    this.observers.push(observer);
  }

  removeObserver(observer: OrderObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyStatusChanged(order: Order): void {
    this.observers.forEach(observer => observer.onStatusChanged(order));
  }

  notifyEventProcessed(event: Event, order: Order): void {
    this.observers.forEach(observer => observer.onEventProcessed(event, order));
  }
}