
import { loadEnv } from '../src/env';

test('loads env with defaults', () => {
  const env = loadEnv({});
  expect(env.NEXT_PUBLIC_APP_NAME).toBe('Ground Zero');
});
