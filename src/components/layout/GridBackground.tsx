interface GridBackgroundProps {
  children: React.ReactNode;
}

export function GridBackground({ children }: GridBackgroundProps) {
  return (
    <div className="min-h-screen grid-paper-bg">
      {children}
    </div>
  );
}
