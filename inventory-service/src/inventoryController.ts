import { Request, Response } from 'express';
import { InventoryService } from './inventoryService';

export class InventoryController {
  private inventoryService: InventoryService;
  
  constructor() {
    this.inventoryService = new InventoryService();
  }
  
  async getInventory(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const inventory = await this.inventoryService.getInventory(productId);
      if (!inventory) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(inventory);
    } catch (error) {
      console.error("Error in getInventory:", error);
      res.status(500).json({ error: 'Failed to retrieve inventory' });
    }
  }
  
  // Called when an order is created
  async handleOrderCreated(order: any) {
    const { productId, quantity } = order;
    await this.inventoryService.decreaseInventory(productId, quantity);
  }
}
