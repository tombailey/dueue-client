import DueueClient from "./interface";
import Message from "../entity/message";

export default class FetchDueueClient implements DueueClient {
  private readonly host: string;

  constructor(host: string) {
    this.host = host;
  }

  async publish(
    queueName: string,
    body: string,
    expiry: Date | undefined = undefined
  ): Promise<void> {
    const response = await fetch(`${this.host}/dueue/${queueName}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: body,
        expiry: expiry ? expiry.getTime() / 1000 : undefined,
      }),
    });
    if (!response.ok) {
      throw new Error(`Expected 2xx but got ${response.status}`);
    }
  }

  async receive(
    queueName: string,
    subscriberId: string
  ): Promise<Message | null> {
    const response = await fetch(
      `${this.host}/dueue/${queueName}?subscriberId=${subscriberId}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      } else {
        throw new Error(`Expected 2xx but got ${response.status}`);
      }
    } else {
      const json = await response.json();
      return {
        id: json.id,
        body: json.message,
      };
    }
  }

  async acknowledge(
    queueName: string,
    subscriberId: string,
    messageId: string
  ): Promise<void> {
    const response = await fetch(
      `${this.host}/dueue/${queueName}/${messageId}?subscriberId=${subscriberId}`,
      {
        method: "delete",
      }
    );
    if (!response.ok) {
      throw new Error(`Expected 2xx but got ${response.status}`);
    }
  }
}
