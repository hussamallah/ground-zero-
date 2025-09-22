
'use client';
import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { P1_QA } from './p1qa';
import { P2A_QA } from './p2a';
import { FAMILIES, seedBracket, nextTell } from './enginePort';
import { OptionCard } from '../components/OptionCard';

// Family data from HTML engine
const FAMILY_DATA = {
  Control: { icon: "♛", desc: "You set the call and move the plan." },
  Pace: { icon: "⏱", desc: "You keep time by picking a task and finishing it." },
  Boundary: { icon: "▦", desc: "You draw the line and say what can fit now." },
  Truth: { icon: "⚖", desc: "You hold the reason by checking facts and keeping signals clear." },
  Recognition: { icon: "☼", desc: "You show proof and claim the work you did." },
  Bonding: { icon: "👥", desc: "You keep trust by caring for and protecting the link." },
  Stress: { icon: "🔥", desc: "You act when pressure is high and others stall." }
} as const;

// Phase 3 questions from HTML engine
const P3_QA = {
  Truth: { q: "You're lost in the movie's plot. What do you do?", a: { C: "You ask a friend to quickly explain what you missed.", O: "You keep watching, hoping you'll eventually figure it out from the context.", F: "You pull out your phone and start scrolling, having given up on the movie." } },
  Pace: { q: "Your new routine is exhausting. Your move?", a: { C: "You reduce the intensity so it's more sustainable and you can stick with it.", O: "You push through the exhaustion, hoping your body will eventually adapt.", F: "You quit the routine altogether because it's too hard." } },
  Boundary: { q: "A friend still hasn't repaid a loan. What's your move?", a: { C: "You gently remind them about it.", O: "You hope they remember on their own without you saying anything.", F: "You decide to never lend them money again but don't say anything." } },
  Recognition: { q: "Your proud post gets no likes. Your reaction?", a: { C: "You're okay with it; you posted it for yourself.", O: "You wonder if you should have posted it at a different time of day.", F: "You feel embarrassed and consider deleting it." } },
  Bonding: { q: "Your friend brings you to a party, then leaves you alone. How do you handle it?", a: { C: "You introduce yourself to someone new.", O: "You find a quiet corner and wait for your friend to come back.", F: "You feel resentful toward your friend for abandoning you." } },
  Stress: { q: "Your power cuts out mid-meeting. What next?", a: { C: "You immediately switch to your phone's hotspot to rejoin.", O: "You wait a minute to see if the power comes back on by itself.", F: "You accept that the meeting is over for you and give up." } },
  Control: { q: "You're playing a casual game of tennis with a friend who keeps making questionable calls in their own favor. It's subtle, but you're sure they're bending the rules. How do you handle it?", a: { C: "You pause and say, \"Hey, let's make a clear call: any ball close to the line is in. Agreed?\"", O: "You start making your own questionable calls to even the score.", F: "You say nothing, but keep a mental tally and feel resentful." } }
} as const;

/* FAMILIES imported from enginePort */
type Family = typeof FAMILIES[number];
type Axis = "C"|"O"|"F";
type Face = "Sovereign"|"Rebel"|"Navigator"|"Visionary"|"Seeker"|"Architect"|"Guardian"|"Equalizer"|"Spotlight"|"Diplomat"|"Partner"|"Provider"|"Artisan"|"Catalyst";

type State = {
  phase: "P0"|"P1"|"P2A"|"BR_INT"|"P3"|"SUM";
  p0_sel: Set<Family>;
  p1_ix: number;
  p2a_ix: number;
  p3_ix: number;
  brStep: number;
  axisP1: Record<Family, Axis>;
  axisP2: Record<Family, Axis>;
  axisP3: Record<Family, Axis>;
  faceWinners: Record<Family, string>; // "Family/Face"
  bracket: any[]; // [ [ [A,B], [A,B], ... ], [], [] ] or with winners
  top2?: [string,string];
};

const KEY = "gzq/u6";

// Archetype data for face duels
const archetypeData: Record<string, {name: string, bird: string, description: string, image: string}> = {
  "Sovereign": {
    name: "Sovereign",
    bird: "Golden Eagle", 
    description: "I rise in direct ascent, wings locked, owning the sky. Nothing above me but the sun itself.",
    image: "/soverign.png"
  },
  "Rebel": {
    name: "Rebel",
    bird: "Raven",
    description: "I twist through air in erratic bursts, sharp turns breaking every pattern mid-flight. Order means nothing to me.",
    image: "/rebel.png"
  },
  "Visionary": {
    name: "Visionary", 
    bird: "Swallow",
    description: "I carve long arcs forward, eyes set on horizons no one else has seen yet. My body lives in tomorrow's wind.",
    image: "/Visionary.png"
  },
  "Navigator": {
    name: "Navigator",
    bird: "Albatross", 
    description: "I glide across endless distances, adjusting course through every crosswind. Storm or calm, I find the way",
    image: "/navigator.png"
  },
  "Equalizer": {
    name: "Equalizer",
    bird: "Owl",
    description: "I hold altitude in balance, wings stretched level, symmetry unbroken. Night or day, the measure is steady.",
    image: "/Equalizer.png"
  },
  "Guardian": {
    name: "Guardian",
    bird: "Swan",
    description: "I circle wide, watching, shielding the formation. Approach with peace and I stay graceful; threaten and I rise fierce.",
    image: "/Guardian.png"
  },
  "Seeker": {
    name: "Seeker",
    bird: "Falcon",
    description: "I dive with piercing precision, cutting through veils and illusions. What lies beneath is mine to uncover.",
    image: "/seeker.png"
  },
  "Architect": {
    name: "Architect",
    bird: "Weaverbird",
    description: "I climb in measured steps, every angle chosen, every strand reinforced. My flight builds as much as it moves.",
    image: "/Architect.png"
  },
  "Spotlight": {
    name: "Spotlight",
    bird: "Peacock",
    description: "I spiral upward, radiant, all eyes pulled to my shimmer. Flight is my stage, the sky my mirror.",
    image: "/spotlight.png"
  },
  "Diplomat": {
    name: "Diplomat",
    bird: "Dove",
    description: "I weave gently through the currents, smoothing turbulence, easing the path of those beside me.",
    image: "/Diplomat.png"
  },
  "Partner": {
    name: "Partner",
    bird: "Penguin",
    description: "I fly in water if not in sky, always wing-to-wing, never breaking from the one I've chosen.",
    image: "/partner.png"
  },
  "Provider": {
    name: "Provider",
    bird: "Pelican",
    description: "I lift with strength enough for others, carrying their weight in my draft. My currents are never just for me.",
    image: "/provider.png"
  },
  "Catalyst": {
    name: "Catalyst",
    bird: "Hummingbird",
    description: "I explode off the air in impossible speed, scattering stillness, igniting motion where none existed.",
    image: "/Catalyst.png"
  },
  "Artisan": {
    name: "Artisan",
    bird: "Heron",
    description: "I stroke the air in slow, deliberate movements, each motion refined, each landing an act of grace.",
    image: "/artisan.png"
  }
};

function useLocalState<T>(key: string, initial: T){
  const [val, setVal] = React.useState<T>(initial);
  const [isHydrated, setIsHydrated] = React.useState(false);
  
  // Load from localStorage after hydration
  React.useEffect(() => {
    setIsHydrated(true);
    try{
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      // Handle Set serialization/deserialization
      if (parsed.p0_sel && Array.isArray(parsed.p0_sel)) {
        parsed.p0_sel = new Set(parsed.p0_sel);
      }
      setVal(parsed as T);
    }catch{ /* ignore */ }
  }, [key]);
  
  // Save to localStorage
  React.useEffect(() => {
    if (!isHydrated) return;
    try {
      const toStore = { ...val } as any;
      // Handle Set serialization
      if (toStore.p0_sel instanceof Set) {
        toStore.p0_sel = Array.from(toStore.p0_sel);
      }
      localStorage.setItem(key, JSON.stringify(toStore));
    } catch { /* ignore */ }
  }, [val, key, isHydrated]);
  
  return [val, setVal] as const;
}

function hashStr(s: string){ let h=0; for (let i=0;i<s.length;i++) h=((h<<5)-h)+s.charCodeAt(i)|0; return Math.abs(h); }

function buildEntrantsWithWildcard(state: State){
  // Collect 7 winners as "Family/Face", add a duplicate of the strongest winner as wildcard.
  const winners: string[] = FAMILIES.map(f => state.faceWinners[f]).filter(Boolean) as string[];
  const pick = winners[0] ?? "Control/Sovereign";
  const entrants = [...winners];
  while (entrants.length < 8) entrants.push(pick);
  return entrants;
}


function FaceName(id: string){
  const parts = id.split("/");
  return parts[1] ?? id;
}

function getProgress(state: State): number {
  let step = 0;
  const total = 28;
  
  if (state.phase === "P0") step = 0;
  else if (state.phase === "P1") step = 1 + state.p1_ix;
  else if (state.phase === "P2A" || state.phase === "BR_INT") step = 8 + state.p2a_ix;
  else if (state.phase === "P3") step = 22 + state.p3_ix;
  else if (state.phase === "SUM") step = 28;
  
  return Math.round((step / total) * 100);
}

export default function Quiz(){
  const [state, setState] = useLocalState<State>(KEY, {
    phase: "P0",
    p0_sel: new Set(),
    p1_ix: 0,
    p2a_ix: 0,
    p3_ix: 0,
    brStep: 0,
    axisP1: {} as any,
    axisP2: {} as any,
    axisP3: {} as any,
    faceWinners: {} as any,
    bracket: []
  });
  
  const [isHydrated, setIsHydrated] = React.useState(false);
  
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  function save(mut: (s: State)=>void){
    setState(s => { const next = structuredClone(s); mut(next); return next; });
  }

  function restart(){
    setState({
      phase: "P0",
      p0_sel: new Set(),
      p1_ix: 0,
      p2a_ix: 0,
      p3_ix: 0,
      brStep: 0,
      axisP1: {} as any,
      axisP2: {} as any,
      axisP3: {} as any,
      faceWinners: {} as any,
      bracket: []
    });
  }

  if (!isHydrated) {
  return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'radial-gradient(1200px 700px at 15% -10%, #121625, #0a0b0f)',
        color: '#f7f3ea',
        fontFamily: 'Inter, ui-sans-serif, system-ui, Segoe UI, Roboto, Arial'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="text-lg font-bold mb-2" style={{ color: '#aeb7c7' }}>
            Ground Zero • Loading...
          </div>
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'radial-gradient(1200px 700px at 15% -10%, #121625, #0a0b0f)',
      color: '#f7f3ea',
      fontFamily: 'Inter, ui-sans-serif, system-ui, Segoe UI, Roboto, Arial',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '12px',
        fontSize: '12px',
        zIndex: 10
      }}>
        <Link style={{ textDecoration: 'underline', color: '#f7f3ea' }} href="/">Home</Link>
        <button style={{ textDecoration: 'underline', color: '#f7f3ea', background: 'none', border: 'none', cursor: 'pointer' }} onClick={restart}>Restart</button>
      </div>
        
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        overflow: 'hidden'
      }}>
        {state.phase === "P0" && <Phase0 state={state} save={save} />}
        {state.phase === "P1" && <Phase1 state={state} save={save} />}
        {state.phase === "P2A" && <Phase2A state={state} save={save} />}
        {state.phase === "BR_INT" && <BracketInterleaved state={state} save={save} />}
        {state.phase === "P3" && <Phase3 state={state} save={save} />}
        {state.phase === "SUM" && <Summary state={state} restart={restart} />}
      </div>
    </div>
  );
}

function Phase0({state, save}:{state: State; save: (m:(s:State)=>void)=>void}){
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#f7f3ea' }}>
          Select 3 families to continue
        </h2>
        <p style={{ fontSize: '16px', color: '#aeb7c7', lineHeight: '1.5' }}>
          Choose the three areas that resonate most with you
        </p>
        <div style={{ 
          marginTop: '16px', 
          padding: '8px 16px', 
          background: 'rgba(212,175,55,0.1)', 
          borderRadius: '20px', 
          display: 'inline-block',
          fontSize: '14px',
          color: '#d4af37',
          fontWeight: '600'
        }}>
          {state.p0_sel.size}/3 selected
        </div>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        gap: '16px'
      }}>
        {FAMILIES.map(family => {
          const data = FAMILY_DATA[family];
          const isSelected = state.p0_sel.has(family);
          return (
            <button
              key={family}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '20px',
                borderRadius: '20px',
                border: isSelected ? '2px solid #d4af37' : '2px solid #3a3f4a',
                background: isSelected 
                  ? 'linear-gradient(180deg, #2a2d34, #1f2128)' 
                  : 'linear-gradient(180deg, #1a1d24, #171a20)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                minHeight: '160px',
                textAlign: 'left',
                transform: isSelected ? 'translateY(-4px)' : 'none',
                boxShadow: isSelected 
                  ? '0 8px 24px rgba(212,175,55,0.3), 0 0 0 1px rgba(212,175,55,0.2) inset' 
                  : '0 4px 12px rgba(0,0,0,0.2)'
              }}
              onClick={() => {
                save(s => {
                  if (s.p0_sel.has(family)) {
                    s.p0_sel.delete(family);
                  } else if (s.p0_sel.size < 3) {
                    s.p0_sel.add(family);
                  }
                });
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                display: 'grid',
                placeItems: 'center',
                background: isSelected 
                  ? 'rgba(212,175,55,0.25)' 
                  : 'rgba(212,175,55,0.15)',
                color: '#d4af37',
                fontSize: '24px',
                fontWeight: '900',
                border: isSelected 
                  ? '2px solid #d4af37' 
                  : '1px solid #6b5620',
                transition: 'all 0.2s ease',
                filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.6))'
              }}>
                {family === 'Stress' ? (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    position: 'relative',
                    filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.9))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Lightning bolt symbol - representing stress/energy */}
                    <div style={{
                      width: '28px',
                      height: '28px',
                      position: 'relative'
                    }}>
                      {/* Main lightning bolt */}
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '6px',
                        height: '28px',
                        background: 'linear-gradient(135deg, #f4d03f, #d4af37)',
                        clipPath: 'polygon(0% 0%, 100% 40%, 60% 40%, 100% 100%, 0% 60%, 40% 60%)'
                      }} />
                      {/* Lightning spark */}
                      <div style={{
                        position: 'absolute',
                        top: '3px',
                        right: '3px',
                        width: '8px',
                        height: '8px',
                        background: 'linear-gradient(135deg, #f4d03f, #d4af37)',
                        borderRadius: '50%',
                        filter: 'blur(1px)'
                      }} />
                    </div>
                  </div>
                ) : family === 'Bonding' ? (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    position: 'relative',
                    filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.9))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Chain link symbol - representing bonding/connection */}
                    <div style={{
                      width: '28px',
                      height: '28px',
                      position: 'relative'
                    }}>
                      {/* Top chain link */}
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '16px',
                        height: '10px',
                        background: 'linear-gradient(135deg, #f4d03f, #d4af37)',
                        borderRadius: '8px 8px 0 0',
                        border: '2px solid #d4af37'
                      }} />
                      {/* Bottom chain link */}
                      <div style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '16px',
                        height: '10px',
                        background: 'linear-gradient(135deg, #d4af37, #f4d03f)',
                        borderRadius: '0 0 8px 8px',
                        border: '2px solid #f4d03f'
                      }} />
                      {/* Connecting link */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '10px',
                        height: '6px',
                        background: 'linear-gradient(135deg, #f4d03f, #d4af37)',
                        borderRadius: '5px'
                      }} />
                    </div>
                  </div>
                ) : data.icon}
              </div>
              <div style={{
                fontWeight: '900',
                color: isSelected ? '#f7f3ea' : '#d4af37',
                letterSpacing: '0.3px',
                fontSize: '18px',
                transition: 'color 0.2s ease'
              }}>
                {family}
              </div>
              <div style={{
                fontSize: '14px',
                color: isSelected ? '#e8d39a' : '#aeb7c7',
                opacity: '0.95',
                lineHeight: '1.4',
                transition: 'color 0.2s ease'
              }}>
                {data.desc}
              </div>
            </button>
          );
        })}
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <button
          style={{
            padding: '16px 32px',
            borderRadius: '50px',
            border: '2px solid transparent',
            background: state.p0_sel.size === 3 
              ? 'linear-gradient(135deg, #d4af37, #e3c566)' 
              : 'linear-gradient(135deg, #2a2f3a, #1a1d24)',
            color: state.p0_sel.size === 3 ? '#1a1208' : '#aeb7c7',
            fontWeight: '900',
            fontSize: '16px',
            cursor: state.p0_sel.size === 3 ? 'pointer' : 'not-allowed',
            opacity: state.p0_sel.size === 3 ? 1 : 0.7,
            transition: 'all 0.3s ease',
            minWidth: '280px',
            textAlign: 'center',
            boxShadow: state.p0_sel.size === 3 
              ? '0 6px 20px rgba(212,175,55,0.4)' 
              : '0 4px 12px rgba(0,0,0,0.2)',
            transform: state.p0_sel.size === 3 ? 'translateY(-2px)' : 'none'
          }}
          disabled={state.p0_sel.size !== 3}
          onClick={() => {
            if (state.p0_sel.size === 3) {
              save(s => {
                s.phase = "P1";
                s.p1_ix = 0;
              });
            }
          }}
        >
          {state.p0_sel.size === 3 ? 'Continue' : `Select ${3 - state.p0_sel.size} more`}
        </button>
      </div>
    </div>
  );
}

function Phase1({state, save}:{state: State; save: (m:(s:State)=>void)=>void}){
  const fam = FAMILIES[state.p1_ix];
  const qaArr = P1_QA[fam];
  const qIx = hashStr(fam) % qaArr.length;
  const qa = qaArr[qIx];
  
  const progress = ((state.p1_ix + 1) / 7) * 100;
  
  return (
    <div className="min-h-screen text-white bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(255,255,255,0.06),rgba(0,0,0,0)_60%),#0b0f1a]">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="mx-auto max-w-5xl px-4 h-12 flex items-center justify-between">
          <div className="text-sm text-white/70">
            <span className="font-medium text-white">Phase 1</span>
            <span className="mx-2">•</span> Control
            <span className="mx-2">•</span> {state.p1_ix+1}/7
        </div>
          <div className="flex items-center gap-3">
            <div className="w-16 text-right text-xs tabular-nums text-white/70" aria-live="polite">{Math.round(progress)}%</div>
            <div className="w-40 h-1.5 rounded-full bg-white/10" aria-hidden>
              <div className="h-1.5 rounded-full bg-white/80 transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
            <button aria-label="Home" className="p-2 rounded-xl hover:bg-white/5">🏠</button>
            <button aria-label="Restart" className="p-2 rounded-xl hover:bg-white/5">⟲</button>
      </div>
      </div>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        {/* Question */}
        <motion.h1 
          key={`p1-question-${state.p1_ix}`}
          variants={questionVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-center text-2xl md:text-3xl font-semibold tracking-tight mt-8"
        >
          {qa.q}
        </motion.h1>

        {/* Options */}
        <motion.section
          key={`p1-options-${state.p1_ix}`}
          variants={optionsVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="radiogroup"
          aria-label="Answers"
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
        >
        {[...qa.options].sort((a, b) => {
          // Group by axis: C, O, F
          const order = { 'C': 0, 'O': 1, 'F': 2 };
          return order[a.axis] - order[b.axis];
          }).map((o, i) => {
            const axisLabel = o.axis === "C" ? "Commit" : o.axis === "O" ? "Explore" : "Break";
            const axisChipClass = o.axis === "C" 
              ? "text-[11px] px-2 py-1 rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] bg-yellow-500/20 border-yellow-400/50 text-yellow-300"
              : o.axis === "O"
              ? "text-[11px] px-2 py-1 rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] bg-blue-600/20 border-blue-500/40 text-blue-300"
              : "text-[11px] px-2 py-1 rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] bg-red-600/20 border-red-500/40 text-red-300";
            
            return (
              <motion.div
                key={`${state.p1_ix}-${i}`}
                variants={optionVariants}
                whileHover="hover"
                whileTap="tap"
                role="radio"
                tabIndex={0}
            onClick={()=>{
              save(s=>{
                s.axisP1[fam]=o.axis;
                s.faceWinners[fam]=`${fam}/${o.face}`;
                if (s.p1_ix<6){ s.p1_ix++; }
                else {
                  s.bracket = seedBracket(s.faceWinners, s.axisP1);
                  s.phase="P2A";
                  s.p2a_ix=0;
                  s.brStep=0;
                }
              });
            }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    save(s=>{
                      s.axisP1[fam]=o.axis;
                      s.faceWinners[fam]=`${fam}/${o.face}`;
                      if (s.p1_ix<6){ s.p1_ix++; }
                      else {
                        s.bracket = seedBracket(s.faceWinners, s.axisP1);
                        s.phase="P2A";
                        s.p2a_ix=0;
                        s.brStep=0;
                      }
                    });
                  }
                }}
                className={[
                  "group w-full cursor-pointer select-none text-left rounded-2xl p-5 md:p-6",
                  "bg-white/[0.04] hover:bg-white/[0.07] active:bg-white/[0.09]",
                  "border border-white/10 hover:border-yellow-400/60",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_8px_24px_rgba(212,175,55,0.25)]",
                ].join(" ")}
              >
                <div className="flex items-center gap-3">
                  <span className={axisChipClass}>{axisLabel}</span>
                  <span className="font-medium leading-tight text-[15px] md:text-base">{o.text}</span>
            </div>
            </motion.div>
            );
          })}
        </motion.section>

        {/* Spacer for mobile */}
        <div className="h-20 md:h-0" />
      </main>
    </div>
  );
}


function Phase2A({state, save}:{state: State; save:(m:(s:State)=>void)=>void}){
  const fam = FAMILIES[state.p2a_ix];
  const qa = P2A_QA[fam];
  const entries: {ax: Axis; text: string}[] = [
    { ax: "C", text: qa.a.C },
    { ax: "O", text: qa.a.O }
  ];
  
  const progress = ((state.p2a_ix + 1) / 7) * 100;
  
  return (
    <div className="min-h-screen text-white bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(255,255,255,0.06),rgba(0,0,0,0)_60%),#0b0f1a]">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="mx-auto max-w-5xl px-4 h-12 flex items-center justify-between">
          <div className="text-sm text-white/70">
            <span className="font-medium text-white">Phase 2A</span>
            <span className="mx-2">•</span> Options
            <span className="mx-2">•</span> {state.p2a_ix+1}/7
        </div>
          <div className="flex items-center gap-3">
            <div className="w-16 text-right text-xs tabular-nums text-white/70" aria-live="polite">{Math.round(progress)}%</div>
            <div className="w-40 h-1.5 rounded-full bg-white/10" aria-hidden>
              <div className="h-1.5 rounded-full bg-white/80 transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
            <button aria-label="Home" className="p-2 rounded-xl hover:bg-white/5">🏠</button>
            <button aria-label="Restart" className="p-2 rounded-xl hover:bg-white/5">⟲</button>
      </div>
      </div>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        {/* Question */}
        <motion.h1 
          key={`p2a-question-${state.p2a_ix}`}
          variants={questionVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-center text-2xl md:text-3xl font-semibold tracking-tight mt-8"
        >
          {qa.q}
        </motion.h1>

        {/* Options */}
        <motion.section
          key={`p2a-options-${state.p2a_ix}`}
          variants={optionsVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="radiogroup"
          aria-label="Answers"
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
        >
          {entries.map(e => {
            return (
              <motion.div
                key={`${state.p2a_ix}-${e.ax}`}
                variants={optionVariants}
                whileHover="hover"
                whileTap="tap"
                role="radio"
                tabIndex={0}
                onClick={()=>{
                  save(s=>{
                    s.axisP2[fam]=e.ax;
                    s.phase="BR_INT";
                  });
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    save(s=>{
                      s.axisP2[fam]=e.ax;
                      s.phase="BR_INT";
                    });
                  }
                }}
                className={[
                  "group w-full cursor-pointer select-none text-left rounded-2xl p-5 md:p-6",
                  "bg-white/[0.04] hover:bg-white/[0.07] active:bg-white/[0.09]",
                  "border border-white/10 hover:border-yellow-400/60",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_8px_24px_rgba(212,175,55,0.25)]",
                ].join(" ")}
              >
                <div className="font-medium leading-tight text-[15px] md:text-base">
                  {e.text}
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* Spacer for mobile */}
        <div className="h-20 md:h-0" />
      </main>
    </div>
  );
}

// Animation variants for smooth transitions
const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1
  },
  hover: {
    y: -8,
    scale: 1.02
  }
};

const imageVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotateY: -15
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotateY: 0
  }
};

const textVariants = {
  hidden: { 
    opacity: 0, 
    y: 20
  },
  visible: { 
    opacity: 1, 
    y: 0
  }
};

// Question transition variants
const questionVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1
  },
  exit: { 
    opacity: 0, 
    y: -20,
    scale: 1.05
  }
};

// Loading spinner variants
const loadingVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8
  },
  visible: { 
    opacity: 1,
    scale: 1
  },
  exit: { 
    opacity: 0,
    scale: 0.8
  }
};

const optionsVariants = {
  hidden: { 
    opacity: 0, 
    y: 30
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.15
    }
  },
  exit: { 
    opacity: 0, 
    y: -30
  }
};

const optionVariants = {
  hidden: { 
    opacity: 0, 
    y: 15,
    scale: 0.96
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1
  },
  hover: {
    y: -6,
    scale: 1.03
  },
  tap: {
    scale: 0.97
  }
};

function BracketInterleaved({state, save}:{state: State; save:(m:(s:State)=>void)=>void}){
  const step = state.brStep;
  const br = state.bracket as any[];
  if (step>=4 && br[1].length===0){
    const w = br[0].map((p:any)=>p.winner).filter(Boolean);
    if (w.length===4) { br[1] = [[w[0],w[1]],[w[2],w[3]]]; }
  }
  if (step>=6 && br[2].length===0){
    const w = br[1].map((p:any)=>p.winner).filter(Boolean);
    if (w.length===2) { br[2] = [[w[0],w[1]]]; }
  }

  let label="", roundIx=0, idx=0;
  if (step<4){ label="QUARTERFINALS"; roundIx=0; idx=step; }
  else if (step<6){ label="SEMIFINALS"; roundIx=1; idx=step-4; }
  else { label="FINAL"; roundIx=2; idx=0; }
  const pair = br[roundIx][idx];
  if (!Array.isArray(pair)){
    if (step>=6){
      save(s=>{
        const f = s.bracket[2][0];
        if (f && f.winner && f.loser) s.top2=[f.winner,f.loser];
        s.phase="P3";
      });
      return null;
    } else {
      save(s=>{ s.brStep = step+1; s.phase="P2A"; if (s.p2a_ix<6) s.p2a_ix++; else s.phase="P3"; });
      return null;
    }
  }

  const [A,B] = pair as [string,string];
  const faceA = FaceName(A), faceB = FaceName(B);
  const [selectedCard, setSelectedCard] = React.useState<string | null>(null);

  const handleSelection = (sideId: string) => {
    setSelectedCard(sideId);
    setTimeout(() => {
      save(s=>{
        s.bracket[roundIx][idx] = { winner: sideId, loser: sideId===A?B:A };
        s.brStep += 1;
        if (roundIx===2){
          s.top2 = [sideId, sideId===A?B:A];
        }
        if (s.p2a_ix < 6){
          s.p2a_ix += 1;
          s.phase="P2A";
        } else if (roundIx===2){
          s.phase="P3";
        } else {
          s.phase="BR_INT";
        }
      });
    }, 200);
  };

  return (
    <div className="min-h-screen text-white bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(255,255,255,0.06),rgba(0,0,0,0)_60%),#0b0f1a]">
      {/* Header with progress bar */}
      <header className="pt-5 pb-2">
        <div className="text-center text-[12.5px] tracking-[0.14em] text-white/70">
          {label} • MATCH {idx+1}/{roundIx===0?4:(roundIx===1?2:1)}
        </div>
        <div className="mx-auto mt-2 h-1.5 w-44 rounded-full bg-white/10">
          <div className="h-1.5 w-[75%] rounded-full bg-white/80" />
        </div>
      </header>

      {/* Main container */}
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div role="radiogroup" className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[{id:A,face:faceA},{id:B,face:faceB}].map((side, index) => {
            const archetype = archetypeData[side.face];
            const isSelected = selectedCard === side.id;
            const isDisabled = selectedCard && selectedCard !== side.id;
            
            return (
              <motion.div
                key={side.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: index * 0.06 }}
                className={`
                  relative rounded-3xl bg-white/[0.035] border border-white/12 
                  shadow-[0_12px_36px_rgba(0,0,0,0.35)] 
                  before:absolute before:inset-0 before:rounded-3xl before:pointer-events-none 
                  before:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] p-4
                  transition-all duration-160 hover:-translate-y-0.5 hover:border-white/20
                  ${isSelected ? 'ring-2 ring-teal-300/60 shadow-[0_20px_60px_rgba(94,234,212,.16)] scale-[1.02]' : ''}
                  ${isDisabled ? 'opacity-60 pointer-events-none' : 'cursor-pointer'}
                `}
                onClick={() => !isDisabled && handleSelection(side.id)}
                role="radio"
                tabIndex={isDisabled ? -1 : 0}
                aria-checked={isSelected}
                aria-label={archetype ? `${archetype.name} — ${archetype.bird}` : side.face}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
                    e.preventDefault();
                    handleSelection(side.id);
                  }
                }}
              >

                {/* Stage alignment with proper baseline */}
                <div className="mx-6 mt-6 rounded-2xl border border-yellow-300/15 bg-[#111418]">
                  <div className="relative aspect-[4/5]">
                    {archetype && (
                      <>
                        <img
                          src={archetype.image}
                          alt=""
                          className="absolute inset-0 w-full h-full object-contain object-center drop-shadow-[0_14px_30px_rgba(0,0,0,.45)]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_30%,rgba(255,255,255,.06),transparent_70%)]" />
                      </>
                    )}
                  </div>
                </div>

                {/* Title with proper hierarchy */}
                <h2 className="mt-4 text-center text-xl md:text-2xl font-semibold">
                  {archetype ? (
                    <>
                      {archetype.name} <span className="text-white/70">— {archetype.bird}</span>
                    </>
                  ) : (
                    side.face
                  )}
                </h2>

                {/* Description with rhythm */}
                {archetype && (
                  <p className="mx-auto mt-3 mb-5 max-w-[60ch] text-center text-[15px] leading-7 text-white/75">
                    {archetype.description}
                  </p>
                )}

              </motion.div>
            );
          })}
        </div>

        {/* Continue button (shown after selection) */}
        {selectedCard && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <button 
              className="rounded-2xl bg-white text-black px-5 py-3 font-medium hover:opacity-90 transition-opacity"
              onClick={() => {
                // Continue logic is handled in handleSelection
              }}
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* Accessibility announcement */}
        <div aria-live="polite" className="sr-only">
          {selectedCard && `Selected ${archetypeData[FaceName(selectedCard)]?.name || selectedCard}`}
        </div>
      </div>
    </div>
  );
}

function Phase3({state, save}:{state: State; save:(m:(s:State)=>void)=>void}){
  const fam = FAMILIES[state.p3_ix];
  const qa = P3_QA[fam];
  const p2 = state.axisP2[fam] || "C";
  const pair = (p2 === "O") ? ["C","F"] : ["C","O"];
  
  const progress = ((state.p3_ix + 1) / 7) * 100;
  
  return (
    <div className="min-h-screen text-white bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(255,255,255,0.06),rgba(0,0,0,0)_60%),#0b0f1a]">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="mx-auto max-w-5xl px-4 h-12 flex items-center justify-between">
          <div className="text-sm text-white/70">
            <span className="font-medium text-white">Phase 3</span>
            <span className="mx-2">•</span> Pattern
            <span className="mx-2">•</span> {state.p3_ix+1}/7
        </div>
          <div className="flex items-center gap-3">
            <div className="w-16 text-right text-xs tabular-nums text-white/70" aria-live="polite">{Math.round(progress)}%</div>
            <div className="w-40 h-1.5 rounded-full bg-white/10" aria-hidden>
              <div className="h-1.5 rounded-full bg-white/80 transition-[width] duration-300" style={{ width: `${progress}%` }} />
        </div>
            <button aria-label="Home" className="p-2 rounded-xl hover:bg-white/5">🏠</button>
            <button aria-label="Restart" className="p-2 rounded-xl hover:bg-white/5">⟲</button>
      </div>
      </div>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        {/* Question */}
        <motion.h1 
          key={`p3-question-${state.p3_ix}`}
          variants={questionVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="text-center text-2xl md:text-3xl font-semibold tracking-tight mt-8"
        >
          {qa.q}
        </motion.h1>

        {/* Options */}
        <motion.section
          key={`p3-options-${state.p3_ix}`}
          variants={optionsVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="radiogroup"
          aria-label="Answers"
          className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
        >
          {pair.map(ax => {
            return (
              <motion.div
                key={`${state.p3_ix}-${ax}`}
                variants={optionVariants}
                whileHover="hover"
                whileTap="tap"
                role="radio"
                tabIndex={0}
                onClick={()=>{
                  save(s=>{
                    s.axisP3[fam] = ax as Axis;
                    if (s.p3_ix < 6) { 
                      s.p3_ix++; 
                    } else { 
                      s.phase = "SUM"; 
                    }
                  });
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    save(s=>{
                      s.axisP3[fam] = ax as Axis;
                      if (s.p3_ix < 6) { 
                        s.p3_ix++; 
                      } else { 
                        s.phase = "SUM"; 
                      }
                    });
                  }
                }}
                className={[
                  "group w-full cursor-pointer select-none text-left rounded-2xl p-5 md:p-6",
                  "bg-white/[0.04] hover:bg-white/[0.07] active:bg-white/[0.09]",
                  "border border-white/10 hover:border-yellow-400/60",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_8px_24px_rgba(212,175,55,0.25)]",
                ].join(" ")}
              >
                <div className="font-medium leading-tight text-[15px] md:text-base">
                  {qa.a[ax as Axis]}
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* Spacer for mobile */}
        <div className="h-20 md:h-0" />
      </main>
    </div>
  );
}

function Summary({state, restart}:{state: State; restart: ()=>void}){
  const [winner, runner] = state.top2 ?? [undefined, undefined];
  
  // Calculate verdict like in HTML engine
  const verdict = FAMILIES.map(f => {
    const a1 = state.axisP1[f] || "C";
    const a2 = state.axisP2[f] || "C"; 
    const a3 = state.axisP3[f] || "C";
    return (a1 === "F" || a2 === "F" || a3 === "F") ? "F" : 
           ((a1 === "O" || a2 === "O" || a3 === "O") ? "O" : "C");
  }).join("");
  
  const copyResult = () => {
    const payload = JSON.stringify({
      top1: winner ? FaceName(winner) : "?",
      top2: runner ? FaceName(runner) : "?", 
      verdict: verdict
    }, null, 2);
    navigator.clipboard.writeText(payload).catch(() => {});
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 className="text-2xl font-bold mb-2">Your Ground Zero Profile</h2>
        <p className="text-neutral-400">Complete personality assessment results</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-6 text-center">
          <div className="text-sm text-yellow-400 font-bold mb-2">TOP-1</div>
          <div className="text-2xl font-bold text-yellow-300">{winner ? FaceName(winner) : "?"}</div>
          <div className="text-xs text-neutral-400 mt-1">{winner ?? ""}</div>
        </div>
        <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-6 text-center">
          <div className="text-sm text-yellow-400 font-bold mb-2">TOP-2</div>
          <div className="text-xl font-bold text-yellow-300">{runner ? FaceName(runner) : "?"}</div>
          <div className="text-xs text-neutral-400 mt-1">{runner ?? ""}</div>
        </div>
      </div>
      
      <div className="rounded-2xl border border-neutral-700 bg-neutral-900/50 p-6 text-center">
        <div className="text-sm text-yellow-400 font-bold mb-2">VERDICT</div>
        <div className="text-3xl font-bold text-yellow-300 tracking-wider mb-2">{verdict}</div>
        <div className="text-sm text-neutral-400">C P B T R Bn S</div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <button 
          className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-full hover:bg-yellow-300 transition-colors"
          onClick={copyResult}
        >
          Copy Result
        </button>
        <button 
          className="px-6 py-3 border border-neutral-600 text-neutral-300 font-bold rounded-full hover:border-neutral-500 transition-colors"
          onClick={restart}
        >
          Restart Quiz
        </button>
      </div>
      
      <details className="rounded-2xl border border-neutral-700 bg-neutral-900/30 p-4">
        <summary className="text-sm text-neutral-400 cursor-pointer">Debug Data</summary>
        <pre className="mt-4 text-xs text-neutral-500 overflow-auto">
{JSON.stringify({
  phase: state.phase,
  p0_sel: Array.from(state.p0_sel),
  p1_ix: state.p1_ix,
  p2a_ix: state.p2a_ix,
  p3_ix: state.p3_ix,
  brStep: state.brStep,
  axisP1: state.axisP1,
  axisP2: state.axisP2,
  axisP3: state.axisP3,
  faceWinners: state.faceWinners,
  bracket: state.bracket,
  top2: state.top2,
  verdict: verdict
}, null, 2)}
      </pre>
        <p className="text-xs text-neutral-600 mt-2">Local state key: <code>gzq/u6</code></p>
      </details>
    </div>
  );
}
