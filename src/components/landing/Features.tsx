import { Globe, Zap, Lock } from "lucide-react";

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass p-8 rounded-2xl hover:bg-white/5 transition-colors">
      <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative z-10 py-24 px-4 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built on advanced blockchain technology to provide secure, automated, and efficient asset management.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Globe className="w-8 h-8 text-primary" />}
            title="RWA Integration"
            description="Direct exposure to real-world assets like Gold, tokenized and liquid on the blockchain."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-primary" />}
            title="AI Rebalancing"
            description="Smart algorithms monitor market volatility 24/7 to protect your principal and maximize yield."
          />
          <FeatureCard 
            icon={<Lock className="w-8 h-8 text-primary" />}
            title="Non-Custodial"
            description="You retain full control of your assets. Smart contracts handle the logic, you hold the keys."
          />
        </div>
      </div>
    </section>
  );
}
