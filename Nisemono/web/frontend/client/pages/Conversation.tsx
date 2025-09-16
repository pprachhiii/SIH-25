import { useParams } from "react-router-dom";
import { addMessage, getConversation } from "@/lib/storage";
import { useMemo, useState } from "react";

export default function ConversationPage() {
  const { id } = useParams();
  const conv = useMemo(() => (id ? getConversation(id) : undefined), [id]);
  const [text, setText] = useState("");
  if (!conv) return <div className="min-h-screen grid place-items-center">Conversation not found.</div>;
  return (
    <div className="min-h-screen bg-white text-foreground">
      <header className="px-6 py-6 flex items-center justify-between">
        <a href="/history" className="text-sm text-foreground/60 hover:text-foreground">← Back to History</a>
        <h1 className="text-xl font-medium truncate">{conv.title}</h1>
        <div />
      </header>
      <main className="container mx-auto px-6 pb-24 max-w-3xl">
        <ul className="space-y-3">
          {conv.messages.length === 0 ? (
            <li className="text-foreground/60">No messages yet.</li>
          ) : (
            conv.messages.map((m) => (
              <li key={m.id} className="rounded-lg bg-[#f3edf7]/40 px-3 py-2">
                <p className="text-sm">{m.text}</p>
                <p className="text-[10px] text-foreground/50">{new Date(m.at).toLocaleString()}</p>
              </li>
            ))
          )}
        </ul>
        <div className="fixed bottom-6 inset-x-0 mx-auto max-w-3xl px-6">
          <div className="flex gap-2 bg-white rounded-xl ring-1 ring-foreground/10 shadow-lg p-2">
            <input value={text} onChange={(e)=>setText(e.target.value)}
              placeholder="Type a message"
              className="flex-1 bg-transparent outline-none px-2" />
            <button
              onClick={()=>{ if(!text.trim()) return; addMessage(conv.id, text.trim()); setText(""); location.reload(); }}
              className="rounded-lg bg-white px-3 py-1.5 text-primary ring-1 ring-primary/20 shadow-sm">
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
