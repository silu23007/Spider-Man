import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CharacterBio } from "../types";
import { Shield, Sparkles, Zap, Brain, Activity, Swords, ChevronRight } from "lucide-react";

const bios: CharacterBio[] = [
  {
    id: "spiderman",
    name: "Peter Parker",
    alterEgo: "Spider-Man",
    codename: "The Vigilante",
    description: "Stripped of his high-tech Stark suits and forgotten by the entire world after Doctor Strange's spell, Peter Parker is back to basics. Operating from a run-down apartment in Queens, he swings through New York on sheer willpower and home-brewed web fluid, carving out a brand new day of street-level heroism.",
    powers: [
      "Wall-Crawling (Bio-electromagnetism)",
      "Proportional Spider Strength (Lifts up to 10 tons)",
      "Spider-Sense (Precognitive danger warning)",
      "Superhuman Agility & Reflexes"
    ],
    weapons: [
      "Classic Mechanical Web-Shooters",
      "Gamma-Stabilizer Web-Matrix (Co-engineered with Banner)",
      "Spider-Tracers (Frequency-modulated)"
    ],
    stats: {
      strength: 65,
      agility: 98,
      intellect: 85,
      stamina: 70,
      combat: 80
    },
    quote: "Peter: 'Look, the world forgot Peter Parker... but they still remember Spider-Man. And as long as I have breath, I'll protect this neighborhood.'",
    color: "from-red-600 via-rose-600 to-blue-700",
    bgGlow: "shadow-[0_0_40px_rgba(239,68,68,0.25)]",
    alliance: "Independent Vigilante"
  },
  {
    id: "hulk",
    name: "Dr. Bruce Banner",
    alterEgo: "The Hulk",
    codename: "The Emerald Behemoth",
    description: "Following the stabilization of his dual-identities, Smart Hulk has returned to his laboratory to research multiversal disturbances. When localized gamma spikes crop up in New York, Banner initiates the 'Gamma Protocol', bringing him face-to-face with a mysterious masked vigilante whose bio-resonance holds strange properties.",
    powers: [
      "Infinite Physical Strength (Scales with rage)",
      "Superhuman Leap & Speed",
      "Immune to Gamma Radiation",
      "Rapid Regenerative Healing Factor"
    ],
    weapons: [
      "S.H.I.E.L.D. Sub-Atomic Scanner",
      "Gamma Core Containment Cells",
      "Tactical Nanotech Bio-Armor (Self-scaling)"
    ],
    stats: {
      strength: 99,
      agility: 40,
      intellect: 95,
      stamina: 98,
      combat: 75
    },
    quote: "Bruce: 'I spent years thinking Hulk was a curse. Now, with Peter's help, we're using gamma science to build a shield for this city, not a weapon.'",
    color: "from-emerald-600 via-green-600 to-indigo-800",
    bgGlow: "shadow-[0_0_40px_rgba(16,185,129,0.25)]",
    alliance: "The Avengers"
  }
];

export default function CharacterBios() {
  const [selectedCharId, setSelectedCharId] = useState<string>("spiderman");
  
  // Interactive Customization States
  const [spideySuit, setSpideySuit] = useState<"spandex" | "nanotech">("spandex");
  const [hulkMode, setHulkMode] = useState<"smart" | "savage">("smart");

  const activeChar = bios.find((b) => b.id === selectedCharId)!;

  // Calculate dynamic stats based on gear choices
  const getDynamicStats = () => {
    const base = { ...activeChar.stats };
    if (activeChar.id === "spiderman") {
      if (spideySuit === "nanotech") {
        base.strength += 15; // Banner tech exoskeleton boost
        base.agility -= 5;    // slightly heavier
        base.stamina += 20;   // shield protection
        base.combat += 10;    // smart target-assist
      }
    } else {
      if (hulkMode === "savage") {
        base.strength = 100; // Peak rage
        base.agility += 20;  // Animalistic leaps
        base.intellect = 15; // Mindless
        base.stamina = 100;  // Infinite endurance
        base.combat += 15;   // Brutal combat
      }
    }
    return base;
  };

  const dynamicStats = getDynamicStats();

  return (
    <div id="character-bios-section" className="py-16 px-4 max-w-7xl mx-auto z-10 relative">
      <div className="text-center mb-10">
        <span className="px-3 py-1 text-xs font-mono uppercase bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-full tracking-wider">
          Avenger/Vigilante Database
        </span>
        <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tighter text-white mt-3 uppercase">
          Dynamic Character Bios
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mt-2 text-sm">
          Toggle between Spider-Man and the Hulk. Toggle their tech modifiers to see how their tactical metrics adapt dynamically.
        </p>
      </div>

      {/* Database Select Tabs */}
      <div className="flex justify-center space-x-4 mb-8 bg-white/5 p-1.5 rounded-2xl border border-white/10 max-w-md mx-auto backdrop-blur-md">
        <button
          onClick={() => setSelectedCharId("spiderman")}
          className={`flex-1 py-3 px-4 font-sans font-black tracking-wider text-xs uppercase rounded-xl cursor-pointer transition-all duration-300 ${
            selectedCharId === "spiderman"
              ? "bg-red-600/80 text-white shadow-lg border border-white/20"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          🕷️ SPIDER-MAN
        </button>
        <button
          onClick={() => setSelectedCharId("hulk")}
          className={`flex-1 py-3 px-4 font-sans font-black tracking-wider text-xs uppercase rounded-xl cursor-pointer transition-all duration-300 ${
            selectedCharId === "hulk"
              ? "bg-emerald-600/80 text-white shadow-lg border border-white/20"
              : "text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          🤢 THE HULK
        </button>
      </div>

      {/* Main Bio Showcase Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeChar.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row gap-8 relative overflow-hidden shadow-2xl ${activeChar.bgGlow}`}
        >
          {/* Subtle grid accent background */}
          <div className="absolute inset-0 bg-grid-white opacity-[0.01] pointer-events-none" />

          {/* Graphical/Icon Section (Takes up Left Hand) */}
          <div className="w-full lg:w-2/5 flex flex-col justify-between">
            <div className={`rounded-2xl bg-gradient-to-b ${activeChar.color} p-6 border border-white/10 relative overflow-hidden flex flex-col justify-end min-h-64 shadow-xl`}>
              <div className="absolute top-2 right-2 px-2.5 py-0.5 bg-black/60 border border-white/10 text-yellow-400 font-mono text-[10px] tracking-widest uppercase rounded">
                SECURE ACCESS
              </div>

              <div>
                <span className="text-xs font-mono text-zinc-200 uppercase opacity-90 block">
                  {activeChar.codename}
                </span>
                <h3 className="text-3xl md:text-5xl font-sans font-black tracking-tighter text-white uppercase mt-1 leading-none">
                  {activeChar.alterEgo}
                </h3>
                <p className="text-xs font-mono text-white/80 mt-1">
                  Real Name: {activeChar.name}
                </p>
              </div>
            </div>

            {/* Interactive Stats Modifiers */}
            <div className="mt-6 bg-black/40 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
              <h4 className="text-xs font-mono text-yellow-400 uppercase tracking-widest mb-3">
                🔧 Active Armor/Mod Configuration:
              </h4>

              {activeChar.id === "spiderman" ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSpideySuit("spandex")}
                    className={`p-2.5 font-sans font-bold text-xs rounded-xl border uppercase text-center cursor-pointer transition-all ${
                      spideySuit === "spandex"
                        ? "bg-red-600/80 text-white border-white/20 shadow-md"
                        : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Classic Spandex
                    <span className="block text-[8px] font-mono font-normal mt-0.5">
                      Max Agility (+0 Weight)
                    </span>
                  </button>
                  <button
                    onClick={() => setSpideySuit("nanotech")}
                    className={`p-2.5 font-sans font-bold text-xs rounded-xl border uppercase text-center cursor-pointer transition-all ${
                      spideySuit === "nanotech"
                        ? "bg-blue-700/80 text-white border-white/20 shadow-md"
                        : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Gamma-Shield Suit
                    <span className="block text-[8px] font-mono font-normal mt-0.5">
                      +15 Str, +20 Stamina
                    </span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setHulkMode("smart")}
                    className={`p-2.5 font-sans font-bold text-xs rounded-xl border uppercase text-center cursor-pointer transition-all ${
                      hulkMode === "smart"
                        ? "bg-emerald-600/80 text-white border-white/20 shadow-md"
                        : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Smart Hulk [Bruce]
                    <span className="block text-[8px] font-mono font-normal mt-0.5">
                      Max Intellect (95 Int)
                    </span>
                  </button>
                  <button
                    onClick={() => setHulkMode("savage")}
                    className={`p-2.5 font-sans font-bold text-xs rounded-xl border uppercase text-center cursor-pointer transition-all ${
                      hulkMode === "savage"
                        ? "bg-purple-800/80 text-white border-white/20 shadow-md"
                        : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Savage Rage Hulk
                    <span className="block text-[8px] font-mono font-normal mt-0.5">
                      Max Smash (100 Str/Stam)
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description and Interactive Metrics (Right Hand) */}
          <div className="w-full lg:w-3/5 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-zinc-500 font-mono text-xs uppercase">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Affiliation: {activeChar.alliance}</span>
              </div>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed mt-2">
                {activeChar.description}
              </p>
            </div>

            {/* Dynamic Interactive Progress Stats */}
            <div className="space-y-3 bg-black/30 border border-white/10 p-4 rounded-2xl backdrop-blur-md shadow-inner">
              <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest border-b border-white/10 pb-2 flex justify-between">
                <span>TACTICAL METRICS MATRIX</span>
                <span className="text-[10px] text-yellow-500 font-normal">
                  {activeChar.id === "spiderman" && spideySuit === "nanotech" ? "Exoskeleton Modifiers Applied" : ""}
                  {activeChar.id === "hulk" && hulkMode === "savage" ? "Rage Limit Breakers Applied" : ""}
                </span>
              </h4>

              {/* Stats loops */}
              {[
                { label: "Physical Strength", val: dynamicStats.strength, icon: Swords },
                { label: "Combat Agility", val: dynamicStats.agility, icon: Activity },
                { label: "Cognitive Intellect", val: dynamicStats.intellect, icon: Brain },
                { label: "Durable Stamina", val: dynamicStats.stamina, icon: Shield },
              ].map((stat, sIdx) => (
                <div key={sIdx}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-zinc-400 flex items-center space-x-1">
                      <stat.icon className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{stat.label}</span>
                    </span>
                    <span className="text-white font-bold">{stat.val}/100</span>
                  </div>
                  <div className="w-full h-3 bg-black/50 border border-white/5 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      className={`h-full rounded-full bg-gradient-to-r ${
                        activeChar.id === "spiderman" ? "from-red-500 to-rose-600" : "from-emerald-500 to-green-600"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.val}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Abilities list grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/30 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
                <h5 className="text-xs font-mono text-yellow-400 uppercase font-bold mb-2">
                  🧬 Mutation Powers:
                </h5>
                <ul className="space-y-1">
                  {activeChar.powers.map((pow, pIdx) => (
                    <li key={pIdx} className="text-xs text-zinc-300 flex items-center">
                      <ChevronRight className="w-3.5 h-3.5 text-red-500 mr-1 flex-shrink-0" />
                      <span>{pow}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-black/30 border border-white/10 p-3 rounded-2xl backdrop-blur-md">
                <h5 className="text-xs font-mono text-yellow-400 uppercase font-bold mb-2">
                  🛠️ Gear / Arsenal:
                </h5>
                <ul className="space-y-1">
                  {activeChar.weapons.map((weap, wIdx) => (
                    <li key={wIdx} className="text-xs text-zinc-300 flex items-center">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-500 mr-1 flex-shrink-0" />
                      <span>{weap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quote block */}
            <div className="border-l-4 border-yellow-500 bg-white/5 border-t border-r border-b border-white/10 p-3 rounded-r-2xl italic text-xs font-mono text-zinc-300">
              {activeChar.quote}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
