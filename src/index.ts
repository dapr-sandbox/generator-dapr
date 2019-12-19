import * as Generator from 'yeoman-generator';
import { Answers, App, Language, Microservice, Prompt, Prompts, StateStore, PubSub, Component } from './types';
import { componentLookup, languageLookup } from './files';
import * as emoji from 'node-emoji';

export default class extends Generator {
    private answers: Answers;
    private app: App;

    constructor(args: any, opts: any) {
        super(args, opts);

        this.argument("name", {
            type: String,
            required: false
        });

    }
    async prompting() {
        let prompts = [
            {
                type: "checkbox",
                name: "languages",
                message: "What languages would you like to scaffold microservices for? (Use space bar to check the following)",
                choices: ["C#", "Go", "JavaScript", "Python", "TypeScript"]
            },
            {
                type: "list",
                name: "stateStore",
                message: "What state store (if any) would you like your app to use? (Use space bar to check the following)",
                choices: ["Redis", "Azure CosmosDB", "None"]
            },
            {
                type: "list",
                name: "pubsub",
                message: "What pubsub component (if any) would you like your app to use? (Use space bar to check the following)",
                choices: ["Redis Streams", "NATS", "Azure Service Bus", "RabbitMQ", "None"]
            }
        ] as Prompts;

        if (!this.options.name) {
            prompts.unshift({
                type: "input",
                name: "name",
                message: "What would you like to call your dapr project?"
            } as Prompt);
        }
        this.answers = await this.prompt(prompts);
    }

    async configuring() {
        let microservices = this.answers.languages.map((language) => {
            let microservice = { language } as Microservice;
            return microservice;
        });

        this.app = {
            name: (this.answers.name) ? this.answers.name : this.options.name,
            stateStore: (this.answers.stateStore !== "None") ? this.answers.stateStore as StateStore : undefined,
            pubsub: (this.answers.pubsub !== "None") ? this.answers.pubsub as PubSub : undefined,
            microservices
        };

        console.log("Configuring the following app:");
        console.log(this.app);
    }

    writing() {
        this._createDeployDirectory();
        this._createMicroservices();
        if (this.app.stateStore) this._createComponentManifest(this.app.stateStore);
        if (this.app.pubsub) this._createComponentManifest(this.app.pubsub);
        this._deleteTemp();
    }

    install() {
    }

    end() {
        this._logScaffolding();
        // Give dapr run advice
        this.log("To run your dapr dapr app, download the dapr CLI (https://github.com/dapr/cli/releases). To run in Kubernetes, run 'dapr init --kubernetes'. To run in self-hosted mode, run 'dapr init'. Then follow instructions in each microservice's README to install packages and build your build/run your microservices.");

        // Give dapr state advice
        switch (this.app.stateStore) {
            case "Redis":
                this.log("Next you'll need to create a Redis store and add configuration details to your redis.yaml (see Redis dapr doc: https://github.com/dapr/docs/blob/master/howto/setup-state-store/setup-redis.md)");
                break;
            case "Azure CosmosDB":
                this.log("Next you'll need to create a CosmosDB database in Azure and add configuration details to your cosmosdb.yaml (see CosmosDB dapr doc: https://github.com/dapr/docs/blob/master/howto/setup-state-store/setup-azure-cosmosdb.md)");
                break;
        }
    }

    _createMicroservices() {
        this.app.microservices.forEach((m) => this._createMicroservice(m.language));
    }

    /**
     * This function takes a selected microservice and scaffolds the code for it. Note that as development of this generator continues, this function will likely grow in complexity to codegen the actual microservice code as well.
     * @param language the language of the microservice
     */
    _createMicroservice(language: Language) {
        let { codePath, manifestPath, languageName } = languageLookup[language];
        console.log(emoji.get('heavy_check_mark'), ` Creating ${language} microservice code`);
        // Create microservice code directory with boilerplate code
        this.fs.copyTpl(
            this.templatePath(codePath),
            this.destinationPath(`${this.app.name}/${languageName}`),
            {}
        );

        console.log(emoji.get('heavy_check_mark'), ` Creating ${language} manifest`);
        // Create microservice manifest in deploy directory
        this.fs.copyTpl(
            this.templatePath(manifestPath),
            this.destinationPath(`${this.app.name}/deploy/${languageName}.yaml`),
            {}
        );
    }

    _createDeployDirectory() {
        this.fs.copyTpl(
            this.templatePath("deploy"),
            this.destinationPath(`${this.app.name}/deploy`),
            {}
        );
    }

    _deleteTemp() {
        this.fs.delete(this.destinationPath(`${this.app.name}/deploy/tmp.txt`));
    }

    _createComponentManifest(component: Component) {
        const { componentName, manifestPath } = componentLookup[component]
        console.log(emoji.get('heavy_check_mark'), ` Creating component manifest (${componentName}.yaml) for ${component}`);
        this.fs.copyTpl(
            this.templatePath(manifestPath),
            this.destinationPath(`${this.app.name}/deploy/${componentName}.yaml`),
            {}
        );
    }

    _logScaffolding() {
        let app = this.app;
        let message = `Great! I scaffolded a dapr app called ${this.options.name || app.name}. The app includes`;

        switch (app.microservices.length) {
            case 0:
                message += " no microservices";
                break;
            case 1:
                message += ` a ${app.microservices[0].language} microservice`;
                break;
            default:
                message += ` a ${app.microservices[0].language} microservice`;
                for (let i = 1; i < app.microservices.length - 1; i++) {
                    message += `, a ${app.microservices[i].language} microservice`;
                }
                message += ` and a ${app.microservices[app.microservices.length - 1].language} microservice`;
        }

        message += (app.stateStore) ? `. I also created the configuration files for a ${app.stateStore} state store.` : "";
        this.log(message);
    }
};