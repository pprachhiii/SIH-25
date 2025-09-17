import { useCallback, useRef, useState } from "react";
import { addDocument, createConversation, addMessage, getUser, setUser, clearAll, removeConversation, removeDocument } from "@/lib/storage";
import { FileText, HelpCircle, History, Mail, Menu, Plus, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DroppedFile {
  name: string;
  size: number;
}

type NavKey = "history" | "documents" | "profile";

export default function Index() {
  const [hovering, setHovering] = useState(false);
  const nav = useNavigate();
  const [convId, setConvId] = useState<string | null>(null);
  const [docId, setDocId] = useState<string | null>(null);
  const [followup, setFollowup] = useState("");
  const [user, setUserState] = useState(getUser());
  const [verifying, setVerifying] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  const handleNew = () => {
    setFile(null);
    setConvId(null);
    setDocId(null);
    setFollowup("");
    setHovering(false);
    nav("/");
  };
  const [file, setFile] = useState<DroppedFile | null>(null);
  const [active, setActive] = useState<NavKey>("history");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    setFile({ name: f.name, size: f.size });
    const conv = createConversation(f.name);
    setConvId(conv.id);
    const d = addDocument(f.name, f.size, conv.id);
    setDocId(d.id);

    setVerifying(true);
    try {
      const text = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(typeof r.result === "string" ? r.result : "");
        r.readAsText(f);
      });

      const payload = text ? { fileName: f.name, text } : { fileName: f.name };
      const res = await fetch("/api/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await res.json()) as { summary: string; details: string[] };
      setSummary(data.summary);
      setMessages([{ role: "assistant", content: data.summary }]);
      addMessage(conv.id, data.summary);
    } catch (e) {
      setSummary("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHovering(false);
    onFiles(e.dataTransfer.files);
  }, [onFiles]);

  const openFilePicker = () => inputRef.current?.click();

  const pillClass =
    "rounded-full p-2 shadow-sm ring-1 ring-primary/10 transition-colors";

  return (
    <div className="min-h-screen bg-white text-foreground relative overflow-hidden">
      {/* Brand */}
      <header className="absolute left-6 top-6">
        <img
          src={"/assets/Logo%20dark%20(2470x726).png"}
          alt="Logo"
          style={{ height: 40, width: "auto" }}
        />
      </header>

      {/* Left floating toolbar */}
      <aside className="fixed left-4 top-1/2 -translate-y-1/2 select-none">
        <div className="flex flex-col items-center gap-3 rounded-full bg-[#f3edf7] px-2 py-3 shadow-sm ring-1 ring-primary/10">
          <button aria-label="Menu" onClick={() => nav('/')} className={`${pillClass} bg-white hover:bg-primary/10`}>
            <Menu className="h-4 w-4 text-foreground/70" />
          </button>
          <button aria-label="New" onClick={handleNew} className={`${pillClass} bg-[#ffd8e4] hover:brightness-95`}>
            <Plus className="h-4 w-4 text-foreground/70" />
          </button>
          <div className="flex flex-col items-center gap-3 pt-1">
            <div className="flex flex-col items-center text-[10px] leading-tight text-foreground/60">
              <button
                onClick={() => { setActive("history"); nav('/history'); }}
                className={`${pillClass} ${active === "history" ? "bg-[#e8def8]" : "bg-white hover:bg-primary/10"}`}
                aria-label="History"
              >
                <History className="h-4 w-4 text-foreground/70" />
              </button>
              <span className="mt-1">History</span>
            </div>
            <div className="flex flex-col items-center text-[10px] leading-tight text-foreground/60">
              <button
                onClick={() => { setActive("documents"); nav('/documents'); }}
                className={`${pillClass} ${active === "documents" ? "bg-[#e8def8]" : "bg-white hover:bg-primary/10"}`}
                aria-label="Documents"
              >
                <FileText className="h-4 w-4 text-foreground/70" />
              </button>
              <span className="mt-1">Documents.</span>
            </div>
            <div className="flex flex-col items-center text-[10px] leading-tight text-foreground/60">
              <button
                onClick={() => { setActive("profile"); }}
                className={`${pillClass} ${active === "profile" ? "bg-[#e8def8]" : "bg-white hover:bg-primary/10"}`}
                aria-label="Profile"
              >
                <User className="h-4 w-4 text-foreground/70" />
              </button>
              <span className="mt-1">Profile</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Right help widget */}
      <aside className="fixed right-4 bottom-8 select-none">
        <div className="flex flex-col items-center gap-3 rounded-full bg-[#f3edf7] px-2 py-3 shadow-sm ring-1 ring-primary/10">
          <button aria-label="FAQ" onClick={()=> nav('/support')} className={`${pillClass} bg-white hover:bg-primary/10`}>
            <Menu className="h-4 w-4 text-foreground/70" />
          </button>
          <div className="flex flex-col items-center text-[10px] leading-tight text-foreground/60">
            <button onClick={()=> nav('/support')} className={`${pillClass} bg-white hover:bg-primary/10`} aria-label="FAQ">
              <HelpCircle className="h-4 w-4 text-foreground/70" />
            </button>
            <span className="mt-1">FAQ</span>
          </div>
          <div className="flex flex-col items-center text-[10px] leading-tight text-foreground/60">
            <button onClick={()=> nav('/support')} className={`${pillClass} bg-white hover:bg-primary/10`} aria-label="Contact">
              <Mail className="h-4 w-4 text-foreground/70" />
            </button>
            <span className="mt-1">Contact</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="container mx-auto px-4 pt-28 pb-20">
        <section className="mx-auto max-w-4xl">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setHovering(true);
            }}
            onDragLeave={() => setHovering(false)}
            onDrop={onDrop}
            className={
              "relative grid place-items-center h-[452px] rounded-md border-2 border-dashed transition-colors " +
              (hovering ? "bg-primary/10 border-primary/40" : "bg-[#f3edf7]/25 border-foreground/20")
            }
          >
            {file && (
              <button
                aria-label="Remove selected file"
                onClick={() => {
                  if (convId) removeConversation(convId);
                  if (docId) removeDocument(docId);
                  setFile(null);
                  setConvId(null);
                  setDocId(null);
                  setFollowup("");
                  setSummary(null);
                  setMessages([]);
                }}
                className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-foreground/70 ring-1 ring-foreground/10 shadow hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
            {!file ? (
              <p className="text-sm text-foreground/60">Drag and drop to upload</p>
            ) : verifying ? (
              <p className="text-sm text-foreground/80">Analyzing…</p>
            ) : (
              <div className="text-center">
                <p className="text-sm text-foreground/80">Selected:</p>
                <p className="mt-1 text-base font-medium text-foreground">{file.name}</p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={openFilePicker}
              className="mt-10 rounded-xl bg-white px-6 py-3 text-base font-medium text-primary shadow-md ring-1 ring-primary/20 hover:shadow-lg active:shadow-sm transition-shadow"
            >
              Upload from Device
            </button>
          </div>

          {file && (
            <>
              {summary && (
                <div className="mx-auto mt-8 max-w-3xl rounded-xl bg-white p-4 shadow-sm ring-1 ring-foreground/10">
                  <h3 className="text-sm font-medium mb-2">Verification Result</h3>
                  <p className="text-sm whitespace-pre-wrap">{summary}</p>
                </div>
              )}
              <div className="mx-auto mt-6 flex max-w-2xl items-center gap-2">
                <input
                  value={followup}
                  onChange={(e)=> setFollowup(e.target.value)}
                  placeholder="Ask a follow‑up question"
                  className="flex-1 rounded-lg border border-foreground/20 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={async ()=>{
                    if(!followup.trim() || !convId) return;
                    const q = followup.trim();
                    setFollowup("");
                    addMessage(convId, q);
                    setMessages((m)=> [...m, { role: "user", content: q }]);
                    const res = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, context: { lastSummary: summary ?? undefined, messages } }) });
                    const data = (await res.json()) as { answer: string };
                    addMessage(convId, data.answer);
                    setMessages((m)=> [...m, { role: "assistant", content: data.answer }]);
                  }}
                  className="rounded-lg bg-white px-4 py-2 text-primary ring-1 ring-primary/20 shadow-sm hover:shadow"
                >
                  Ask
                </button>
              </div>
              {messages.length > 1 && (
                <div className="mx-auto mt-4 max-w-3xl space-y-2">
                  {messages.map((m, i)=> (
                    <div key={i} className={`rounded-lg px-3 py-2 text-sm ${m.role === 'user' ? 'bg-[#e8def8]' : 'bg-[#f3edf7]/60'}`}>
                      {m.content}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      {/* Inline Profile panel */}
      {active === "profile" && (
        <div className="fixed left-24 top-1/2 -translate-y-1/2 z-50 w-64 rounded-xl bg-white p-4 shadow-lg ring-1 ring-foreground/10">
          <h3 className="text-sm font-medium mb-2">Profile</h3>
          <label className="block text-xs mb-1">Name</label>
          <input
            value={user.name}
            onChange={(e)=> setUserState({ ...user, name: e.target.value })}
            className="w-full rounded-lg border border-foreground/20 bg-white px-3 py-2 mb-2"
          />
          <div className="flex items-center justify-between">
            <button
              onClick={()=>{ setUser(user); }}
              className="rounded-lg bg-white px-3 py-1.5 text-primary ring-1 ring-primary/20 shadow-sm"
            >
              Save
            </button>
            <button
              onClick={()=>{ clearAll(); nav('/login'); }}
              className="rounded-lg bg-white px-3 py-1.5 text-red-600 ring-1 ring-red-200 shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
