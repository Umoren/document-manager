import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ApiCategory, ApiDocument, ApiComment, Document } from '@/types';

const BASE_URL = 'http://localhost:3001';

// Helper to add user-id header
const headers = (userId: string) => ({
  'user-id': userId,
  'Content-Type': 'application/json'
});

// Categories
export async function fetchCategories(userId: string): Promise<ApiCategory[]> {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    headers: headers(userId)
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function fetchCategoryDocuments(categoryId: string, userId: string): Promise<Document[]> {
  console.log('Fetching documents for:', categoryId, userId);
  const res = await fetch(`http://localhost:3001/api/categories/${categoryId}/documents`, {
    headers: {
      'user-id': userId
    }
  });

  if (!res.ok) {
    const error = await res.json();
    console.error('Fetch error:', error);
    throw new Error(error.message || 'Failed to fetch documents');
  }

  const data = await res.json();
  console.log('Fetch response:', data);
  return data;
}


export async function assignCategoryMember(
  categoryId: string,
  userId: string,
  adminId: string,
  role: string
): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/api/categories/${categoryId}/members`, {
    method: 'POST',
    headers: headers(adminId),
    body: JSON.stringify({ userId, role })
  });
  if (!res.ok) throw new Error('Failed to assign role');
  return res.json();
}

// Documents
export async function fetchDocument(documentId: string, userId: string): Promise<Document> {
  const res = await fetch(`${BASE_URL}/api/documents/${documentId}`, {
    headers: headers(userId)
  });
  if (!res.ok) throw new Error('Failed to fetch document');
  return res.json();
}

export async function updateDocument(
  documentId: string,
  updates: Partial<Document>,
  userId: string
): Promise<Document> {
  const res = await fetch(`${BASE_URL}/api/documents/${documentId}`, {
    method: 'PUT',
    headers: headers(userId),
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update document');
  return res.json();
}

export async function deleteDocument(documentId: string, userId: string): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/api/documents/${documentId}`, {
    method: 'DELETE',
    headers: headers(userId)
  });
  if (!res.ok) throw new Error('Failed to delete document');
  return res.json();
}

export async function addComment(
  documentId: string,
  content: string,
  userId: string
): Promise<Comment> {
  const res = await fetch(`${BASE_URL}/api/documents/${documentId}/comments`, {
    method: 'POST',
    headers: headers(userId),
    body: JSON.stringify({ content })
  });
  if (!res.ok) throw new Error('Failed to add comment');
  return res.json();
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
