"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Home, Gamepad2, FileText, Mic, CreditCard, User, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations";

export default function Dashboard() {

const router = useRouter();
const { language } = useLanguage();
const t = translations[language];

const [isMenuOpen, setIsMenuOpen] = useState(false);

const [files, setFiles] = useState([
{ id: 1, name: "UML, Data Modeling, and V-Model Testing", type: "pdf", lastOpened: "1 day ago" },
{ id: 2, name: "Java Basic Syntax and Constructs", type: "pdf", lastOpened: "3 days ago" },
{ id: 3, name: "Java Programming Concepts and Examples", type: "docx", lastOpened: "7 days ago" },
]);

const [dragOver, setDragOver] = useState(false);
const { theme, setTheme } = useTheme();
const isDark = theme === "dark";
const [mounted, setMounted] = useState(false);

useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
if (!currentUser) router.push("/login");
});
return () => unsubscribe();
}, [router]);

useEffect(() => setMounted(true), []);

const handleFileUpload = async (
e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>
) => {

e.preventDefault();
let file: File | null = null;

if ("dataTransfer" in e) file = e.dataTransfer.files[0];
else file = e.target.files?.[0] || null;

if (!file) return;

setDragOver(false);

const newFile = {
id: Date.now(),
name: file.name,
type: file.name.split(".").pop()?.toLowerCase() || "unknown",
lastOpened: "Just now",
};

setFiles((prev) => [newFile, ...prev]);

const formData = new FormData();
formData.append("pdf", file);

try {

const res = await fetch("/api/process-pdf", {
method: "POST",
body: formData,
});

const data = await res.json();

if (data.success && data.documentId) {
localStorage.setItem("latestDoc", data.documentId);
window.dispatchEvent(new Event("flashcardsUpdated"));
}

} catch (err) {
console.error("Upload failed:", err);
}

};

const getFileIcon = (type: string) => {
switch (type) {
case "pdf": return "📄";
case "doc":
case "docx": return "📝";
default: return "📎";
}
};

const menuStyle: React.CSSProperties = {
display: "flex",
alignItems: "center",
gap: "14px",
padding: "16px 18px",
borderRadius: "14px",
textDecoration: "none",
color: "#111",
fontWeight: 600,
fontSize: "16px",
transition: "all 0.2s ease",
};

return (

<>

<div
className="min-h-screen pt-24 px-8 transition-colors duration-300 relative overflow-hidden"
style={{
backgroundImage: theme === "dark"
? "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 50%, #3a3a3a 100%)"
: "url('/bg-3.jpg')",
backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
}}
><div
className="absolute inset-0 backdrop-blur-md -z-10"
style={{
background: isDark
? "rgba(0,0,0,0.45)"
: "rgba(43,28,18,0.35)"
}}
></div><header className="fixed top-0 left-0 right-0 h-20 bg-white/70 dark:bg-[#1E1E1E]/70 backdrop-blur-lg shadow-md flex items-center px-6 z-50 transition-colors duration-300"><div className="w-full flex items-center justify-between"><div className="flex items-center gap-4"><button onClick={() => setIsMenuOpen(true)} className="text-2xl dark:text-white">
☰
</button>

<img src="/logo.png" alt="Logo" className="h-24 w-auto object-contain" /></div><div className="flex items-center gap-4"><Link href="/account">
<Image src="/profile.png" alt="Profile" width={40} height={40} />
</Link>{mounted && (

<div
onClick={() => setTheme(isDark ? "light" : "dark")}
style={{
width: "62px",
height: "32px",
backgroundColor: isDark ? "#1f2937" : "#fce7f3",
borderRadius: "999px",
display: "flex",
alignItems: "center",
padding: "4px",
cursor: "pointer",
transition: "all 0.3s ease",
}}
><div
style={{
width: "24px",
height: "24px",
backgroundColor: "#ffffff",
borderRadius: "50%",
transform: isDark ? "translateX(30px)" : "translateX(0px)",
transition: "transform 0.3s ease",
boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
display: "flex",
alignItems: "center",
justifyContent: "center",
}}
>{isDark
? <Moon size={14} color="#111827"/>
: <Sun size={14} color="#ec4899"/>}

</div>
</div>)}

</div>
</div>
</header><div className="mb-10"><h1 className="text-3xl font-semibold text-gray-800 dark:text-white">
{t.dashboardTitle}
</h1><p className="text-gray-500 dark:text-gray-400 mt-1">
{t.dashboardSubtitle}
</p></div>{/* FEATURE BOXES */}

{/* MENU DRAWER */}
{isMenuOpen && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "300px",
      height: "100vh",
      background: isDark
        ? "linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 50%, #3a3a3a 100%)"
        : "white",
      color: isDark ? "#ffffff" : "#111111",
      zIndex: 999999,
      boxShadow: "5px 0 20px rgba(0,0,0,0.15)",
      padding: "30px 20px",
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
        color: isDark ? "#ffffff" : "#111111",
      }}
    >
      ×
    </button>

    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "40px" }}>
      
      <Link href="/" style={{ ...menuStyle, color: isDark ? "#fff" : "#111" }} onClick={() => setIsMenuOpen(false)}>
        <Home size={24} strokeWidth={2.5} color="#ec4899" /> {t.home}
      </Link>

      <Link href="/arcade" style={{ ...menuStyle, color: isDark ? "#fff" : "#111" }} onClick={() => setIsMenuOpen(false)}>
        <Gamepad2 size={24} strokeWidth={2.5} color="#ec4899" /> {t.arcade}
      </Link>

      <Link href="/document" style={{ ...menuStyle, color: isDark ? "#fff" : "#111" }} onClick={() => setIsMenuOpen(false)}>
        <FileText size={24} strokeWidth={2.5} color="#ec4899" /> {t.document}
      </Link>

      <Link href="/podcast" style={{ ...menuStyle, color: isDark ? "#fff" : "#111" }} onClick={() => setIsMenuOpen(false)}>
        <Mic size={24} strokeWidth={2.5} color="#ec4899" /> {t.podcast}
      </Link>

      <Link href="/flashcards" style={{ ...menuStyle, color: isDark ? "#fff" : "#111" }} onClick={() => setIsMenuOpen(false)}>
        <CreditCard size={24} strokeWidth={2.5} color="#ec4899" /> {t.flashcards}
      </Link>

      <hr style={{ margin: "12px 0", borderColor: isDark ? "#374151" : "#eee" }} />

      <Link href="/account" style={{ ...menuStyle, color: isDark ? "#fff" : "#111" }} onClick={() => setIsMenuOpen(false)}>
        <User size={24} strokeWidth={2.5} color="#ec4899" /> {t.account}
      </Link>

    </div>
  </div>
)}

{/* OVERLAY */}
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

<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"><Link href="/document">
<div className="premiumCard">
<div className="cardIcon bg-blue-100">
<Image src="/mimi-doc.png" alt="Document" width={45} height={45}/>
</div>
<div>
<h3>{t.summarize}</h3>
<p>{t.uploadSmart}</p>
</div>
</div>
</Link><Link href="/flashcards">
<div className="premiumCard">
<div className="cardIcon bg-blue-100">
<Image src="/mimi-flash.png" alt="Flashcards" width={60} height={60}/>
</div>
<div>
<h3>{t.generateFlashcards}</h3>
<p>{t.revisionCards}</p>
</div>
</div>
</Link><Link href="/podcast">
<div className="premiumCard">
<div className="cardIcon bg-blue-100">
<Image src="/mimi-pod.png" alt="Podcast" width={45} height={45}/>
</div>
<div>
<h3>{t.aiPodcast}</h3>
<p>{t.turnNotes}</p>
</div>
</div>
</Link><Link href="/arcade">
<div className="premiumCard">
<div className="cardIcon bg-indigo-100">
<Image src="/mimi-arc.png" alt="Arcade" width={50} height={50}/>
</div>
<div>
<h3>{t.arcade}</h3>
<p>{t.playGames}</p>
</div>
</div>
</Link></div><div className="flex justify-center mb-12"><div
className={`uploadBox ${dragOver ? "dragActive" : ""}`}
onDragOver={(e)=>{e.preventDefault();setDragOver(true)}}
onDragLeave={()=>setDragOver(false)}
onDrop={handleFileUpload}
onClick={()=>document.getElementById("file-upload")?.click()}
><input
id="file-upload"
type="file"
onChange={handleFileUpload}
style={{display:"none"}}
accept=".pdf,.doc,.docx"
/>

<div className="text-4xl mb-3"></div><p className="text-lg font-semibold">
{t.dropYourPDFFHere}
</p></div></div><h2 className="text-lg font-semibold mb-4 dark:text-white">
{t.myFiles}
</h2><div className="space-y-4">{files.map((file)=>(

<div key={file.id} className="fileRow">
    <div className="flex items-center gap-4"><div className="docIcon">
<Image src="/doc.png" alt="doc" width={22} height={22}/>
</div><div>
<h4 className="font-medium dark:text-white">
{file.name}
</h4>
<p className="text-sm text-gray-500 dark:text-gray-400">
{file.lastOpened}
</p>
</div></div><span className="text-xl text-gray-400 cursor-pointer">
⋮
</span></div>
))}</div><style jsx>{`

.premiumCard{
display:flex;
align-items:center;
gap:18px;
padding:24px;
border-radius:20px;
background:rgba(255,255,255,0.65);
backdrop-filter:blur(12px);
border:1px solid rgba(255,255,255,0.3);
box-shadow:0 6px 20px rgba(0,0,0,0.06);
transition:all .3s ease;
cursor:pointer;
}

.premiumCard:hover{
transform:translateY(-5px);
box-shadow:0 12px 30px rgba(0,0,0,0.08);
}

:global(.dark) .premiumCard{
background:rgba(42,42,42,0.7);
}

.cardIcon{
width:48px;
height:48px;
border-radius:14px;
display:flex;
align-items:center;
justify-content:center;
font-size:20px;
}

.cardIcon img{
object-fit:contain;
}

.uploadBox{
width:65%;
max-width:750px;
border:2px dashed #ccc;
border-radius:20px;
padding:50px;
text-align:center;
background:rgba(255,255,255,0.65);
backdrop-filter:blur(12px);
cursor:pointer;
transition:all .3s ease;
}

:global(.dark) .uploadBox{
background:rgba(42,42,42,0.7);
border-color:#444;
color:#fff;
}

.dragActive{
border-color:#6366f1;
background:rgba(243,244,255,0.6);
}

.fileRow{
display:flex;
justify-content:space-between;
align-items:center;
padding:20px;
border-radius:18px;
background:rgba(255,255,255,0.65);
backdrop-filter:blur(12px);
box-shadow:0 4px 15px rgba(0,0,0,0.05);
transition:all .3s ease;
}

.fileRow:hover{
transform:translateY(-3px);
box-shadow:0 10px 25px rgba(0,0,0,0.08);
}

:global(.dark) .fileRow{
background:rgba(42,42,42,0.7);
}

.docIcon{
width:42px;
height:42px;
border-radius:12px;
background:#FFE8F3;
color:white;
display:flex;
align-items:center;
justify-content:center;
}

`}</style></div>
</>
);}