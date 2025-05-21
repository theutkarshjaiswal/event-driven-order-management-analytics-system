import { Kafka } from 'kafkajs';

class KafkaConsumer {
  private kafka;
  private consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'inventory-service',
      brokers: ['localhost:9092']
    });
    this.consumer = this.kafka.consumer({ groupId: 'inventory-group' });
  }

  async connect() {
    await this.consumer.connect();
  }

  async subscribe(topic: string, callback: ({ topic, partition, message }: any) => void) {
    await this.consumer.subscribe({ topic, fromBeginning: true });
    await this.consumer.run({
      eachMessage: async (payload) => {
        await callback(payload);
      }
    });
  }
}

export default new KafkaConsumer();
