import * as Generator from 'yeoman-generator';
import { Answers, Prompt, Prompts } from './types';

export default class extends Generator {
    private answers: Answers;
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
            name: "daprMode",
            message: "Are you running dapr in Kubernetes or in standalone mode?",
            choices: ["Kubernetes", "Standalone"]
        },
        {
            type: "checkbox",
            name: "languages",
            message: "What languages would you like to scaffold microservices for? (Use space bar to check the following)",
            choices: ["C# (.NET Core)", "JavaScript (Node)", "Python", "Go"]
        },
        {
            type: "list",
            name: "store",
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
        let answers = this.answers;
        let intro = `Great! I'm scaffolding you a ${answers.daprMode} dapr app called ${this.options.name || answers.name}. The app includes`;
        let microservicesText;
        if (answers.languages.length === 0) microservicesText = " no microservices";
        if (answers.languages.length === 1) microservicesText = ` a ${answers.languages[0]} microservice`;
        if (answers.languages.length > 1) {
            microservicesText = ` a ${answers.languages[0]} microservice`;
            for (let i = 1; i < answers.languages.length - 1; i++) {
                microservicesText += `, a ${answers.languages[i]} microservice`;
            }
            microservicesText += ` and a ${answers.languages[answers.languages.length - 1]} microservice`;
        }
        let stateText = (answers.store !== "None") ? `. I'll also create the configuration files for a ${answers.store} state store` : "";
        this.log(`${intro}${microservicesText}${stateText}`);
    }

    writing() {
        this._createDeployDirectory();
        this._createMicroservices(this.answers.languages);
        this._createStateManifest(this.answers.store);
        this._deleteTemp();
    }

    install() {
        this.log("Installing your packages:");
    }

    end() {
        // Give dapr run advice
        this.log((this.answers.daprMode === "Kubernetes") ?
            "To run dapr in your Kubernetes cluster, download the dapr CLI (https://github.com/dapr/cli/releases) and run 'dapr init --kubernetes'." :
            "To run dapr in your Standalone mode, download the dapr CLI (https://github.com/dapr/cli/releases) and run 'dapr init'.");

        // Give dapr state advice
        switch (this.answers.store) {
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
    _createMicroservices(languages: string[]) {
        languages.forEach((language) => this._createMicroservice(language));
    }

    _createMicroservice(language: string) {
        let directoryName;
        switch (language) {
            case "C# (.NET Core)":
                directoryName = "csharp";
                break;
            case "JavaScript (Node)":
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

    _createStateManifest(store: string) {
        let manifestName;
        switch (store) {
            case "Redis":
                manifestName = "redis.yaml";
                break;
            case "CosmosDB":
                manifestName = "cosmos.yaml";
                break;
            case "Cassandra":
                manifestName = "cassandra.yaml";
                break;
        }
        if (store !== "None") {
            this.fs.copyTpl(
                this.templatePath(`state-templates/${manifestName}`),
                this.destinationPath(`deploy/${manifestName}`),
                {}
            );
        }
    }
};