# Setlist Manager

## Getting Started

> The following instructions assume you have Homebrew installed, if not do that first.

1. Copy `.env.example` into a `.env` file and fill in the missing values.
2. Install postgresql locally with `brew install postgresql`
3. Run postgresql server with `brew services start postgresql`
4. Generate the Prisma Client with `npx prisma generate`
5. Start the development server with `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note: For google and spotify auth to work you'll need to create an app for both of those to use.

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

### Spotify Integration

The application includes seamless Spotify integration for creating playlists from setlists:

- **Automatic token refresh**: Spotify access tokens are automatically refreshed when they expire
- **Playlist creation**: Convert any setlist into a Spotify playlist with one click
- **Song matching**: Automatically searches Spotify for matching songs using title and artist
- **Error handling**: Graceful handling of token expiration with user-friendly reconnection prompts

#### How to Use

1. Sign in with your Spotify account (recommended) or connect Spotify after signing up
2. Navigate to any setlist page
3. Click the green "Create Spotify Playlist" button
4. The playlist will be created in your Spotify account with all matching songs

#### Technical Implementation

- **Token Management**: Automatic refresh of expired access tokens using refresh tokens
- **Database Storage**: Secure storage of tokens in the database with proper encryption
- **Error Recovery**: Automatic cleanup of invalid accounts and user-friendly reconnection flows
- **API Integration**: Direct integration with Spotify Web API for playlist creation and song search

#### Token Refresh Logic

The application implements a robust token refresh system:

1. **Expiration Detection**: Tokens are checked for expiration with a 5-minute buffer
2. **Automatic Refresh**: When tokens expire, the system automatically attempts to refresh them
3. **Fallback Handling**: If refresh fails, the account is cleaned up and user is prompted to reconnect
4. **Seamless Experience**: Users don't need to manually re-authenticate unless refresh tokens are invalid

If having trouble connecting a deployed instance to the subabase db refer to this page: 
https://supabase.com/docs/guides/database/prisma

Make sure the environment variables on vercel match what is suggested there.

For spotify sign in to work locally add this to .env NEXTAUTH_URL="http://127.0.0.1:3000" since localhost is not useable as a callback url for spotify auth.

## TODO:
- Create docs properly to allow someone to easily run the project locally and help me troubleshoot in the future. 
- Maybe dockerize
- Fix spotify api integration issues (show spotify logo beside songs that have a perfect match) ✅ **COMPLETED**
- When a song doesn't have a match don't include it in the playlist and warn the user  ✅ **COMPLETED**
- Allow reordering setlists with drag and drop. ✅ **COMPLETED**
- Create printable setlists. ✅ **COMPLETED**
- Method to send email or google calendar event to bandmates with setlist, playlist and event details. (maybe this requires adding an event type that a setlist could be linked to)
- User profile section.
- Allow linking spotify after signing up with google.
- Refactor to avoid code duplication.
- Maybe allow a user to have a roster of musicians with contact info that could easily be added to an event from a list. 
- Be able to edit songs from setlist view ✅ **COMPLETED**
- Add Sharp and flat versions of each key ✅ **COMPLETED**
- Maybe let user know key is your singing key
- When sharing band, user should be notified and given a choice.
- User should have the ability to remove a band. ✅ **COMPLETED**
- Display how many users a band has and show a list somewhere ✅ **COMPLETED**
- Fix share band ✅ **COMPLETED**
- Add testing ** In Progress **
- Multiple Set Support
- Filter out songs based on tags 
- Add (Album Version) to edge cases of spotify perfect match
- Add husky and require successful build to commit or push