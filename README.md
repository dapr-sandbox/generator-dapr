# generator-dapr

**NOTE**: This package is a work in progress and is not yet fully functional. 

A [Yeoman](http://yeoman.io) generator for scaffolding a [dapr](http://dapr.io) project.

## Installation

- `npm install -g generator-dapr`

## Usage

- `yo dapr`

## Building the Generator

If you're planning on forking or contributing, note that the generator is developed in TypeScript. Correspondingly, only the source code is included in this repo (in `src`). 

To build the code, run `npm run build`, which will compile the .ts files and copy all templates into an `app` directory, where Yeoman looks for them.

## Getting Started

See [dapr docs](https://github.com/dapr/docs) and [docr samples](https://github.com/dapr/samples) to get started.

## Who should use this?

The target audience for this generator is developers familiar with distributed systems concepts (e.g. microservices, state, pubsub) who want to _quickly_ scaffold a dapr project. The target audience **does not** need to be familiar with any specific programming language, and should instead be able to This demographic can be broken into two sub-demographics:

1. **Developers with cloud-native experience**: For developers with experience using containers and Kubernetes, this generator aims to make it easier to minimize the time spent searching for manifests (e.g. Redis, Kafka), building Dockerfiles, and exercising dapr features.

2. **Developers without cloud-native experience**: For developers without experience using containers and Kubernetes, this generator aims to make it easy to build a self-hosted dapr application. The generator also offers tooling and docs (e.g. makefiles, readmes) to hand-hold the developer through containerizing their microservices and deploying them to Kubernetes if they so choose.

## Who should not use this?
Power users of dapr, along with app architects, who seek substantial customization of their application infrastructure should probably not use this generator, as it offers a generic application that won't satisfy highly-specific needs.
