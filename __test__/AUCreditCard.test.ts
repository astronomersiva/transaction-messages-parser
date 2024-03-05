const { getTransactionData } = await import('../src/index.js');
import fs from 'fs';

import { getFileName } from './utils.js';
const testCases = fs.readFileSync(`__test__/fixtures/${getFileName(import.meta.url).replace('.test.ts', '')}`).toString().split('-----\n');

test('main', async() => {
  for (const testCase of testCases) {
    expect(await getTransactionData(testCase)).toMatchSnapshot();
  }
});
