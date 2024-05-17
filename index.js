const OpenAI = require("openai");
const dotenv = require("dotenv");
const inquirer = require('inquirer');

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function question(msg, model_name) {
  const completion = await openai.chat.completions.create({
    messages: [{
        role: "system",
        content: "You are a helpful assistant. keep your answers short and without markdown in plain text as this is part of a chat application"
      },
      {
        role: "user",
        content: msg
      }
    ],
    max_tokens: 60,
    model: model_name,
  });
  const response = completion.choices[0].message.content;
  return response;
}

async function prompt() {
  const models = ["gpt-3.5-turbo", "gpt-4-turbo", "gpt-4o"];

  const userAnswers = await inquirer
    .prompt([{
        name: "model_name",
        type: "list",
        message: "Which GPT model would you like to use?",
        choices: models,
        default: "gpt-3.5-turbo",
      },
      {
        name: "message",
        type: "input",
        message: "Enter you message to GPT",
      },
    ])
    .then((answer) => {
      return answer;
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.error(error);
      } else {
        console.error(error);
      }
    });
  return userAnswers;
}
async function main() {
  const answers = await prompt();
  const gptResponse = await question(answers.message, answers.model_name);
  console.log(gptResponse);
}

main();