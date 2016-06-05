# Mint Peaks Alexa Skill

Ability to query Mint Peaks through Alexa to get the current temperature and/or humidity.

When installed, simply utter things like:

> Alexa, ask Mint Peaks for the temperature
> Alexa, ask Mint Peaks what's the humidity
> Alexa, ask Mint Peaks about the current state

## Other parts

This repo is part of the mintpeaks ecosystem, these are the other parts you need to setup for it to work:

- **Tessel app** [mintpeaks-tessel](https://github.com/mihar/mintpeaks-tessel) - Node.js app for Tessel
- **Node app** [mintpeaks](https://github.com/mihar/mintpeaks) - Node.js app for streaming Tessel data (TCP socket, Express, Socket.io)

## Setting up the new skill on Alexa

To get started, add a new Alexa Skill Set in [Amazon Developer Console](https://developer.amazon.com/edw/home.html#/). Once you created a new app, give it the following settings:

### Skill Information

- Application Id - _Copy this to `.env`_
- Skill type: Custom Interaction Model
- Name: _"Mint Peaks"_
- Invocation Name: _"Mint Peaks"_

_**Interaction model**_

For _Intent Scema_, set:

```json
{
  "intents": [
    {
      "intent": "GetStatus"
    },
    {
      "intent": "GetTemperature"
    },
    {
      "intent": "GetHumidity"
    }
  ]
}
```

For the _Sample Utterances_, use:

```
GetStatus what's the status
GetStatus what is the status
GetStatus what is the current status
GetStatus what's the state
GetStatus what is the state
GetStatus what is the current state
GetStatus get the status
GetStatus get me the status
GetStatus get the current status
GetStatus get me the current status
GetStatus tell me the state
GetStatus tell me the current state
GetStatus how is it
GetStatus tell me how is it
GetStatus how is it now
GetStatus tell mehow is it now
GetStatus how is it right now
GetStatus tell me how is it right now

GetTemperature get the temperature
GetTemperature get the current temperature
GetTemperature get me the temperature
GetTemperature get me the current temperature
GetTemperature give me the temperature
GetTemperature give me the current temperature
GetTemperature tell me the temperature
GetTemperature tell me the current temperature
GetTemperature what's the temperature
GetTemperature what is the temperature
GetTemperature what is the current temperature
GetTemperature what's the current temperature
GetTemperature what is the temperature right now
GetTemperature what's the temperature right now
GetTemperature how's the temperature
GetTemperature how is the temperature
GetTemperature how hot it is
GetTemperature how hot is it
GetTemperature how cold it is
GetTemperature how cold is it
GetTemperature how warm it is
GetTemperature how warm is it
GetTemperature is it hot
GetTemperature is it cold

GetHumidity what's the humidity
GetHumidity what is the humidity
GetHumidity get the humidity
GetHumidity get me the humidity
GetHumidity get me the current humidity
GetHumidity get me the current humidity reading
GetHumidity tell the humidity
GetHumidity tell the current humidity
GetHumidity give me the humidity
GetHumidity give me the current humidity
GetHumidity give me the current humidity reading
GetHumidity what is the current humidity
GetHumidity what is the humidity right now
GetHumidity how humid it is
GetHumidity how humid is it
GetHumidity is it humid
GetHumidity how's the humidity
GetHumidity how is the humidity
```

## Deploy skill backend

The simplest way to host your new skill is using AWS Lambda. For _Endpoint_ select _Lambda ARN (Amazon Resource Name)_. It's important that you include the `node_modules` directory in your deploy archive, as Lambda doesn't know how to fetch NPM modules.

Also verify that you've set the `APPLICATION_ID` and `MINT_PEAKS_SERVER_URL` inside your `.env` file.

```bash
git clone https://github.com/mihar/mintpeaks-alexa-skill.git
cd mintpeaks-alexa-skill

npm install
zip -r mintpeaks_lambda_deploy.zip * .env
```

After this you'll need to deploy `mintpeaks_lambda_deploy.zip` as a Lambda function:

1. [Login to AWS Console and visit Lambda settings](https://console.aws.amazon.com/lambda/home?region=us-east-1#)
1. Select _Create Lambda Function_
1. Skip blueprint selection
2. Set function name, e.g. `getMintPeaks` and select Node.js runtime
3. Upload as a Zip file (`mintpeaks_lambda_deploy.zip`) to Lambda function
4. Use `index.handler` handler and select _Basic Execution Role_ for Role
5. Create Lambda function. After creation, you'll be able to copy the ARN from top right corner to Alexa skill settings
