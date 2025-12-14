import { Cpu, Network, Layers, BarChart3 } from "lucide-react";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative z-10 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
              <Cpu className="w-4 h-4" />
              <span>Powered by QIE Blockchain</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Intelligent Liquidity <br />
              <span className="text-muted-foreground">Meets High-Speed Consensus</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Aurum-AI leverages the QIE Blockchain's high throughput and low latency to execute complex AI-driven strategies in real-time.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Network className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">QIE Native Oracles</h3>
                  <p className="text-muted-foreground">
                    We utilize QIE's native oracle infrastructure to fetch tamper-proof price feeds for Gold (XAU) and QIE tokens every 3 seconds, ensuring our AI models always act on the freshest data.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                  <Layers className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Smart Contract Automation</h3>
                  <p className="text-muted-foreground">
                    The AurumVault smart contract is deployed directly on QIE Mainnet. It autonomously handles asset swapping and liquidity provision without human intervention, reducing counterparty risk.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI-Driven Rebalancing</h3>
                  <p className="text-muted-foreground">
                    Our off-chain AI agents analyze global market sentiment and volatility indices. When risk is detected, the agent signals the QIE smart contract to shift liquidity to Gold (Stable). When markets are bullish, it shifts to QIE (Growth).
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-[100px] rounded-full" />
            <div className="relative glass p-8 rounded-3xl border border-white/10 bg-black/40">
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-6 border-b border-white/10">
                  <span className="text-sm font-mono text-muted-foreground">LIVE SYSTEM STATUS</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-bold text-green-500">OPERATIONAL</span>
                  </div>
                </div>
                
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Network</span>
                    <span>QIE Mainnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Block Height</span>
                    <span className="text-primary">#12,458,992</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Oracle Latency</span>
                    <span className="text-green-400">12ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas Price</span>
                    <span>2.5 Gwei</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 mt-4">
                    <p className="text-xs text-muted-foreground mb-2">LATEST AI DECISION</p>
                    <p className="text-green-400">
                      {">"} DETECTED_LOW_VOLATILITY<br/>
                      {">"} EXECUTING_STRATEGY: YIELD_FARMING<br/>
                      {">"} ALLOCATION: 60% QIE / 40% GOLD
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
