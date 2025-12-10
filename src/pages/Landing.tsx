import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Shield, Zap, Globe, Lock } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const vaultState = useQuery(api.vault.getVaultState);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">Aurum-AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/auth")}
            className="hidden md:flex"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isAuthenticated ? "Dashboard" : "Launch App"}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm text-primary/80">
            <Zap className="w-4 h-4" />
            <span>AI-Powered Liquidity Protocol on QIE Blockchain</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Autonomous Wealth <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-200">
              Preservation & Growth
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Aurum-AI automatically rebalances your portfolio between Gold and QIE based on real-time volatility analysis, ensuring optimal risk-adjusted returns.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              size="lg" 
              className="h-12 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/auth")}
            >
              Start Earning
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-12 px-8 text-lg glass hover:bg-white/10"
            >
              View Documentation
            </Button>
          </div>
        </motion.div>

        {/* Stats Ticker */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-24 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatBox label="Total Value Locked" value={`$${(vaultState?.tvl || 1250000).toLocaleString()}`} />
          <StatBox label="Current APY" value={`${(vaultState?.current_apy || 12.5).toFixed(2)}%`} />
          <StatBox label="Gold Price" value={`$${(vaultState?.gold_price || 2045).toFixed(2)}`} />
          <StatBox label="QIE Price" value={`$${(vaultState?.qie_price || 0.45).toFixed(4)}`} />
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 py-24 px-4 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
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
      </section>
    </div>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="glass p-4 rounded-xl text-center">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass p-8 rounded-2xl hover:bg-white/5 transition-colors">
      <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}