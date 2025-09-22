
export const FAMILIES = ["Control","Pace","Truth","Boundary","Recognition","Bonding","Stress"] as const;
export type Family = typeof FAMILIES[number];
export type Axis = "C"|"O"|"F";

export type P2AEntry = {
  q: string;
  a: Record<"C" | "O", string>;
};

export type P2AQA = Record<Family, P2AEntry>;

// Exact copy from HTML engine
export const P2A_QA: P2AQA = {"Truth": {"q": "You hear a rumor about a friend that sounds completely out of character. How do you react?", "a": {"C": "You go directly to your friend to hear their side of the story.", "O": "You ask other people if they've also heard the rumor to see if it's true."}}, "Pace": {"q": "Your road trip is falling behind the agreed-upon schedule. How do you respond?", "a": {"C": "You suggest a new, more realistic schedule that everyone can agree on.", "O": "You try to rush through the next few stops to make up for lost time."}}, "Boundary": {"q": "A draining relative wants to stay with you for a full week, but you're already feeling overwhelmed. What's your answer?", "a": {"C": "You say \"no\" kindly but firmly, explaining that it's not a good time for you.", "O": "You suggest a shorter stay, like just for the weekend, as a compromise."}}, "Recognition": {"q": "You gave a thoughtful gift, but their reaction was muted and they quickly set it aside. How do you feel?", "a": {"C": "You let it go, trusting that your good intention is what matters.", "O": "You ask them later if they liked the gift, trying to get a clearer signal."}}, "Bonding": {"q": "A friend needs your help moving on your only day off. What do you do?", "a": {"C": "You offer to help for a few hours, setting a clear limit on your time.", "O": "You agree to help all day, even though you know you'll be exhausted."}}, "Stress": {"q": "You just ruined a key ingredient while cooking dinner. What is your next move?", "a": {"C": "You calmly assess what's left and skillfully adapt the recipe.", "O": "You try to patch the mistake, hoping no one will notice the difference in taste."}}, "Control": {"q": "The assembly instructions for a new piece of furniture are wrong. What now?", "a": {"C": "You ignore them and figure it out yourself using common sense.", "O": "You find a video tutorial online to see how someone else did it."}}} as const;
