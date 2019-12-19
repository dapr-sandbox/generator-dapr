import { LanguageLookup, ComponentLookup } from './types';

export const componentLookup: ComponentLookup = {
    "Redis": {
        componentName: "redis",
        manifestPath: "state/redis.yaml"
    },
    "Azure CosmosDB": {
        componentName: "cosmosdb",
        manifestPath: "state/cosmosdb.yaml"
    },
    "NATS": {
        componentName: "nats-pubsub",
        manifestPath: "pubsub/nats-pubsub.yaml"
    },
    "RabbitMQ": {
        componentName: "rabbitmq-pubsub",
        manifestPath: "pubsub/rabbitmq-pubsub.yaml"
    },
    "Redis Streams": {
        componentName: "redis-pubsub",
        manifestPath: "pubsub/redis-pubsub.yaml"
    },
    "Azure Service Bus": {
        componentName: "servicebus-pubsub",
        manifestPath: "pubsub/servicebus-pubsub.yaml"
    }
}

export const languageLookup: LanguageLookup = {
    "C#": {
        languageName: "csharp",
        codePath: "languages/csharp",
        manifestPath: "microservice-manifests/csharp.yaml"
    },
    "Python": {
        languageName: "python",
        codePath: "languages/python",
        manifestPath: "microservice-manifests/python.yaml"
    },
    "JavaScript": {
        languageName: "javascript",
        codePath: "languages/javascript",
        manifestPath: "microservice-manifests/javascript.yaml"
    },
    "Go": {
        languageName: "go",
        codePath: "languages/go",
        manifestPath: "microservice-manifests/go.yaml"
    },
    "TypeScript": {
        languageName: "typescript",
        codePath: "languages/typescript",
        manifestPath: "microservice-manifests/typescript.yaml"
    }
}