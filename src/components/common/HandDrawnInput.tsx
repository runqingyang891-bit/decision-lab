interface HandDrawnInputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
}

export function HandDrawnInput({ type = 'text', value, onChange, placeholder, className = '', maxLength }: HandDrawnInputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`hand-drawn-input w-full text-black ${className}`}
    />
  );
}
