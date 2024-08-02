import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { convertToCoreMessages, streamText } from 'ai';
import { AI_MODELS } from '@/lib/models';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, model } = await req.json();

  if (!messages || !model) {
    return new Response('Missing messages or model', { status: 400 });
  }

  if (!AI_MODELS.find((m) => m.id === model)) {
    return new Response('Invalid model', { status: 400 });
  }

  const vendor = AI_MODELS.find((m) => m.id === model)!.vendor;

  const provider = vendor === 'OpenAI' ? openai : anthropic;

  const result = await streamText({
    model: provider(model),
    // model: openai('gpt-4o-mini'),
    messages: convertToCoreMessages(messages),
    onFinish: async (data) => {
      console.log(data);
    },
  });

  return result.toDataStreamResponse();
}
