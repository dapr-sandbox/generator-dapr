import * as Generator from 'yeoman-generator';
import { Answers, App, Language, Microservice, Prompt, Prompts } from './types';

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
        let prompts = [{
            type: "list",
            name: "mode",
            message: "Are you running dapr in Kubernetes or in standalone mode?",
            choices: ["Kubernetes", "Standalone"]
        },
        {
            type: "checkbox",
            name: "languages",
            message: "What languages would you like to scaffold microservices for? (Use space bar to check the following)",
            choices: ["C#", "Go", "JavaScript", "Python"]
        },
        {
            type: "list",
            name: "stateStore",
            message: "What state store (if any) would you like your app to use? (Use space bar to check the following)",
            choices: ["Redis", "CosmosDB", "Cassandra", "None"]
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

    configuring() {
        let microservices = this.answers.languages.map((language) => {
            return { language } as Microservice;
        });

        this.app = {
            ...this.answers, microservices
        }
    }

    writing() {
        this._createDeployDirectory();
        this._createMicroservices();
        this._createStateManifest();
        this._deleteTemp();
    }

    install() {
        this.log("Installing your packages:");
    }

    end() {
        this._logScaffolding();
        // Give dapr run advice
        this.log((this.app.mode === "Kubernetes") ?
            "To run dapr in your Kubernetes cluster, download the dapr CLI (https://github.com/dapr/cli/releases) and run 'dapr init --kubernetes'." :
            "To run dapr in your Standalone mode, download the dapr CLI (https://github.com/dapr/cli/releases) and run 'dapr init'.");

        // Give dapr state advice
        switch (this.app.stateStore) {
            case "Redis":
                this.log("Next you'll need to create a Redis store and add configuration details to your redis.yaml (see Redis dapr doc)")
                break;
            case "CosmosDB":
                this.log("Next you'll need to create a CosmosDB database in Azure and add configuration details to your cosmosdb.yaml (see CosmosDB dapr doc)")
                break;
            case "Cassandra":
                this.log("Next you'll need to create a Cassandra store and add configuration details to your cassandra.yaml (see Cassandra dapr doc)")
                break;
        }
    }

    // Private methods
    _configureApp() {
    }

    _createMicroservices() {
        this.app.microservices.forEach((m) => this._createMicroservice(m.language));
    }

    /**
     * This function takes a selected microservice and scaffolds the code for it. Note that as development of this generator continues, this function will likely grow in complexity to build the actual microservice code as well.
     * @param language the language of the microservice
     */
    _createMicroservice(language: Language) {
        let directoryName;
        switch (language) {
            case "C#":
                directoryName = "csharp";
                break;
            case "JavaScript":
                directoryName = "node";
                break;
            case "Python":
                directoryName = "python";
                break;
            case "Go":
                directoryName = "go";
                break;
        }

        // Create microservice code directory with boilerplate code
        this.fs.copyTpl(
            this.templatePath(directoryName),
            this.destinationPath(directoryName),
            {}
        );

        // Create microservice manifest in deploy directory
        this.fs.copyTpl(
            this.templatePath(`deploy-templates/${directoryName}.yaml`),
            this.destinationPath(`deploy/${directoryName}.yaml`),
            {}
        );
    }

    _createDeployDirectory() {
        this.fs.copyTpl(
            this.templatePath("deploy"),
            this.destinationPath("deploy"),
            {}
        );
    }

    _deleteTemp() {
        this.fs.delete(this.destinationPath("deploy/tmp.txt"));
    }

    _createStateManifest() {
        let manifestName;
        switch (this.app.stateStore) {
            case "Redis":
                manifestName = "redis.yaml";
                break;
            case "CosmosDB":
                manifestName = "cosmos.yaml";
                break;
            case "Cassandra":
                manifestName = "cassandra.yaml";
                break;
            default:
                return;
        }
        this.fs.copyTpl(
            this.templatePath(`state-templates/${manifestName}`),
            this.destinationPath(`deploy/${manifestName}`),
            {}
        );
    }

    _logScaffolding() {
        let app = this.app;
        let intro = `Great! I scaffolded a ${app.mode} dapr app called ${this.options.name || app.name}. The app includes`;
        let microservicesText;
        if (app.microservices.length === 0) microservicesText = " no microservices";
        if (app.microservices.length === 1) microservicesText = ` a ${app.microservices[0].language} microservice`;
        if (app.microservices.length > 1) {
            microservicesText = ` a ${app.microservices[0].language} microservice`;
            for (let i = 1; i < app.microservices.length - 1; i++) {
                microservicesText += `, a ${app.microservices[i].language} microservice`;
            }
            microservicesText += ` and a ${app.microservices[app.microservices.length - 1].language} microservice`;
        }
        let stateText = (app.stateStore !== "None") ? `. I also created the configuration files for a ${app.stateStore} state store.` : "";
        this.log(`${intro}${microservicesText}${stateText}`);
    }
};