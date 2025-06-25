This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Features

### PDF Export Functionality

The application now includes the ability to export setlists to printable PDFs. This feature includes:

- **Client-side PDF generation** using jsPDF library
- **Professional formatting** with band name, setlist name, and song details
- **Configurable options** for including artist, key, and date information
- **Multiple page support** for long setlists
- **Export buttons** available on both individual setlist pages and the setlists list

#### How to Use

1. Navigate to any setlist page or the setlists list
2. Click the green "Export PDF" button
3. The PDF will be automatically downloaded with a filename format: `{BandName}_{SetListName}_setlist.pdf`

#### PDF Features

- Clean, professional layout with indigo header
- Song numbering and details (title, key, artist)
- Automatic page breaks for long setlists
- Page numbering
- Generation date stamp
- Optimized for printing

#### Technical Implementation

- **Client-side**: Uses `jspdf` library for browser-based PDF generation
- **TypeScript**: Fully typed with proper interfaces and error handling
- **Configurable**: Options for page size, orientation, and content inclusion

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


If having trouble connecting a deployed instance to the subabase db refer to this page: 
https://supabase.com/docs/guides/database/prisma

Make sure the environment variables on vercel match what is suggested there.

For spotify sign in to work locally add this to .env NEXTAUTH_URL="http://127.0.0.1:3000" since localhost is not useable as a callback url for spotify auth.

TODO:
Create docs properly to allow someone to easily run the project locally and help me troubleshoot in the future. 
Maybe dockerize
Allow reordering setlists with drag and drop.
Create printable setlists. ✅ **COMPLETED**
Method to send email or google calendar event to bandmates with setlist, playlist and event details. (maybe this requires adding an event type that a setlist could be linked to)
User profile section.
Allow linking spotify after signing up with google.
Refactor to avoid code duplication.
Maybe allow a user to have a roster of musicians with contact info that could easily be added to an event from a list. 