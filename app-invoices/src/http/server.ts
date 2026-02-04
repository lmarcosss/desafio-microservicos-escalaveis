import '@opentelemetry/auto-instrumentations-node/register'

import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import '../broker/subscriber.ts'


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.register(fastifyCors, { origin: "*" })  

app.get('/health', async (request, reply) => {
    return reply.status(200).send({ status: 'ok' })
})

app.listen({ host: '0.0.0.0', port: 3334 }, (err, address) => {
    console.log(`[Invoices] Http Server running!`)
})