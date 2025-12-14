import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router";

interface NavbarProps {
  isAuthenticated: boolean;
  scrollToSection: (id: string) => void;
}

export function Navbar({ isAuthenticated, scrollToSection }: NavbarProps) {
  const navigate = useNavigate();

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-black" />
        </div>
        <span className="text-xl font-bold tracking-tight">Aurum-AI</span>
      </div>
      
      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-6">
        <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Features
        </button>
        <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          How it Works
        </button>
        <button onClick={() => scrollToSection('roadmap')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          Roadmap
        </button>
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
  );
}
