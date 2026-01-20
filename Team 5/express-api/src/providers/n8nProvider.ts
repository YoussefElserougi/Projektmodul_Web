import axios from "axios";
import { ApiProvider, ProviderResponse } from "promptfoo";

interface N8nProviderConfig {
  webhookUrl?: string;
}

class N8nProvider implements ApiProvider {
  config: N8nProviderConfig;

  constructor(options: { config: N8nProviderConfig }) {
    this.config = options.config;
  }

  id() {
    return "n8n-provider";
  }

  async callApi(
    prompt: string,
    context?: any,
    options?: any
  ): Promise<ProviderResponse> {
    const url = this.config.webhookUrl || process.env.WEBHOOK_URL;

    const expected = context.vars.expected_output;

    if (!url) {
      return {
        error:
          "WEBHOOK_URL environment variable is not set and no webhookUrl provided in config.",
      };
    }

    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          prompt: prompt,
          expected,
        },
      });

      if (response.status === 200) {
        return {
          output: response.data.output,
        };
      }

      return {
        error: `Request failed with status ${response.status}: ${response.statusText}`,
      };
    } catch (error: any) {
      return {
        error: `Error calling n8n webhook: ${error.message}`,
      };
    }
  }
}

export = N8nProvider;
