# Document Manager

A document management system demonstrating ReBAC (Relationship-Based Access Control) using Permit.io.

## Structure
```bash
document-manager/
├── backend/         
└── frontend/  

## Prerequisites

- Node.js
- Permit.io account and API key
- Clerk.dev account and API keys

## Setup

1. Install dependencies:
```sh
npm run install-all
```
2. Set up environment variables:
Backend (.env):
```sh
PERMIT_API_KEY=your_permit_api_key
PORT=3001
```
Frontend (.env.local):
```sh
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

3. Run the development servers:
```sh
npm run dev
```
This will start:

- Backend on http://localhost:3001
- Frontend on http://localhost:3000

## Features

- ReBAC permissions with Permit.io
- Document management with categories

## Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Express.js
- Auth: Clerk
- Permissions: Permit.io

