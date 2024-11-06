import { useState } from 'react'
import { FileText } from 'lucide-react'
import { permitState } from 'permit-fe-sdk'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { ApiDocument } from '@/types'

interface DocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    document?: ApiDocument;
    categoryId: string;
    mode: 'create' | 'edit';
    onSave: (document: ApiDocument) => Promise<void>;
}

export function DocumentModal({
    isOpen,
    onClose,
    document,
    categoryId,
    mode,
    onSave
}: DocumentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ApiDocument>(
        document || {
            id: '', // Will be set by backend for create
            name: '',
            content: '',
            categoryId
        }
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving document:', error);
            // You might want to add error handling/display here
        } finally {
            setIsLoading(false);
        }
    };

    // Check permissions
    const canPerformAction = permitState?.check(
        mode === 'create' ? 'create-document' : 'create-document',
        `Category:${categoryId}`,
        {},
        {}
    );

    if (!canPerformAction) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[725px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {mode === 'create' ? 'Create New Document' : 'Edit Document'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Create a new document in this category'
                            : 'Make changes to your document here'
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Document name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Document content"
                                className="h-48"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading
                                ? 'Saving...'
                                : mode === 'create' ? 'Create' : 'Save Changes'
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}