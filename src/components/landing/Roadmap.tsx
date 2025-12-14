export function Roadmap() {
  return (
    <section id="roadmap" className="relative z-10 py-24 px-4 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Roadmap</h2>
          <p className="text-muted-foreground">Our journey to decentralized financial freedom.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { phase: "Phase 1", title: "Foundation", status: "Completed", items: ["QIE Contract Deployment", "Basic AI Integration", "Beta Launch"] },
            { phase: "Phase 2", title: "Expansion", status: "In Progress", items: ["Advanced Oracle Feeds", "Mobile App Beta", "Staking Pools"] },
            { phase: "Phase 3", title: "Autonomy", status: "Upcoming", items: ["DAO Governance", "Cross-chain Bridge", "Institutional API"] },
            { phase: "Phase 4", title: "Global", status: "Future", items: ["Debit Card Integration", "Physical Gold Redemption", "Global Partnerships"] }
          ].map((item, i) => (
            <div key={i} className="glass p-6 rounded-xl border-t-4 border-t-primary/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <h4 className="text-6xl font-bold">{i + 1}</h4>
              </div>
              <div className="relative z-10">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.status === 'Completed' ? 'bg-green-500/20 text-green-500' : item.status === 'In Progress' ? 'bg-amber-500/20 text-amber-500' : 'bg-white/10 text-muted-foreground'}`}>
                  {item.status}
                </span>
                <h3 className="text-xl font-bold mt-4 mb-2">{item.title}</h3>
                <ul className="space-y-2">
                  {item.items.map((li, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                      {li}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
