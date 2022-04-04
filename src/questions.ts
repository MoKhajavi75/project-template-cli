import chalk from 'chalk';
import { prompt, registerPrompt } from 'inquirer';
// eslint-disable-next-line
// @ts-ignore
import selectDirectory from 'inquirer-select-directory';
import validateName from 'validate-npm-package-name';

export type Answers = {
  name: string;
  description: string;
  url: string;
  directory: string;
};

registerPrompt('directory', selectDirectory);

export const questions = async () =>
  prompt([
    {
      name: 'name',
      message: 'Project name:',
      default: 'my-project',
      validate: name => {
        const { validForNewPackages, warnings, errors } = validateName(name);
        const err = ['', ...(errors || []), ...(warnings || [])].join('\n❌ ');

        if (!validForNewPackages) {
          console.log(`${chalk.red(err)}\n`);
          return false;
        }

        return true;
      }
    },
    {
      name: 'description',
      message: 'Project description:',
      default: 'My awesome project! 🪄'
    },
    {
      name: 'url',
      message: 'Project url:',
      validate: url => {
        const regex = /^git@[a-zA-Z0-9-]*.com:[a-zA-Z0-9-]*\/[a-zA-Z0-9/-]*.git/;

        if (!regex.test(url)) {
          console.log(chalk.red('\n❌ Please enter a valid ssh project url'));
          return false;
        }
        return true;
      }
    },
    {
      name: 'directory',
      message: 'Project directory:',
      type: 'directory',
      basePath: '..'
    }
  ]);
