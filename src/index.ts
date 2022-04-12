import { questions } from './questions';
import { setup } from './setup';

const main = async () => {
  const answers = await questions();
  await setup(answers);

  console.log('✅ Done!');
};

main();
