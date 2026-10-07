"use client";

import React, { useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ════════════════════════════════════════════════════════════════════
   ClezoBot — a cute humanoid cleaning robot, pure SVG + framer-motion.

   <ClezoBot activity="mopping" size={300} />

   activity: "window-washer" | "mopping" | "spritzer" |
             "vacuuming"     | "inspector" | "napping"

   How it works: every limb is its own <motion.g>. Arms are 2-bone rigs
   (shoulder + elbow) solved with inverse kinematics, so the hands always
   stay glued to the tool they hold. Each activity is sampled into smooth
   looping keyframes once, then played by framer-motion.
   ════════════════════════════════════════════════════════════════════ */

const BLUE = "#00aee6";
const NAVY = "#001b2e";
const WHITE = "#f8fafc";
const SW = 3; // outline weight

export const CLEZO_BOT_ACTIVITIES = [
  "window-washer",
  "mopping",
  "spritzer",
  "vacuuming",
  "inspector",
  "napping",
];

/* ───────────────────────── kinematics ───────────────────────── */

const N = 48; // samples per loop
const TAU = Math.PI * 2;
const RAD = Math.PI / 180;
const A1 = 30; // upper arm length
const A2 = 28; // forearm length
const SH = { L: [-34, -44], R: [34, -44] }; // shoulders (torso space, origin = hips)

const sin = (u, k = 1) => Math.sin(TAU * k * u);
const cos = (u, k = 1) => Math.cos(TAU * k * u);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const rotate2 = (p, deg) => {
  const c = Math.cos(deg * RAD);
  const s = Math.sin(deg * RAD);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c];
};
// point on a tool (tool space) -> robot root space
const place = (t, p) => {
  const r = rotate2(p, t.rot || 0);
  return [t.x + r[0], t.y + r[1]];
};
// root space -> torso space (inverse of translate(x,y) rotate(rot))
const toLocal = (w, t) => rotate2([w[0] - t.x, w[1] - t.y], -(t.rot || 0));

// 2-bone IK. 0 deg = arm hanging straight down, positive = clockwise.
function ik(side, target) {
  const S = SH[side];
  const dx = target[0] - S[0];
  const dy = target[1] - S[1];
  const d = Math.max(Math.hypot(dx, dy), 0.001);
  const dc = clamp(d, 2, A1 + A2 - 0.5);
  const phi = Math.atan2(dy, dx);
  const alpha = Math.acos(clamp((A1 * A1 + dc * dc - A2 * A2) / (2 * A1 * dc), -1, 1));
  const th1 = phi + (side === "R" ? -alpha : alpha); // elbows bend outward
  const E = [S[0] + A1 * Math.cos(th1), S[1] + A1 * Math.sin(th1)];
  const H = [S[0] + (dx / d) * dc, S[1] + (dy / d) * dc];
  const th2 = Math.atan2(H[1] - E[1], H[0] - E[0]);
  let elbow = (th2 - th1) / RAD;
  while (elbow > 180) elbow -= 360;
  while (elbow < -180) elbow += 360;
  return { s: th1 / RAD - 90, e: elbow };
}

function unwrap(arr) {
  for (let i = 1; i < arr.length; i++) {
    while (arr[i] - arr[i - 1] > 180) arr[i] -= 360;
    while (arr[i] - arr[i - 1] < -180) arr[i] += 360;
  }
  return arr;
}

/* One definition per activity. at(u) describes the whole body for u in [0,1). */
const DEFS = {
  "window-washer": {
    dur: 3.2,
    mood: "happy",
    look: [3, -3],
    at(u) {
      const s = sin(u);
      const c = cos(u);
      const tool = { x: 64, y: -57 + 27 * s, rot: 3 * c };
      const aux = { x: -66, y: -50 - 16 * s, rot: 14 * c };
      return {
        torso: { x: 2, y: 1.2 * sin(u, 2), rot: 3 + 1.5 * s },
        head: { rot: 5 + 3 * s },
        legL: { r: 2 * s },
        legR: { r: -2 * s },
        tool,
        aux,
        handR: place(tool, [0, 0]),
        handL: place(aux, [0, 0]),
      };
    },
  },
  mopping: {
    dur: 2.6,
    mood: "focus",
    look: [0, 3],
    at(u) {
      const s = sin(u);
      const tool = { x: -32 * s, y: 26, rot: 22 * s };
      return {
        torso: { x: 0, y: -1.4 * cos(u, 2), rot: -3.5 * s },
        head: { rot: -5 * s },
        legL: { r: 8 * sin(u, 2) },
        legR: { r: -8 * sin(u, 2) },
        tool,
        handL: place(tool, [0, -50]),
        handR: place(tool, [0, -66]),
      };
    },
  },
  spritzer: {
    dur: 1.6,
    mood: "cheer",
    look: [3, -1],
    at(u) {
      const p = Math.pow(Math.max(0, sin(u, 2)), 2); // two squeezes per loop
      const tool = { x: 66 - 4 * p, y: -52 + 1.5 * p, rot: -10 + 3 * p };
      return {
        torso: { x: 0, y: 1 * sin(u, 2), rot: 3 - 2 * p },
        head: { rot: 5 + 2 * p },
        legL: { r: 3 },
        legR: { r: -3 },
        tool,
        trig: -30 * p,
        handR: place(tool, [0, 4]),
        handL: [-31 + 1.2 * sin(u), -13],
      };
    },
  },
  vacuuming: {
    dur: 2.8,
    mood: "focus",
    look: [0, 2],
    at(u) {
      const s = sin(u);
      const tool = { x: -30 * s, y: 26, rot: 14 * s };
      return {
        torso: { x: 0, y: -1.4 * cos(u, 2), rot: -3 * s },
        head: { rot: -4 * s },
        legL: { r: 7 * sin(u, 2) },
        legR: { r: -7 * sin(u, 2) },
        tool,
        handL: place(tool, [-8, -72]),
        handR: place(tool, [8, -72]),
      };
    },
  },
  inspector: {
    dur: 3.6,
    mood: "curious",
    look: [4, 3],
    at(u) {
      const s = sin(u);
      const tool = { x: 64 + 12 * s, y: -14 + 2 * sin(u, 2), rot: 6 * s };
      return {
        torso: { x: 6, y: 4 + 1.2 * cos(u, 2), rot: 16 + 1.5 * s },
        head: { rot: 6 + 3 * s },
        legL: { r: 4 },
        legR: { r: -8 + 2 * s },
        tool,
        handR: place(tool, [0, 0]),
        handL: [-28, -4],
      };
    },
  },
  napping: {
    dur: 4.2,
    mood: "sleep",
    look: [0, 0],
    at(u) {
      const s = sin(u);
      return {
        torso: { x: 0, y: 24 + 1.2 * s, rot: 0 },
        head: { rot: 6 + 6 * s },
        legL: { r: 26, sy: 0.4, y: 24 },
        legR: { r: -26, sy: 0.4, y: 24 },
        handL: [-14, -8 + 1.2 * s],
        handR: [14, -8 + 1.2 * s],
      };
    },
  },
};

const clipCache = {};
function buildClip(name) {
  if (clipCache[name]) return clipCache[name];
  const def = DEFS[name];
  const mk = (...keys) => Object.fromEntries(keys.map((k) => [k, []]));
  const rows = {
    torso: mk("x", "y", "rotate"),
    head: mk("rotate"),
    legL: mk("rotate", "scaleY", "y"),
    legR: mk("rotate", "scaleY", "y"),
    armL: mk("s", "e"),
    armR: mk("s", "e"),
    tool: mk("x", "y", "rotate"),
    aux: mk("x", "y", "rotate"),
    trig: [],
  };
  let hasTool = false;
  let hasAux = false;
  for (let i = 0; i <= N; i++) {
    const f = def.at(i / N);
    const T = { x: 0, y: 0, rot: 0, ...f.torso };
    rows.torso.x.push(T.x);
    rows.torso.y.push(T.y);
    rows.torso.rotate.push(T.rot);
    rows.head.rotate.push(f.head.rot);
    for (const k of ["legL", "legR"]) {
      const l = f[k];
      rows[k].rotate.push(l.r);
      rows[k].scaleY.push(l.sy ?? 1);
      rows[k].y.push(l.y ?? 0);
    }
    if (f.tool) {
      hasTool = true;
      rows.tool.x.push(f.tool.x);
      rows.tool.y.push(f.tool.y);
      rows.tool.rotate.push(f.tool.rot);
    }
    if (f.aux) {
      hasAux = true;
      rows.aux.x.push(f.aux.x);
      rows.aux.y.push(f.aux.y);
      rows.aux.rotate.push(f.aux.rot);
    }
    rows.trig.push(f.trig ?? 0);
    const a = ik("L", toLocal(f.handL, T));
    const b = ik("R", toLocal(f.handR, T));
    rows.armL.s.push(a.s);
    rows.armL.e.push(a.e);
    rows.armR.s.push(b.s);
    rows.armR.e.push(b.e);
  }
  unwrap(rows.armL.s);
  unwrap(rows.armL.e);
  unwrap(rows.armR.s);
  unwrap(rows.armR.e);
  const clip = { dur: def.dur, mood: def.mood, look: def.look, rows, hasTool, hasAux };
  clipCache[name] = clip;
  return clip;
}

/* Turn keyframe rows into framer-motion props. Constant rows become plain
   initial values, moving rows become looping keyframe animations. */
function track(values, rm, dur) {
  const initial = {};
  const animate = {};
  for (const k in values) {
    const arr = values[k];
    initial[k] = arr[0];
    if (!rm && Math.max(...arr) - Math.min(...arr) > 1e-3) animate[k] = arr;
  }
  return {
    initial,
    animate,
    transition: { type: "tween", duration: dur, ease: "linear", repeat: Infinity },
  };
}

/* ───────────────────────── building blocks ───────────────────────── */

// Invisible square that pins a group's bounding-box centre to its joint,
// so framer-motion rotates/scales around exactly that point.
function Pivot({ r }) {
  return <rect x={-r} y={-r} width={r * 2} height={r * 2} fill="none" pointerEvents="none" />;
}

// A joint at (x,y). Children are drawn in the parent's coordinates.
function Joint({ x, y, r = 100, tr, children }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g initial={tr?.initial} animate={tr?.animate} transition={tr?.transition}>
        <Pivot r={r} />
        <g transform={`translate(${-x} ${-y})`}>{children}</g>
      </motion.g>
    </g>
  );
}

function ToolRig({ tr, children }) {
  return (
    <motion.g initial={tr.initial} animate={tr.animate} transition={tr.transition}>
      <Pivot r={170} />
      {children}
    </motion.g>
  );
}

function Sparkle({ x, y, s = 1, delay = 0, rm }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <motion.path
        d="M0 -7 L1.8 -1.8 L7 0 L1.8 1.8 L0 7 L-1.8 1.8 L-7 0 L-1.8 -1.8 Z"
        fill={WHITE}
        stroke={BLUE}
        strokeWidth={1.5}
        strokeLinejoin="round"
        initial={{ scale: 0.8, opacity: 1 }}
        animate={rm ? undefined : { scale: [0, 1, 0], rotate: [0, 90], opacity: [0, 1, 0] }}
        transition={{ type: "tween", duration: 1.8, delay, repeat: Infinity, ease: "easeInOut" }}
      />
    </g>
  );
}

/* ───────────────────────── the robot ───────────────────────── */

function Eye({ cx, h = 17, w = 12, big = false, blink, blinkT }) {
  const y = -120;
  return (
    <motion.g animate={blink} transition={blinkT}>
      <rect x={cx - w / 2} y={y - h / 2} width={w} height={h} rx={w / 2} fill={BLUE} />
      <circle cx={cx - 1.6} cy={y - h / 2 + 5} r={big ? 3.2 : 2.4} fill={WHITE} />
      {big && <circle cx={cx + 2} cy={y + h / 2 - 4} r={1.4} fill={WHITE} />}
    </motion.g>
  );
}

function Face({ mood, look, rm }) {
  const blink = rm ? undefined : { scaleY: [1, 1, 0.08, 1, 1] };
  const blinkT = { type: "tween", duration: 4.2, times: [0, 0.88, 0.92, 0.96, 1], repeat: Infinity, ease: "easeInOut" };
  const line = { stroke: BLUE, strokeWidth: 3.5, strokeLinecap: "round", fill: "none" };
  const sleep = mood === "sleep";
  const h = mood === "focus" ? 13 : mood === "curious" ? 20 : 17;

  return (
    <g>
      {/* screen */}
      <rect x={-46} y={-146} width={92} height={62} rx={30} fill={NAVY} />
      <rect x={-43.5} y={-143.5} width={87} height={57} rx={28} fill="none" stroke={BLUE} strokeOpacity={0.35} strokeWidth={1.5} />

      {/* cheeks */}
      {mood !== "focus" && (
        <>
          <ellipse cx={-31} cy={-102} rx={6} ry={3.4} fill={BLUE} fillOpacity={0.35} />
          <ellipse cx={31} cy={-102} rx={6} ry={3.4} fill={BLUE} fillOpacity={0.35} />
        </>
      )}

      {/* eyes */}
      {sleep ? (
        <>
          <path d="M-24 -117 Q-17 -127 -10 -117" {...line} />
          <path d="M10 -117 Q17 -127 24 -117" {...line} />
        </>
      ) : (
        <g transform={`translate(${look[0]} ${look[1]})`}>
          <Eye cx={-17} h={h} big={mood === "cheer"} blink={blink} blinkT={blinkT} />
          <Eye cx={17} h={h} big={mood === "cheer"} blink={blink} blinkT={blinkT} />
        </g>
      )}

      {/* brows */}
      {mood === "focus" && (
        <>
          <path d="M-26 -136 L-10 -130" {...line} strokeWidth={3} />
          <path d="M26 -136 L10 -130" {...line} strokeWidth={3} />
        </>
      )}
      {mood === "curious" && (
        <>
          <path d="M-26 -134 L-10 -138" {...line} strokeWidth={3} />
          <path d="M10 -133 L26 -131" {...line} strokeWidth={3} />
        </>
      )}

      {/* mouth */}
      {mood === "happy" && <path d="M-8 -103 Q0 -95 8 -103" {...line} />}
      {mood === "focus" && <path d="M-6 -102 Q0 -98 6 -102" {...line} />}
      {mood === "cheer" && <path d="M-9 -105 Q0 -86 9 -105 Z" fill={BLUE} />}
      {mood === "curious" && <circle cx={0} cy={-100} r={3.2} {...line} strokeWidth={3} />}
      {sleep && (
        <>
          <path d="M-5 -102 Q0 -98 5 -102" {...line} />
          <motion.circle
            cx={11}
            cy={-99}
            r={5}
            fill={WHITE}
            fillOpacity={0.2}
            stroke={WHITE}
            strokeOpacity={0.9}
            strokeWidth={1.4}
            initial={{ scale: 0.7 }}
            animate={rm ? undefined : { scale: [0.6, 1.5, 0.6] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
    </g>
  );
}

function Head({ mood, look, rm, headTr }) {
  const sleep = mood === "sleep";
  const antenna = {
    initial: { rotate: sleep ? -2 : -7 },
    animate: rm ? undefined : { rotate: sleep ? [-2, 2] : [-7, 7] },
    transition: { duration: sleep ? 3 : 1.3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
  };
  return (
    <Joint x={0} y={-66} r={140} tr={headTr}>
      {/* neck */}
      <rect x={-10} y={-70} width={20} height={14} rx={4} fill={NAVY} />
      {/* antenna */}
      <Joint x={0} y={-158} r={40} tr={antenna}>
        <rect x={-1.8} y={-178} width={3.6} height={22} rx={1.8} fill={NAVY} />
        <circle cx={0} cy={-181} r={6} fill={BLUE} stroke={NAVY} strokeWidth={SW} opacity={sleep ? 0.45 : 1} />
        <circle cx={-1.8} cy={-183} r={1.8} fill={WHITE} />
      </Joint>
      {/* ear pods */}
      {[-1, 1].map((k) => (
        <g key={k}>
          <circle cx={61 * k} cy={-112} r={11} fill={BLUE} stroke={NAVY} strokeWidth={SW} />
          <circle cx={61 * k} cy={-112} r={4.5} fill={WHITE} />
        </g>
      ))}
      {/* shell */}
      <rect x={-56} y={-158} width={112} height={92} rx={42} fill={WHITE} stroke={NAVY} strokeWidth={3.5} />
      <path
        d="M-54 -100 C-54 -72 -30 -67 0 -67 C30 -67 54 -72 54 -100 C40 -78 -40 -78 -54 -100 Z"
        fill={BLUE}
        fillOpacity={0.12}
      />
      <path d="M-40 -150 Q-28 -156 -14 -154" stroke={BLUE} strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" fill="none" />
      <Face mood={mood} look={look} rm={rm} />
    </Joint>
  );
}

function Body({ rm }) {
  return (
    <g>
      <rect x={-34} y={-60} width={68} height={62} rx={28} fill={WHITE} stroke={NAVY} strokeWidth={3.5} />
      <path
        d="M-32 -22 C-30 -4 -14 2 0 2 C14 2 30 -4 32 -22 C22 -10 -22 -10 -32 -22 Z"
        fill={BLUE}
        fillOpacity={0.12}
      />
      {/* chest badge */}
      <motion.circle
        cx={0}
        cy={-30}
        r={12}
        fill="none"
        stroke={BLUE}
        strokeWidth={2}
        initial={{ scale: 1, opacity: 0.6 }}
        animate={rm ? undefined : { scale: [1, 1.6], opacity: [0.7, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />
      <circle cx={0} cy={-30} r={12} fill={NAVY} />
      <circle cx={0} cy={-30} r={8.5} fill={BLUE} />
      <path d="M0 -37 C4 -31 6 -29 6 -26 A6 6 0 0 1 -6 -26 C-6 -29 -4 -31 0 -37 Z" fill={WHITE} />
      {/* rivets */}
      <circle cx={-24} cy={-14} r={2} fill={NAVY} />
      <circle cx={24} cy={-14} r={2} fill={NAVY} />
    </g>
  );
}

function Leg({ side, tr }) {
  const k = side === "L" ? -1 : 1;
  const hx = 15 * k;
  return (
    <Joint x={hx} y={0} r={70} tr={tr}>
      <rect x={hx - 6.5} y={-4} width={13} height={30} rx={6.5} fill={WHITE} stroke={NAVY} strokeWidth={SW} />
      <rect x={k < 0 ? hx - 15 : hx - 9} y={21} width={24} height={13} rx={6.5} fill={BLUE} stroke={NAVY} strokeWidth={SW} />
      <rect x={k < 0 ? hx - 11 : hx + 3} y={24} width={7} height={3} rx={1.5} fill={WHITE} fillOpacity={0.85} />
    </Joint>
  );
}

function Arm({ side, s, e }) {
  const [sx, sy] = SH[side];
  return (
    <Joint x={sx} y={sy} r={115} tr={s}>
      <rect x={sx - 6.5} y={sy - 6} width={13} height={A1 + 10} rx={6.5} fill={WHITE} stroke={NAVY} strokeWidth={SW} />
      <Joint x={sx} y={sy + A1} r={115} tr={e}>
        <rect x={sx - 5.5} y={sy + A1 - 5} width={11} height={A2 + 9} rx={5.5} fill={WHITE} stroke={NAVY} strokeWidth={SW} />
        <circle cx={sx} cy={sy + A1} r={6} fill={NAVY} />
        <circle cx={sx} cy={sy + A1 + A2} r={8.5} fill={BLUE} stroke={NAVY} strokeWidth={SW} />
        <circle cx={sx - 2.6} cy={sy + A1 + A2 - 3} r={2} fill={WHITE} />
      </Joint>
      <circle cx={sx} cy={sy} r={8} fill={BLUE} stroke={NAVY} strokeWidth={SW} />
    </Joint>
  );
}

/* ───────────────────────── tools ───────────────────────── */

function Squeegee() {
  return (
    <g>
      <rect x={-3.5} y={-12} width={7} height={40} rx={3.5} fill={NAVY} />
      <rect x={-5.5} y={-3} width={11} height={20} rx={5.5} fill={BLUE} stroke={NAVY} strokeWidth={SW} />
      <rect x={-27} y={-24} width={54} height={11} rx={5.5} fill={WHITE} stroke={NAVY} strokeWidth={SW} />
      <rect x={-27} y={-16} width={54} height={4} rx={2} fill={BLUE} />
    </g>
  );
}

function Rag() {
  return (
    <g>
      <rect x={-11} y={-8} width={22} height={16} rx={4} fill={WHITE} stroke={NAVY} strokeWidth={2.5} />
      <rect x={-9} y={1} width={18} height={4} rx={2} fill={BLUE} fillOpacity={0.6} />
    </g>
  );
}

function Bubble({ x, delay, rm }) {
  return (
    <motion.circle
      cx={x}
      cy={-8}
      r={3}
      fill={WHITE}
      fillOpacity={0.7}
      stroke={BLUE}
      strokeWidth={1.2}
      initial={{ opacity: 0 }}
      animate={rm ? undefined : { y: [0, -18], opacity: [0, 0.95, 0], scale: [0.6, 1.3] }}
      transition={{ type: "tween", duration: 1.6, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

function Mop({ rm }) {
  const strands = Array.from({ length: 9 }, (_, i) => -22 + i * 5.5);
  return (
    <g>
      <rect x={-3} y={-82} width={6} height={80} rx={3} fill={NAVY} />
      <rect x={-5} y={-74} width={10} height={30} rx={5} fill={BLUE} stroke={NAVY} strokeWidth={2.5} />
      <rect x={-8} y={-16} width={16} height={12} rx={4} fill={BLUE} stroke={NAVY} strokeWidth={SW} />
      {strands.map((x, i) => (
        <rect key={x} x={x - 2.2} y={0} width={4.4} height={8} rx={2.2} fill={i % 2 ? BLUE : WHITE} stroke={NAVY} strokeWidth={2} />
      ))}
      <rect x={-27} y={-9} width={54} height={11} rx={5.5} fill={WHITE} stroke={NAVY} strokeWidth={SW} />
      <Bubble x={-20} delay={0} rm={rm} />
      <Bubble x={4} delay={0.55} rm={rm} />
      <Bubble x={22} delay={1.1} rm={rm} />
    </g>
  );
}

function Spray({ clip, rm }) {
  const trig = track({ rotate: clip.rows.trig }, rm, clip.dur);
  return (
    <g>
      <rect x={-12} y={-6} width={24} height={36} rx={8} fill={BLUE} fillOpacity={0.85} stroke={NAVY} strokeWidth={SW} />
      <rect x={-8} y={10} width={16} height={16} rx={5} fill={WHITE} fillOpacity={0.55} />
      <rect x={-5} y={-14} width={10} height={9} rx={2} fill={NAVY} />
      <rect x={-8} y={-26} width={36} height={13} rx={5.5} fill={WHITE} stroke={NAVY} strokeWidth={SW} />
      <circle cx={28} cy={-19} r={3} fill={BLUE} stroke={NAVY} strokeWidth={2} />
      <Joint x={4} y={-12} r={40} tr={trig}>
        <rect x={2} y={-12} width={6} height={18} rx={3} fill={WHITE} stroke={NAVY} strokeWidth={2.2} />
      </Joint>
    </g>
  );
}

function Mote({ from, delay, rm }) {
  return (
    <motion.circle
      cx={0}
      cy={-6}
      r={2.2}
      fill={BLUE}
      initial={{ opacity: 0, x: from }}
      animate={rm ? undefined : { x: [from, 0], opacity: [0, 1, 0], scale: [1, 0.4] }}
      transition={{ duration: 1.1, delay, repeat: Infinity, ease: "easeIn" }}
    />
  );
}

function Vacuum({ rm }) {
  return (
    <g>
      <rect x={-3.5} y={-72} width={7} height={52} rx={3.5} fill={NAVY} />
      <rect x={-7} y={-22} width={14} height={12} rx={4} fill={BLUE} stroke={NAVY} strokeWidth={SW} />
      {/* canister pod */}
      <rect x={-14} y={-58} width={28} height={34} rx={14} fill={WHITE} stroke={NAVY} strokeWidth={3.5} />
      <motion.circle
        cx={0}
        cy={-41}
        r={4.5}
        fill={BLUE}
        initial={{ opacity: 1 }}
        animate={rm ? undefined : { opacity: [1, 0.35, 1] }}
        transition={{ type: "tween", duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* T handle */}
      <rect x={-15} y={-76} width={30} height={8} rx={4} fill={BLUE} stroke={NAVY} strokeWidth={SW} />
      {/* floor head */}
      <rect x={-31} y={-12} width={62} height={15} rx={7.5} fill={WHITE} stroke={NAVY} strokeWidth={3.5} />
      <rect x={-24} y={-3} width={48} height={3} rx={1.5} fill={BLUE} />
      <circle cx={-23} cy={2} r={4} fill={NAVY} />
      <circle cx={23} cy={2} r={4} fill={NAVY} />
      <Mote from={-46} delay={0} rm={rm} />
      <Mote from={46} delay={0.3} rm={rm} />
      <Mote from={-38} delay={0.6} rm={rm} />
      <Mote from={40} delay={0.9} rm={rm} />
    </g>
  );
}

function Germ({ x, y, s = 1, delay = 0, rm }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <motion.g
        initial={{ rotate: -10 }}
        animate={rm ? undefined : { rotate: [-12, 12] }}
        transition={{ type: "tween", duration: 1.4, delay, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      >
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <line key={a} x1={0} y1={-5} x2={0} y2={-9} stroke={NAVY} strokeWidth={2} strokeLinecap="round" transform={`rotate(${a})`} />
        ))}
        <circle r={5.5} fill={NAVY} fillOpacity={0.85} />
        <circle cx={-1.8} cy={-1} r={1} fill={WHITE} />
        <circle cx={1.8} cy={-1} r={1} fill={WHITE} />
      </motion.g>
    </g>
  );
}

function Magnifier({ uid, rm }) {
  return (
    <g transform="rotate(50)">
      <rect x={-8} y={-3.5} width={30} height={7} rx={3.5} fill={NAVY} />
      <rect x={-6} y={-5.5} width={18} height={11} rx={5.5} fill={BLUE} stroke={NAVY} strokeWidth={2.5} />
      <circle cx={40} cy={0} r={19} fill={BLUE} fillOpacity={0.16} />
      <clipPath id={`${uid}-lens`}>
        <circle cx={40} cy={0} r={16} />
      </clipPath>
      <g clipPath={`url(#${uid}-lens)`}>
        <g transform="rotate(-50 40 0)">
          <Germ x={34} y={-4} s={1.1} rm={rm} />
          <Germ x={47} y={6} s={0.8} delay={0.5} rm={rm} />
        </g>
      </g>
      <circle cx={40} cy={0} r={19} fill="none" stroke={NAVY} strokeWidth={4} />
      <circle cx={40} cy={0} r={16.5} fill="none" stroke={BLUE} strokeWidth={2.5} />
      <path d="M28 -9 Q31 -14 37 -15" stroke={WHITE} strokeWidth={3} strokeLinecap="round" fill="none" />
    </g>
  );
}

const TOOLS = {
  "window-washer": Squeegee,
  mopping: Mop,
  spritzer: Spray,
  vacuuming: Vacuum,
  inspector: Magnifier,
};

/* ───────────────────────── scene extras ───────────────────────── */

const NOZZLE = [91, -75];
const MIST = [
  { dx: 44, dy: -18, r: 3, d: 0 },
  { dx: 58, dy: -6, r: 2.2, d: 0.04 },
  { dx: 52, dy: -30, r: 2.6, d: 0.08 },
  { dx: 70, dy: -14, r: 1.8, d: 0.02 },
  { dx: 40, dy: 2, r: 2, d: 0.1 },
  { dx: 64, dy: -26, r: 1.6, d: 0.06 },
  { dx: 76, dy: -4, r: 1.4, d: 0.12 },
];

function Extras({ activity, clip, rm }) {
  const { rows, dur } = clip;
  if (activity === "window-washer") return null; // pane is drawn behind the robot
  if (activity === "spritzer") {
    const period = dur / 2;
    return (
      <g>
        {MIST.map((m, i) => (
          <motion.circle
            key={i}
            cx={NOZZLE[0]}
            cy={NOZZLE[1]}
            r={m.r}
            fill={i % 2 ? WHITE : BLUE}
            stroke={BLUE}
            strokeWidth={0.8}
            initial={{ opacity: 0 }}
            animate={
              rm
                ? undefined
                : {
                    x: [0, m.dx * 0.55, m.dx],
                    y: [0, m.dy * 0.7 - 4, m.dy + 8],
                    opacity: [0, 0.95, 0.9, 0],
                    scale: [0.5, 1, 1.8],
                  }
            }
            transition={{ duration: period * 0.6, delay: m.d, repeat: Infinity, repeatDelay: period * 0.4, ease: "easeOut" }}
          />
        ))}
        <Sparkle x={NOZZLE[0] + 74} y={NOZZLE[1] - 14} s={0.9} rm={rm} />
      </g>
    );
  }
  if (activity === "napping") {
    const zs = [
      { size: 14, delay: 0 },
      { size: 18, delay: 1.05 },
      { size: 22, delay: 2.1 },
    ];
    return (
      <g>
        {zs.map((z) => (
          <motion.text
            key={z.delay}
            x={44}
            y={-112}
            fontSize={z.size}
            fontWeight={800}
            fontFamily="ui-rounded, 'Nunito', system-ui, sans-serif"
            fill={BLUE}
            stroke={NAVY}
            strokeWidth={3}
            paintOrder="stroke"
            textAnchor="middle"
            initial={{ opacity: rm ? 1 : 0 }}
            animate={rm ? undefined : { x: [0, 12, 24], y: [0, -16, -34], opacity: [0, 1, 0], scale: [0.5, 1, 1.3] }}
            transition={{ type: "tween", duration: 3.15, delay: z.delay, repeat: Infinity, ease: "easeOut" }}
          >
            Z
          </motion.text>
        ))}
      </g>
    );
  }
  if (activity === "mopping" || activity === "vacuuming") {
    const wet = track({ x: rows.tool.x }, rm, dur);
    return (
      <g>
        <ellipse cx={0} cy={35} rx={74} ry={3.2} fill={BLUE} fillOpacity={0.1} />
        <motion.g initial={wet.initial} animate={wet.animate} transition={wet.transition}>
          <ellipse cx={0} cy={35} rx={36} ry={4.5} fill={BLUE} fillOpacity={activity === "mopping" ? 0.24 : 0.14} />
          {activity === "mopping" && <Sparkle x={30} y={28} s={0.8} delay={0.2} rm={rm} />}
        </motion.g>
      </g>
    );
  }
  return null;
}

// Glass pane for the window washer, drawn behind the robot.
function Pane({ clip, rm }) {
  const blade = track({ y: clip.rows.tool.y }, rm, clip.dur);
  return (
    <g>
      <rect x={30} y={-190} width={86} height={226} rx={10} fill={BLUE} fillOpacity={0.1} stroke={BLUE} strokeOpacity={0.55} strokeWidth={3} />
      <path d="M44 -168 L68 -188 M44 -128 L100 -184" stroke={WHITE} strokeOpacity={0.6} strokeWidth={3} strokeLinecap="round" />
      <motion.g initial={blade.initial} animate={blade.animate} transition={blade.transition}>
        <rect x={37} y={-30} width={54} height={18} rx={9} fill={WHITE} fillOpacity={0.45} />
        <rect x={37} y={-21.5} width={54} height={2.5} rx={1.2} fill={BLUE} fillOpacity={0.6} />
      </motion.g>
      <Sparkle x={104} y={-170} s={1} rm={rm} />
      <Sparkle x={46} y={-70} s={0.7} delay={0.9} rm={rm} />
    </g>
  );
}

/* ───────────────────────── the scene ───────────────────────── */

function Rig({ activity, rm, uid }) {
  const clip = useMemo(() => buildClip(activity), [activity]);
  const { rows, dur, mood, look } = clip;
  const t = (v) => track(v, rm, dur);

  const torso = t(rows.torso);
  const head = t(rows.head);
  const legL = t(rows.legL);
  const legR = t(rows.legR);
  const armL = { s: t({ rotate: rows.armL.s }), e: t({ rotate: rows.armL.e }) };
  const armR = { s: t({ rotate: rows.armR.s }), e: t({ rotate: rows.armR.e }) };

  const Tool = TOOLS[activity];
  const sitting = activity === "napping";

  return (
    <g>
      {/* floor shadow */}
      <ellipse cx={0} cy={sitting ? 38 : 36} rx={sitting ? 68 : 52} ry={sitting ? 9 : 7} fill={NAVY} fillOpacity={0.14} />

      {activity === "window-washer" && <Pane clip={clip} rm={rm} />}

      {/* legs (behind the body) */}
      <Leg side="L" tr={legL} />
      <Leg side="R" tr={legR} />

      {/* body + head */}
      <Joint x={0} y={0} r={230} tr={torso}>
        <Body rm={rm} />
        <Head mood={mood} look={look} rm={rm} headTr={head} />
      </Joint>

      {/* tools sit between the body and the hands */}
      {clip.hasTool && Tool && (
        <ToolRig tr={t(rows.tool)}>
          <Tool uid={uid} clip={clip} rm={rm} />
        </ToolRig>
      )}
      {clip.hasAux && (
        <ToolRig tr={t(rows.aux)}>
          <Rag />
        </ToolRig>
      )}

      {/* arms (same torso motion, drawn on top so hands grip the tools) */}
      <Joint x={0} y={0} r={230} tr={torso}>
        <Arm side="L" s={armL.s} e={armL.e} />
        <Arm side="R" s={armR.s} e={armR.e} />
      </Joint>

      <Extras activity={activity} clip={clip} rm={rm} />
    </g>
  );
}

export default function ClezoBot({ activity = "window-washer", size = 300, className, style }) {
  const reduce = false;
  const uid = useId().replace(/:/g, "");
  const act = CLEZO_BOT_ACTIVITIES.includes(activity) ? activity : "window-washer";

  return (
    <svg
      viewBox="0 0 300 280"
      width={size}
      height={(size * 280) / 300}
      className={className}
      style={style}
      role="img"
      aria-label={`Clezo cleaning robot: ${act.replace("-", " ")}`}
    >
      <g transform="translate(120 198)">
        <Rig key={act} activity={act} rm={!!reduce} uid={uid} />
      </g>
    </svg>
  );
}