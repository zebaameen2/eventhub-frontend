
import React, { useEffect, useState } from "react";

const MOVE_INTERVAL_MS = 30;
const RISE_SPEED_PX = 1.2; // smooth bubble speed
const MIN_X_MARGIN = 60;
const MIN_DISTANCE_BETWEEN = 130;
const BUBBLE_SIZE = 34;
const MAX_ACTIVE_BUBBLES = 5;

function BubbleHeader({ onLogin, onSignup }) {
  const [bubbles, setBubbles] = useState([]);

  // random x but spaced
  const getSpacedX = (width, existing) => {
    for (let i = 0; i < 30; i++) {
      const x =
        MIN_X_MARGIN + Math.random() * (width - MIN_X_MARGIN * 2 - BUBBLE_SIZE);

      const clash = existing.some(
        (b) => Math.abs(b.x - x) < MIN_DISTANCE_BETWEEN,
      );
      if (!clash) return x;
    }
    return MIN_X_MARGIN;
  };

  // spawn bubble ONLY from bottom
  const spawnBubble = (existing = []) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      id: crypto.randomUUID(),
      type: Math.random() > 0.5 ? "L" : "S",
      x: getSpacedX(width, existing),
      y: height + BUBBLE_SIZE + Math.random() * 80,
      startY: height + BUBBLE_SIZE,
      paused: false,
      expanded: false,
      opacity: 1,
      blur: 0,
    };
  };

  // initial bubbles
  useEffect(() => {
    const init = [];
    for (let i = 0; i < MAX_ACTIVE_BUBBLES; i++) {
      init.push(spawnBubble(init));
    }
    setBubbles(init);
  }, []);

  // movement loop
  useEffect(() => {
    const timer = setInterval(() => {
      const height = window.innerHeight;

      setBubbles((prev) => {
        let updated = prev.map((b) => {
          if (b.paused) return b;

          const y = b.y - RISE_SPEED_PX;
          const travelled = b.startY - y;
          const total = b.startY + BUBBLE_SIZE;
          const progress = travelled / total;

          let opacity = 1;
          let blur = 0;

          // last 20% → fade + blur
          if (progress > 0.8) {
            const t = (progress - 0.8) / 0.2;
            opacity = Math.max(0, 1 - t);
            blur = t * 6;
          }

          return { ...b, y, opacity, blur };
        });

        // remove fully gone
        updated = updated.filter((b) => b.y > -BUBBLE_SIZE * 2);

        // keep count
        while (updated.length < MAX_ACTIVE_BUBBLES) {
          updated.push(spawnBubble(updated));
        }

        return updated;
      });
    }, MOVE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {bubbles.map((b) => {
        const isLogin = b.type === "L";

        return (
          <div
            key={b.id}
            onMouseEnter={() =>
              setBubbles((prev) =>
                prev.map((x) =>
                  x.id === b.id ? { ...x, paused: true, expanded: true } : x,
                ),
              )
            }
            onMouseLeave={() =>
              setBubbles((prev) =>
                prev.map((x) =>
                  x.id === b.id ? { ...x, paused: false, expanded: false } : x,
                ),
              )
            }
            onClick={() => (isLogin ? onLogin?.() : onSignup?.())}
            className={`absolute flex items-center justify-center font-semibold text-white shadow-xl
              ${
                isLogin
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                  : "bg-gradient-to-r from-pink-500 to-fuchsia-600"
              }
            `}
            style={{
              left: b.x,
              top: b.y,
              width: b.expanded ? "auto" : BUBBLE_SIZE,
              height: b.expanded ? "auto" : BUBBLE_SIZE,
              padding: b.expanded ? "8px 16px" : 0,
              borderRadius: "9999px",
              transform: b.expanded ? "scale(1.15)" : "scale(1)",
              opacity: b.opacity,
              filter: `blur(${b.blur}px)`,
              pointerEvents: "auto",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "transform 0.25s ease",
            }}
          >
            {b.expanded ? (isLogin ? "Login" : "Signup") : b.type}
          </div>
        );
      })}
    </div>
  );
}

export default BubbleHeader;