const fs = require('fs');
const path = require('path');
const successColor = '\x1b[32m%s\x1b[0m';
const checkSign = '\u{2705}';
require('dotenv').config()


const envList = (process.env.LIST_PROPERTY || "").split(",");

let envObject = ""

envList.map((key) => {
  envObject += `  ${key}: "${process.env[key]}",\n`;
})

let envFile = `
export const environment = {
${envObject}
};
`;

const targetPath = path.join(__dirname, `./src/environments/environment.ts`);
fs.writeFile(targetPath, envFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(successColor, `${checkSign} Successfully generated environment file`);
  }
});

const targetPath2 = path.join(__dirname, `./src/environments/environment.prod.ts`);
fs.writeFile(targetPath2, envFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(successColor, `${checkSign} Successfully generated environment file`);
  }
});

const targetPath3 = path.join(__dirname, `./src/environments/environment.dev.ts`);
fs.writeFile(targetPath3, envFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(successColor, `${checkSign} Successfully generated environment file`);
  }
});

