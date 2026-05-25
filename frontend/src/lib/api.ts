const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  async createAssignment(data: any) {
    const res = await fetch(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create assignment');
    }
    return res.json();
  },

  async getAssignments(search?: string) {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    const res = await fetch(`${API_BASE}/assignments?${params}`);
    if (!res.ok) throw new Error('Failed to fetch assignments');
    return res.json();
  },

  async getAssignment(id: string) {
    const res = await fetch(`${API_BASE}/assignments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch assignment');
    return res.json();
  },

  async deleteAssignment(id: string) {
    const res = await fetch(`${API_BASE}/assignments/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete assignment');
    return res.json();
  },

  async regenerateAssignment(id: string) {
    const res = await fetch(`${API_BASE}/assignments/${id}/regenerate`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to regenerate');
    return res.json();
  },

  async renameAssignment(id: string, title: string) {
    const res = await fetch(`${API_BASE}/assignments/${id}/rename`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error('Failed to rename assignment');
    return res.json();
  },
};

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws';
