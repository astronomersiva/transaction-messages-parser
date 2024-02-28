const { getTransactionData } = await import('../src/index.js');
import fs from 'fs';
import path from 'path';

const testCases = fs.readFileSync('__test__/inputs').toString().split('-----\n');

test('main', async() => {
  for (const testCase of testCases) {
    expect(await getTransactionData(testCase)).toMatchSnapshot();
  }
});
