# .NET Core Dapr Microservice
This is a yeoman-generated dapr-enabled .NET Core microservice. You can either run it in self-hosted mode (on your machine) or build a container and run it in Kubernetes.

## Running in Self-Hosted Mode

### Prerequisites

- [Dapr CLI](https://github.com/dapr/cli/releases), must have run `dapr init` 
- [.NET Core](https://dotnet.microsoft.com/download)

### Steps

1. Navigate to the `csharp` directory: `cd csharp`
2. Run `dotnet build` to restore and build the project
3. Run `dotnet run` through the dapr CLI:

```bash
dapr run --app-id csharp --app-port 80 --port 3500 dotnet run
```

In this case we've named the microservice "csharp", specified that it runs on port 80, and specified that the dapr runtime should run on port 3500. Note that if other microservices are already using 3500, you should change this to some other value.

> Note that the dapr cli will automatically configure a Redis store and Redis pubsub component, with component manifests in a "components" directory (`redis.yaml` and `redis_messagebus.yaml` respectively). If you selected non-Redis components (e.g. Cosmos, NATS) that you want to run in self-hosted mode, copy the generated `components` directory into your microservice's directory. `dapr run` will look for the `components` directory and use the components specified there instead of Redis if found. This step will no longer be necessary when [Issue 225](https://github.com/dapr/cli/issues/225) is resolved.

To see that the microservice is running, open a new terminal window and list dapr microservices:

```bash
C:\test>dapr list
  APP ID  DAPR PORT  APP PORT  COMMAND      AGE  CREATED              PID
  csharp  3500       80        dotnet run   10s  2019-12-19 21:24.33  25388
```

### Service Invocation
To test the microservice, you can start by invoking one of its REST endpoints through the dapr port. Use your favorite http client (e.g. curl, Postman, your browser) to make requests against this project's endpoints:

**Deposit Money**

On Linux, MacOS:
 ```sh
curl -X POST http://localhost:80/deposit \
        -H 'Content-Type: application/json' \
        -d '{ "id": "17", "amount": 12 }'
 ```

 On Windows:
 ```sh
curl -X POST http://localhost:80/deposit -H "Content-Type: application/json" -d "{ \"id\": \"17\", \"amount\": 12 }"
 ```

Output:
```txt
 {"id":"17","balance":12}
```

 ---

**Withdraw Money**
On Linux, MacOS:
 ```sh
curl -X POST http://localhost:80/withdraw \
        -H 'Content-Type: application/json' \
        -d '{ "id": "17", "amount": 10 }'
 ```
On Windows:
 ```sh
 curl -X POST http://localhost:80/withdraw -H "Content-Type: application/json" -d "{ \"id\": \"17\", \"amount\": 10 }"
 ```

Outpt:
```txt
{"id":"17","balance":2}
```

 ---

**Get Balance**

```sh
curl http://localhost:80/17
```
Output:
```txt
{"id":"17","balance":2}
```

 ---

### Pubsub
Similarly, you can test the microservice's pubsub functionality by publishing a message topic that it subscribes to. In this case, the microservice subscribes to messages of topic "withdraw", and "deposit". Publish by creating a POST request against `http://localhost:3500/v1.0/{topic}`. Alternatively, use the `dapr publish` command to publish a message: 


 **Withdraw Money (pubsub)**
On Linux, MacOS:
```sh
dapr publish -t withdraw -p '{"id": "17", "amount": 15 }'
```
On Windows:
 ```sh
 dapr publish -t withdraw -p "{\"id\": \"17\", \"amount\": 15 }"
 ```
 ---

**Deposit Money (pubsub)**
On Linux, MacOS:
```sh
dapr publish -t deposit -p '{"id": "17", "amount": 15 }'
```
On Windows:
 ```sh
 dapr publish -t deposit -p "{\"id\": \"17\", \"amount\": 15 }"
```
 ---
Now you're able to use dapr to build pubsub applications! Update the topics your .NET Core microservice subscribes to, create new endpoints/handlers, and try publishing a message from a different microservice! See [pubsub doc](https://github.com/dapr/docs/tree/master/concepts/publish-subscribe-messaging) and [pubsub sample](https://github.com/dapr/samples/tree/master/4.pub-sub) for more details.

## Deploy in Kubernetes

To deploy this microservice to Kubernetes, you first need to containerize it.

### Prerequisites

- Docker
- A Kubernetes cluster (could be a managed cluster or a cluster running on your machine)
- Kubectl configured with your cluster
- Dapr initialized in your cluster: `dapr init --kubernetes`
- A dockerhub account or a container registry to push your container images up to

### Build and Deploy

1. Navigate to the C# directory: `cd csharp`
2. Run `docker build --tag [YOUR_CONTAINER_REGISTRY/YOUR_CONTAINER_NAME] .`
    > Note that YOUR_CONTAINER_REGISTRY should be the name of your dockerhub repository or the name of whatever other container registry (e.g. Azure CR) you're using
3. Update the `deploy/csharp.yaml` file, setting the `image` key to [YOUR_CONTAINER_REGISTRY/YOUR_CONTAINER_NAME]
4. Push your container image up to Dockerhub or your container registry: `docker push [YOUR_CONTAINER_REGISTRY/YOUR_CONTAINER_NAME]`
5. Apply your Kubernetes manifest: `kubectl apply -f csharp.yaml`
    > If you're using a private container registry, you'll need to add the appropriate credentials to the csharp.yaml file
6. Run `kubectl get pods -w` to see your pod spin up:

```cmd
NAME                                      READY   STATUS             RESTARTS   AGE
csharp-microservice-56c74595d-htrk4       2/2     Running            0          6s
```

Once deployed, you should see that 2/2 containers are running for the deployment. This represents the container that hosts your microservice and the container that hosts the dapr runtime.

### Use your app in Kubernetes

This microservice (and any other dapr microservice) invokes other endpoints, handles state management, publishes messages and binds to external endpoints through the dapr runtime, which lives in a sidecar container in the same pod as the microservice is deployed to. This means that any other microservice that wants to invoke this microservice simply makes HTTP calls against its own dapr sidecar. In Kubernetes, each dapr sidecar uses port 3500.

#### Invoke this microservice's endpoints

To invoke this microservice's endpoints from another dapr microservice, create requests against the following endpoints:

- GET `http://localhost:3500/v1.0/invoke/csharp-microservice/method/{account}` Get the balance for the account specified by `id`
- POST `http://localhost:3500/v1.0/invoke/csharp-microservice/method/deposit` Accepts a JSON payload to deposit money to an account
- POST `http://localhost:3500/v1.0/invoke/csharp-microservice/method/withdraw` Accepts a JSON payload to withdraw money from an account

To test this microservice's endpoints on its own (i.e. without invoking them from another dapr-ized microservice), we can expose the microservice publicly by provisioning an external endpoint. To accomplish this, we'll tweak our microservice's yaml manifest to include a LoadBalancer:

1. Add a LoadBalancer to the top of your csharp.yaml:

```yaml
kind: Service
apiVersion: v1
metadata:
  name: csharp-microservice
  labels:
    app: csharp-microservice
spec:
  selector:
    app: csharp-microservice
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: LoadBalancer

---
```

2. Reapply your csharp.yaml file: `kubectl apply -f csharp.yaml`
3. Wait for the public endpoint to be provisioned: `kubectl get svc -w`

```bash
NAME                            TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)            AGE
csharp-microservice             LoadBalancer   10.0.172.159   <pending>      80:32632/TCP       7s
```

4. Once the external-ip changes from pending to an IP adress, you can use a REST client (e.g. curl, Postman, browser) to make calls against the following endpoints:

- GET `http://localhost:3500/v1.0/invoke/csharp-microservice/method/{account}`
- POST `http://localhost:3500/v1.0/invoke/csharp-microservice/method/deposit`
- POST `http://localhost:3500/v1.0/invoke/csharp-microservice/method/withdraw`

#### Publish messages

This microservice subscribes to messages of topic "deposit" and "withdraw" (see '/dapr/subscribe' GET endpoint). Other dapr microservices can publish messages of these topics by POSTing a JSON payload against `http://localhost:3500/v1.0/publish/<YOUR_TOPIC>`. For example, another microservice could publish a message of topic "withdraw" by POSTing {"id": "17", "amount": 42} against `http://localhost:3500/v1.0/publish/withdraw`.