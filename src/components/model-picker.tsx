import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { AI_MODELS, DEFAULT_MODEL } from '@/lib/models';
import { atom, useAtom } from 'jotai';

const MODEL_KEY = 'model';

const modelAtom = atom<string>(
  globalThis.localStorage ? localStorage.getItem(MODEL_KEY) || DEFAULT_MODEL : DEFAULT_MODEL,
);

export const modelAtomWithPersistence = atom(
  (get) => get(modelAtom),
  (get, set, value: string | null | undefined) => {
    if (!value) {
      localStorage.removeItem(MODEL_KEY);
    } else {
      set(modelAtom, value);
      localStorage.setItem(MODEL_KEY, value);
    }
  },
);

export function ModelPicker() {
  const [model, setModel] = useAtom(modelAtomWithPersistence);

  return (
    <Select value={model || undefined} onValueChange={setModel}>
      <SelectTrigger
        id="chatbot"
        aria-label="Chatbot"
        className="w-auto border-none shadow-none text-xl font-semibold focus:ring-0"
      >
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {AI_MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
