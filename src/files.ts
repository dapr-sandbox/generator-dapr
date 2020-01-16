import { LanguageTemplates, ComponentTemplates } from './types';

export const componentTemplates: ComponentTemplates = {
    "Redis": {
        componentName: "redis-state",
        manifestPath: "state/redis-state.yaml"
    },
    "Redis Binding": {
        componentName: "redis-binding",
        manifestPath: "bindings/redis-binding.yaml"
    },
    "Azure CosmosDB": {
        componentName: "cosmosdb-state",
        manifestPath: "state/cosmosdb-state.yaml"
    },
    "NATS": {
        componentName: "nats-pubsub",
        manifestPath: "pubsub/nats-pubsub.yaml"
    },
    "RabbitMQ": {
        componentName: "rabbitmq-pubsub",
        manifestPath: "pubsub/rabbitmq-pubsub.yaml"
    },
    "RabbitMQ Binding": {
        componentName: "rabbitmq-binding",
        manifestPath: "bindings/rabbitmq-binding.yaml"
    },
    "Redis Streams": {
        componentName: "redis-pubsub",
        manifestPath: "pubsub/redis-pubsub.yaml"
    },
    "Azure Service Bus": {
        componentName: "servicebus-pubsub",
        manifestPath: "pubsub/servicebus-pubsub.yaml"
    }, 
    "AWS DynamoDB Binding": {
        componentName: "aws-dynamodb-binding",
        manifestPath: "bindings/aws-dynamodb-binding.yaml"
    },
    "AWS S3 Binding": {
        componentName: "aws-s3-binding",
        manifestPath: "bindings/aws-s3-binding.yaml"
    },
    "AWS SNS Binding": {
        componentName: "aws-sns-binding",
        manifestPath: "bindings/aws-sns-binding.yaml"
    },
    "AWS SQS Binding": {
        componentName: "aws-sqs-binding",
        manifestPath: "bindings/aws-sqs-binding.yaml"
    },
    "Azure Blob Storage Binding": {
        componentName: "azure-blob-storage-binding",
        manifestPath: "bindings/azure-blob-storage-binding.yaml"
    },
    "Azure CosmosDB Binding": {
        componentName: "azure-cosmosdb-binding",
        manifestPath: "bindings/azure-cosmosdb-binding.yaml"
    },
    "Azure EventHubs Binding": {
        componentName: "azure-eventhubs-binding",
        manifestPath: "bindings/azure-eventhubs-binding.yaml"
    },
    "Azure Service Bus Queues Binding": {
        componentName: "azure-service-bus-queues-binding",
        manifestPath: "bindings/azure-service-bus-queues-binding.yaml"
    },
    "Azure SignalR Binding": {
        componentName: "azure-signalr-binding",
        manifestPath: "bindings/azure-signalr-binding.yaml"
    },
    "GCP Cloud Pub/Sub Binding": {
        componentName: "gcp-cloud-pubsub-binding",
        manifestPath: "bindings/gcp-cloud-pubsub-binding.yaml"
    },
    "GCP Storage Bucket Binding": {
        componentName: "gcp-storage-bucket-binding",
        manifestPath: "bindings/gcp-storage-bucket-binding.yaml"
    }, 
    "HTTP Binding": {
        componentName: "http-binding",
        manifestPath: "bindings/http-binding.yaml"
    },
    "Kafka Binding": {
        componentName: "kafka-binding",
        manifestPath: "bindings/kafka-binding.yaml"
    },
    "Kubernetes Events Binding": {
        componentName: "kubernetes-events-binding",
        manifestPath: "bindings/kubernetes-events-binding.yaml"
    },
    "MQTT Binding": {
        componentName: "mqtt-binding",
        manifestPath: "bindings/mqtt-binding.yaml"
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