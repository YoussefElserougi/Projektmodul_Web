export interface EvaluationRequest {
    file: Express.Multer.File;
}

export interface N8NProviderConfig {
    id: string;
    config: {
        webhookUrl?: string;
    };
}

export interface PromptfooConfig {
    prompts: string[];
    providers: (string | N8NProviderConfig)[];
    tests: TestCase[];
}

export interface TestCase {
    vars: Record<string, string>;
    assert: Assertion[];
}

export interface Assertion {
    type: string;
    value?: string;
    threshold?: number;
}
