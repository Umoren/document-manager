import { DocumentTable } from '@/components/documents/document-table';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Header from '@/components/layout/header';
import { permitState, getAbility } from '@/lib/permit';
import { fetchCategoryDocuments, updateDocument, deleteDocument } from '@/lib/utils';
import type { Document } from '@/types';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CategoryPage() {
    const router = useRouter();
    const { categoryId } = router.query;
    const { user, isLoaded } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [categoryName, setCategoryName] = useState('');
    const [permissionsLoaded, setPermissionsLoaded] = useState(false);
    const [accessError, setAccessError] = useState<string>();

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
            if (!isLoaded || !user || !categoryId || !permissionsLoaded) {
                console.log('Not ready:', { isLoaded, user: !!user, categoryId, permissionsLoaded });
                return;
            }

            console.log('Checking access...');
            const canAccess = permitState?.check("list-documents", `Category:${categoryId}`, {}, {});
            console.log('Access check result:', canAccess);

            if (!canAccess) {
                console.log('Setting access error');
                setAccessError(`You don't have access to view documents in this category`);
                return;
            }

            setIsLoading(true);
            try {
                console.log('Starting document fetch');
                const docs = await fetchCategoryDocuments(categoryId as string, user.id);
                console.log('Documents fetched:', docs);
                setDocuments(docs);
                setCategoryName(categoryId === 'finance' ? 'Finance' : 'HR');
            } catch (error) {
                console.error('Error loading documents:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [categoryId, isLoaded, user, permissionsLoaded]);

    if (!isLoaded || !permissionsLoaded) return <div>Loading...</div>;

    return (
        <>
            <Header
                userName={`${user?.firstName} ${user?.lastName}`}
                userAvatar={user?.imageUrl}
                currentPage={categoryName}
            />
            {accessError ? (
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <div className="text-center text-red-500 flex flex-col items-center justify-center h-64">
                        <AlertCircle className="h-12 w-12 mb-4" />
                        <p>{accessError}</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => router.push('/')}
                        >
                            Back to Categories
                        </Button>
                    </div>
                </div>
            ) : (
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
            )}
        </>
    );
}