import { Link } from "react-router-dom";
import { listDocuments } from "@/lib/storage";

function groupByDate(docs: ReturnType<typeof listDocuments>) {
  const groups: Record<string, typeof docs> = {} as any;
  for (const d of docs) {
    const key = new Date(d.uploadedAt).toDateString();
    (groups[key] ||= []).push(d);
  }
  return Object.entries(groups).sort((a,b)=> (new Date(a[0]) < new Date(b[0]) ? 1 : -1));
}

export default function DocumentsPage() {
  const docs = listDocuments();
  const groups = groupByDate(docs);

  const download = (name: string) => {
    const blob = new Blob([`Dummy content for ${name}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      <header className="px-6 py-6 flex items-center justify-between">
        <a href="/" className="text-sm text-foreground/60 hover:text-foreground">← Home</a>
        <h1 className="text-xl font-medium">Documents</h1>
        <div />
      </header>
      <main className="container mx-auto px-6 pb-16 max-w-4xl">
        {groups.length === 0 ? (
          <p className="text-foreground/60">No documents yet.</p>
        ) : (
          <div className="space-y-8">
            {groups.map(([date, items]) => (
              <section key={date}>
                <h2 className="text-sm font-medium text-foreground/70 mb-3">{date}</h2>
                <ul className="bg-[#f3edf7]/40 rounded-xl ring-1 ring-foreground/10 divide-y divide-foreground/10">
                  {items.map((d)=> (
                    <li key={d.id} className="p-4 flex flex-wrap items-center gap-3 justify-between">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{d.name}</p>
                        <p className="text-xs text-foreground/60">{(d.size/1024).toFixed(1)} KB • {new Date(d.uploadedAt).toLocaleTimeString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={()=>download(d.name)} className="rounded-lg bg-white px-3 py-1.5 text-sm ring-1 ring-primary/20 shadow-sm hover:shadow">Download</button>
                        {d.conversationId ? (
                          <Link className="text-sm text-primary underline" to={`/conversation/${d.conversationId}`}>View conversation</Link>
                        ) : (
                          <span className="text-xs text-foreground/50">No conversation</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
