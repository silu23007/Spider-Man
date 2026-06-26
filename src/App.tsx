import { useState } from "react";
import WebSwingingBackground from "./components/WebSwingingBackground";
import ComicPanels from "./components/ComicPanels";
import CharacterBios from "./components/CharacterBios";
import CountdownTimer from "./components/CountdownTimer";
import TicketBooking from "./components/TicketBooking";
import DailyBugleConsole from "./components/DailyBugleConsole";
import { Sparkles, Shield, Compass, Armchair, MessageSquareCode, Layers3, Volume2, Info } from "lucide-react";

export default function App() {
  // Ambient Gamma radiation intensity (0 to 100) controlled by comic panels or user
  const [gammaIntensity, setGammaIntensity] = useState<number>(30);
  const [smashCount, setSmashCount] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(true);

  // Triggered when Hulk crashes down in the background canvas
  const handleHulkSmash = () => {
    setSmashCount((prev) => prev + 1);
    // Subtle physical/visual feedback
    if (!isMuted) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(80, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      } catch (e) {
        console.warn("Audio Context blocked or not supported", e);
      }
    }
  };

  return (
    <div className="min-h-screen text-white bg-[#020617] font-sans relative overflow-x-hidden selection:bg-red-600/40 selection:text-white pb-16">
      
      {/* Background radial glow accents for the Frosted Glass depth */}
      <div className="absolute top-[10%] left-[5%] w-[35vw] h-[35vw] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[35%] right-[5%] w-[40vw] h-[40vw] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[10%] w-[30vw] h-[30vw] bg-yellow-500/5 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-[5%] right-[15%] w-[35vw] h-[35vw] bg-red-500/5 rounded-full blur-[130px] pointer-events-none" />

      {/* 1. Interactive Parallax and Animated Character Background */}
      <WebSwingingBackground 
        gammaIntensity={gammaIntensity} 
        onHulkSmashTrigger={handleHulkSmash} 
      />

      {/* 2. Top Alert Ribbon & Branding */}
      <div className="relative z-20 w-full bg-red-950/40 backdrop-blur-md text-white font-mono text-[11px] py-2.5 px-4 flex justify-between items-center tracking-widest border-b border-white/10">
        <div className="flex items-center space-x-2 truncate">
          <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 text-[9px] font-black rounded uppercase animate-pulse">
            LIVE NEWS
          </span>
          <span className="truncate font-medium text-zinc-200">
            JJJ: "COLLUSION CONFIRMED! THE SPIDER-MENACE SEEN WITH INDESTRUCTIBLE GREEN ENFORCER!"
          </span>
        </div>
        
        <div className="flex items-center space-x-4 ml-2 flex-shrink-0">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="hover:text-yellow-400 font-mono text-[10px] uppercase flex items-center space-x-1 cursor-pointer transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isMuted ? "Sound: Off" : "Sound: On"}</span>
          </button>
          
          <span className="hidden md:inline text-zinc-400 font-bold">
            S.H.I.E.L.D. SECURE LEDGER INDEX
          </span>
        </div>
      </div>

      {/* 3. Header Navigation Block */}
      <header className="relative z-10 py-6 px-4 border-b border-white/10 bg-white/5 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Main Logo & Title Pairings */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Avenger File: MCU Crossover Event</span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-sans font-black tracking-tighter text-white uppercase leading-none mt-1">
              Spider-Man: <span className="text-red-500">Brand New Day</span>
            </h1>
          </div>

          {/* Quick Jump Sidebar Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "Comic Storyboard", target: "comic-panel-1", icon: Layers3 },
              { label: "Character Files", target: "character-bios-section", icon: Compass },
              { label: "Transceiver Comm", target: "bugle-console-section", icon: MessageSquareCode },
              { label: "Ticket Office", target: "ticket-booking-section", icon: Armchair },
            ].map((link, lIdx) => (
              <button
                key={lIdx}
                onClick={() => {
                  const elem = document.getElementById(link.target);
                  if (elem) {
                    elem.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                }}
                className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 rounded-xl font-mono text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <link.icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

        </div>
      </header>

      {/* 4. Immersive Hero / Introduction Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-10 text-center space-y-6">
        
        {/* Dynamic Interactive HUD Monitor */}
        <div className="inline-flex flex-wrap items-center gap-3 bg-white/5 backdrop-blur-xl p-2.5 rounded-full border border-white/10 text-xs font-mono text-zinc-300 shadow-lg">
          <div className="flex items-center space-x-1 px-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-400 font-bold">SMASH METER: {smashCount}</span>
          </div>
          
          <div className="h-4 w-[1px] bg-white/10" />
          
          {/* Gamma slider control */}
          <div className="flex items-center space-x-2 px-3">
            <span>Gamma Radiation:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={gammaIntensity}
              onChange={(e) => setGammaIntensity(Number(e.target.value))}
              className="w-20 accent-emerald-500 h-1 bg-black/30 rounded cursor-pointer"
              title="Drag to change background particle color distribution!"
            />
            <span className="text-emerald-400 font-bold">{gammaIntensity}%</span>
          </div>
        </div>

        {/* Main Title Displays */}
        <div className="space-y-3">
          <h2 className="text-4xl md:text-7xl font-sans font-black tracking-tight uppercase leading-none text-white max-w-4xl mx-auto">
            A New Horizon. <br className="hidden md:inline" />
            <span className="text-gradient bg-gradient-to-r from-red-500 via-emerald-400 to-green-500 bg-clip-text text-transparent">
              An Interconnected Might.
            </span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
            The multiverse has closed, leaving Spider-Man truly isolated on the streets of New York. But when an unstable gamma leakage sparks chaos in Queens, Peter Parker must cross forces with Dr. Bruce Banner. Dive into the official storyboard file below.
          </p>
        </div>

        {/* Warning Callout Box */}
        <div className="max-w-xl mx-auto bg-yellow-500/10 backdrop-blur-xl border border-yellow-500/20 p-3.5 rounded-2xl flex items-center space-x-2.5 text-[11px] font-mono text-yellow-400 text-left shadow-lg">
          <Info className="w-4 h-4 flex-shrink-0 animate-bounce" />
          <span>Note: The canvas displays active parallax. Moving your mouse across the skyline shifts perspective, showing flying particles.</span>
        </div>

      </section>

      {/* 5. Live Countdown Clock */}
      <CountdownTimer />

      {/* 6. Interactive Comic Book Panels Storyboard */}
      <ComicPanels 
        onSelectPanel={(panel) => console.log("Comic Panel Selected:", panel.title)} 
        onGammaAdjust={(val) => setGammaIntensity(val)} 
      />

      {/* 7. Character Bio Database (Peter vs Bruce) */}
      <CharacterBios />

      {/* 8. Avengers Transceiver Link & J. Jonah Jameson Editorial */}
      <DailyBugleConsole />

      {/* 9. Interactive Cinema Reservation Stub */}
      <TicketBooking />

      {/* 10. Cinematic Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 pt-10 text-center space-y-4 max-w-7xl mx-auto px-4">
        <div className="flex justify-center space-x-3 text-zinc-500 font-mono text-[10px] uppercase">
          <span>Marvel Entertainment & Sony Pictures (Fan Hub)</span>
          <span>•</span>
          <span>Privacy Protocol</span>
          <span>•</span>
          <span>Avengers Database Security</span>
        </div>
        
        <p className="text-[10px] font-mono text-zinc-500 max-w-xl mx-auto leading-relaxed">
          This fan hub application is optimized for extreme interactive realism. Interactive elements like the seating map, digital receipt generation, and J. Jonah Jameson rant modules are fully local-state enabled. S.H.I.E.L.D. logs are persistent on the browser cache level.
        </p>

        <div className="text-zinc-600 text-[9px] font-mono font-black tracking-widest">
          DEVELOPED SECURELY IN CLOUD REGION RUNTIME PORT: 3000
        </div>
      </footer>

    </div>
  );
}
