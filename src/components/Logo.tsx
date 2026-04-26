export function Logo({ className = "", variant = "dark" }: { className?: string; variant?: "dark" | "light" }) {
  const textColor = variant === "light" ? "text-primary-foreground" : "text-primary";
  const accentColor = "text-gold";
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
        <span className="font-display text-lg font-bold text-primary">A</span>
        <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
      </div>
      <div className="flex flex-col leading-none">
        <span className={`font-display text-base font-bold tracking-tight ${textColor}`}>
          Assieds <span className={accentColor}>Les</span> Conseils
        </span>
        <span className={`text-[10px] uppercase tracking-[0.2em] ${variant === "light" ? "text-gold-soft" : "text-muted-foreground"}`}>
          Coaching · Conseil · Formation
        </span>
      </div>
    </div>
  );
}
