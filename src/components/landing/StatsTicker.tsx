import { motion, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }: { value: number, prefix?: string, suffix?: string, decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [value, prefix, suffix, decimals]);

  return <span ref={ref} />;
}

function StatBox({ label, value, prefix, suffix, decimals }: { label: string, value: number, prefix?: string, suffix?: string, decimals?: number }) {
  return (
    <div className="glass p-4 rounded-xl text-center">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold text-foreground">
        <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </p>
    </div>
  );
}

export function StatsTicker() {
  const vaultState = useQuery(api.vault.getVaultState);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4 -mt-20 mb-24 relative z-20"
    >
      <StatBox 
        label="Total Value Locked" 
        value={vaultState?.tvl || 1250000} 
        prefix="$" 
        decimals={0}
      />
      <StatBox 
        label="Current APY" 
        value={vaultState?.current_apy || 12.5} 
        suffix="%" 
        decimals={2}
      />
      <StatBox 
        label="Gold Price" 
        value={vaultState?.gold_price || 2045} 
        prefix="$" 
        decimals={2}
      />
      <StatBox 
        label="QIE Price" 
        value={vaultState?.qie_price || 0.45} 
        prefix="$" 
        decimals={4}
      />
    </motion.div>
  );
}
