import express from 'express';
import { OrderController } from './orderController';
import kafkaProducer from './kafkaProducer';

const app = express();
app.use(express.json());

// Initialize Kafka producer
(async () => {
  try {
    await kafkaProducer.connect();
    console.log("Kafka producer connected");
  } catch (err) {
    console.error("Kafka producer connection error:", err);
  }
})();

const orderController = new OrderController();

app.post('/orders', orderController.createOrder.bind(orderController));
app.get('/orders/:id', orderController.getOrder.bind(orderController));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Order Service listening on port ${port}`);
});
