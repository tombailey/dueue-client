# dueue-client

## Introduction

A client for [dueue](https://github.com/tombailey/dueue).

## Getting started

```sh
npm install --save dueue-client
```

```ts
import DueueClient from "dueue-client";

const dueueClient = new DueueClient("http://localhost:8080");

const queueName = "example-queue";
await dueueClient.publish(queueName, "hello world");

const subscriberId = "example-subscriber";
const message = await dueueClient.receive(queueName, subscriberId);
if (message !== null) {
  console.log(message.body);
  await dueueClient.acknowledge(queueName, subscriberId, message.id);
}
```
