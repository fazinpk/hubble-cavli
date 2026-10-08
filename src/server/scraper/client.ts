import "server-only";
import { z } from "zod";

import { sleep } from "@utils/async";

import {
  MAX_ATTEMPTS,
  MMI_GRAPHQL_URL,
  REQUEST_TIMEOUT_MS,
  RETRY_BASE_DELAY_MS,
  USER_AGENT,
} from "./consts";

const graphqlEnvelopeSchema = z.object({
  data: z.unknown().optional(),
  errors: z.array(z.object({ message: z.string() })).optional(),
});

class RetryableError extends Error {}

const sendOnce = async (body: string): Promise<unknown> => {
  let response: Response;
  try {
    response = await fetch(MMI_GRAPHQL_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": USER_AGENT },
      body,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    throw new RetryableError(`Network error: ${(error as Error).message}`);
  }

  if (response.status === 429 || response.status >= 500) {
    throw new RetryableError(`MMI Connect responded ${response.status}`);
  }
  if (!response.ok) {
    throw new Error(`MMI Connect responded ${response.status}`);
  }
  return response.json();
};

export const gqlRequest = async <TSchema extends z.ZodType>(
  query: string,
  variables: Record<string, unknown>,
  dataSchema: TSchema,
): Promise<z.output<TSchema>> => {
  const body = JSON.stringify({ query, variables });

  for (let attempt = 1; ; attempt++) {
    try {
      const envelope = graphqlEnvelopeSchema.parse(await sendOnce(body));
      if (envelope.errors?.length) {
        throw new Error(
          `GraphQL error: ${envelope.errors.map((e) => e.message).join("; ")}`,
        );
      }
      return dataSchema.parse(envelope.data);
    } catch (error) {
      if (!(error instanceof RetryableError) || attempt >= MAX_ATTEMPTS) {
        throw error;
      }
      await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
    }
  }
};
