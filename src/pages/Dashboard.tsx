import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Wallet, 
  Shield, 
  Zap,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Timer,
  Gauge,
  ArrowUpRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { OnChainProof } from "@/components/dashboard/OnChainProof";
import { TokenInfo } from "@/components/dashboard/TokenInfo";
import { AIDecisionLog } from "@/components/dashboard/AIDecisionLog";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActionTabs } from "@/components/dashboard/ActionTabs";
import { VaultPerformance } from "@/components/dashboard/VaultPerformance";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const ensureWallet = useMutation(api.users.ensureWallet);
  const vaultState = useQuery(api.vault.getVaultState);
  const vaultHistory = useQuery(api.vault.getVaultHistory);
  const seedVault = useMutation(api.vault.seedVaultData);
  const toggleRisk = useMutation(api.vault.toggleRiskState);
  const analyzeMarket = useAction(api.ai.analyzeMarket);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Ensure user has a wallet when they visit dashboard
  useEffect(() => {
    if (isAuthenticated && user) {
      ensureWallet();
    } else if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, user, ensureWallet, navigate]);

  // Seed vault data if empty (for demo purposes)
  useEffect(() => {
    if (vaultHistory && vaultHistory.length === 0) {
      seedVault();
    }
  }, [vaultHistory, seedVault]);

  const handleRiskToggle = async () => {
    try {
      await toggleRisk();
      toast.success(`Risk mode updated`);
    } catch (error) {
      toast.error("Failed to update risk mode");
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await analyzeMarket();
      toast.success("Market analysis complete");
    } catch (error) {
      console.error(error);
      toast.error("Failed to analyze market");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) return null;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-24">
      {/* Demo Mode Banner */}
      <div className="fixed top-0 left-0 right-0 bg-amber-500/10 border-b border-amber-500/20 text-amber-500 text-xs font-bold text-center py-1 z-50 backdrop-blur-sm">
        Demo Mode – Testnet / Simulated USD values
      </div>

      <div className="max-w-7xl mx-auto space-y-8 mt-6">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Aurum-AI Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name || "User"}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-4">
              <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-sm border-primary/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-bold text-primary">QIE Mainnet Connected</span>
              </div>
              <Button variant="outline" onClick={() => signOut()} className="gap-2 h-9">
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Wallet className="w-3 h-3" /> {user.walletAddress ? `${user.walletAddress.slice(0,6)}...${user.walletAddress.slice(-4)}` : "Connecting..."}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>QIE Balance: 1,240.50 QIE</span>
            </div>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="USD Balance" 
            value={user.depositedAmount || 0}
            isCurrency
            icon={<Wallet className="w-4 h-4 text-primary" />}
            trend="+2.5%"
            delay={0.1}
          />
          <StatsCard 
            title="ARM Tokens (Gold)" 
            value={user.armBalance || 0} 
            icon={<Shield className="w-4 h-4 text-blue-400" />}
            subtext={`≈ ${formatCurrency((user.armBalance || 0) * (vaultState?.gold_price || 2000))} USD`}
            delay={0.2}
            decimals={4}
          />
          <StatsCard 
            title="Current APY" 
            value={vaultState?.current_apy || 0}
            suffix="%"
            icon={<ArrowUpRight className="w-4 h-4 text-green-400" />}
            trend="AI Optimized"
            delay={0.3}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass border-none h-full bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-400" /> AI Vault Status
                    </p>
                    <h3 className="text-2xl font-bold mt-2 font-mono">
                      {vaultState?.status === "RISK_ON" ? "Risk On (Growth)" : "Risk Off (Safety)"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">
                      Powered by QIE Native Gold Oracles. Updates every 3 seconds.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Manual Override</span>
                  <Switch 
                    checked={vaultState?.status === "RISK_ON"}
                    onCheckedChange={handleRiskToggle}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Chart, Activity, On-Chain Proof */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 space-y-8"
          >
            <VaultPerformance />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <OnChainProof />
              <TokenInfo />
            </div>

            <RecentActivity />
          </motion.div>

          {/* Right Column: Actions, AI Insights, Decision Log */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-8"
          >
            <Card className="glass border-none h-fit">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your liquidity position</CardDescription>
              </CardHeader>
              <CardContent>
                <ActionTabs />
              </CardContent>
            </Card>

            <Card className="glass border-none bg-gradient-to-br from-primary/10 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    AI Insights
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-xs bg-white/5 hover:bg-white/10 border-white/10"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                    ) : (
                      <Zap className="w-3 h-3 mr-1" />
                    )}
                    {isAnalyzing ? "Analyzing..." : "Run Analysis"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Market Sentiment</span>
                    <span className={vaultState?.status === "RISK_ON" ? "text-green-400 font-medium" : "text-red-400 font-medium"}>
                      {vaultState?.status === "RISK_ON" ? "Bullish (Risk On)" : "Bearish (Risk Off)"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">AI Confidence</span>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-3 h-3 text-primary" />
                      <span className="text-primary font-bold">94.2%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Oracle Refresh</span>
                    <div className="flex items-center gap-2">
                      <Timer className="w-3 h-3 text-muted-foreground" />
                      <span className="text-white font-mono">00:03s</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 rounded bg-black/20 text-xs text-muted-foreground border border-white/5">
                    {vaultState?.analysis || "\"AI suggests increasing Gold allocation due to rising global uncertainty metrics.\""}
                  </div>
                </div>
              </CardContent>
            </Card>

            <AIDecisionLog />
          </motion.div>
        </div>
      </div>
    </div>
  );
}