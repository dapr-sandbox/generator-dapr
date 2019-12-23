# TypeScript Dapr Microservice
This is a yeoman-generated dapr-enabled TypeScript microservice. You can either run it in self-hosted mode (on your machine) or build a container and run it in Kubernetes.

## Running in Self-Hosted Mode

### Prerequisites

First you'll need to install the [dapr cli](https://github.com/dapr/cli/releases) and run `dapr init`. This will run the dapr runtime on your machine.

### Steps

1. Navigate to the `typescript` directory
2. Run `npm install` to gather dependencies
3. Run `npm run build` to compile your Typescript code into Javascript code (which lives in the `lib` directory)
3. Run the compiled application with dapr with dapr:

```bash
dapr run --app-id ts --app-port 3001 --port 3500 npm run start
```

In this case we've named the microservice "ts", specified that it runs on port 3001, and specified that the dapr runtime should run on port 3500. 

> Note that the dapr cli will automatically run a Redis store and Redis pubsub component, with component manifests in a "components" directory (`redis.yaml` and `redis_messagebus.yaml` respectively). To use a different state or pubsub component...

To see that the microservice is running, open a new terminal window and list dapr microservices:

```cmd
C:\test>dapr list
  APP ID  DAPR PORT  APP PORT  COMMAND      AGE  CREATED              PID
  node    3500       3001      node app.ts  10s  2019-12-19 21:24.33  25388
```

### Service Invocation
To test the microservice, you can start by invoking one of its REST endpoints through the dapr port. Use your favorite HTTP client (e.g. curl, Postman, your browser) to make a GET request against `http://localhost:3500/v1.0/invoke/ts/method/randomNumber`. Alternatively, use the `dapr invoke` command to call the endpoint:

```cmd
C:\git\test>dapr invoke --app-id ts --verb "GET" -m randomNumber
{"randomNumber":42}
App invoked successfully
```

Other microservices will also be able to invoke this endpoint over HTTP.

### State Persistence

The generated microservice includes helper methods to get and set key/value pairs. Note that these methods persist state through dapr, by POSTing or GETting against `http://localhost:3500/v1.0/state`. We can test our state persistence by invoking the POST `/saveNumber` endpoint and the GET `/savedNumber` endpoint. Once again, use your favorite REST client or `dapr invoke` to call these endpoints: 

**Windows**:
```cmd
C:\git\test>dapr invoke --app-id ts --verb "POST" -m saveNumber -p "{ \"number\": 42 }"
```

**Linux/Mac**:
```cmd
C:\git\test>dapr invoke --app-id ts --verb "POST" -m saveNumber -p '{ "number": 42 }'
```

You should see the following output:
```cmd
OK
App invoked successfully
```

Now you can verify that your state was persisted:
```cmd
C:\git\test>dapr invoke --app-id ts --verb "GET" -m savedNumber
{number: 42}
```

Now you can tweak your code to get and set any state with your microservice! See state doc<<Insert doc>> and state sample <<Insert sample>> for more details.

### Pubsub
Similarly, you can test the microservice's pubsub functionality by publishing a message topic that it subscribes to. In this case, the microservice subscribes to messages of topic "A", and "B". Publish by creating a POST request against `http://localhost:3500/v1.0/A`. Alternatively, use the `dapr publish` command to publish a message: 

```cmd
dapr publish --topic "A"
Event published successfully
```

Observe the messages coming through the app: 

```cmd
== APP == Got message of topic 'A'
```

Now you're able to use dapr to build pubsub applications! Update the topics your TypeScript app subscribes to, create new endpoints/handlers, and try publishing a message from a different microservice! See <<Insert doc>> pubsub doc and <<Insert sample>> sample for more details.

## Deploy in Kubernetes

To deploy this microservice to Kubernetes, you first need to containerize it. You can do this by building the docker images manually or you can use the Makefile included in the the generated project.

### Prerequisites

- Docker
- A Kubernetes cluster (could be a managed cluster or a cluster running on your machine)
- Kubectl configured with your cluster
- Dapr initialized in your cluster: `dapr init --kubernetes`
- A dockerhub account or a container registry to push your container images up to
- [Make](https://www.gnu.org/software/make/), if you choose to use the Makefile

### Build and Deploy Manually

1. Navigate to the typescript directory: `cd typescript`
2. Run `docker build --tag [[YOUR_CONTAINER_REGISTRY/YOUR_CONTAINER_NAME]] .`
    > Note that YOUR_CONTAINER_REGISTRY should be the name of your dockerhub repository or the name of whatever other container registry (e.g. Azure CR) you're using
3. Update the `depoy/typescript.yaml` file, setting the `image` key to [[YOUR_CONTAINER_REGISTRY/YOUR_CONTAINER_NAME]]
4. Push your container image up to Dockerhub or your container registry: `docker push ...`
5. Apply your Kubernetes manifest: `kubectl apply -f typescript.yaml`

    > If you're using a private container registry, you'll need to add the appropriate credentials to the typescript.yaml files
6. Run `kubectl get pods -w` to see your pod spin up:

```cmd
NAME                                      READY   STATUS             RESTARTS   AGE
typescript-microservice-56c74595d-htrk4   2/2     Running            0          6s
```

Once deployed, you should see that 2/2 containers are running for the deployment. This represents the container that hosts your microservice and the container that hosts the dapr runtime.

### Build and Deploy using the Make file

1. Navigate to the top level of your project and open the Makefile
2. Update [[INSERT VARIABLES]] to represent your container registry and your 
2. Run make build ... which will build container images for all of the microservices in your project
3. Run make push ... which will push 
4. Run kubectl apply -f "typescript.yaml"

### Use your app in Kubernetes

This microservice (and any other dapr microservice) invokes other endpoints, handles state management, publishes messages and binds to external endpoints through the dapr runtime, which lives in a sidecar container in the same pod as the microservice is deployed to. This means that any other microservice that wants to invoke this microservice simply makes HTTP calls against its own dapr sidecar. In Kubernetes, each dapr sidecar uses port 3500.

#### Invoke this microservice's endpoints

To invoke this microservice's endpoints from another dapr microservice, create requests against the following endpoints:

- GET http://localhost:3500/v1.0/invoke/ts/method/randomNumber
- POST http://localhost:3500/v1.0/invoke/ts/method/saveNumber with JSON payload (e.g. {number: 42})
- GET http://localhost:3500/v1.0/invoke/ts/method/savedNumber

To test these endpoints on their own, or to expose them publicly, follow the following steps:

1. Add a LoadBalancer to the top of your javascript.yaml:

```yaml
kind: Service
apiVersion: v1
metadata:
  name: typescript-service
  labels:
    app: typescript-service
spec:
  selector:
    app: typescript-service
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: LoadBalancer
```

2. Reapply your typescript.yaml file: `kubectl apply -f typescript.yaml`
3. Wait for the public endpoint to be configured: `kubectl get svc -w`

```cmd
NAME                           TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)            AGE
typescript-service             LoadBalancer   10.0.172.159   <pending>      80:32632/TCP       7s
```

4. Once the external-ip changes from pending to an IP adress, use a REST client (e.g. curl, Postman, browser) to make calls against the following endpoints:

- GET http://<YOUR_PUBLIC_ENDPOINT>/v1.0/invoke/ts/method/randomNumber
- POST http://<YOUR_PUBLIC_ENDPOINT>/v1.0/invoke/ts/method/saveNumber with JSON payload (e.g. {number: 42})
- GET http://<YOUR_PUBLIC_ENDPOINT>/v1.0/invoke/ts/method/savedNumber

#### Publish messages
