import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ComicPanelData } from "../types";
import { Sparkles, Zap, Shield, HelpCircle, HeartCrack } from "lucide-react";

interface ComicPanelsProps {
  onSelectPanel: (panel: ComicPanelData) => void;
  onGammaAdjust: (intensity: number) => void;
}

const panels: ComicPanelData[] = [
  {
    id: 1,
    title: "A FRESH BEGINNING",
    subtitle: "The Forgotten Vigilante",
    description: "In the shadow of the Grand Central Terminal, Peter Parker swings alone. Everyone he loved has forgotten who he is. Starting from scratch, he builds his own suit and patrols the cold, uncaring streets of a brand new Manhattan.",
    imageAlt: "Spider-Man overlooking New York skyline",
    soundEffect: "THWIP!",
    accentColor: "from-red-600 to-rose-700",
    dialogue: "Peter: 'No Stark tech. No Avengers budget. Just me, some spandex, and a lot of glue. Let's do this.'"
  },
  {
    id: 2,
    title: "GAMMA SPIKE IN QUEENS",
    subtitle: "A Sudden Impact",
    description: "An unexpected explosion rocks a Stark Industries warehouse. Advanced prototypes are stolen, leaving behind trace radiation. Dr. Bruce Banner's remote monitors light up. A dangerous gamma signature has just been activated.",
    imageAlt: "Hulk smash site radiating green energy",
    soundEffect: "BRRRRRR!",
    accentColor: "from-emerald-600 to-teal-700",
    dialogue: "Bruce: 'That's not normal decay... Someone is attempting to stabilize a miniature gamma collider in downtown Queens.'"
  },
  {
    id: 3,
    title: "THE ENCOUNTER",
    subtitle: "Webs vs. Might",
    description: "Mistaking Spider-Man for a rogue tech smuggler, a rogue defense mech crashes into the docks. Spider-Man struggles to contain its nuclear engine, when a massive, green fist intercepts the blow. The Science Bros reunite—without memories, but with instinct.",
    imageAlt: "Spider-Man and Hulk teaming up at the docks",
    soundEffect: "SMASH!",
    accentColor: "from-purple-700 to-violet-800",
    dialogue: "Hulk: 'Puny robot. Don't touch the spider-kid!'\nPeter: 'Woah! Huge green savior! Can I get an autograph or a safe house?!'"
  },
  {
    id: 4,
    title: "THE BRAND NEW ALLIANCE",
    subtitle: "Science & Agility",
    description: "Working inside Bruce's cloaked laboratory, Peter integrates Banner's stabilizer matrix into his Web-Shooters. Together, they prepare to confront a street-level gang armed with unstable gamma-cores. The web-slinger and the behemoth stand ready.",
    imageAlt: "Spider-Man and Banner working in the lab",
    soundEffect: "CLANG!",
    accentColor: "from-amber-500 to-orange-600",
    dialogue: "Peter: 'So, if I spray this web, it stops the explosion?'\nBruce: 'Yes. Unless you cross the streams. Then, Queens becomes a crater.'"
  }
];

export default function ComicPanels({ onSelectPanel, onGammaAdjust }: ComicPanelsProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [activePanel, setActivePanel] = useState<ComicPanelData | null>(null);

  const handlePanelClick = (panel: ComicPanelData) => {
    setActivePanel(panel);
    onSelectPanel(panel);
    
    // Shift gamma intensity based on panel
    if (panel.id === 1) onGammaAdjust(15);
    if (panel.id === 2) onGammaAdjust(95);
    if (panel.id === 3) onGammaAdjust(70);
    if (panel.id === 4) onGammaAdjust(45);
  };

  return (
    <div className="my-10 px-4 max-w-7xl mx-auto z-10 relative">
      <div className="text-center mb-8">
        <span className="px-3 py-1 text-xs font-mono uppercase bg-red-600/20 text-red-400 border border-red-500/30 rounded-full tracking-wider">
          Interactive Comic Arc
        </span>
        <h2 className="text-3xl md:text-5xl font-sans font-black tracking-tighter text-white mt-3 uppercase">
          Brand New Day Storyboard
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto mt-2 text-sm font-sans">
          Click on any panels to expand the timeline storyline. Watch how Spider-Man's universe crosses paths with Hulk's gamma outbreak.
        </p>
      </div>

      {/* Grid of panels resembling classic comic books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {panels.map((panel, idx) => {
          const isHovered = hoveredId === panel.id;
          const tilts = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2"];
          const tilt = tilts[idx % tilts.length];

          return (
            <motion.div
              key={panel.id}
              id={`comic-panel-${panel.id}`}
              className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 cursor-pointer overflow-hidden shadow-xl hover:shadow-2xl hover:border-white/20 ${tilt} hover:rotate-0 hover:scale-103 transition-all duration-300 group`}
              onMouseEnter={() => setHoveredId(panel.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handlePanelClick(panel)}
              whileTap={{ scale: 0.98 }}
            >
              {/* Comic dot halftone effect on hover */}
              <div 
                className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] pointer-events-none transition-opacity duration-300"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 2px, transparent 3px)",
                  backgroundSize: "8px 8px"
                }}
              />

              {/* Decorative Frame */}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-mono tracking-widest z-10 uppercase rounded-md border border-white/10">
                Chapter {panel.id}
              </div>

              {/* Sound Effect Bubble */}
              <motion.div
                className={`absolute right-4 top-4 px-3 py-1 font-sans font-extrabold text-sm text-white bg-red-600/90 backdrop-blur-md border border-white/20 rounded-md shadow-md z-10 uppercase tracking-widest pointer-events-none`}
                animate={{
                  scale: isHovered ? [1, 1.2, 1.1] : 1,
                  rotate: isHovered ? [-5, 12, 5] : -5,
                }}
                transition={{ duration: 0.3 }}
              >
                {panel.soundEffect}
              </motion.div>

              {/* Graphical representation/Placeholder with Marvel vibes */}
              <div className={`w-full h-44 rounded-xl bg-gradient-to-br ${panel.accentColor} flex flex-col justify-end p-3 relative overflow-hidden border border-white/10`}>
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  {panel.id === 1 && <Sparkles className="w-20 h-20 text-white" />}
                  {panel.id === 2 && <Zap className="w-20 h-20 text-white" />}
                  {panel.id === 3 && <Shield className="w-20 h-20 text-white" />}
                  {panel.id === 4 && <HeartCrack className="w-20 h-20 text-white" />}
                </div>

                <div className="z-10 bg-black/50 backdrop-blur-md p-2 rounded-lg border border-white/10">
                  <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wide">
                    {panel.subtitle}
                  </p>
                  <h3 className="text-base font-sans font-black tracking-tight text-white uppercase">
                    {panel.title}
                  </h3>
                </div>
              </div>

              {/* Dialogue Text Box */}
              <div className="mt-4 bg-black/40 text-white p-3 border border-white/10 rounded-xl shadow-inner min-h-24 flex flex-col justify-between backdrop-blur-md">
                <p className="text-xs font-mono italic leading-relaxed text-zinc-300 line-clamp-3">
                  {panel.dialogue.split("\n")[0]}
                </p>
                <div className="text-right mt-1">
                  <span className="text-[9px] font-mono bg-white/10 text-white hover:bg-white/25 border border-white/10 px-1.5 py-0.5 uppercase tracking-wider rounded-md">
                    Read Story
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expanded Modal View for reading the comic panel */}
      <AnimatePresence>
        {activePanel && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              id="active-panel-modal"
              initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotate: 2 }}
              className="bg-slate-950/90 backdrop-blur-2xl border border-white/15 max-w-2xl w-full p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden"
            >
              {/* Halftone pattern */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, #fff 2px, transparent 3px)",
                  backgroundSize: "10px 10px"
                }}
              />

              {/* Close Button */}
              <button
                onClick={() => setActivePanel(null)}
                className="absolute right-4 top-4 bg-red-600/80 hover:bg-red-700/80 backdrop-blur-md text-white border border-white/20 font-mono px-2 py-1 rounded-lg shadow cursor-pointer transition-colors text-xs font-bold"
              >
                CLOSE [ESC]
              </button>

              <div className="flex items-center space-x-2 text-xs font-mono text-yellow-400 uppercase tracking-widest mb-1">
                <span>COMIC PANEL REFERENCE #{activePanel.id}</span>
              </div>

              <h3 className="text-2xl md:text-4xl font-sans font-black tracking-tighter text-white uppercase border-b border-white/10 pb-3">
                {activePanel.title}
              </h3>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className={`h-48 md:h-full rounded-2xl bg-gradient-to-br ${activePanel.accentColor} border border-white/10 p-4 flex flex-col justify-between relative overflow-hidden`}>
                  <div className="absolute bottom-[-10px] right-[-10px] opacity-10">
                    <Sparkles className="w-32 h-32 text-white" />
                  </div>
                  <div className="px-3 py-1.5 bg-black/60 border border-white/10 rounded-xl font-sans font-black tracking-widest text-center text-lg text-yellow-400 uppercase w-fit animate-pulse">
                    {activePanel.soundEffect}
                  </div>
                  <div className="bg-black/85 p-3 rounded-xl border border-white/10">
                    <p className="text-[11px] font-mono text-emerald-400 uppercase">
                      {activePanel.subtitle}
                    </p>
                    <p className="text-xs text-zinc-300 mt-1">
                      {activePanel.imageAlt}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                      STORY LOG
                    </h4>
                    <p className="text-sm text-zinc-300 leading-relaxed font-sans mt-1">
                      {activePanel.description}
                    </p>
                  </div>

                  <div className="bg-black/40 text-white p-4 border border-white/10 rounded-2xl shadow">
                    <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold mb-1">
                      CHARACTER DIALOGUE
                    </h4>
                    {activePanel.dialogue.split("\n").map((line, lIdx) => (
                      <p key={lIdx} className="text-xs font-mono leading-relaxed mt-1 text-zinc-200">
                        {line}
                      </p>
                    ))}
                  </div>

                  <div className="pt-2">
                    <p className="text-[11px] font-mono text-zinc-500 italic">
                      💡 Energy signature shifts gamma ambient to:{" "}
                      <span className="text-emerald-400 font-bold font-sans">
                        {activePanel.id === 1 && "15% (Quiet Vigilante)"}
                        {activePanel.id === 2 && "95% (Hulk Gamma Outbreak)"}
                        {activePanel.id === 3 && "70% (Collaborative Clash)"}
                        {activePanel.id === 4 && "45% (Interconnected Science)"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
