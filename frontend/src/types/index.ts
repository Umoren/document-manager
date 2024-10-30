// types/index.ts

// Backend types
export interface ApiCategory {
    id: string;
    name: string;
    documentCount: number;
}

export interface ApiDocument {
    id: string;
    name: string;
    categoryId: string;
    content: string;
}

export interface ApiComment {
    id: string;
    documentId: string;
    userId: string;
    content: string;
    createdAt: Date;
}

// Frontend component types
export interface Category extends ApiCategory {
    documentCount: number;
    icon: 'Folder' | 'FileText';
}

export interface Document extends ApiDocument {
    // lastUpdated: string;
}

export interface Comment extends ApiComment { }