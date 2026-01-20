import { PromptfooConfig, TestCase, Assertion } from "../types";

export const generateConfig = (rows: any[]): PromptfooConfig => {
  const tests: TestCase[] = rows.map((row) => {
    if (!row.expected_output) {
      throw new Error("Output is required");
    }

    const vars: Record<string, string> = { ...row };

    const assert: Assertion[] = [];

    assert.push({
      type: "llm-rubric",
      value: `The response must be semantically similar to this reference:\n\n${row.expected_output}`,
    });

    return {
      vars,
      assert,
    };
  });

  return {
    prompts: ["{{input}}"],
    providers: [
      {
        id: "n8n-provider",
        config: {
          webhookUrl: process.env.WEBHOOK_URL,
        },
      },
    ],
    tests,
  };
};
