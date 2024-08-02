type AiModel = {
  id: string;
  name: string;
  vendor: 'OpenAI' | 'Anthropic';
};

export const AI_MODELS: AiModel[] = [
  {
    id: 'claude-3-5-sonnet-20240620',
    name: 'Claude 3.5 Sonnet',
    vendor: 'Anthropic',
  },
  {
    id: 'claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    vendor: 'Anthropic',
  },
  {
    id: 'claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    vendor: 'Anthropic',
  },
  {
    id: 'claude-3-haiku-20240307',
    name: 'Claude 3 Haiku',
    vendor: 'Anthropic',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    vendor: 'OpenAI',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o-mini',
    vendor: 'OpenAI',
  },
];
