import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

interface HeroProps {
  isAuthenticated: boolean;
  scrollToSection: (id: string) => void;
}

export function Hero({ isAuthenticated, scrollToSection }: HeroProps) {
  const navigate = useNavigate();

  return (
    <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center pt-20 pb-32">
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
            onClick={() => scrollToSection('how-it-works')}
          >
            View Documentation
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
