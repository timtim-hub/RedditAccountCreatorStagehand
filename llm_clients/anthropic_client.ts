/******************************************************************************
 * YOU PROBABLY DON'T WANT TO BE USING THIS FILE DIRECTLY                      *
 * INSTEAD, EDIT `stagehand.config.ts` TO MODIFY THE CLIENT CONFIGURATION      *
 ******************************************************************************/

/**
 * Welcome to the Stagehand Anthropic client!
 *
 * This is a client for Anthropic Claude models
 * that allows you to create chat completions with Claude.
 */

import {
  AvailableModel,
  CreateChatCompletionOptions,
  LLMClient,
} from "@browserbasehq/stagehand";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

export class AnthropicClient extends LLMClient {
  public type = "anthropic" as const;
  private client: Anthropic;

  constructor({ apiKey }: { apiKey: string }) {
    super("claude-3-5-sonnet-latest" as AvailableModel);
    this.client = new Anthropic({ apiKey });
  }

  async createChatCompletion<T = any>({
    options,
    retries = 3,
    logger,
  }: CreateChatCompletionOptions): Promise<T> {
    const { image, requestId, ...optionsWithoutImageAndRequestId } = options;

    // TODO: Implement vision support
    if (image) {
      console.warn(
        "Image provided. Vision is not currently supported for anthropic",
      );
    }

    logger({
      category: "anthropic",
      message: "creating chat completion",
      level: 1,
      auxiliary: {
        options: {
          value: JSON.stringify({
            ...optionsWithoutImageAndRequestId,
            requestId,
          }),
          type: "object",
        },
        modelName: {
          value: this.modelName,
          type: "string",
        },
      },
    });

    if (options.image) {
      console.warn(
        "Image provided. Vision is not currently supported for anthropic",
      );
    }

    let responseFormat = undefined;
    if (options.response_model) {
      // Anthropic doesn't support response_model like OpenAI, so we'll handle this differently
      console.warn("response_model not fully supported for Anthropic");
    }

    try {
      const messages = options.messages.map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : msg.role === "user" ? "user" : "user",
        content: typeof msg.content === "string" ? msg.content : 
                 Array.isArray(msg.content) ? 
                   msg.content.map(c => "text" in c ? c.text : "").join("\n") : 
                   String(msg.content),
      }));

      const response = await this.client.messages.create({
        model: this.modelName as any,
        max_tokens: options.maxTokens || 1000,
        messages: messages as any,
        temperature: options.temperature || 0.7,
      });

      // Convert Anthropic response format to OpenAI format
      const openaiFormatResponse = {
        id: response.id,
        object: "chat.completion",
        created: Math.floor(Date.now() / 1000),
        model: this.modelName,
        choices: [
          {
            index: 0,
            message: {
              role: "assistant",
              content: response.content[0]?.type === 'text' ? response.content[0].text : "",
            },
            finish_reason: response.stop_reason || "stop",
          },
        ],
        usage: {
          prompt_tokens: response.usage?.input_tokens || 0,
          completion_tokens: response.usage?.output_tokens || 0,
          total_tokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
        },
      };

      return openaiFormatResponse as T;
    } catch (error) {
      console.error("Anthropic API error:", error);
      throw error;
    }
  }
}
