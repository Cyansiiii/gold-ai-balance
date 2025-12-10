import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { motion } from "framer-motion";
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
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  TrendingUp, 
  Activity, 
  Shield, 
  Zap,
  LogOut
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, signOut, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const ensureWallet = useMutation(api.users.ensureWallet);
  const transactions = useQuery(api.transactions.getUserTransactions);
  const vaultState = useQuery(api.vault.getVaultState);
  const vaultHistory = useQuery(api.vault.getVaultHistory);
  const createTransaction = useMutation(api.transactions.createTransaction);
  const seedVault = useMutation(api.vault.seedVaultData);

  const [amount, setAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (!user) return null;

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Balance" 
            value={formatCurrency((user.depositedAmount || 0) * (vaultState?.gold_price || 2000) / 2000)} // Approx value
            icon={<Wallet className="w-4 h-4 text-primary" />}
            trend="+2.5%"
          />
          <StatsCard 
            title="ARM Tokens" 
            value={(user.armBalance || 0).toFixed(2)} 
            icon={<Shield className="w-4 h-4 text-blue-400" />}
            subtext="1 ARM = 1 Gold oz (peg)"
          />
          <StatsCard 
            title="Current APY" 
            value={(vaultState?.current_apy || 0).toFixed(2) + "%"} 
            icon={<TrendingUp className="w-4 h-4 text-green-400" />}
            trend="AI Optimized"
          />
          <StatsCard 
            title="Risk Mode" 
            value={vaultState?.status || "ANALYZING"} 
            icon={<Activity className="w-4 h-4 text-orange-400" />}
            subtext="Auto-Rebalancing"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-8">
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
                  {transactions?.map((tx) => (
                    <div key={tx._id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {tx.type === 'DEPOSIT' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-medium">{tx.type}</p>
                          <p className="text-xs text-muted-foreground">{new Date(tx.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{tx.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount)}</p>
                        <p className="text-xs text-muted-foreground font-mono">{tx.tx_hash.slice(0, 6)}...{tx.tx_hash.slice(-4)}</p>
                      </div>
                    </div>
                  ))}
                  {(!transactions || transactions.length === 0) && (
                    <div className="text-center text-muted-foreground py-8">No transactions yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div className="space-y-8">
            <Card className="glass border-none h-fit">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your liquidity position</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="deposit" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="deposit">Deposit</TabsTrigger>
                    <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
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
                </Tabs>
              </CardContent>
            </Card>

            <Card className="glass border-none bg-gradient-to-br from-primary/10 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Market Sentiment</span>
                    <span className="text-green-400 font-medium">Bullish</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Volatility Index</span>
                    <span className="text-yellow-400 font-medium">Moderate</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Next Rebalance</span>
                    <span className="text-white font-medium">~4h 12m</span>
                  </div>
                  <div className="mt-4 p-3 rounded bg-black/20 text-xs text-muted-foreground">
                    "AI suggests increasing Gold allocation due to rising global uncertainty metrics."
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend, subtext }: { title: string, value: string, icon: React.ReactNode, trend?: string, subtext?: string }) {
  return (
    <Card className="glass border-none">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
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
  );
}
