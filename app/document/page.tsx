"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import TopBar from "@/components/ui/TopBar";
import { Home, Gamepad2, FileText, Mic, CreditCard, User } from "lucide-react";
import { JSX } from "react/jsx-runtime";

export default function DocumentPage(): JSX.Element {

const [notes, setNotes] = useState<string>("Loading notes...");
const [question, setQuestion] = useState<string>("");
const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
const [isTyping, setIsTyping] = useState(false);

/* scroll progress */
const [progress, setProgress] = useState(0);
const notesRef = useRef<HTMLDivElement>(null);

const isDark =
typeof window !== "undefined" &&
document.documentElement.classList.contains("dark");

useEffect(() => {

const fetchNotes = async () => {

try {

const res = await fetch("/api/get-notes");

if (!res.ok) {
setNotes("Generate notes first 📄");
return;
}

const data = await res.json();
setNotes(data.notes || "No notes generated.");

} catch (err) {

console.error("Notes load error:", err);
setNotes("Failed to load notes.");

}

};

fetchNotes();

}, []);

/* scroll progress logic */
const handleScroll = () => {
if (!notesRef.current) return;

const el = notesRef.current;
const percent =
(el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;

setProgress(percent);
};

const askQuestion = async (customQuestion?: string) => {

const q = customQuestion || question;

if (!q.trim()) return;

const userMessage = { role: "user" as const, text: q };
setMessages((prev) => [...prev, userMessage]);
setQuestion("");
setIsTyping(true);

try {

const res = await fetch("/api/chat-with-doc", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ question: q }),
});

const data = await res.json();

setTimeout(() => {

const aiMessage = {
role: "ai" as const,
text: data.answer || "No response."
};

setMessages((prev) => [...prev, aiMessage]);
setIsTyping(false);

}, 900);

} catch (err) {

console.error("Chat error:", err);

setMessages((prev) => [
...prev,
{ role: "ai", text: "Failed to get answer." }
]);

setIsTyping(false);

}

};

return (

<div
style={{
height: "100vh",
display: "flex",
flexDirection: "column",
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
position: "fixed",
top: 0,
left: 0,
width: "300px",
height: "100vh",
background: isDark ? "#1E1E1E" : "white",
zIndex: 999999,
boxShadow: "5px 0 20px rgba(0,0,0,0.15)",
padding: "30px 20px",
color: isDark ? "white" : "#111",
}}
>

<button
onClick={() => setIsMenuOpen(false)}
style={{
position: "absolute",
top: "20px",
right: "20px",
fontSize: "28px",
background: "none",
border: "none",
cursor: "pointer",
color: isDark ? "white" : "black",
}}
>
×
</button>

<div
style={{
display: "flex",
flexDirection: "column",
gap: "6px",
marginTop: "40px",
}}
>

{[
{ href: "/dashboard", label: "Home", icon: <Home size={24} strokeWidth={2.5} color="#ec4899" /> },
{ href: "/arcade", label: "Arcade", icon: <Gamepad2 size={24} strokeWidth={2.5} color="#ec4899" /> },
{ href: "/document", label: "Document", icon: <FileText size={24} strokeWidth={2.5} color="#ec4899" /> },
{ href: "/podcast", label: "Podcast", icon: <Mic size={24} strokeWidth={2.5} color="#ec4899" /> },
{ href: "/flashcards", label: "Flashcards", icon: <CreditCard size={24} strokeWidth={2.5} color="#ec4899" /> },
].map((item, index) => (

<Link
key={index}
href={item.href}
onClick={() => setIsMenuOpen(false)}
style={{
...menuStyle,
color: isDark ? "white" : "#111",
}}
>

{item.icon} {item.label}

</Link>

))}

<hr style={{ margin: "12px 0", borderColor: isDark ? "#2A2A2A" : "#eee" }} />

<Link
href="/mimi"
onClick={() => setIsMenuOpen(false)}
style={{
...menuStyle,
gap: "12px",
display: "flex",
alignItems: "center",
color: isDark ? "white" : "#111",
}}
>

<img src="/mascot.png" style={{ width: "28px" }} />

Mimi

</Link>

<hr style={{ margin: "12px 0", borderColor: isDark ? "#2A2A2A" : "#eee" }} />

<Link
href="/account"
onClick={() => setIsMenuOpen(false)}
style={{
...menuStyle,
color: isDark ? "white" : "#111",
}}
>

<User size={24} strokeWidth={2.5} color="#ec4899" />

Account

</Link>

</div>
</div>

)}

{isMenuOpen && (

<div
onClick={() => setIsMenuOpen(false)}
style={{
position: "fixed",
top: 0,
left: 0,
width: "100vw",
height: "100vh",
background: "rgba(0,0,0,0.4)",
zIndex: 99999,
}}
/>

)}

{/* MAIN CONTENT */}

<div
style={{
display: "flex",
flex: 1,
padding: "30px",
gap: "28px",
overflow: "hidden",
}}
>

{/* NOTES */}

<div style={{ flex: 2, overflow: "hidden" }}>

<div
style={{
background: isDark
? "rgba(40,40,40,0.55)"
: "rgba(255,255,255,0.45)",
backdropFilter: "blur(22px)",
border: "1px solid rgba(255,255,255,0.25)",
borderRadius: "24px",
padding: "40px",
boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
color: isDark ? "white" : "#333",
height: "100%",
display: "flex",
flexDirection: "column"
}}
>



{/* progress bar */}

<div
style={{
height: "10px",
background: "rgba(255,255,255,0.25)",
borderRadius: "20px",
marginBottom: "24px",
overflow: "hidden",
backdropFilter: "blur(6px)"
}}
>

<div
style={{
width: `${progress}%`,
height: "100%",
background: "linear-gradient(90deg,#ec4899,#f472b6,#f9a8d4)",
borderRadius: "20px",
transition: "width 0.25s ease",
boxShadow: "0 0 10px rgba(236,72,153,0.6)"
}}
/>

</div>

<h1
style={{
marginBottom: "25px",
fontSize: "26px",
fontWeight: 600,
opacity: 0.9,
}}
>
📄 Study Notes
</h1>

<div
ref={notesRef}
onScroll={handleScroll}
style={{
whiteSpace: "pre-wrap",
lineHeight: "1.9",
fontSize: "16px",
opacity: 0.9,
overflowY: "auto"
}}
>
{notes}
</div>

</div>
</div>

{/* CHAT */}

<div
style={{
flex: 1,
display: "flex",
flexDirection: "column",
background: isDark
? "rgba(20,20,20,0.55)"
: "rgba(255,255,255,0.35)",
backdropFilter: "blur(24px)",
border: "1px solid rgba(255,255,255,0.25)",
borderRadius: "24px",
overflow: "hidden",
}}
>

<div
style={{
padding: "18px 22px",
borderBottom: "1px solid rgba(255,255,255,0.15)",
fontSize: "15px",
fontWeight: 500,
opacity: 0.7,
}}
>
Chat with Mimi
</div>

<div
style={{
flex: 1,
padding: "20px",
overflowY: "auto",
}}
>

{messages.map((msg, i) => (

<div
key={i}
style={{
marginBottom: "16px",
display: "flex",
justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
gap: "10px",
}}
>

{msg.role === "ai" && (
<img
src="/mascot.png"
style={{
width: "32px",
height: "32px",
borderRadius: "50%",
}}
/>
)}

<div
style={{
maxWidth: "70%",
padding: "12px 16px",
borderRadius: "18px",
background:
msg.role === "user"
? "rgba(220,244,228,0.9)"
: isDark
? "rgba(50,50,50,0.7)"
: "rgba(255,255,255,0.8)",
boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
fontSize: "14px",
}}
>
{msg.text}
</div>

</div>

))}

{/* typing indicator */}

{isTyping && (
<div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
<img src="/mascot.png" style={{ width: "32px", borderRadius: "50%" }} />
<div
style={{
padding: "10px 14px",
borderRadius: "16px",
background: "rgba(255,255,255,0.6)",
fontSize: "13px",
opacity: 0.7
}}
>
Mimi is typing...
</div>
</div>
)}

</div>

{/* input */}

<div
style={{
padding: "16px",
borderTop: "1px solid rgba(255,255,255,0.15)",
}}
>

<input
value={question}
onChange={(e) => setQuestion(e.target.value)}
placeholder="Ask Mimi about your document..."
onKeyDown={(e) => e.key === "Enter" && askQuestion()}
style={{
width: "100%",
padding: "12px",
borderRadius: "12px",
border: "none",
background: isDark
? "rgba(60,60,60,0.7)"
: "rgba(255,255,255,0.7)",
outline: "none",
}}
/>

{/* quick question chips */}

<div style={{ marginTop: "10px", display: "flex", gap: "8px", flexWrap: "wrap" }}>

{["Summarize this", "Key points", "Explain simply"].map((q) => (

<button
key={q}
onClick={() => askQuestion(q)}
style={{
padding: "6px 10px",
borderRadius: "20px",
border: "1px solid rgba(255,255,255,0.3)",
background: "rgba(255,255,255,0.4)",
cursor: "pointer",
fontSize: "12px"
}}
>
{q}
</button>

))}

</div>

</div>

</div>

</div>

</div>

);

}

const menuStyle: React.CSSProperties = {
display: "flex",
alignItems: "center",
gap: "14px",
padding: "16px 18px",
borderRadius: "14px",
textDecoration: "none",
fontWeight: 600,
fontSize: "16px",
transition: "all 0.2s ease",
};