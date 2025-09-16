import { Link } from "react-router-dom";
import { listConversations } from "@/lib/storage";

export default function HistoryPage() {
  const conversations = listConversations().sort((a,b)=> (a.createdAt < b.createdAt ? 1 : -1));
  return (
    <div className="min-h-screen bg-white text-foreground">
      <header className="px-6 py-6 flex items-center justify-between">
        <a href="/" className="text-sm text-foreground/60 hover:text-foreground">← Home</a>
        <h1 className="text-xl font-medium">History</h1>
        <div />
      </header>
      <main className="container mx-auto px-6 pb-16 max-w-3xl">
        {conversations.length === 0 ? (
          <p className="text-foreground/60">No conversations yet.</p>
        ) : (
          <ul className="divide-y divide-foreground/10 bg-[#f3edf7]/40 rounded-xl ring-1 ring-foreground/10">
            {conversations.map((c)=> (
              <li key={c.id} className="p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-medium">{c.title}</h2>
                  <p className="text-xs text-foreground/60">{new Date(c.createdAt).toLocaleString()}</p>
                </div>
                <Link className="text-primary underline" to={`/conversation/${c.id}`}>Open</Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
