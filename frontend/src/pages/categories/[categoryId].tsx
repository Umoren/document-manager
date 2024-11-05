import { DocumentTable } from '@/components/documents/document-table';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Header from '@/components/layout/header';
import { permitState, getAbility } from '@/lib/permit';
import { fetchCategoryDocuments, updateDocument, deleteDocument } from '@/lib/utils';
import type { Document } from '@/types';

export default function CategoryPage() {
    const router = useRouter();
    const { categoryId } = router.query;
    const { user, isLoaded } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [categoryName, setCategoryName] = useState('');
    const [permissionsLoaded, setPermissionsLoaded] = useState(false);

    // First load permissions
    useEffect(() => {
        if (!isLoaded || !user) return;

        const loadPermissions = async () => {
            await getAbility(user.id);
            setPermissionsLoaded(true);
        };

        loadPermissions();
    }, [user, isLoaded]);

    // Then load data once permissions are ready
    useEffect(() => {
        const loadData = async () => {
            if (!isLoaded || !user || !categoryId || !permissionsLoaded) return;

            const canAccess = permitState?.check("list-documents", `Category:${categoryId}`, {}, {});

            if (!canAccess) {
                router.push('/');
                return;
            }

            setIsLoading(true);
            try {
                const docs = await fetchCategoryDocuments(categoryId as string, user.id);
                setDocuments(docs);
                setCategoryName(categoryId === 'finance' ? 'Finance' : 'HR');
            } catch (error) {
                console.error('Error loading documents:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [categoryId, isLoaded, user, router, permissionsLoaded]);

    if (!isLoaded || !permissionsLoaded) return <div>Loading...</div>;

    return (
        <>
            <Header
                userName={`${user?.firstName} ${user?.lastName}`}
                userAvatar={user?.imageUrl}
                currentPage={categoryName}
            />
            <DocumentTable
                categoryId={categoryId as string}
                categoryName={categoryName}
                documents={documents}
                isLoading={isLoading}
                onDocumentUpdate={async (document: any) => {
                    if (!user) return;
                    try {
                        await updateDocument(document.id, document, user.id);
                        const docs = await fetchCategoryDocuments(categoryId as string, user.id);
                        setDocuments(docs);
                    } catch (error) {
                        console.error('Error updating document:', error);
                    }
                }}
                onDocumentDelete={async (documentId: string) => {
                    if (!user) return;
                    try {
                        await deleteDocument(documentId, user.id);
                        const docs = await fetchCategoryDocuments(categoryId as string, user.id);
                        setDocuments(docs);
                    } catch (error) {
                        console.error('Error deleting document:', error);
                    }
                }}
            />
        </>
    );
}