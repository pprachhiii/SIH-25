export type Conversation = {
  id: string;
  title: string;
  createdAt: string; // ISO
  messages: { id: string; text: string; at: string }[];
};

export type Doc = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string; // ISO
  conversationId: string | null;
};

const CONV_KEY = "app.conversations.v1";
const DOC_KEY = "app.documents.v1";
const USER_KEY = "app.user.v1";

export type User = { id: string; name: string };

const uid = () => Math.random().toString(36).slice(2, 10);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUser(): User {
  return read<User>(USER_KEY, { id: "u1", name: "User" });
}
export function setUser(u: User) {
  write(USER_KEY, u);
}

export function listConversations(): Conversation[] {
  return read<Conversation[]>(CONV_KEY, []);
}
export function saveConversations(list: Conversation[]) {
  write(CONV_KEY, list);
}
export function createConversation(title: string): Conversation {
  const list = listConversations();
  const c: Conversation = { id: uid(), title, createdAt: new Date().toISOString(), messages: [] };
  list.unshift(c);
  saveConversations(list);
  return c;
}
export function addMessage(conversationId: string, text: string) {
  const list = listConversations();
  const c = list.find((x) => x.id === conversationId);
  if (!c) return;
  c.messages.push({ id: uid(), text, at: new Date().toISOString() });
  saveConversations(list);
}
export function getConversation(id: string): Conversation | undefined {
  return listConversations().find((c) => c.id === id);
}

export function listDocuments(): Doc[] {
  return read<Doc[]>(DOC_KEY, []);
}
export function saveDocuments(list: Doc[]) {
  write(DOC_KEY, list);
}
export function addDocument(name: string, size: number, conversationId: string | null = null): Doc {
  const list = listDocuments();
  const d: Doc = { id: uid(), name, size, uploadedAt: new Date().toISOString(), conversationId };
  list.unshift(d);
  saveDocuments(list);
  return d;
}

export function removeConversation(id: string) {
  const all = listConversations().filter((c) => c.id !== id);
  saveConversations(all);
}

export function removeDocument(id: string) {
  const all = listDocuments().filter((d) => d.id !== id);
  saveDocuments(all);
}

export function clearAll() {
  localStorage.removeItem(CONV_KEY);
  localStorage.removeItem(DOC_KEY);
}
