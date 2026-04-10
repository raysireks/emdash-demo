const Database = require('better-sqlite3');
const db = new Database('./data.db');

try {
  // Check if user exists
  const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get('dev@emdash.local');
  if (!existingUser) {
    db.prepare(`
      INSERT INTO users (id, email, name, role, email_verified, disabled, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).run('demo-admin-id', 'dev@emdash.local', 'Dev Admin', 50, 1, 0);
    console.log("Inserted dev@emdash.local user.");
  }

  // Set the correct setup complete flag
  db.prepare(`
    INSERT OR REPLACE INTO options (name, value) VALUES (?, ?)
  `).run('emdash:setup_complete', '"true"');
  
  // also setting emdash:setup:complete just in case.
  db.prepare(`
    INSERT OR REPLACE INTO options (name, value) VALUES (?, ?)
  `).run('emdash:setup:complete', '"true"');

  console.log("Dev setup flag injected successfully.");
} catch (e) {
  console.error(e);
}
