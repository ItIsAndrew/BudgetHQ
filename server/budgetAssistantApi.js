const DEFAULT_MODEL = 'gpt-5.6-luna';
const MAX_BODY_BYTES = 64 * 1024;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES = 12;

const BUDGET_ASSISTANT_INSTRUCTIONS = `You are BudgetHQ Assistant, a concise and practical budgeting coach inside the BudgetHQ prototype.

Help with monthly budgets, everyday spending, bills, savings goals, debt basics, youth money habits, transactions, categories, CSV imports, and navigating BudgetHQ.

BudgetHQ navigation:
- MAIN > Today contains balances, Safe-to-Spend, bills, goals, charts, and the Monthly Money Story.
- MAIN > Add & Manage contains accounts, imports, budget setup, bills, goals, subscriptions, and data controls.
- MAIN > Transactions contains the detailed ledger, filters, sorting, editing, and deletion.
- KIDS contains the money box, savings quests, chores, rewards, allowance scheduling, and activity.
- TIPS contains practical everyday saving and spending guidance.

Give a direct answer first, then short steps when useful. Ask one focused follow-up question when necessary. Never claim that BudgetHQ has moved money or connected to a bank. Do not provide individualized investment, tax, legal, or credit-repair advice; explain the limit and suggest an appropriate qualified professional for those topics. Do not request account numbers, card numbers, passwords, API keys, or other secrets.`;

export function normalizeAssistantMessages(messages) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message) =>
        message &&
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.text === 'string',
    )
    .map((message) => ({
      role: message.role,
      text: message.text.trim().slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((message) => message.text)
    .slice(-MAX_MESSAGES);
}

export function createResponsesPayload(messages, model = DEFAULT_MODEL) {
  const normalizedMessages = normalizeAssistantMessages(messages);
  const transcript = normalizedMessages
    .map(
      (message) =>
        `${message.role === 'assistant' ? 'BudgetHQ Assistant' : 'User'}: ${message.text}`,
    )
    .join('\n\n');

  return {
    input: `${transcript}\n\nBudgetHQ Assistant:`,
    instructions: BUDGET_ASSISTANT_INSTRUCTIONS,
    max_output_tokens: 500,
    model,
    reasoning: { effort: 'none' },
    store: false,
    text: { verbosity: 'low' },
  };
}

export function extractResponseText(responseBody) {
  if (typeof responseBody?.output_text === 'string') {
    return responseBody.output_text.trim();
  }

  for (const item of responseBody?.output ?? []) {
    for (const content of item?.content ?? []) {
      if (
        (content?.type === 'output_text' || content?.type === 'text') &&
        typeof content.text === 'string'
      ) {
        return content.text.trim();
      }
    }
  }

  return '';
}

export async function createBudgetAssistantReply({
  apiKey,
  fetchImpl = fetch,
  messages,
  model = DEFAULT_MODEL,
}) {
  if (!apiKey) {
    const error = new Error(
      'AI setup is required. Add OPENAI_API_KEY to your .env file and restart BudgetHQ.',
    );
    error.code = 'missing_api_key';
    error.status = 503;
    throw error;
  }

  const normalizedMessages = normalizeAssistantMessages(messages);

  if (!normalizedMessages.some((message) => message.role === 'user')) {
    const error = new Error('Enter a budgeting question to continue.');
    error.code = 'invalid_messages';
    error.status = 400;
    throw error;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetchImpl('https://api.openai.com/v1/responses', {
      body: JSON.stringify(createResponsesPayload(normalizedMessages, model)),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: controller.signal,
    });

    if (!response.ok) {
      const error = new Error(
        response.status === 429
          ? 'The AI usage limit was reached. Try again shortly.'
          : response.status === 401 || response.status === 403
            ? 'The OpenAI API key could not be used. Check the key and restart BudgetHQ.'
            : 'BudgetHQ Assistant is temporarily unavailable. Try again.',
      );
      error.code = 'upstream_error';
      error.status = response.status === 429 ? 429 : 502;
      throw error;
    }

    const responseBody = await response.json();
    const reply = extractResponseText(responseBody);

    if (!reply) {
      const error = new Error(
        'BudgetHQ Assistant did not return an answer. Try asking again.',
      );
      error.code = 'empty_response';
      error.status = 502;
      throw error;
    }

    return reply;
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error(
        'BudgetHQ Assistant took too long to respond. Try again.',
      );
      timeoutError.code = 'request_timeout';
      timeoutError.status = 504;
      throw timeoutError;
    }

    if (!error.status) {
      const networkError = new Error(
        'BudgetHQ Assistant is temporarily unavailable. Check your connection and try again.',
      );
      networkError.code = 'network_error';
      networkError.status = 502;
      throw networkError;
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function readJsonBody(request) {
  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of request) {
    totalBytes += chunk.length;

    if (totalBytes > MAX_BODY_BYTES) {
      const error = new Error('The chat request is too large.');
      error.code = 'request_too_large';
      error.status = 413;
      throw error;
    }

    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
  } catch {
    const error = new Error('The chat request was not valid JSON.');
    error.code = 'invalid_json';
    error.status = 400;
    throw error;
  }
}

function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(body));
}

export function createBudgetAssistantMiddleware({
  apiKey,
  fetchImpl = fetch,
  model = DEFAULT_MODEL,
  onError = () => {},
}) {
  return async function budgetAssistantMiddleware(request, response) {
    if (request.method === 'GET') {
      sendJson(response, 200, {
        configured: Boolean(apiKey),
        model: apiKey ? model : null,
      });
      return;
    }

    if (request.method !== 'POST') {
      response.setHeader('Allow', 'GET, POST');
      sendJson(response, 405, { error: 'Method not allowed.' });
      return;
    }

    try {
      const body = await readJsonBody(request);
      const reply = await createBudgetAssistantReply({
        apiKey,
        fetchImpl,
        messages: body.messages,
        model,
      });
      sendJson(response, 200, { reply });
    } catch (error) {
      onError(error);
      sendJson(response, error.status ?? 500, {
        code: error.code ?? 'assistant_error',
        error: error.message || 'BudgetHQ Assistant is temporarily unavailable.',
      });
    }
  };
}

export function budgetAssistantApiPlugin(options) {
  const middleware = createBudgetAssistantMiddleware(options);

  return {
    name: 'budgethq-assistant-api',
    configurePreviewServer(server) {
      server.middlewares.use('/api/budget-assistant', middleware);
    },
    configureServer(server) {
      server.middlewares.use('/api/budget-assistant', middleware);
    },
  };
}

export { DEFAULT_MODEL };
