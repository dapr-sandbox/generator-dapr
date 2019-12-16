// Supported dapr modes
type DaprMode = "Kubernetes" | "Standalone";

// Supported languages
type Language = "JavaScript" | "TypeScript" | "Go" | "Python" | "C#";

// Supported state stores
type StateStore = "Redis" | "CosmosDB" | "Cassandra";

// Supported protocols
type DaprProtocol = "HTTP" | "gRPC";

// Supported pubsub components
type PubSub = "Redis";

export interface Answers {
    name: string,
    daprMode: string,
    languages: string[],
    store: string
}

export interface Microservice {
    /** Informs the language of the microservice */
    language: Language;
    /** Informs whether or not to add boilerplate state management code to microservice */
    statePersistance: boolean;
    /** Informs whether or not to add boilerplate pubsub code to microservice */
    pubsub: boolean;
    /** Informs whether or not the microservice's manifest should include a LoadBalancer */
    externalEndpoint: boolean;
    /** Informs whether or not to add boilerplate actor code to microservice */
    actors?: boolean;
    /** Informs protocol boilerplate to add to microservice */
    protocol?: DaprProtocol;
}

export interface App {
    /** Informs whether the dapr app is running in Kubernetes or in Standalone mode */
    mode: DaprMode;
    /** Informs the microservices that compose the dapr application */
    microservices: Microservice[];
    /** Informs the state store to be used by the dapr application */
    stateStore?: StateStore;
    /** Informs the pubsub mechanism to be used by the dapr application */
    pubsub?: PubSub;
}

export interface Prompt {
    type: string,
    name: string,
    message: string,
    choices?: string[]
}

export type Prompts = Prompt[];