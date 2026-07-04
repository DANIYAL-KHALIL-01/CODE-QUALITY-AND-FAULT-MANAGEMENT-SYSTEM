export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-hero-pattern p-8 text-center animate-fade-in">
      <div className="space-y-12 max-w-2xl">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-brand-foreground via-brand-primary to-brand-muted bg-clip-text text-transparent animate-bounce-in">
            Welcome to FaultPredict
          </h1>
          <p className="text-xl text-brand-muted animate-slide-in">
            Intelligent test case prioritization for legacy software systems
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-card-gradient border border-brand-accent rounded-xl p-6 hover:shadow-glow hover:shadow-glow-lg transition-all duration-300 animate-fade-in">
            <div className="h-12 w-12 bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-lg flex items-center justify-center mb-4 animate-float">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-brand-foreground mb-2">Smart Analysis</h3>
            <p className="text-brand-muted text-sm">Advanced algorithms to identify high-risk modules</p>
          </div>

          <div className="bg-card-gradient border border-brand-accent rounded-xl p-6 hover:shadow-glow hover:shadow-glow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="h-12 w-12 bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-lg flex items-center justify-center mb-4 animate-float">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-brand-foreground mb-2">Fast Prioritization</h3>
            <p className="text-brand-muted text-sm">Optimize your testing efforts with intelligent prioritization</p>
          </div>

          <div className="bg-card-gradient border border-brand-accent rounded-xl p-6 hover:shadow-glow hover:shadow-glow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="h-12 w-12 bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-lg flex items-center justify-center mb-4 animate-float">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-brand-foreground mb-2">Legacy Support</h3>
            <p className="text-brand-muted text-sm">Specialized for legacy software systems</p>
          </div>
        </div>

        <div className="mt-12 animate-slide-in">
          <button className="bg-gradient-to-r from-brand-primary to-brand-primary/80 hover:from-brand-primary/90 hover:to-brand-primary/70 text-white px-8 py-3 rounded-lg font-medium shadow-glow hover:shadow-glow-lg transition-all duration-300 animate-float">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
