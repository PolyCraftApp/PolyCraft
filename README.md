## PolyCraft

PolyCraft is a React + Vite frontend for interacting with PolyCraft smart contracts.

It provides wallet connection (Solana / EVM via MetaMask), prediction creation and a UI to interact with the PolyCraft protocol.

---

### Tech stack

- **React 19**
- **TypeScript**
- **Vite 7**
- Solana Wallet Adapter
- MetaMask provider

---

### Requirements

- Node.js **>= 18**
- npm / pnpm / yarn (examples below use `npm`)

---

### Getting started

```bash
git clone https://github.com/PolyCraftApp/PolyCraft.git
cd PolyCraft
npm install

# start dev server
npm run dev
```

By default the app is available at `http://localhost:3000/`.

---

### Available scripts

- **`npm run dev`** – start Vite dev server
- **`npm run build`** – create production build (`dist/`)
- **`npm run preview`** – preview the production build locally
- **`npm run lint`** – run ESLint checks

---

### Project structure

Key files and directories:

- `src/main.tsx` – React application entry point
- `src/index.css` – global styles
- `src/components/Navbar.tsx` – navigation bar
- `src/components/CreatePredictionForm.tsx` – prediction creation form
- `src/components/Docs.tsx` – documentation page/section
- `src/components/WalletProvider.tsx` – wallet provider and context

---

### License

The license has not been specified yet. If you plan to make this project public, add a `LICENSE` file (for example MIT or Apache‑2.0).

