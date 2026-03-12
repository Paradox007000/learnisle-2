"use client";

import TopBar from "@/components/ui/TopBar";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play, Pause, Home, Gamepad2, FileText, Mic, CreditCard, User } from "lucide-react";

function cleanForSpeech(text: string) {
  return text
    .replace(/\\/g, "")
    .replace(/\*/g, "")
    .replace(/^- /gm, "")
    .replace(/^• /gm, "")
    .replace(/^#+\s/gm, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

export default function PodcastPage() {

  const captionRef = useRef<HTMLDivElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Preparing podcast...");
  const [captions, setCaptions] = useState("");
  const [playing, setPlaying] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const progress = words.length > 0 ? (currentWordIndex / words.length) * 100 : 0;

  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  useEffect(() => {

    const loadPodcast = async () => {

      try {

        setLoading(true);
        setStatus("Preparing podcast...");

        const res = await fetch("/api/get-notes");
        if (!res.ok) throw new Error("No notes");

        const { notes } = await res.json();

        let finalText = notes;

        if (language === "hi") {

          const translateRes = await fetch(
            "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=" +
            encodeURIComponent(notes)
          );

          const data = await translateRes.json();
          finalText = data[0].map((t: any) => t[0]).join("");

        }

        setCaptions(finalText);

        const cleanText = cleanForSpeech(finalText);
        const wordArray = cleanText.split(/\s+/);

        setWords(wordArray);

        const speech = new SpeechSynthesisUtterance(cleanText);

        const loadVoices = () => {

          const voices = speechSynthesis.getVoices();
          let selected;

          if (language === "hi") {
            selected =
              voices.find(v => v.lang.includes("hi")) ||
              voices.find(v => v.name.toLowerCase().includes("hindi"));
          } else {
            selected =
              voices.find(v => v.name.toLowerCase().includes("female")) ||
              voices.find(v => v.lang.includes("en"));
          }

          if (selected) speech.voice = selected;
        };

        loadVoices();
        speechSynthesis.onvoiceschanged = loadVoices;

        speech.rate = 0.95;
        speech.pitch = 1.1;

        speech.onstart = () => {
          setLoading(false);
          setPlaying(true);
          setStatus("Now Playing");
        };

        speech.onboundary = (event) => {

          if (event.name === "word") {

            const spoken = cleanText.substring(0, event.charIndex);
            const index = spoken.split(/\s+/).length - 1;
            setCurrentWordIndex(index);

          }
        };

        speech.onend = () => {

          setPlaying(false);
          setStatus("Podcast Finished");

        };

        utteranceRef.current = speech;

        setTimeout(() => speechSynthesis.speak(speech), 400);

      } catch {

        setStatus("No notes available");
        setLoading(false);

      }
    };

    loadPodcast();

    return () => speechSynthesis.cancel();

  }, [language]);



  const togglePlay = () => {

    if (!utteranceRef.current) return;

    if (playing) {
      speechSynthesis.pause();
      setPlaying(false);
    } else {
      speechSynthesis.resume();
      setPlaying(true);
    }

  };


  useEffect(() => {

    const el = captionRef.current;
    if (!el) return;

    const active = el.querySelector(".activeWord");

    if (active) {

      active.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }

  }, [currentWordIndex]);



  return (

<div
className="page"
style={{
backgroundImage: "url('/bg-4.png')",
backgroundSize: "cover",
backgroundPosition: "center",
}}
>

<TopBar openMenu={() => setIsMenuOpen(true)} />

{/* MENU DRAWER */}

{isMenuOpen && (

<div
style={{
position:"fixed",
top:0,
left:0,
width:"300px",
height:"100vh",
background:isDark ? "#1E1E1E":"white",
zIndex:999999,
boxShadow:"5px 0 20px rgba(0,0,0,0.15)",
padding:"30px 20px",
color:isDark ? "white":"#111"
}}
>

<button
onClick={() => setIsMenuOpen(false)}
style={{
position:"absolute",
top:"20px",
right:"20px",
fontSize:"28px",
background:"none",
border:"none",
cursor:"pointer",
color:isDark ? "white":"black"
}}
>
×
</button>

<div style={{display:"flex",flexDirection:"column",gap:"6px",marginTop:"40px"}}>

{[
{ href:"/dashboard",label:"Home",icon:<Home size={24} strokeWidth={2.5} color="#ec4899"/> },
{ href:"/arcade",label:"Arcade",icon:<Gamepad2 size={24} strokeWidth={2.5} color="#ec4899"/> },
{ href:"/document",label:"Document",icon:<FileText size={24} strokeWidth={2.5} color="#ec4899"/> },
{ href:"/podcast",label:"Podcast",icon:<Mic size={24} strokeWidth={2.5} color="#ec4899"/> },
{ href:"/flashcards",label:"Flashcards",icon:<CreditCard size={24} strokeWidth={2.5} color="#ec4899"/> },
].map((item,index)=>(
<Link key={index} href={item.href} onClick={()=>setIsMenuOpen(false)} style={menuStyle}>
{item.icon} {item.label}
</Link>
))}

<hr style={{margin:"12px 0"}}/>

<Link href="/mimi" onClick={()=>setIsMenuOpen(false)} style={{...menuStyle,gap:"12px"}}>
<img src="/mascot.png" style={{width:"28px"}}/>
Mimi
</Link>

<hr style={{margin:"12px 0"}}/>

<Link href="/account" onClick={()=>setIsMenuOpen(false)} style={menuStyle}>
<User size={24} strokeWidth={2.5} color="#ec4899"/>
Account
</Link>

</div>
</div>

)}

{isMenuOpen && (
<div
onClick={()=>setIsMenuOpen(false)}
style={{
position:"fixed",
top:0,
left:0,
width:"100vw",
height:"100vh",
background:"rgba(0,0,0,0.4)",
zIndex:99999
}}
/>
)}

{/* LANGUAGE PANEL */}

<div className="languagePanel">

<p className="langTitle">Choose Language</p>

<button
onClick={() => setLanguage("en")}
className={language === "en" ? "toggle active" : "toggle"}
>
English
</button>

<button
onClick={() => setLanguage("hi")}
className={language === "hi" ? "toggle active" : "toggle"}
>
हिंदी
</button>

</div>


{/* PLAYER */}

<div className="centerWrap">

<div className="player">

<img src="/mascot.png" className="mascot"/>

<h2 className="status">{status}</h2>

{!loading && (
<>
<div className="waveWrap">
{Array.from({length:30}).map((_,i)=>(
<span
key={i}
className={playing?"waveBar active":"waveBar"}
style={{animationDelay:`${i*0.05}s`}}
/>
))}
</div>

<div className="progressBar">
<div className="progressFill" style={{width:`${progress}%`}}/>
</div>

<button className="playButton" onClick={togglePlay}>
{playing ? <Pause size={26}/> : <Play size={26}/>}
</button>
</>
)}

<div ref={captionRef} className="captions">
{words.map((word,i)=>(
<span key={i} className={i===currentWordIndex?"activeWord":""}>
{word}{" "}
</span>
))}
</div>

</div>

</div>

<style jsx>{`

.page{
min-height:100vh;
}

.languagePanel{
position:fixed;
right:30px;
top:120px;
display:flex;
flex-direction:column;
gap:8px;
padding:16px;
border-radius:20px;
background:rgba(255,255,255,0.55);
backdrop-filter:blur(14px);
box-shadow:0 10px 30px rgba(0,0,0,0.08);
}

.langTitle{
font-size:12px;
font-weight:600;
opacity:0.7;
margin-bottom:4px;
}

.toggle{
border:none;
padding:8px 14px;
border-radius:999px;
font-weight:600;
cursor:pointer;
background:rgba(255,255,255,0.7);
}

.toggle.active{
background:linear-gradient(135deg,#ff7aa8,#ff4f91);
color:white;
}

.centerWrap{
display:flex;
justify-content:center;
align-items:center;
padding:60px 20px;
}

.player{
width:900px;
padding:70px;
border-radius:40px;
backdrop-filter:blur(30px);
background:rgba(255,255,255,0.45);
box-shadow:0 40px 120px rgba(255,105,160,0.15);
display:flex;
flex-direction:column;
align-items:center;
gap:28px;
}

.mascot{
width:140px;
}

.waveWrap{
display:flex;
align-items:flex-end;
gap:4px;
height:40px;
}

.waveBar{
width:4px;
height:8px;
background:linear-gradient(180deg,#ff7aa8,#ff4f91);
border-radius:4px;
opacity:0.6;
}

.waveBar.active{
animation:wave 1s infinite ease-in-out;
}

@keyframes wave{
0%{height:8px}
25%{height:28px}
50%{height:14px}
75%{height:34px}
100%{height:10px}
}

.progressBar{
width:60%;
height:8px;
background:rgba(255,255,255,0.6);
border-radius:20px;
overflow:hidden;
}

.progressFill{
height:100%;
background:linear-gradient(90deg,#ff7aa8,#ff4f91);
}

.playButton{
width:75px;
height:75px;
border-radius:50%;
border:none;
background:linear-gradient(135deg,#ff7aa8,#ff4f91);
color:white;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
}

.captions{
width:100%;
height:260px;
overflow-y:auto;
padding:24px;
border-radius:20px;
line-height:1.9;
background:rgba(255,255,255,0.6);
}

.activeWord{
background:#ff7aa8;
color:white;
padding:4px 8px;
border-radius:8px;
}

`}</style>

</div>

);

}

const menuStyle: React.CSSProperties = {
display:"flex",
alignItems:"center",
gap:"14px",
padding:"16px 18px",
borderRadius:"14px",
textDecoration:"none",
fontWeight:600,
fontSize:"16px",
transition:"all 0.2s ease",
};