export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  SHIPPED = "SHIPPED",
  CANCELLED = "CANCELLED"
}

export interface OrderItem {
  itemId: string;
  qty: number;
}

export class Order {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  eventHistory: string[]; // Store event IDs
  createdAt: Date;
  updatedAt: Date;

  constructor(
    orderId: string,
    customerId: string,
    items: OrderItem[],
    totalAmount: number
  ) {
    this.orderId = orderId;
    this.customerId = customerId;
    this.items = items;
    this.totalAmount = totalAmount;
    this.status = OrderStatus.PENDING;
    this.eventHistory = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateStatus(newStatus: OrderStatus): void {
    this.status = newStatus;
    this.updatedAt = new Date();
  }

  addEventToHistory(eventId: string): void {
    this.eventHistory.push(eventId);
    this.updatedAt = new Date();
  }

  getStatusColor(): string {
    switch (this.status) {
      case OrderStatus.PENDING:
        return "warning";
      case OrderStatus.PAID:
        return "primary";
      case OrderStatus.PARTIALLY_PAID:
        return "warning";
      case OrderStatus.SHIPPED:
        return "success";
      case OrderStatus.CANCELLED:
        return "destructive";
      default:
        return "muted";
    }
  }
}