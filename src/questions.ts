import { prompt, registerPrompt } from 'inquirer';
// eslint-disable-next-line
// @ts-ignore
import selectDirectory from 'inquirer-select-directory';
import validateName from 'validate-npm-package-name';

export type Answers = {
  name: string;
  description: string;
  url: string;
  force: boolean;
  directory: string;
};

registerPrompt('directory', selectDirectory);

export const questions = (): Promise<Answers> =>
  prompt([
    {
      name: 'name',
      message: 'Project name:',
      default: 'my-project',
      validate: name => {
        const { validForNewPackages, warnings, errors } = validateName(name);
        const red = '\x1b[31m';
        const normal = '\x1b[0m';
        const err = [...(errors || []), ...(warnings || [])].join(`\n${red}>> ${normal}`);

        return validForNewPackages || err;
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

        return regex.test(url) || 'Please enter a valid ssh project url';
      }
    },
    {
      name: 'force',
      message: 'Force push:',
      type: 'confirm',
      default: false
    },
    {
      name: 'directory',
      message: 'Project directory:',
      type: 'directory',
      basePath: '..'
    }
  ]);
