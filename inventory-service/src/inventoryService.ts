import { MongoClient, Db } from 'mongodb';

export interface Inventory {
  productId: string;
  quantity: number;
}

export class InventoryService {
  private db!: Db;
  
  constructor() {
    const client = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017');
    client.connect().then(() => {
      this.db = client.db('inventory_db');
      console.log("Connected to MongoDB for Inventory Service");
    }).catch((err) => {
      console.error("Error connecting to MongoDB", err);
    });
  }
  
  async getInventory(productId: string): Promise<Inventory | null> {
    const doc = await this.db.collection('inventories').findOne({ productId });
    if (!doc) return null;
    return {
      productId: doc.productId,
      quantity: doc.quantity
    } as Inventory;
  }
  
  async decreaseInventory(productId: string, quantity: number) {
    await this.db.collection('inventories').updateOne(
      { productId },
      { $inc: { quantity: -quantity } }
    );
    console.log(`Decreased inventory for product ${productId} by ${quantity}`);
  }
}
