import { createDir } from './createDir';
import type { Answers } from './questions';
import { shellExecuter } from './shellExecuter';

export const setup = async (answers: Answers) => {
  const projectDir = `${answers.directory}/${answers.name}`;
  const templateUrl = 'git@github.com:MohamadKh75/project-template.git';

  await createDir(projectDir);

  await shellExecuter(
    `cd ${projectDir} \
  && git clone ${templateUrl} . \
  && git remote set-url origin ${answers.url} \
  && pnpm install \
  && sed -i \
    -e 's~"name": ".*"~"name": "${answers.name}"~' \
    -e 's~"description": ".*"~"description": "${answers.description}"~' \
    -e 's~"url": ".*"~"url": "${answers.url}"~' \
    package.json \
  && git reset $(git commit-tree HEAD^{tree} -m "chore: initial commit") \
  && git add . \
  && git commit --amend -n --no-edit \
  && git push origin master -u ${answers.force ? '-f' : ''}`
  );
};
