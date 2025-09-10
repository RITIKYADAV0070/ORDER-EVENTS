import { OrderItem } from "./order";

export enum EventType {
  ORDER_CREATED = "OrderCreated",
  PAYMENT_RECEIVED = "PaymentReceived", 
  SHIPPING_SCHEDULED = "ShippingScheduled",
  ORDER_CANCELLED = "OrderCancelled"
}

export interface BaseEvent {
  eventId: string;
  timestamp: string;
  eventType: EventType;
}

export interface OrderCreatedEvent extends BaseEvent {
  eventType: EventType.ORDER_CREATED;
  orderId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
}

export interface PaymentReceivedEvent extends BaseEvent {
  eventType: EventType.PAYMENT_RECEIVED;
  orderId: string;
  amountPaid: number;
}

export interface ShippingScheduledEvent extends BaseEvent {
  eventType: EventType.SHIPPING_SCHEDULED;
  orderId: string;
  shippingDate: string;
}

export interface OrderCancelledEvent extends BaseEvent {
  eventType: EventType.ORDER_CANCELLED;
  orderId: string;
  reason: string;
}

export type Event = OrderCreatedEvent | PaymentReceivedEvent | ShippingScheduledEvent | OrderCancelledEvent;

// hatchling - LLM generated helper function
export function parseEvent(jsonString: string): Event | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed.eventType || !parsed.eventId || !parsed.timestamp) {
      console.warn("Invalid event format: missing required fields");
      return null;
    }
    
    return parsed as Event;
  } catch (error) {
    console.error("Failed to parse event JSON:", error);
    return null;
  }
}