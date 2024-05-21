const OpenAI = require("openai");
const dotenv = require("dotenv");
const inquirer = require('inquirer');
const readline = require('readline');
const chalk = require('chalk');


dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function question(message, model) {
  const completion = await openai.chat.completions.create({
    messages: [{
        role: "system",
        content: "You are a helpful assistant. keep your answers brief and without markdown in plain text as this is part of a chat application"
      },
      {
        role: "user",
        content: message
      }
    ],
    max_tokens: 200,
    model: model,
  });
  const response = completion.choices[0].message.content;
  return response;
}

async function messagePrompt() {
  const userMessage = await inquirer
    .prompt([{
      name: "message",
      type: "input",
      message: "Enter you message to GPT (Press ESC to quit)",
    }, ])
    .then((userMessage) => {
      return userMessage;
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.error(error);
      } else {
        console.error(error);
      }
    });

  return userMessage;
}

async function modelPrompt() {
  const models = ["gpt-3.5-turbo", "gpt-4-turbo", "gpt-4o"];

  const model = await inquirer
    .prompt([{
      name: "model_name",
      type: "list",
      message: "Which GPT model would you like to use?",
      choices: models,
      default: "gpt-3.5-turbo",
    }])
    .then((model) => {
      return model;
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.error(error);
      } else {
        console.error(error);
      }
    });
  return model;
}
async function main() {
  tokens = 0;
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function onKeyPress(key) {
    if (key.name === 'escape') {
      console.log('Exiting...');
      rl.close();
      process.exit();
    }
  }

  rl.input.on('keypress', onKeyPress);
  const modelObj = await modelPrompt();
  while (true) {
    const messageObj = await messagePrompt();
    const gptResponse = await question(messageObj.message, modelObj.model_name);
    console.log(chalk.blue(gptResponse));
    tokens = tokens + 60
    //console.log('tokens used estimate: ' + tokens)
  }
}

main();