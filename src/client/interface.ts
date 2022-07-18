import Message from "../entity/message";

type DueueClient = {
  publish(
    queueName: string,
    body: string,
    expiry?: Date | undefined
  ): Promise<void>;
  receive(queueName: string, subscriberId: string): Promise<Message | null>;
  acknowledge(
    queueName: string,
    subscriberId: string,
    messageId: string
  ): Promise<void>;
};

export default DueueClient;
