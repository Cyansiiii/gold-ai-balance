import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function ActionTabs() {
  const createTransaction = useMutation(api.transactions.createTransaction);
  const vaultState = useQuery(api.vault.getVaultState);

  const [amount, setAmount] = useState("");
  const [convertAmount, setConvertAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

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
      toast.error(error instanceof Error ? error.message : "Transaction failed");
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
      await createTransaction({
        type: "REBALANCE", 
        amount: Number(convertAmount),
      });
      toast.success(`Successfully converted ${convertAmount} USD to Gold (ARM)`);
      setConvertAmount("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Conversion failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue="deposit" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="deposit">Deposit</TabsTrigger>
        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
        <TabsTrigger value="convert">Rebalance</TabsTrigger>
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
          {isSubmitting ? "Processing..." : "Deposit into AI Vault"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Executed via QIE Router + Aurum Vault smart contract
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
          {isSubmitting ? "Processing..." : "Withdraw to Wallet"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Funds returned to connected QIE wallet
        </p>
      </TabsContent>

      <TabsContent value="convert" className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">AI Rebalance (QIE ↔ Gold)</label>
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
            <span className="text-muted-foreground">Current Gold Price</span>
            <span>{formatCurrency(vaultState?.gold_price || 2000)} / oz</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Est. ARM Tokens</span>
            <span>{convertAmount && !isNaN(Number(convertAmount)) ? (Number(convertAmount) / (vaultState?.gold_price || 2000)).toFixed(4) : "0.0000"}</span>
          </div>
        </div>
        <Button 
          className="w-full bg-amber-500 hover:bg-amber-600 text-black"
          onClick={handleConversion}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Rebalancing..." : "Execute AI Rebalance"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          Swaps assets via QIEDEX liquidity pools
        </p>
      </TabsContent>
    </Tabs>
  );
}
