import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { motion, animate } from "framer-motion";
import { useEffect, useRef } from "react";

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

export function StatsCard({ title, value, icon, trend, subtext, delay = 0, isCurrency = false, suffix = "", decimals = 2 }: { title: string, value: number, icon: React.ReactNode, trend?: string, subtext?: string, delay?: number, isCurrency?: boolean, suffix?: string, decimals?: number }) {
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
                  decimals={decimals}
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
