import { useEffect, useState } from "react";
import { Clock, AlertTriangle, Sparkles } from "lucide-react";

export default function CountdownTimer() {
  // Target release date: July 24, 2026 (00:00:00 Local/EST)
  const targetDate = new Date("2026-07-24T00:00:00-04:00").getTime();
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    ms: 0,
    isReleased: false,
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, ms: 0, isReleased: true });
        clearInterval(timerInterval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const ms = Math.floor((difference % 1000) / 10); // 2 digit milliseconds

      setTimeLeft({ days, hours, minutes, seconds, ms, isReleased: false });
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 33); // Run frequently for millisecond updates

    return () => clearInterval(timerInterval);
  }, [targetDate]);

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto z-10 relative">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        {/* Neon line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500/80 via-yellow-500/80 to-emerald-500/80" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Header Description */}
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-xs font-mono text-yellow-400 uppercase tracking-widest">
              <Clock className="w-4 h-4 animate-spin text-red-500" />
              <span>SPIDER-MAN 4 & HULK: OFFICIAL RELEASE COUNTDOWN</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-sans font-black tracking-tighter text-white uppercase leading-none">
              July 24, 2026
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              The Brand New Day Begins. Secure tickets early using the booking module.
            </p>
          </div>

          {/* Countdown Clock (Days, Hours, Minutes, Seconds, MS) */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {[
              { label: "DAYS", val: timeLeft.days, color: "text-red-500" },
              { label: "HRS", val: timeLeft.hours, color: "text-white" },
              { label: "MINS", val: timeLeft.minutes, color: "text-white" },
              { label: "SECS", val: timeLeft.seconds, color: "text-white" },
            ].map((unit, uIdx) => (
              <div key={uIdx} className="flex flex-col items-center">
                <div className="bg-black/30 border border-white/10 rounded-2xl px-3 py-4 md:px-5 md:py-6 w-16 md:w-24 text-center shadow-inner relative overflow-hidden backdrop-blur-md">
                  {/* Digital glow lines */}
                  <div className="absolute inset-x-0 top-0 h-0.5 bg-red-500/10" />
                  <span className={`text-2xl md:text-4xl font-mono font-bold ${unit.color}`}>
                    {String(unit.val).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 font-bold mt-1.5 tracking-wider uppercase">
                  {unit.label}
                </span>
              </div>
            ))}

            {/* Splitter */}
            <span className="text-xl font-mono text-zinc-600 self-center pb-5">:</span>

            {/* Milliseconds unit */}
            <div className="flex flex-col items-center">
              <div className="bg-black/30 border border-white/10 rounded-2xl px-2.5 py-3 md:px-4 md:py-5 w-12 md:w-16 text-center shadow-inner backdrop-blur-md">
                <span className="text-lg md:text-2xl font-mono font-bold text-emerald-400 animate-pulse">
                  {String(timeLeft.ms).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[9px] font-mono text-emerald-500 font-bold mt-2 tracking-wider">
                MS
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic status ticker below countdown */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
            <span>CRITICAL: High localized kinetic signatures detected in Queens district.</span>
          </div>
          <div className="flex items-center space-x-1 text-emerald-400">
            <Sparkles className="w-3.5 h-3.5 animate-bounce" />
            <span>S.H.I.E.L.D. Secure Terminal Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
