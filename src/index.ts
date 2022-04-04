import type { Answers } from './questions';
import { questions } from './questions';
import { setup } from './setup';

const main = async () => {
  const answers: Answers = await questions();
  await setup(answers);

  console.log('✅ Done!');
};

main();
