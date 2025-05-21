import { Kafka } from 'kafkajs';

class KafkaProducer {
  private kafka;
  private producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'order-service',
      brokers: ['localhost:9092'] // Change if your broker is elsewhere
    });
    this.producer = this.kafka.producer();
  }

  async connect() {
    await this.producer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
  }

  async send(topic: string, message: object) {
    await this.producer.send({
      topic,
      messages: [
        { value: JSON.stringify(message) }
      ]
    });
    console.log(`Message sent to topic ${topic}`);
  }
}

export default new KafkaProducer();
