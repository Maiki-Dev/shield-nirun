import { CircleCheck } from "lucide-react";

export function FormSuccess({ title, text, resetLabel, onReset }: { title: string; text: string; resetLabel: string; onReset: () => void }) {
  return (
    <div role="status" className="flex flex-col items-center gap-3 rounded-2xl bg-brand/10 p-8 text-center">
      <CircleCheck className="h-12 w-12 text-accent" />
      <p className="text-headline-sm font-bold text-ink">{title}</p>
      <p className="max-w-md text-body-sm text-muted">{text}</p>
      <button type="button" onClick={onReset} className="mt-2 text-label-lg font-bold text-accent hover:underline">
        {resetLabel}
      </button>
    </div>
  );
}
