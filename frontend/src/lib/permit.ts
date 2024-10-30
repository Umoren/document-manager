// lib/permit.ts
import { Permit, permitState } from 'permit-fe-sdk';

export const getAbility = async (userId: string) => {
    console.log('Initializing permit for user:', userId);
    const permit = Permit({
        loggedInUser: userId,
        backendUrl: "http://localhost:3001"
    });

    console.log('Loading permissions bulk');
    await permit.loadLocalStateBulk([
        // Category permissions with instance keys
        { action: "list-documents", resource: "Category:finance" },
        { action: "list-documents", resource: "Category:hr" },
        { action: "create-document", resource: "Category:finance" },
        { action: "create-document", resource: "Category:hr" },

        // Document permissions with instance keys
        { action: "read", resource: "Document:budget_report" },
        { action: "read", resource: "Document:marketing_expense" },
        { action: "read", resource: "Document:salary_report" },
        { action: "edit", resource: "Document:budget_report" },
        { action: "edit", resource: "Document:marketing_expense" },
        { action: "edit", resource: "Document:salary_report" },
        // ... other document actions
    ]);
    console.log('Permissions loaded into permitState');
};

export { permitState };