import '@opentelemetry/auto-instrumentations-node/register'

import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { z } from 'zod'
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { db } from '../db/client.ts'
import { schema } from '../db/schema/index.ts'
import { randomUUID } from 'crypto'
import { dispatchOrderCreated } from '../broker/messages/order-created.ts'
import { trace } from '@opentelemetry/api'
import { setTimeout } from 'node:timers/promises'
import { tracer } from '../tracer/tracer.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.register(fastifyCors, { origin: "*" })  

app.get('/health', async (request, reply) => {
    return reply.status(200).send({ status: 'ok' })
})

app.post('/orders',{ schema: {
    body: z.object({
        amount: z.coerce.number(),
    })
}}, async (request, reply) => {
    const { amount } = request.body

    console.log('Creating and order with amount', amount)

    const orderId = randomUUID()
    const customerId = "a131c01a-e4e6-4e67-a7ff-0d36150e2963"

    await db.insert(schema.orders).values({
        id: crypto.randomUUID(),
        customerId,
        status: 'pending',
        amount,
    }).execute()

    const span = tracer.startSpan("Deu ruim aqui")

    span.setAttribute("teste", "Hello World")

    await setTimeout(2000)

    span.end()
    
    trace.getActiveSpan()?.setAttribute("order_id", orderId)

    dispatchOrderCreated({
        orderId,
        amount,
        customer: {
            id: customerId,
        }
    })

    return reply.status(201).send()
})

app.listen({ host: '0.0.0.0', port: 3333 }, (err, address) => {
    console.log(`[Orders] Http Server running!`)
})