import { useState, useEffect } from 'react';
import { backendApi } from '../services/backendApi';

// Mock DB
export const db = { type: 'virtual_db' };

// Mock auth compatible with existing logic
export const auth = {
  currentUser: null as any,
  signOut: () => {
    localStorage.removeItem('gmaa_user');
    localStorage.removeItem('gmaa_profile');
    return Promise.resolve();
  }
};

export function collection(dbInstance: any, path: string) {
  return { type: 'collection_ref', path };
}

export function doc(dbInstance: any, path: string, id?: string) {
  if (id) {
    return { type: 'doc_ref', path: `${path}/${id}`, collection: path, id };
  }
  const parts = path.split('/');
  return { type: 'doc_ref', path, collection: parts[0], id: parts[1] || '' };
}

export function query(ref: any, ...args: any[]) {
  // Support custom subpaths or filter hints
  return ref;
}

export function where(field: string, op: string, val: any) {
  return { type: 'where', field, op, value: val };
}

export function orderBy(field: string, dir: string = 'asc') {
  return { type: 'orderBy', field, dir };
}

export function limit(v: number) {
  return { type: 'limit', value: v };
}

export function serverTimestamp() {
  return new Date().toISOString();
}

export async function addDoc(collectionRef: any, data: any) {
  const path = collectionRef.path;
  
  if (path === 'consultations') {
    const res = await backendApi.submitConsultation(data);
    return { id: res.id || Math.random().toString() };
  }
  if (path === 'tenders') {
    const res = await backendApi.submitTender(data, []);
    return { id: res.id || Math.random().toString() };
  }
  if (path === 'bids') {
    const res = await backendApi.submitBid(data);
    return { id: res.id || Math.random().toString() };
  }
  if (path === 'support_tickets') {
    const res = await backendApi.submitSupportTicket(data);
    return { id: res.id || Math.random().toString() };
  }
  if (path.startsWith('support_tickets/') && path.endsWith('/messages')) {
    const ticketId = path.split('/')[1];
    const res = await backendApi.submitTicketMessage(ticketId, data);
    return { id: res.id || Math.random().toString() };
  }
  if (path === 'support_threads') {
    const res = await backendApi.initiateChat(data);
    return { id: res.id || Math.random().toString() };
  }
  if (path.startsWith('support_threads/') && path.endsWith('/messages')) {
    const chatId = path.split('/')[1];
    const res = await backendApi.submitChatMessage(chatId, data);
    return { id: res.id || Math.random().toString() };
  }
  
  return { id: Math.random().toString() };
}

export async function setDoc(docRef: any, data: any) {
  // Simply mock successful save
  return Promise.resolve();
}

export async function getDoc(docRef: any) {
  const col = docRef.collection;
  const id = docRef.id;
  
  // Return an structure with .exists() and .data()
  return {
    exists: () => true,
    data: () => ({ id, role: 'unknown' })
  };
}

export async function updateDoc(docRef: any, data: any) {
  const id = docRef.id;
  const col = docRef.collection;
  
  if (col === 'bids') {
    const res = await fetch(`/api/bids/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  }
  
  if (col === 'consultations') {
    const res = await fetch(`/api/consultations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  }
  
  if (col === 'support_tickets') {
    const res = await fetch(`/api/support-tickets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  }
  
  return Promise.resolve();
}

export async function deleteDoc(docRef: any) {
  return Promise.resolve();
}

// Mock elements mapping
class MockDoc {
  id: string;
  _data: any;
  constructor(id: string, data: any) {
    this.id = id;
    this._data = data;
  }
  get(field: string) {
    return this._data[field];
  }
  data() {
    return this._data;
  }
}

class MockSnapshot {
  docs: MockDoc[] = [];
  constructor(docs: MockDoc[]) {
    this.docs = docs;
  }
  get empty() {
    return this.docs.length === 0;
  }
  get size() {
    return this.docs.length;
  }
  map(cb: any) {
    return this.docs.map(cb);
  }
}

async function fetchCollectionList(path: string): Promise<any[]> {
  try {
    if (path === 'consultations') {
      return await backendApi.fetchConsultations();
    }
    if (path === 'tenders') {
      return await backendApi.fetchTenders();
    }
    if (path === 'bids') {
      return await backendApi.fetchBids();
    }
    if (path === 'support_tickets') {
      return await backendApi.fetchSupportTickets();
    }
    if (path.startsWith('support_tickets/') && path.endsWith('/messages')) {
      const ticketId = path.split('/')[1];
      return await backendApi.fetchTicketMessages(ticketId);
    }
    if (path === 'support_threads') {
      return await backendApi.fetchChats();
    }
    if (path.startsWith('support_threads/') && path.endsWith('/messages')) {
      const chatId = path.split('/')[1];
      return await backendApi.fetchChatMessages(chatId);
    }
    if (path === 'users' || path === 'users/vendor') {
      return await backendApi.fetchVendors();
    }
  } catch (err) {
    console.warn("Fetch collection failed:", path);
  }
  return [];
}

export function onSnapshot(ref: any, callback: (snapshot: MockSnapshot) => void, errorCallback?: (err: any) => void) {
  if (!ref) return () => {};
  const path = ref.path;
  let active = true;

  const poll = async () => {
    if (!active) return;
    try {
      const list = await fetchCollectionList(path);
      if (!active) return;
      const docs = list.map(item => new MockDoc(item.id || item.uid || Math.random().toString(), item));
      callback(new MockSnapshot(docs));
    } catch (err) {
      if (errorCallback) errorCallback(err);
    }
  };

  poll();
  const interval = setInterval(poll, 3000);

  return () => {
    active = false;
    clearInterval(interval);
  };
}

export function useCollection(ref: any) {
  const [value, setValue] = useState<MockSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!ref) {
      setValue(null);
      setLoading(false);
      return;
    }
    
    let active = true;
    const path = ref.path;
    
    const poll = async () => {
      try {
        const list = await fetchCollectionList(path);
        if (!active) return;
        const docs = list.map(item => new MockDoc(item.id || item.uid || Math.random().toString(), item));
        setValue(new MockSnapshot(docs));
        setLoading(false);
      } catch (err) {
        if (!active) return;
        setError(err);
        setLoading(false);
      }
    };

    poll();
    const interval = setInterval(poll, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [ref?.path]);

  return [value, loading, error] as const;
}

export const signInWithGoogle = () => Promise.resolve({ user: null });
