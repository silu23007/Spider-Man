import { useEffect, useRef, useState } from "react";

interface WebSwingingBackgroundProps {
  gammaIntensity: number; // 0 to 100
  onHulkSmashTrigger?: () => void;
}

export default function WebSwingingBackground({ gammaIntensity, onHulkSmashTrigger }: WebSwingingBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle Classes
    class GammaSpark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = height + 50;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = -(Math.random() * 2 + 0.5);
        this.size = Math.random() * 2 + 1;
        this.alpha = Math.random() * 0.5 + 0.3;
        this.maxLife = Math.random() * 200 + 100;
        this.life = 0;
        // Blend red spider webs and green gamma sparks
        const isGamma = Math.random() * 100 < gammaIntensity;
        this.color = isGamma 
          ? `hsla(${Math.random() * 40 + 100}, 90%, 60%, ` 
          : `hsla(${Math.random() * 20 + 350}, 90%, 50%, `;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Attracted slightly to mouse
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
          this.vx += (dx / dist) * 0.04;
          this.vy += (dy / dist) * 0.04;
        }

        this.life++;
        this.alpha = (1 - this.life / this.maxLife) * 0.7;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.globalAlpha = this.alpha;
        c.fillStyle = this.color + `${this.alpha})`;
        c.shadowBlur = 8;
        c.shadowColor = this.color + "1)";
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    class WebLine {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      alpha: number;
      life: number;
      maxLife: number;

      constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.alpha = 0.6;
        this.life = 0;
        this.maxLife = 40;
      }

      update() {
        this.life++;
        this.alpha = (1 - this.life / this.maxLife) * 0.6;
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.strokeStyle = `rgba(255, 255, 255, ${this.alpha})`;
        c.lineWidth = 1.5;
        c.shadowBlur = 4;
        c.shadowColor = "rgba(255,255,255,0.8)";
        c.beginPath();
        c.moveTo(this.x1, this.y1);
        c.lineTo(this.x2, this.y2);
        c.stroke();
        c.restore();
      }
    }

    // Parallax Skyline elements
    interface Building {
      x: number;
      w: number;
      h: number;
      layer: number;
      color: string;
    }

    const buildings: Building[] = [];
    const layers = [
      { speed: 0.1, color: "rgba(10, 11, 22, 0.45)" },
      { speed: 0.25, color: "rgba(15, 17, 34, 0.65)" },
      { speed: 0.4, color: "rgba(22, 24, 46, 0.85)" },
    ];

    // Seed buildings
    for (let layer = 0; layer < 3; layer++) {
      let currentX = -100;
      while (currentX < width + 200) {
        const buildingW = Math.random() * 80 + 50;
        const buildingH = Math.random() * (height * 0.4) + (layer + 1) * 70;
        buildings.push({
          x: currentX,
          w: buildingW,
          h: buildingH,
          layer: layer,
          color: layers[layer].color,
        });
        currentX += buildingW + Math.random() * 15;
      }
    }

    // Hero silhouette animations
    let spidey = {
      active: false,
      swingX: -100,
      swingY: 200,
      anchorX: 0,
      anchorY: 0,
      angle: -Math.PI / 4,
      targetAngle: Math.PI / 4,
      speed: 0.015,
      progress: 0,
      webLines: [] as WebLine[],
    };

    let hulk = {
      active: false,
      x: -200,
      y: height,
      targetX: 0,
      targetY: 0,
      peakY: 100,
      progress: 0,
    };

    const particles: GammaSpark[] = [];
    const webs: WebLine[] = [];

    // Trigger Spider-Man swinging
    const triggerSpideySwing = () => {
      if (spidey.active) return;
      spidey.active = true;
      spidey.progress = 0;
      spidey.swingX = -50;
      spidey.swingY = height * 0.3;
      spidey.anchorX = width * 0.4 + Math.random() * 100;
      spidey.anchorY = -50;
    };

    // Trigger Hulk jump
    const triggerHulkJump = () => {
      if (hulk.active) return;
      hulk.active = true;
      hulk.progress = 0;
      hulk.x = width * 0.1 + Math.random() * (width * 0.3);
      hulk.targetX = hulk.x + width * 0.4;
      hulk.peakY = height * 0.15;
    };

    // Periodically trigger hero events
    const spideyInterval = setInterval(triggerSpideySwing, 12000);
    const hulkInterval = setInterval(triggerHulkJump, 19000);

    // Give an initial trigger
    setTimeout(triggerSpideySwing, 2000);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Main animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Create ambient particles
      if (particles.length < 150) {
        particles.push(new GammaSpark());
      }

      // 1. Draw Background Sky Gradient (Dark Spider Red + Hulk Green ambiance)
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      grad.addColorStop(0, "rgba(22, 10, 24, 1)");
      grad.addColorStop(0.5, "rgba(8, 8, 16, 1)");
      grad.addColorStop(1, "rgba(5, 10, 6, 1)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle web pattern on sky
      ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
      ctx.lineWidth = 0.5;
      const webCenterX = width * 0.5;
      const webCenterY = height * 0.35;
      for (let r = 80; r < Math.max(width, height); r += 80) {
        ctx.beginPath();
        ctx.arc(webCenterX, webCenterY, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        ctx.beginPath();
        ctx.moveTo(webCenterX, webCenterY);
        ctx.lineTo(
          webCenterX + Math.cos(angle) * width,
          webCenterY + Math.sin(angle) * width
        );
        ctx.stroke();
      }

      // 2. Draw Parallax Buildings
      buildings.forEach((building) => {
        const speed = layers[building.layer].speed;
        const offset = (mouseRef.current.x - width / 2) * speed * -0.1;
        ctx.fillStyle = building.color;
        
        // Shadow/glow effects on buildings
        ctx.shadowBlur = building.layer === 2 ? 15 : 0;
        ctx.shadowColor = "rgba(16, 185, 129, 0.08)";
        
        ctx.fillRect(
          building.x + offset,
          height - building.h,
          building.w,
          building.h
        );

        // Draw light grids inside close buildings
        if (building.layer === 2 && building.w > 60) {
          ctx.fillStyle = Math.random() > 0.98 ? "rgba(251, 191, 36, 0.15)" : "rgba(16, 185, 129, 0.1)";
          const cols = Math.floor(building.w / 14);
          const rows = Math.floor(building.h / 24);
          for (let col = 1; col < cols - 1; col++) {
            for (let row = 1; row < rows - 2; row++) {
              if ((col + row) % 3 === 0) {
                ctx.fillRect(
                  building.x + offset + col * 14,
                  height - building.h + row * 24,
                  4,
                  6
                );
              }
            }
          }
        }
      });
      ctx.shadowBlur = 0; // Reset shadow

      // 3. Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.life >= p.maxLife || p.y < -10 || p.x < -10 || p.x > width + 10) {
          particles.splice(i, 1);
        }
      }

      // 4. Update & Draw Web swinging Spidey
      if (spidey.active) {
        spidey.progress += spidey.speed;
        if (spidey.progress >= 1) {
          spidey.active = false;
        } else {
          // Pendulum swing calculation
          const swingAngle =
            spidey.angle + (spidey.targetAngle - spidey.angle) * spidey.progress;
          const ropeLength = height * 0.65;
          spidey.swingX = spidey.anchorX + Math.sin(swingAngle) * ropeLength;
          spidey.swingY = spidey.anchorY + Math.cos(swingAngle) * ropeLength;

          // Draw spider web line
          ctx.save();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 8;
          ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
          ctx.beginPath();
          ctx.moveTo(spidey.anchorX, spidey.anchorY);
          ctx.lineTo(spidey.swingX, spidey.swingY);
          ctx.stroke();
          ctx.restore();

          // Spidey silhouette drawing
          ctx.save();
          ctx.translate(spidey.swingX, spidey.swingY);
          ctx.rotate(-swingAngle); // Tilt Spidey
          ctx.fillStyle = "rgba(12, 12, 22, 0.95)";
          ctx.strokeStyle = "rgba(239, 68, 68, 0.9)"; // Red dynamic outline!
          ctx.lineWidth = 2;

          // Draw Spidey Silhouette shape
          ctx.beginPath();
          // head
          ctx.arc(0, -20, 10, 0, Math.PI * 2);
          // torso
          ctx.moveTo(0, -10);
          ctx.lineTo(0, 10);
          // legs
          ctx.lineTo(-12, 35);
          ctx.moveTo(0, 10);
          ctx.lineTo(12, 35);
          // arms (swinging)
          ctx.moveTo(0, -5);
          ctx.lineTo(-20, -15);
          ctx.moveTo(0, -5);
          ctx.lineTo(15, 10);
          ctx.stroke();
          ctx.fill();

          // Glowing Red Eyes
          ctx.fillStyle = "#ffffff";
          ctx.shadowBlur = 6;
          ctx.shadowColor = "#ef4444";
          ctx.beginPath();
          ctx.ellipse(-3, -21, 2, 4, Math.PI / 6, 0, Math.PI * 2);
          ctx.ellipse(3, -21, 2, 4, -Math.PI / 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      // 5. Update & Draw Jumping Hulk
      if (hulk.active) {
        hulk.progress += 0.012;
        if (hulk.progress >= 1) {
          hulk.active = false;
          // TRIGGER SMASH DAMAGE!
          setShake(true);
          setTimeout(() => setShake(false), 600);
          if (onHulkSmashTrigger) {
            onHulkSmashTrigger();
          }
        } else {
          // Quadratic bezier jump arc
          const t = hulk.progress;
          const u = 1 - t;
          hulk.x = u * hulk.x + t * hulk.targetX;
          hulk.y = u * u * height + 2 * u * t * hulk.peakY + t * t * height;

          // Draw Hulk silhouette
          ctx.save();
          ctx.translate(hulk.x, hulk.y);
          ctx.fillStyle = "rgba(6, 12, 8, 0.98)";
          ctx.strokeStyle = "rgba(16, 185, 129, 0.9)"; // Gamma outline
          ctx.lineWidth = 3.5;
          ctx.shadowBlur = 20;
          ctx.shadowColor = "rgba(16, 185, 129, 0.5)";

          ctx.beginPath();
          // Head
          ctx.arc(0, -55, 18, 0, Math.PI * 2);
          // Giant shoulders
          ctx.moveTo(-35, -35);
          ctx.bezierCurveTo(-35, -50, 35, -50, 35, -35);
          // Arms / fists raised
          ctx.lineTo(45, -75);
          ctx.arc(45, -75, 10, 0, Math.PI * 2);
          ctx.moveTo(-35, -35);
          ctx.lineTo(-45, -75);
          ctx.arc(-45, -75, 10, 0, Math.PI * 2);
          // Huge torso
          ctx.moveTo(-35, -35);
          ctx.lineTo(-20, 10);
          ctx.lineTo(20, 10);
          ctx.lineTo(35, -35);
          // Legs crouched
          ctx.lineTo(25, 30);
          ctx.lineTo(5, 15);
          ctx.lineTo(-5, 15);
          ctx.lineTo(-25, 30);
          ctx.closePath();
          ctx.stroke();
          ctx.fill();

          // Green Glowing Eyes
          ctx.fillStyle = "#34d399";
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#10b981";
          ctx.beginPath();
          ctx.arc(-6, -57, 3, 0, Math.PI * 2);
          ctx.arc(6, -57, 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(spideyInterval);
      clearInterval(hulkInterval);
      window.removeEventListener("resize", handleResize);
    };
  }, [gammaIntensity, onHulkSmashTrigger]);

  return (
    <>
      <canvas
        id="swinging-canvas"
        ref={canvasRef}
        className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 transition-transform duration-75 ${
          shake ? "animate-bounce scale-102 border-4 border-emerald-500/20" : ""
        }`}
      />
      {/* Background dark vignetting overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)] z-1" />
    </>
  );
}
