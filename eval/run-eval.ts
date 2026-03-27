import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { testCases } from './dataset';
import { runAgent } from '../lib/agent';
import { generateText, type UIMessage } from 'ai';

async function main() {
  let passed = 0;
  let failed = 0;

  console.log('============================================================');
  console.log('  ClubPack Sponsor Concierge — Eval Run');
  console.log('============================================================\n');

  for (const testCase of testCases) {
    const messages: UIMessage[] = [
      {
        id: String(testCase.id),
        role: 'user',
        parts: [{ type: 'text', text: testCase.userMessage }],
      },
    ];

    let fullText = '';
    let firstToolCalled = 'none';

    try {
      const result = await runAgent(messages);

      for await (const chunk of result.textStream) {
        fullText += chunk;
      }

      const steps = await result.steps;
      const toolsCalled = steps.flatMap((step) =>
        step.toolCalls.map((tc: any) => tc.toolName)
      );
      firstToolCalled = toolsCalled[0] ?? 'none';
    } catch (err) {
      console.log(`Test ${testCase.id}: ${testCase.description}`);
      console.log(`  ERROR: ${err instanceof Error ? err.message : String(err)}`);
      console.log('---');
      failed++;
      continue;
    }

    const toolCorrect = firstToolCalled === testCase.expectedToolCalled;

    const judgeResult = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt: `You are evaluating an AI agent response for correctness.

Test description: ${testCase.description}
Expected first tool called: ${testCase.expectedToolCalled}
Actual first tool called: ${firstToolCalled}
Expected outcome: ${testCase.expectedOutcome}
Actual agent response: ${fullText}

Scoring rules — apply in this order:
1. FAIL immediately if the wrong tool was called as the first tool.
2. FAIL if the agent hallucinated clubs or pricing not in the database (invented names, fake prices).
3. FAIL if the agent should have escalated but did not.
4. FAIL if the agent refused to help a small-budget brand instead of searching for Starter tier clubs.
5. If none of the above failures apply and the correct tool was called, PASS — do not penalise minor differences in wording or response style.

Reply with exactly one word: Pass or Fail`,
    });

    const verdict = judgeResult.text.trim();

    console.log(`Test ${testCase.id}: ${testCase.description}`);
    console.log(`  Tool expected:  ${testCase.expectedToolCalled}`);
    console.log(`  Tool called:    ${firstToolCalled}`);
    console.log(`  Tool correct:   ${toolCorrect ? '✓' : '✗'}`);
    console.log(`  Judge verdict:  ${verdict}`);
    console.log(`  Result:         ${verdict === 'Pass' ? '✓ PASSED' : '✗ FAILED'}`);
    console.log('---');

    if (verdict === 'Pass') {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('============================================================');
  console.log('  EVAL SUMMARY');
  console.log('============================================================');
  console.log(`  Total:    10`);
  console.log(`  Passed:   ${passed}`);
  console.log(`  Failed:   ${failed}`);
  console.log(`  Pass rate: ${Math.round((passed / 10) * 100)}%`);
}

main();
