# EmDash Blank Template

The most minimal EmDash template. A single index page with [EmDash](https://github.com/emdash-cms/emdash) wired up and nothing else. No seed data, no layouts, no components -- start from scratch with full control.

## What's Included

- Single `index.astro` page
- EmDash integration configured
- TypeScript and live config boilerplate

## Infrastructure

- **Runtime:** Node.js
- **Database:** SQLite (local file)
- **Storage:** Local filesystem
- **Framework:** Astro with `@astrojs/node`

## Demo Site Setup & Login

1. Install dependencies
   ```bash
   yarn -i
   ```
2. Run the seed to initialize the schema:
   ```bash
   npx emdash seed seed/seed.json
   ```
3. Run the setup bypass fix (this tells EmDash setup is complete so the UI doesn't trap you):
   ```bash
   node scripts/setup-demo-admin.cjs
   ```
4. Start the dev server: `npx emdash dev`
5. Go to http://localhost:4321/_emdash/admin/login

**To log in:**
There is no special visual "dev mode" indicator on the login screen—it looks exactly like the production login. 
1. Click **Sign in with email link**.
2. Enter `dev@emdash.local`.
3. Check your local terminal (where `npx emdash dev` is running). EmDash will print the magic sign-in link directly to the console instead of sending an email.
4. Open that link in your browser to log in!

## See Also

- [All templates](../)
- [EmDash documentation](https://github.com/emdash-cms/emdash/tree/main/docs)
