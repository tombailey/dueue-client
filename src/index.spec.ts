import { GenericContainer, StartedTestContainer } from "testcontainers";
import DueueClient from "./client/interface";
import FetchDueueClient from ".";

describe("GenericContainer", () => {
  let dueueContainer: StartedTestContainer;
  let dueueClient: DueueClient;

  beforeAll(async () => {
    dueueContainer = await new GenericContainer("tombailey256/dueue:1.0.0")
      .withEnv("DURABILITY_ENGINE", "memory")
      .withEnv("HTTP_PORT", "8080")
      .withExposedPorts(8080)
      .start();
  });

  beforeEach(() => {
    dueueClient = new FetchDueueClient(
      `http://${dueueContainer.getHost()}:${dueueContainer.getMappedPort(8080)}`
    );
  });

  afterAll(async () => {
    await dueueContainer.stop();
  });

  it("should publish messages", async () => {
    await dueueClient.publish("publish-test", "test");
  });

  it("should receive messages", async () => {
    await dueueClient.publish("receive-test", "test");
    const message = await dueueClient.receive(
      "receive-test",
      "receive-test-subscriber"
    );
    expect(message).not.toBeNull();
    expect(message?.body).toEqual("test");
  });

  it("should acknowledge messages", async () => {
    await dueueClient.publish("acknowledge-test", "test");
    const message = await dueueClient.receive(
      "acknowledge-test",
      "acknowledge-test-subscriber"
    );
    expect(message).not.toBeNull();

    const id = message!.id;
    await dueueClient.acknowledge(
      "acknowledge-test",
      "acknowledge-test-subscriber",
      id
    );

    const messageAfterAcknowledge = await dueueClient.receive(
      "acknowledge-test",
      "acknowledge-test-subscriber"
    );
    expect(messageAfterAcknowledge).toBeNull();
  });
});
