
export const FAMILIES = ["Control","Pace","Truth","Boundary","Recognition","Bonding","Stress"] as const;
export type Family = typeof FAMILIES[number];
export type Axis = "C"|"O"|"F";
export type Face =
  | "Sovereign" | "Rebel"
  | "Navigator" | "Visionary"
  | "Seeker" | "Architect"
  | "Guardian" | "Equalizer"
  | "Spotlight" | "Diplomat"
  | "Partner" | "Provider"
  | "Artisan" | "Catalyst";

export const FACES: Record<Family, readonly Face[]> = {
  Control: ["Sovereign","Rebel"],
  Pace: ["Navigator","Visionary"],
  Truth: ["Seeker","Architect"],
  Boundary: ["Guardian","Equalizer"],
  Recognition: ["Spotlight","Diplomat"],
  Bonding: ["Partner","Provider"],
  Stress: ["Artisan","Catalyst"]
} as const;

// Extracted from HTML engine (ported)
export const DUEL_TELLS: Record<Face, string[]> = {
  Sovereign:["I commit now.","I set the line."],
  Rebel:["I defy the drag.","I reroute fast."],
  Visionary:["I see the arc.","I map outcomes."],
  Navigator:["I stage the work.","I time the path."],
  Equalizer:["I balance load.","I keep parity."],
  Guardian:["I guard the edge.","I enforce scope."],
  Seeker:["I test claims.","I pierce noise."],
  Architect:["I structure parts.","I define schema."],
  Spotlight:["I highlight proof.","I amplify signals."],
  Diplomat:["I align parties.","I broker terms."],
  Partner:["I steady the link.","I co-own risk."],
  Provider:["I fuel the flow.","I keep supply."],
  Catalyst:["I punch through.","I prime action."],
  Artisan:["I tune precision.","I polish output."]
};

export function tellGen(){
  const cur: Record<string, number> = {};
  return (fid: string)=>{
    const name = fid.split("/")[1] as Face;
    const arr = DUEL_TELLS[name] || [];
    if (!arr.length) return "";
    if (!(fid in cur)) cur[fid] = 0;
    const t = arr[cur[fid]];
    cur[fid] = (cur[fid] + 1) % arr.length;
    return t;
  };
}
export const nextTell = tellGen();

export function hashStr(s: string){ let h=0; for(let i=0;i<s.length;i++){ h=((h<<5)-h)+s.charCodeAt(i)|0; } return Math.abs(h); }

function pickDeterministic<T>(arr: readonly T[], seed: string): T{
  if (arr.length===0) throw new Error("empty pick");
  let x = hashStr(seed)||123456789;
  const rnd = ()=>{ x^=x<<13; x^=x>>>17; x^=x<<5; return (x>>>0)/4294967296; };
  const idx = Math.floor(rnd()*arr.length);
  return arr[idx];
}

export type FaceWinners = Partial<Record<Family, string>>; // "Family/Face"
export type AxisMap = Partial<Record<Family, Axis>>;

export function buildEntrantsWithWildcard(faceWinners: FaceWinners, axisP1: AxisMap){
  const winners = FAMILIES.map(f=>faceWinners[f]).filter(Boolean) as string[];
  const tier: Axis[] = ["C","O","F"];
  let famPick: Family | null = null;
  for(const ax of tier){
    const candidates = FAMILIES.filter(f => axisP1[f] === ax && !!faceWinners[f]);
    if (candidates.length){
      famPick = pickDeterministic(candidates, JSON.stringify(faceWinners));
      break;
    }
  }
  if (!famPick){
    const present = FAMILIES.filter(f=>!!faceWinners[f]);
    famPick = present.length ? present[0] : "Control";
  }
  const chosen = faceWinners[famPick]!;
  const [fam, name] = chosen.split("/") as [Family, Face];
  const sib = (FACES[fam] as readonly Face[]).find(n => n !== name) || (FACES[fam] as readonly Face[])[0];
  const wildcard = `${fam}/${sib}`;

  const set = new Set<string>(winners);
  set.add(wildcard);
  if (set.size < 8){
    for (const f of FAMILIES){
      const picked = faceWinners[f];
      if (!picked) continue;
      const [ff] = picked.split("/") as [Family, Face];
      for (const n of FACES[ff]){
        const id = `${ff}/${n}`;
        if (!set.has(id)) set.add(id);
        if (set.size===8) break;
      }
      if (set.size===8) break;
    }
  }
  return Array.from(set);
}

export function seedBracket(faceWinners: FaceWinners, axisP1: AxisMap){
  const entrants = buildEntrantsWithWildcard(faceWinners, axisP1).slice();
  const seedStr = JSON.stringify({ winners: faceWinners, axes: axisP1 });
  let x = hashStr(seedStr)||123456789;
  const rnd = ()=>{ x^=x<<13; x^=x>>>17; x^=x<<5; return (x>>>0)/4294967296; };
  for (let i=entrants.length-1; i>0; i--){
    const j = Math.floor(rnd()*(i+1));
    [entrants[i], entrants[j]] = [entrants[j], entrants[i]];
  }
  const qf = [[entrants[0], entrants[7]], [entrants[3], entrants[4]], [entrants[2], entrants[5]], [entrants[1], entrants[6]]];
  return [qf, [], []];
}
