import { Order, OrderStatus } from "../types/order";
import { Event, EventType, OrderCreatedEvent, PaymentReceivedEvent, ShippingScheduledEvent, OrderCancelledEvent } from "../types/events";
import { NotificationManager } from "./observers";

export class EventProcessor {
  private orders: Map<string, Order> = new Map();
  private processedEvents: Event[] = [];
  private notificationManager: NotificationManager;

  constructor(notificationManager: NotificationManager) {
    this.notificationManager = notificationManager;
  }

  processEvent(event: Event): boolean {
    try {
      const orderId = 'orderId' in event ? event.orderId : '';
      const previousStatus = this.orders.get(orderId)?.status;
      
      switch (event.eventType) {
        case EventType.ORDER_CREATED:
          this.handleOrderCreated(event as OrderCreatedEvent);
          break;
        case EventType.PAYMENT_RECEIVED:
          this.handlePaymentReceived(event as PaymentReceivedEvent);
          break;
        case EventType.SHIPPING_SCHEDULED:
          this.handleShippingScheduled(event as ShippingScheduledEvent);
          break;
        case EventType.ORDER_CANCELLED:
          this.handleOrderCancelled(event as OrderCancelledEvent);
          break;
        default:
          console.warn(`⚠️  Unsupported event type: ${(event as any).eventType}`);
          return false;
      }

      this.processedEvents.push(event);
      const order = this.orders.get(orderId);
      
      if (order) {
        order.addEventToHistory(event.eventId);
        this.notificationManager.notifyEventProcessed(event, order);
        
        // Notify status change if status actually changed
        if (previousStatus && previousStatus !== order.status) {
          this.notificationManager.notifyStatusChanged(order);
        }
      }

      return true;
    } catch (error) {
      console.error(`❌ Failed to process event ${event.eventId}:`, error);
      return false;
    }
  }

  private handleOrderCreated(event: OrderCreatedEvent): void {
    const order = new Order(
      event.orderId,
      event.customerId,
      event.items,
      event.totalAmount
    );
    
    this.orders.set(event.orderId, order);
    console.log(`✅ Order created: ${event.orderId}`);
  }

  private handlePaymentReceived(event: PaymentReceivedEvent): void {
    const order = this.orders.get(event.orderId);
    if (!order) {
      console.warn(`⚠️  Order not found for payment: ${event.orderId}`);
      return;
    }

    if (event.amountPaid >= order.totalAmount) {
      order.updateStatus(OrderStatus.PAID);
      console.log(`💰 Payment completed for order: ${event.orderId}`);
    } else if (event.amountPaid > 0) {
      order.updateStatus(OrderStatus.PARTIALLY_PAID);
      console.log(`💰 Partial payment received for order: ${event.orderId}`);
    }
  }

  private handleShippingScheduled(event: ShippingScheduledEvent): void {
    const order = this.orders.get(event.orderId);
    if (!order) {
      console.warn(`⚠️  Order not found for shipping: ${event.orderId}`);
      return;
    }

    order.updateStatus(OrderStatus.SHIPPED);
    console.log(`🚚 Shipping scheduled for order: ${event.orderId}`);
  }

  private handleOrderCancelled(event: OrderCancelledEvent): void {
    const order = this.orders.get(event.orderId);
    if (!order) {
      console.warn(`⚠️  Order not found for cancellation: ${event.orderId}`);
      return;
    }

    order.updateStatus(OrderStatus.CANCELLED);
    console.log(`❌ Order cancelled: ${event.orderId} - Reason: ${event.reason}`);
  }

  getOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  getProcessedEvents(): Event[] {
    return [...this.processedEvents];
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }
}