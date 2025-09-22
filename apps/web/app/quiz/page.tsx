
'use client';
import * as React from 'react';
import Link from 'next/link';
import { P1_QA } from './p1qa';
import { P2A_QA } from './p2a';
import { FAMILIES, seedBracket, nextTell } from './enginePort';

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
        {state.phase === "SUM" && <Summary state={state} />}
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
                transition: 'all 0.2s ease'
              }}>
                {data.icon}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px 16px',
        background: 'rgba(212,175,55,0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(212,175,55,0.2)'
      }}>
        <div style={{ fontSize: '14px', color: '#d4af37', fontWeight: '600' }}>
          Phase 1 • {fam} • {state.p1_ix+1}/7
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#aeb7c7',
          background: 'rgba(0,0,0,0.3)',
          padding: '4px 8px',
          borderRadius: '6px'
        }}>
          {Math.round(((state.p1_ix + 1) / 7) * 100)}%
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '-10px' }}>
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: '600', 
          marginBottom: '16px', 
          color: '#f7f3ea', 
          lineHeight: '1.4',
          padding: '0 20px'
        }}>{qa.q}</h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gridTemplateRows: 'repeat(3, minmax(0, 1fr))', gap: '16px', maxWidth: '1000px', margin: '0 auto' }}>
        {[...qa.options].sort((a, b) => {
          // Group by axis: C, O, F
          const order = { 'C': 0, 'O': 1, 'F': 2 };
          return order[a.axis] - order[b.axis];
        }).map((o, i) => (
          <button key={i}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '16px',
              border: '2px solid #3a3f4a',
              padding: '20px',
              textAlign: 'left',
              background: 'linear-gradient(180deg, #1a1d24, #171a20)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              position: 'relative',
              overflow: 'hidden',
              minHeight: '120px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.background = 'linear-gradient(180deg, #2a2d34, #272a30)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,175,55,0.3)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#3a3f4a';
              e.currentTarget.style.background = 'linear-gradient(180deg, #1a1d24, #171a20)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
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
          >
            <div style={{
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.1))',
              color: '#d4af37',
              border: '1px solid rgba(212,175,55,0.4)',
              textAlign: 'center',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 8px rgba(212,175,55,0.1)',
              alignSelf: 'flex-start'
            }}>
              {o.axis === "C" ? "Commit cleanly" : o.axis === "O" ? "Keep options open" : "Pattern break"}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: '#f7f3ea', 
              lineHeight: '1.4', 
              flex: 1,
              fontWeight: '500'
            }}>
              {o.text}
            </div>
          </button>
        ))}
      </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'hidden' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px 16px',
        background: 'rgba(212,175,55,0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(212,175,55,0.2)'
      }}>
        <div style={{ fontSize: '14px', color: '#d4af37', fontWeight: '600' }}>
          Phase 2A • {fam} • {state.p2a_ix+1}/7
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#aeb7c7',
          background: 'rgba(0,0,0,0.3)',
          padding: '4px 8px',
          borderRadius: '6px'
        }}>
          {Math.round(progress)}%
        </div>
      </div>
      
      <div style={{
        width: '100%',
        background: '#0f1220',
        borderRadius: '999px',
        height: '8px',
        border: '1px solid #2a2f3a'
      }}>
        <div style={{
          background: 'linear-gradient(90deg, #d4af37, #e3c566)',
          height: '100%',
          borderRadius: '999px',
          transition: 'width 0.2s',
          width: `${progress}%`
        }} />
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#f7f3ea' }}>{qa.q}</h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px', flex: 1, maxWidth: '1024px', margin: '0 auto' }}>
        {entries.map(e => (
          <button key={e.ax}
            style={{
              borderRadius: '20px',
              border: '2px solid #3a3f4a',
              padding: '32px 28px',
              textAlign: 'left',
              background: 'linear-gradient(180deg, #1a1d24, #171a20)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.background = 'linear-gradient(180deg, #2a2d34, #272a30)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,175,55,.25)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#3a3f4a';
              e.currentTarget.style.background = 'linear-gradient(180deg, #1a1d24, #171a20)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.4)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={()=>{
              save(s=>{
                s.axisP2[fam]=e.ax;
                s.phase="BR_INT";
              });
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.1))',
                color: '#d4af37',
                border: '1px solid rgba(212,175,55,0.4)',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 8px rgba(212,175,55,0.1)'
              }}>
                {e.ax === "C" ? "Commit cleanly" : "Keep options open"}
              </div>
            </div>
            <div style={{ 
              fontSize: '16px', 
              color: '#f7f3ea', 
              lineHeight: '1.5',
              fontWeight: '500'
            }}>
              {e.text}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

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
  if (step<4){ label="Quarterfinals"; roundIx=0; idx=step; }
  else if (step<6){ label="Semifinals"; roundIx=1; idx=step-4; }
  else { label="Final"; roundIx=2; idx=0; }
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%', justifyContent: 'center', paddingTop: '140px', overflow: 'hidden' }}>
      <div style={{ fontSize: '10px', color: '#aeb7c7' }}>{label} • Match {idx+1}/{roundIx===0?4:(roundIx===1?2:1)}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
        {[{id:A,face:faceA},{id:B,face:faceB}].map(side => (
          <button key={side.id}
            style={{
              borderRadius: '16px',
              border: '2px solid #3a3f4a',
              padding: '28px',
              textAlign: 'center',
              fontSize: '18px',
              background: 'linear-gradient(180deg, #1a1d24, #171a20)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.background = 'linear-gradient(180deg, #2a2d34, #272a30)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,175,55,.25)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#3a3f4a';
              e.currentTarget.style.background = 'linear-gradient(180deg, #1a1d24, #171a20)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.4)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={()=>{
              save(s=>{
                s.bracket[roundIx][idx] = { winner: side.id, loser: side.id===A?B:A };
                s.brStep += 1;
                if (roundIx===2){
                  s.top2 = [side.id, side.id===A?B:A];
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
            }}
          >
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f7f3ea', textAlign: 'center' }}>{side.face}</div>
            <div style={{ fontSize: '24px', margin: '8px 0', color: '#aeb7c7', textAlign: 'center' }}>↓</div>
            <span style={{ display: 'block', fontSize: '12px', color: '#aeb7c7', marginTop: '8px', textAlign: 'center' }}>{nextTell(side.id)}</span>
          </button>
        ))}
      </div>
      <p style={{ fontSize: '10px', color: '#9fb0c6' }}>Face-only duel, per spec.</p>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflow: 'hidden' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '12px 16px',
        background: 'rgba(212,175,55,0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(212,175,55,0.2)'
      }}>
        <div style={{ fontSize: '14px', color: '#d4af37', fontWeight: '600' }}>
          Phase 3 • {fam} • {state.p3_ix+1}/7
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#aeb7c7',
          background: 'rgba(0,0,0,0.3)',
          padding: '4px 8px',
          borderRadius: '6px'
        }}>
          {Math.round(progress)}%
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', color: '#f7f3ea' }}>{qa.q}</h2>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px', flex: 1, maxWidth: '1024px', margin: '0 auto' }}>
        {pair.map(ax => (
          <button key={ax}
            style={{
              borderRadius: '20px',
              border: '2px solid #3a3f4a',
              padding: '32px 28px',
              textAlign: 'left',
              background: 'linear-gradient(180deg, #1a1d24, #171a20)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.background = 'linear-gradient(180deg, #2a2d34, #272a30)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,175,55,.25)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#3a3f4a';
              e.currentTarget.style.background = 'linear-gradient(180deg, #1a1d24, #171a20)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.4)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
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
          >
            <div style={{ 
              fontSize: '16px', 
              color: '#f7f3ea', 
              lineHeight: '1.5',
              fontWeight: '500'
            }}>
              {qa.a[ax as Axis]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Summary({state}:{state: State}){
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
          onClick={() => window.location.reload()}
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
