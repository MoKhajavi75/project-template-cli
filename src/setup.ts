import { writeFile } from 'fs/promises';
import shell from 'shelljs';
import type { Answers } from './questions';

export const setup = async (answers: Answers) => {
  const projectDir = `${answers.directory}/${answers.name}`;
  const templateUrl = 'git@github.com:MohamadKh75/project-template.git';

  shell.mkdir('-p', projectDir);
  shell.cd(projectDir);
  shell.exec(`git clone ${templateUrl} .`, { silent: true, fatal: true });
  shell.exec(`git remote set-url origin ${answers.url}`, { silent: true });
  shell.exec('pnpm install', { silent: true });

  if (answers.removeJest) {
    shell.exec('pnpm rm jest @types/jest', { silent: true });
    shell.rm('-f', 'jest.config.json');
  }

  let packageJson = shell.cat('package.json').toString();

  packageJson = packageJson
    .replace(/"name": ".*"/, `"name": "${answers.name}"`)
    .replace(/"description": ".*"/, `"description": "${answers.description}"`)
    .replace(/"url": ".*"/, `"url": "${answers.url}"`);

  if (answers.removeJest) {
    packageJson = packageJson.replace(/"test": ".*",\n\s+/, '');
  }

  try {
    await writeFile(`${projectDir}/package.json`, packageJson, 'utf-8');
  } catch (err) {
    console.error(err);
  }

  shell.exec('git reset $(git commit-tree HEAD^{tree} -m "chore: initial commit")', {
    silent: true
  });
  shell.exec('git add .', { silent: true });
  shell.exec('git commit --amend -n --no-edit', { silent: true });
  shell.exec(`git push origin main -u ${answers.force ? '-f' : ''}`, { silent: true, fatal: true });

  console.log('✅ Done!');
};
