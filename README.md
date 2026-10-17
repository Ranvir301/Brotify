# Brotify — rebuilt to match your syllabus (Weeks 1–36)

Your original zip was solid work, but it leaned on two things you haven't
covered yet: the **Context API** (`useContext`) for global state, and a
fake "switch view" navigation system instead of real URLs. This version
replaces both with things straight from your course:

## What changed

**1. No Context API — state lives in `App.jsx`, passed down as props.**
Open `src/App.jsx`. Every piece of shared data (`songs`, `playlists`,
`currentUser`, the audio player state, etc.) is a `useState` in one place,
and every handler function (`playSong`, `login`, `addSong`, ...) is defined
there too. Components like `Sidebar`, `Header`, and `Player` receive
exactly what they need as props — same idea as passing props to a
`<SongCard song={song} />`, just at a bigger scale.

**2. Real React Router instead of `changeView()`.**
The old app kept a `currentView` string in state and rendered different
components based on it — the URL never changed. Now:
- `/login` — the auth page
- `/` — home feed
- `/search` — browse & search
- `/playlist/:playlistId` — a **dynamic route**. Open `PlaylistDetail.jsx`
  and look for `useParams()` — that's how the component reads the ID
  straight out of the URL.
- `/album/:albumName` — another dynamic route, same idea.
- `/liked-songs`, `/admin` — regular routes.

**3. Nested routes.**
Look at the route tree in `App.jsx`: `/` renders `AppLayout`, which always
shows the Sidebar, Header, and Player, and has an `<Outlet />` in the
middle. Whichever child route matches (`Home`, `Search`,
`PlaylistDetail`...) gets rendered inside that `<Outlet />`. That's what
"nested routes" means in practice — a shared layout with a swappable
middle section.

**4. No `useEffect`.**
The original synced the `<audio>` element using several `useEffect`
hooks. Since every play/pause/seek/volume change in this app happens
*because the user clicked something*, we just do the DOM update (like
`audioRef.current.play()`) directly inside the same click-handler
function that updates state. No hidden "reactive" step required — same
`onClick`/`onChange` event handling you already know.

**5. One thing slightly ahead of the syllabus: `useRef`.**
To control the actual `<audio>` element (play, pause, seek), we need a
direct reference to that DOM node — that's what `useRef` is for. It's
used in exactly one place (`App.jsx`), and it's really just
`document.querySelector` in React's clothing.

## Concepts used, mapped to your weeks

| Feature | Where | Week |
|---|---|---|
| Controlled forms (login/signup/admin upload) | `AuthPage.jsx`, `AdminPanel.jsx` | 19–24 |
| `useState`, props, conditional rendering, lists (`.map`) | everywhere | 25–30 |
| React Router, `<Link>`/`<NavLink>`, nested routes, `:params` | `App.jsx`, `Sidebar.jsx`, `PlaylistDetail.jsx` | 31–36 |
| `localStorage`/`sessionStorage` + JSON | all the save/load calls in `App.jsx` | 13–18 |
| Arrays/objects (`.map`, `.filter`, `.find`) | `getAlbums`, `getPlaylistSongs`, search filtering | 7–12 / 13–18 |

## Running it

```
npm install
npm run dev
```

Log in with `admin` / `admin123` to reach the Admin Panel and upload some
songs (there's a "Fill Demo Data" button), or sign up as a normal user to
try browsing, liking songs, and building playlists.
