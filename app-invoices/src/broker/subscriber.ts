import { orders } from "./channels/orders.ts";

orders.consume("orders", async (message) => {
    if (!message) {
        console.error("Received null message");
        return null;
    }

    console.log("Received message:", message?.content.toString());

    orders.ack(message);
}, {
    noAck: false,
})

// acknowledge => reconhecer que a mensagem foi recebida com sucesso
 