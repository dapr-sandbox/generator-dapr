import { LanguageTemplates, ComponentTemplates } from './types';

export const componentTemplates: ComponentTemplates = {
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

export const languageTemplates: LanguageTemplates = {
    "C#": {
        languageName: "csharp",
        codePath: "languages/csharp",
        manifestPath: "microservice-manifests/csharp.yaml",
        port: 80
    },
    "Python": {
        languageName: "python",
        codePath: "languages/python",
        manifestPath: "microservice-manifests/python.yaml",
        port: 5000
    },
    "JavaScript": {
        languageName: "javascript",
        codePath: "languages/javascript",
        manifestPath: "microservice-manifests/javascript.yaml",
        port: 3000
    },
    "Go": {
        languageName: "go",
        codePath: "languages/go",
        manifestPath: "microservice-manifests/go.yaml",
        port: 6000
    },
    "TypeScript": {
        languageName: "typescript",
        codePath: "languages/typescript",
        manifestPath: "microservice-manifests/typescript.yaml",
        port: 3001
    }
}