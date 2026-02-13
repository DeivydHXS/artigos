export const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-60 gap-4">

      {/* Spinner */}
      <div className="relative">
        <div className="h-10 w-10 rounded-full border-2 border-border"></div>
        <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </div>

      {/* Texto */}
      <p className="text-muted-foreground text-sm tracking-wide">
        Carregando...
      </p>

    </div>
  );
};
