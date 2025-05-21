import { Pool } from 'pg';

export interface Order {
  id: string;
  productId: string;
  quantity: number;
  status: string;
}

export class OrderService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL || 'postgresql://user:password@localhost:5432/orders_db'
    });
  }

  async createOrder(productId: string, quantity: number): Promise<Order> {
    const result = await this.pool.query(
      'INSERT INTO orders (product_id, quantity, status) VALUES ($1, $2, $3) RETURNING *',
      [productId, quantity, 'created']
    );
    return result.rows[0];
  }

  async getOrder(id: string): Promise<Order | null> {
    const result = await this.pool.query(
      'SELECT * FROM orders WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }
}
