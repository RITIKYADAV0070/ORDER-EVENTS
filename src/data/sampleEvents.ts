// Sample event data in JSON format as specified in requirements
export const sampleEventData = [
  `{"eventId": "e1", "timestamp": "2025-01-10T10:00:00Z", "eventType": "OrderCreated", "orderId": "ORD001", "customerId": "CUST001", "items": [{"itemId": "P001", "qty": 2}, {"itemId": "P002", "qty": 1}], "totalAmount": 150.00}`,
  
  `{"eventId": "e2", "timestamp": "2025-01-10T10:15:00Z", "eventType": "OrderCreated", "orderId": "ORD002", "customerId": "CUST002", "items": [{"itemId": "P003", "qty": 1}], "totalAmount": 89.99}`,
  
  `{"eventId": "e3", "timestamp": "2025-01-10T10:30:00Z", "eventType": "PaymentReceived", "orderId": "ORD001", "amountPaid": 150.00}`,
  
  `{"eventId": "e4", "timestamp": "2025-01-10T10:45:00Z", "eventType": "OrderCreated", "orderId": "ORD003", "customerId": "CUST003", "items": [{"itemId": "P001", "qty": 3}, {"itemId": "P004", "qty": 2}], "totalAmount": 299.99}`,
  
  `{"eventId": "e5", "timestamp": "2025-01-10T11:00:00Z", "eventType": "PaymentReceived", "orderId": "ORD002", "amountPaid": 45.00}`,
  
  `{"eventId": "e6", "timestamp": "2025-01-10T11:15:00Z", "eventType": "ShippingScheduled", "orderId": "ORD001", "shippingDate": "2025-01-11"}`,
  
  `{"eventId": "e7", "timestamp": "2025-01-10T11:30:00Z", "eventType": "PaymentReceived", "orderId": "ORD003", "amountPaid": 299.99}`,
  
  `{"eventId": "e8", "timestamp": "2025-01-10T11:45:00Z", "eventType": "OrderCancelled", "orderId": "ORD002", "reason": "Customer requested cancellation"}`,
  
  `{"eventId": "e9", "timestamp": "2025-01-10T12:00:00Z", "eventType": "ShippingScheduled", "orderId": "ORD003", "shippingDate": "2025-01-12"}`,
  
  `{"eventId": "e10", "timestamp": "2025-01-10T12:15:00Z", "eventType": "OrderCreated", "orderId": "ORD004", "customerId": "CUST004", "items": [{"itemId": "P005", "qty": 1}], "totalAmount": 49.99}`,
];