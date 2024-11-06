// backend/routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const permit = require('../config/permit');

// Get single document
router.get('/:documentId', async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        const { documentId } = req.params;

        const document = documents[documentId];
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Check category permission instead
        const canAccess = await permit.check(userId, "list-documents", `Category:${document.categoryId}`);
        if (!canAccess) {
            return res.status(403).json({ error: 'Not authorized to access this document' });
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

        const document = documents[documentId];
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Check if user can edit documents in this category
        const canEdit = await permit.check(userId, "create-document", `Category:${document.categoryId}`);
        if (!canEdit) {
            return res.status(403).json({ error: 'Not authorized to edit documents in this category' });
        }

        documents[documentId] = {
            ...document,
            ...updates
        };

        res.json(documents[documentId]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});