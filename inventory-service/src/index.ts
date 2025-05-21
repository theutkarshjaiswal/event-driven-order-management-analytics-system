import express from 'express';
import { InventoryController } from './inventoryController';
import kafkaConsumer from './kafkaConsumer';

const app = express();
app.use(express.json());

const inventoryController = new InventoryController();

// Expose endpoint to query inventory by productId
app.get('/inventory/:productId', inventoryController.getInventory.bind(inventoryController));

// Start Kafka consumer to listen for order-created events:
(async () => {
  try {
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe('order-created', async ({ message }) => {
      const order = JSON.parse(message.value.toString());
      console.log("Received order event:", order);
      // Update inventory based on the order
      await inventoryController.handleOrderCreated(order);
    });
    console.log("Kafka consumer is running");
  } catch (err) {
    console.error("Kafka consumer error:", err);
  }
})();

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Inventory Service listening on port ${port}`);
});
