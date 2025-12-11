import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import { motion, useSpring, useTransform, useMotionValue, animate } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  TrendingUp, 
  Activity, 
  Shield, 
  Zap,
  LogOut,
  RefreshCw
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0, className }: { value: number, prefix?: string, suffix?: string, decimals?: number, className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [value, prefix, suffix, decimals]);

  return <span ref={ref} className={className} />;
}

export default function Dashboard() {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const ensureWallet = useMutation(api.users.ensureWallet);
  const transactions = useQuery(api.transactions.getUserTransactions);
  const vaultState = useQuery(api.vault.getVaultState);
  const vaultHistory = useQuery(api.vault.getVaultHistory);
  const createTransaction = useMutation(api.transactions.createTransaction);
  const seedVault = useMutation(api.vault.seedVaultData);
  const toggleRisk = useMutation(api.vault.toggleRiskState);
  const analyzeMarket = useAction(api.ai.analyzeMarket);

  const [amount, setAmount] = useState("");
  const [convertAmount, setConvertAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleTransaction = async (type: "DEPOSIT" | "WITHDRAW") => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTransaction({
        type,
        amount: Number(amount),
      });
      toast.success(`${type === "DEPOSIT" ? "Deposit" : "Withdrawal"} successful`);
      setAmount("");
    } catch (error) {
      toast.error("Transaction failed");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConversion = async () => {
     if (!convertAmount || isNaN(Number(convertAmount)) || Number(convertAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setIsSubmitting(true);
    try {
      // Simulating conversion by just creating a rebalance transaction record
      // In a real app, this would swap assets. Here we just log it.
      await createTransaction({
        type: "REBALANCE", // Using REBALANCE as a proxy for conversion in this demo
        amount: Number(convertAmount),
      });
      toast.success(`Successfully converted ${convertAmount} USD to Gold (ARM)`);
      setConvertAmount("");
    } catch (error) {
      toast.error("Conversion failed");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      const result = await analyzeMarket();
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
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name || "User"}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Operational
            </div>
            <Button variant="outline" onClick={() => signOut()} className="gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Balance" 
            value={(user.depositedAmount || 0) * (vaultState?.gold_price || 2000) / 2000}
            isCurrency
            icon={<Wallet className="w-4 h-4 text-primary" />}
            trend="+2.5%"
            delay={0.1}
          />
          <StatsCard 
            title="ARM Tokens" 
            value={user.armBalance || 0} 
            icon={<Shield className="w-4 h-4 text-blue-400" />}
            subtext="1 ARM = 1 Gold oz (peg)"
            delay={0.2}
          />
          <StatsCard 
            title="Current APY" 
            value={vaultState?.current_apy || 0}
            suffix="%"
            icon={<TrendingUp className="w-4 h-4 text-green-400" />}
            trend="AI Optimized"
            delay={0.3}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass border-none h-full">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Risk Mode</p>
                    <h3 className="text-2xl font-bold mt-2">{vaultState?.status || "ANALYZING"}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Auto-Rebalancing</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg">
                    <Activity className="w-4 h-4 text-orange-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Toggle Risk Strategy</span>
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
          
          {/* Chart Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 space-y-8"
          >
            <Card className="glass border-none">
              <CardHeader>
                <CardTitle>Vault Performance</CardTitle>
                <CardDescription>Real-time AI rebalancing performance vs Market</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vaultHistory || []}>
                    <defs>
                      <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="gold_price" 
                      stroke="var(--primary)" 
                      fillOpacity={1} 
                      fill="url(#colorGold)" 
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="glass border-none">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions?.map((tx, i) => (
                    <motion.div 
                      key={tx._id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-green-500/20 text-green-500' : tx.type === 'WITHDRAW' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                          {tx.type === 'DEPOSIT' ? <ArrowDownLeft className="w-4 h-4" /> : tx.type === 'WITHDRAW' ? <ArrowUpRight className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{tx.type}</p>
                          <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{tx.type === 'DEPOSIT' ? '+' : tx.type === 'WITHDRAW' ? '-' : ''}{formatCurrency(tx.amount)}</p>
                        <p className="text-xs text-muted-foreground font-mono">{tx.tx_hash.slice(0, 6)}...{tx.tx_hash.slice(-4)}</p>
                      </div>
                    </motion.div>
                  ))}
                  {(!transactions || transactions.length === 0) && (
                    <div className="text-center text-muted-foreground py-8">No transactions yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Panel */}
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
                <Tabs defaultValue="deposit" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="deposit">Deposit</TabsTrigger>
                    <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                    <TabsTrigger value="convert">Convert</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="deposit" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount (USD)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="pl-7"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleTransaction("DEPOSIT")}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Deposit Funds"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Funds are automatically converted to ARM tokens
                    </p>
                  </TabsContent>

                  <TabsContent value="withdraw" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount (USD)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="pl-7"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => handleTransaction("WITHDRAW")}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Withdraw Funds"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="convert" className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Convert USD to Gold (ARM)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input 
                          type="number" 
                          placeholder="0.00" 
                          className="pl-7"
                          value={convertAmount}
                          onChange={(e) => setConvertAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate</span>
                        <span>1 USD ≈ 0.0005 OZ</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fee</span>
                        <span>0.1%</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                      onClick={handleConversion}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Converting..." : "Convert to Gold"}
                    </Button>
                  </TabsContent>
                </Tabs>
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
                    <span className="text-muted-foreground">Volatility Index</span>
                    <span className="text-yellow-400 font-medium">Moderate</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Next Rebalance</span>
                    <span className="text-white font-medium">~4h 12m</span>
                  </div>
                  <div className="mt-4 p-3 rounded bg-black/20 text-xs text-muted-foreground border border-white/5">
                    {vaultState?.analysis || "\"AI suggests increasing Gold allocation due to rising global uncertainty metrics.\""}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend, subtext, delay = 0, isCurrency = false, suffix = "" }: { title: string, value: number, icon: React.ReactNode, trend?: string, subtext?: string, delay?: number, isCurrency?: boolean, suffix?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Card className="glass border-none h-full">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <h3 className="text-2xl font-bold mt-2">
                <AnimatedNumber 
                  value={value} 
                  prefix={isCurrency ? "$" : ""} 
                  suffix={suffix}
                  decimals={isCurrency ? 2 : 2}
                />
              </h3>
              {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              {icon}
            </div>
          </div>
          {trend && (
            <div className="mt-4 flex items-center text-xs text-green-400">
              <TrendingUp className="w-3 h-3 mr-1" />
              {trend}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}