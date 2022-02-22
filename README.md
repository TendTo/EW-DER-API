# Energy Web DER management API

This project contains the source code of the many parts that make up the DER management API.

## 🗂 Project structure

```yaml
.
├── app                  # frontend application for both aggregators and common users
├── backend              # backend owned by an aggregator
├── contract             # all the smart contract to deploy on the blockchain
├── docker               # docker stack
├── iot                  # DER simulator as an IOT device
├── .gitignore           # .gitignore file
├── LICENSE              # open license of the project
├── README.md            # THIS FILE
```

## 🧾 Requirements

The Serverless Application Model Command Line Interface (SAM CLI) is an
extension of the AWS CLI that adds functionality for building and testing Lambda
applications. It uses Docker to run your functions in an Amazon Linux
environment that matches Lambda. It can also emulate your application's build
environment and API.

- [Node.js 16](https://nodejs.org/en/)
- [npm 7.x](https://www.npmjs.com/)
- [Docker](https://hub.docker.com/search/?type=edition&offering=community)

> `NOTE:` Node.js version's should be 16.10 <= v < 17. You may encounter some incompatibilities otherwise

### 🐳 Launch the Docker-compose

In the main root of the project, launch the configuration described in the _docker-compose.yaml_ file with

```bash
docker compose up -d
```

To stop the stack, use

```bash
docker compose down
```

Here's the stack this Docker-compose will produce:

![docker-compose-stack](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/TendTo/ts-aws-lambda-template/master/docs/schema.puml)

## ⚙️ Configuration

## ▶️ Build, deploy and delete

### Build

First of all, install all the required dependencies with

```bash
npm install
```

To build the stack, you can run

```bash
# to compile all the .ts files and create the dist folder
npm run compile

sam build
```

### Deploy

Once the stack has been built and the _.aws-sam_ folder is present, to deploy
the stack with Cloudformation, you can run

```bash
sam deploy --config-file samconfig.toml --config-env dev
```

### Delete

If a Stack happens to be in a ROLLBACK state, preventing you from doing any more
deployments or you simply want to delete it, you can do so from the AWS console
or, if you have the AWS CLI installed, you can run

```bash
aws cloudformation delete-stack --stack-name my-function-stack
```

## ➕ Add a resource to your application

The application template uses AWS Serverless Application Model (AWS SAM) to
define application resources. AWS SAM is an extension of AWS CloudFormation with
a simpler syntax for configuring common serverless application resources such as
functions, triggers, and APIs. For resources not included in
[the SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md),
you can use standard
[AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html)
resource types.

There are 3 main types of resource addition:

1. **Generic resource** (non function - non layer):
   - Just update the _template.yaml_ file. Add the resource and its properties
2. **Lambda function** (no dependencies):
   - Update the _template.yaml_ file. Add the lambda function and its properties
   - Create a new folder under _src_ that the _CodeUri_ property will point to
3. **Lambda layer** (or function with self-contained dependencies):
   - Update the _template.yaml_ file. Add the lambda function and its properties
   - Use `npm run newLayer -- <layer_name>` to create a new folder the
     _ContentUri_ property will point to. You can leave everything as default
   - To install the layer's dependencies, run
     `npm i -w src/<layer_name> <package>`
   - If you need to be able to reference your own **.ts** files in the layer
     from any other lambda:
     - Add the following in the _tsconfig.json_:
     ```json
     {
     "compilerOptions": {
         "paths": {
             "/opt/nodejs/*": [
                 "./<layer_name>/*"
             ]
         }
     },
     ```
     - Import the modules as `import * from '/opt/nodejs/<file_name>'`

> `NOTE:` you may need to reload your editor for it to notice the new
> dependencies

## 🛠 Utility scripts

Some utility scripts have been provided:

- `npm test`: run jest's tests
- `npm run watch`: keep watching for changes in the _src_ folder and update the
  _.js_ files in the _dist_ folder
- `npm run compile`: compile **.ts** code with tsc
- `npm run build`: makes sure the _dist_ folder is updated and builds everything
  with `sam build`
- `npm run invoke`: calls `sam local invoke` with the flags
  - `--config-file samconfig.toml`
  - `--config-env dev`
- `npm run deploy`: calls `npm run build` and then `sam deploy` with the flags
  - `--config-file samconfig.toml`
  - `--config-env dev`
- `npm run delete -- <stack_name>`: calls `aws cloudformation delete-stack`
- `npm run clean`: removes both the _dist_ and _.aws-sam_ folders
- `npm run newLayer -- src/<layer_name>`: create the folder and package.json for
  a new layer

> `NOTE:` To use these scripts you have to run `npm install` first. You may also
> need to reload your editor for it to notice the newly installed dependencies

> `NOTE:` Both the _local invoke_ and the _deploy_ command will refer to the
> _.aws-sam_ folder, its template, and its source code, if present.\
> Otherwise, they will fall back on the _template.yaml_ file in the root folder
> and the code in the _dist_ folder.

## ⌨️ Examples

Start compiling the typescript source in watch mode

```bash
npm run watch
```

Start the jest tests. Make sure the _jest.config.js_'s mappings are configured
correctly

```bash
npm test
```

Build all the lambda functions and install their dependencies. It is a good idea
to tun this before any other SAM command

```bash
npm run build
```

Invoke the _MyFunction_ function locally in a specialized docker container

```bash
npm run invoke -- MyFunction
```

Invoke the _MyFunction2_ function locally in a specialized docker container,
passing as the event parameter of the handle the values of _events/event.json_

```bash
npm run invoke -- MyFunction2 --e events/event.json
```

Deploy all the infrastructure to AWS

```bash
npm run deploy
```

## 🧪 Testing

### Using Jest

Make sure the _jest.config.js_ is configured correctly.

```js
{
  ...
  moduleNameMapper : {
    "^/opt/nodejs/(.*)$": "<rootDir>/src/<layer_name>/$1"
  }
  ...
}
```

Then just run

```bash
npm test
```

### Using SAM

First, build your application, because SAM needs a compiled _dist_ folder.

```bash
npm run build
```

#### Local Invoke

The SAM CLI installs dependencies defined in `package.json`, creates a
deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a
JSON document that represents the input that the function receives from the
event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them:

```bash
npm run invoke -- --event events/event.json
```

#### Start API

The SAM CLI can also emulate your application's API. Use the
`sam local start-api` to run the API locally on port 3000.

```bash
sam local start-api
curl http://localhost:3000/
```

The SAM CLI reads the application template to determine the API's routes and the
functions that they invoke. The `Events` property on each function's definition
includes the route and method for each path.

```yaml
Events:
  MyEvent:
    Type: Api
    Properties:
      Path: /func
      Method: get
```

## ♻️ Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, SAM CLI has a command called `sam logs`. `sam logs`
lets you fetch logs generated by your deployed Lambda function from the command
line. In addition to printing the logs on the terminal, this command has several
nifty features to help you quickly find the bug.

```bash
sam logs -n HelloWorldFunction --stack-name ts-aws-lambda --tail
```

> `NOTE:` This command works for all AWS Lambda functions; not just the ones you
> deploy using SAM.

## 📚 Resources

- [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
- [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).
- [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
- AWS Toolkit plug-in list for popular IDEs for SAM CLI
  - [CLion](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
  - [GoLand](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
  - [IntelliJ](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
  - [WebStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
  - [Rider](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
  - [PhpStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
  - [PyCharm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
  - [RubyMine](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
  - [DataGrip](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
  - [VS Code](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/welcome.html)
  - [Visual Studio](https://docs.aws.amazon.com/toolkit-for-visual-studio/latest/user-guide/welcome.html)

## ❤️ Credit

Inspired by
[aws-sam-typescript-layers-example](https://github.com/Envek/aws-sam-typescript-layers-example/)
