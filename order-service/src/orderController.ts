import { Request, Response } from 'express';
import { OrderService, Order } from './orderService';
import kafkaProducer from './kafkaProducer';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }
  
  async createOrder(req: Request, res: Response) {
    try {
      const { productId, quantity } = req.body;
      const order: Order = await this.orderService.createOrder(productId, quantity);

      // Publish order-created event
      await kafkaProducer.send('order-created', order);

      res.status(201).json(order);
    } catch (error) {
      console.error("Error in createOrder:", error);
      res.status(500).json({ error: 'Error creating order' });
    }
  }

  async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order: Order | null = await this.orderService.getOrder(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      console.error("Error in getOrder:", error);
      res.status(500).json({ error: 'Error retrieving order' });
    }
  }
}
