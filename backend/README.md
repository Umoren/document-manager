# Document Manager - ReBAC Demo

This project demonstrates Relationship-Based Access Control (ReBAC) using Permit.io. It's a simple document management system where users can access documents based on their roles in different categories.

## ReBAC Model Explanation

### 1. Resources and Actions

#### Category Resource
```javascript
// Actions available on categories
actions: {
    'create-document': {},
    'list-documents': {},
    'rename': {},
    'delete': {}
}

// Roles
- Category#Admin   // Full access
- Category#Editor  // Can create, list, rename
- Category#Viewer  // Can only list
```

#### Document Resource
```javascript
// Actions available on documents
actions: {
    'read': {},
    'edit': {},
    'comment': {},
    'delete': {}
}

// Roles
- Document#Editor  // Full document access
- Document#Viewer  // Can only read
```

### 2. Relationship Model

Categories are parents of documents. This parent-child relationship is used for role derivation:
```javascript
// When a user has Category#Admin on a category
// They get Document#Editor on all documents in that category
Category:finance [parent] Document:budget_report
```

### 3. Role Derivations

```javascript
// Role derivation rules:
1. Category#Admin -> Document#Editor
2. Category#Editor -> Document#Editor
3. Category#Viewer -> Document#Viewer

// These derivations happen automatically when:
- User has role on category
- Category is parent of document
```

### 4. API Implementation

#### Permission Checks
```javascript
// Check if user can list documents in category
const canAccess = await permit.check(
    userId,
    "list-documents", 
    `Category:${categoryId}`
);

// Check if user can edit document
const canEdit = await permit.check(
    userId, 
    "edit", 
    `Document:${documentId}`
);
```

#### Role Assignment
```javascript
// Assign user as editor of a category
await permit.api.roleAssignments.assign({
    user: userId,
    role: "Editor",  // Becomes Category#Editor
    tenant: "default",
    resource_instance: `Category:${categoryId}`
});
```

### 5. Example Flow

1. Admin gets full access to finance category:
```http
GET /api/categories
Headers: user-id: admin@example.com
Response: [{ id: 'finance', name: 'Finance Documents' }, ...]
```

2. Admin assigns John as editor:
```http
POST /api/categories/finance/members
Headers: 
    user-id: admin@example.com
Body: {
    "userId": "john@example.com",
    "role": "editor"
}
```

3. John can now access documents:
```http
GET /api/categories/finance/documents
Headers: user-id: john@example.com
Response: [{ id: 'budget_report', name: 'Budget Report'}, ...]
```

4. John can edit documents (through role derivation):
```http
PUT /api/documents/budget_report
Headers: user-id: john@example.com
Body: {
    "name": "Updated Budget Report",
    "content": "New content..."
}
```

## Setup

1. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (coming soon)
cd ../frontend
npm install
```

2. Configure Permit.io
- Create resources (Category, Document)
- Set up actions and roles
- Configure role derivations
- Set environment variables:
```env
PERMIT_API_KEY=your_api_key
```

3. Run the Project
```bash
# Backend
npm run dev  # Runs on port 3001

# Frontend (coming soon)
npm run dev  # Runs on port 3000
```

## Testing Permissions

Use Postman or curl to test the API endpoints:

1. List Categories
```http
GET http://localhost:3001/api/categories
Headers:
  user-id: admin@example.com
```

2. Add Member to Category
```http
POST http://localhost:3001/api/categories/finance/members
Headers:
  user-id: admin@example.com
  Content-Type: application/json
Body:
{
    "userId": "john@example.com",
    "role": "editor"
}
```

3. Access Documents
```http
GET http://localhost:3001/api/documents/budget_report
Headers:
  user-id: john@example.com
```


