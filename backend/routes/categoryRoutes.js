const express = require('express');
const router = express.Router();
const permit = require('../config/permit');

// Mock data (since we're not using a database)
const categories = {
    finance: {
        id: 'finance',
        name: 'Finance Documents'
    },
    hr: {
        id: 'hr',
        name: 'HR Documents'
    }
};

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


// List all categories
// backend/routes/categoryRoutes.js
router.get('/', async (req, res) => {
    try {
        const userId = req.headers['user-id'];

        const accessibleCategories = await Promise.all(
            Object.values(categories).map(async (category) => {
                const canAccess = await permit.check(userId, "list-documents", `Category:${category.id}`);
                if (!canAccess) return null;

                // Add document count
                const categoryDocuments = Object.values(documents)
                    .filter(doc => doc.categoryId === category.id);

                return {
                    ...category,
                    documentCount: categoryDocuments.length
                };
            })
        );

        res.json(accessibleCategories.filter(Boolean));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Get category documents
router.get('/:categoryId/documents', async (req, res) => {
    try {
        const userId = req.headers['user-id'];
        const { categoryId } = req.params;

        const canAccess = await permit.check(userId, "list-documents", `Category:${categoryId}`);
        if (!canAccess) {
            return res.status(403).json({ error: 'Not authorized to view documents in this category' });
        }

        const categoryDocuments = Object.values(documents).filter(doc => doc.categoryId === categoryId);
        res.json(categoryDocuments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add member to category (assign role)
router.post('/:categoryId/members', async (req, res) => {
    try {
        const adminId = req.headers['user-id'];
        const { categoryId } = req.params;
        const { userId, role } = req.body;

        // Check if current user can manage members
        const canManage = await permit.check(adminId, "create-document", `Category:${categoryId}`);
        if (!canManage) {
            return res.status(403).json({ error: 'Not authorized to manage category members' });
        }

        // Just capitalize first letter of role
        const resourceRole = role.charAt(0).toUpperCase() + role.slice(1);

        // Assign role to user matching the working format
        await permit.api.roleAssignments.assign({
            user: userId,
            role: resourceRole,
            tenant: "default",
            resource_instance: `Category:${categoryId}`
        });

        res.json({ message: 'Role assigned successfully' });
    } catch (error) {
        console.error('Role assignment error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;