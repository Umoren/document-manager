import { Permit, permitState } from 'permit-fe-sdk';

export const getAbility = async (userId: string) => {
    console.log('Initializing permit for user:', userId);
    const permit = Permit({
        loggedInUser: userId,
        backendUrl: "http://localhost:3001"
    });

    console.log('Loading permissions bulk');
    await permit.loadLocalStateBulk([
        // Only load category permissions, document permissions are derived
        { action: "list-documents", resource: "Category:finance" },
        { action: "list-documents", resource: "Category:hr" },
        { action: "create-document", resource: "Category:finance" },
        { action: "create-document", resource: "Category:hr" }
    ]);
    console.log('Permissions loaded into permitState');
};

export { permitState };