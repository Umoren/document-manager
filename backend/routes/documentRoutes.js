const express = require('express');
const router = express.Router();
const permit = require('../config/permit');

// Mock data
const documents = {
    budget_report: {
        id: 'budget_report',
        name: 'Budget Report 2024',
        categoryId: 'finance',
        content: 'Budget details here...'
    },
    marketing_expense: {
        id: 'marketing_expense',
        name: 'Marketing Expenses Q1',
        categoryId: 'finance',
        content: 'Marketing expense details...'
    },
    salary_report: {
        id: 'salary_report',
        name: 'Employee Salaries',
        categoryId: 'hr',
        content: 'Salary information...'
    }
};


// Get single document
router.get('/:documentId', async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        const { documentId } = req.params;

        const canRead = await permit.check(userId, "read", `Document:${documentId}`);
        if (!canRead) {
            return res.status(403).json({ error: 'Not authorized to read this document' });
        }

        const document = documents[documentId];
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.json(document);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update document
router.put('/:documentId', async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        const { documentId } = req.params;
        const updates = req.body;

        const canEdit = await permit.check(userId, "edit", `Document:${documentId}`);
        if (!canEdit) {
            return res.status(403).json({ error: 'Not authorized to edit this document' });
        }

        // Update mock data
        documents[documentId] = {
            ...documents[documentId],
            ...updates
        };

        res.json(documents[documentId]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete document
router.delete('/:documentId', async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        const { documentId } = req.params;

        const canDelete = await permit.check(userId, "delete", `Document:${documentId}`);
        if (!canDelete) {
            return res.status(403).json({ error: 'Not authorized to delete this document' });
        }

        delete documents[documentId];
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add comment
router.post('/:documentId/comments', async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        const { documentId } = req.params;
        const { content } = req.body;

        const canComment = await permit.check(userId, "comment", `Document:${documentId}`);
        if (!canComment) {
            return res.status(403).json({ error: 'Not authorized to comment on this document' });
        }

        // In real app, save comment to database
        res.json({
            id: Date.now().toString(),
            documentId,
            userId,
            content,
            createdAt: new Date()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;