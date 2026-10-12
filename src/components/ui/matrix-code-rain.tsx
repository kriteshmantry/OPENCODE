import React, { useRef, useEffect, useCallback } from "react";

interface Character {
  char: string;
  opacity: number;
}

interface Strand {
  x: number;
  y: number;
  speed: number;
  length: number;
  characters: Character[];
  showCursor: boolean;
  layer: number;
  scale: number;
}

export interface MatrixCodeRainProps {
  fontSize?: number;
  speed?: number;
  density?: number;
  textColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const MatrixCodeRain = ({
  fontSize = 15,
  speed = 0.6,
  density = 1.2,
  textColor = "#00FF41",
  className = "",
  style,
}: MatrixCodeRainProps = {}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const strands = useRef<Strand[]>([]);
  const lastTime = useRef<number>(0);
  const cursorBlinkTime = useRef<number>(0);

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,./<>?ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈ";

  const getRandomChar = useCallback(() => {
    return characters.charAt(Math.floor(Math.random() * characters.length));
  }, [characters]);

  const createStrand = useCallback(
    (x: number, canvasHeight: number, initialRandomY = false) => {
      const layer = Math.floor(Math.random() * 3);
      const scale = layer === 0 ? 0.85 : layer === 1 ? 1 : 1.15;
      const length = Math.floor(Math.random() * 18) + 12;

      const chars: Character[] = Array(length)
        .fill(null)
        .map(() => ({
          char: getRandomChar(),
          opacity: 1,
        }));

      const strandHeight = length * (fontSize * scale);
      const startY = initialRandomY
        ? Math.random() * canvasHeight - strandHeight
        : -strandHeight;

      return {
        x,
        y: startY,
        speed:
          (Math.random() * 0.4 + 0.8) *
          speed *
          fontSize *
          (layer === 2 ? 1.3 : layer === 1 ? 1 : 0.85),
        length,
        characters: chars,
        showCursor: true,
        layer,
        scale,
      };
    },
    [fontSize, getRandomChar, speed],
  );

  const initStrands = useCallback(
    (width: number, height: number) => {
      const spacing = fontSize * 1.6;
      const totalColumns = Math.floor(width / spacing);
      strands.current = [];

      for (let i = 0; i < totalColumns; i++) {
        if (Math.random() < 0.75 * density) {
          const x = i * spacing;
          strands.current.push(createStrand(x, height, true));
        }
      }
    },
    [createStrand, density, fontSize]
  );

  const updateStrands = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      deltaTime: number,
    ) => {
      const spacing = fontSize * 1.6;
      const maxStrands = Math.floor(width / spacing) * density;

      // Spawn new strands at top if under cap
      if (strands.current.length < maxStrands) {
        const availableSlots = Array.from({
          length: Math.floor(width / spacing),
        })
          .map((_, i) => i * spacing)
          .filter((x) => !strands.current.some((strand) => Math.abs(strand.x - x) < spacing * 0.8));

        if (availableSlots.length > 0 && Math.random() < 0.3 * density) {
          const x =
            availableSlots[Math.floor(Math.random() * availableSlots.length)];
          strands.current.push(createStrand(x, height, false));
        }
      }

      cursorBlinkTime.current += deltaTime;
      if (cursorBlinkTime.current >= 400) {
        strands.current.forEach((strand) => {
          strand.showCursor = !strand.showCursor;
        });
        cursorBlinkTime.current = 0;
      }

      ctx.clearRect(0, 0, width, height);

      strands.current.sort((a, b) => a.layer - b.layer);

      strands.current = strands.current.filter((strand) => {
        // Delta-based movement
        strand.y += strand.speed * (deltaTime / 16.6) * 1.8;

        const baseOpacity =
          strand.layer === 0 ? 0.4 : strand.layer === 1 ? 0.75 : 0.95;
        const blur = strand.layer === 0 ? 1 : strand.layer === 1 ? 3 : 5;

        const scaledFontSize = fontSize * strand.scale;
        ctx.font = `bold ${scaledFontSize}px monospace`;
        ctx.shadowBlur = blur;
        ctx.shadowColor = textColor;

        strand.characters.forEach((char, i) => {
          const y = strand.y + i * scaledFontSize;

          if (y > -scaledFontSize && y < height + scaledFontSize) {
            // Head of the strand glows brighter/white
            if (i === strand.characters.length - 1) {
              ctx.fillStyle = "#E0FFE5";
              ctx.globalAlpha = 1;
              ctx.fillText(char.char, strand.x, y);

              if (strand.showCursor) {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(strand.x, y + 2, scaledFontSize * 0.85, 2);
              }
            } else {
              // Fade towards the tail
              const tailFactor = (i / strand.characters.length);
              ctx.fillStyle = textColor;
              ctx.globalAlpha = baseOpacity * Math.max(0.2, tailFactor);
              ctx.fillText(char.char, strand.x, y);
            }
          }
        });

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Occasional character flicker
        if (Math.random() < 0.04) {
          const randomIndex = Math.floor(
            Math.random() * strand.characters.length,
          );
          strand.characters[randomIndex].char = getRandomChar();
        }

        return strand.y - strand.length * (fontSize * strand.scale) < height + 50;
      });
    },
    [createStrand, density, fontSize, getRandomChar, textColor]
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 800;

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      if (strands.current.length === 0) {
        initStrands(w, h);
      }
    }
  }, [initStrands]);

  const animate = useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const deltaTime = Math.min(time - lastTime.current, 100);
      lastTime.current = time;

      resizeCanvas();
      updateStrands(ctx, canvas.width, canvas.height, deltaTime);

      animationFrameId.current = requestAnimationFrame(animate);
    },
    [resizeCanvas, updateStrands]
  );

  useEffect(() => {
    resizeCanvas();
    const canvas = canvasRef.current;
    if (canvas) {
      initStrands(canvas.width, canvas.height);
    }

    lastTime.current = performance.now();
    cursorBlinkTime.current = 0;
    animationFrameId.current = requestAnimationFrame(animate);

    window.addEventListener("resize", resizeCanvas);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [animate, initStrands, resizeCanvas]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} style={style}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
    </div>
  );
};

export { MatrixCodeRain as Component };
export default MatrixCodeRain;
