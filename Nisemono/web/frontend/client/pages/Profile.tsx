import { getUser, setUser, clearAll } from "@/lib/storage";
import { useState } from "react";

export default function ProfilePage() {
  const [user, setUserState] = useState(getUser());
  return (
    <div className="min-h-screen bg-white text-foreground">
      <header className="px-6 py-6 flex items-center justify-between">
        <a href="/" className="text-sm text-foreground/60 hover:text-foreground">← Home</a>
        <h1 className="text-xl font-medium">Profile</h1>
        <div />
      </header>
      <main className="container mx-auto px-6 pb-16 max-w-xl space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input value={user.name} onChange={(e)=> setUserState({...user, name: e.target.value})}
            className="w-full rounded-lg border border-foreground/20 bg-white px-3 py-2" />
          <button
            onClick={()=>{ setUser(user); alert("Saved"); }}
            className="mt-3 rounded-lg bg-white px-4 py-2 text-primary ring-1 ring-primary/20 shadow">Save</button>
        </div>
        <div className="pt-4">
          <button onClick={()=>{ clearAll(); alert("Logged out (local data cleared)"); location.href = "/"; }}
            className="rounded-lg bg-white px-4 py-2 text-red-600 ring-1 ring-red-200 shadow">Logout</button>
        </div>
      </main>
    </div>
  );
}
