import { useNavigate } from "react-router-dom";
import { createConversation } from "@/lib/storage";
import { useState } from "react";

export default function NewPage() {
  const [title, setTitle] = useState("");
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-white text-foreground">
      <header className="px-6 py-6 flex items-center justify-between">
        <a href="/" className="text-sm text-foreground/60 hover:text-foreground">← Home</a>
        <h1 className="text-xl font-medium">New Conversation</h1>
        <div />
      </header>
      <main className="container mx-auto px-6 pb-16 max-w-xl">
        <label className="block text-sm mb-2">Title</label>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="e.g. Device setup"
          className="w-full rounded-lg border border-foreground/20 bg-white px-3 py-2" />
        <button
          disabled={!title.trim()}
          onClick={() => { const c = createConversation(title.trim()); nav(`/conversation/${c.id}`); }}
          className="mt-4 rounded-xl bg-white px-5 py-2 text-base font-medium text-primary shadow-md ring-1 ring-primary/20 hover:shadow-lg disabled:opacity-50">
          Create
        </button>
      </main>
    </div>
  );
}
