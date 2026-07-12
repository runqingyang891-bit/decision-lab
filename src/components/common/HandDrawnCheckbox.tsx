interface HandDrawnCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function HandDrawnCheckbox({ checked, onChange, label }: HandDrawnCheckboxProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`hand-drawn-checkbox ${checked ? 'checked' : ''}`}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-black">{label}</span>
    </label>
  );
}
