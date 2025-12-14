import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentActivity() {
  const transactions = useQuery(api.transactions.getUserTransactions);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  return (
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
                  <p className="font-medium">{tx.type === 'REBALANCE' ? 'CONVERSION' : tx.type}</p>
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
  );
}
