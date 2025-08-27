# **App Name**: ReferBot Admin Dashboard

## Core Features:

- Authentication: Implements a login page with email and password inputs, storing the JWT token in local storage upon successful authentication.
- Dashboard KPIs: Displays key performance indicators (KPIs) such as total users, leads, and withdraw requests in a visually appealing card format.
- Lead Management: Allows administrators to view, filter, and manage leads, including the ability to verify or reject leads with a reason.
- Offer Management: Enables CRUD operations for offers, including the ability to toggle the active status of an offer and manage offer details.
- User Management: Provides functionality to search users by username or Discord ID and adjust user wallets with a specified amount and note.
- Withdraw Management: Allows administrators to filter and manage withdraw requests, including approving or rejecting requests with a note.

## Style Guidelines:

- Primary color: Crystal Blue (#5BC0F8) for the main interactive elements to provide a clean and trustworthy interface.
- Background color: Very light grey (#F0F2F5) to provide a soft contrast to the dark ink and prevent eye strain during prolonged use. This enhances readability without distracting from the Crystal Blue accents.
- Accent color: A slightly darker shade of Crystal Blue (#45B5F6) is used for hover states and active elements to indicate interactivity.
- Font: 'Inter' (sans-serif) for both body text and headings. Note: currently only Google Fonts are supported.
- Cards: 16px rounded corners, soft shadows, and generous whitespace to maintain a modern, clean aesthetic.
- Crisp hover and focus effects with Crystal Blue rings for clear interaction feedback. Use tasteful motion (200ms) for a smooth user experience.