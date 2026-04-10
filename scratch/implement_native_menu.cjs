const fs = require('fs');
const path = require('path');

const seedPath = '/mnt/c/Users/gavin/OneDrive/Documents/git/emdash-demo/emdashdemo/seed/seed.json';
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

// 1. Remove 'featured' field from schema
const paCollection = seed.collections.find(c => c.slug === 'practice_areas');
if (paCollection) {
  paCollection.fields = paCollection.fields.filter(f => f.slug !== 'featured');
  // Keep navigation_label as it's good practice for custom menu labels
}

// 2. Create the practice_areas_dropdown menu
const menuItems = [
  { label: 'Federal Criminal', url: '/practice-areas/federal-criminal-lawyer' },
  { label: 'Sex Crimes', url: '/practice-areas/sex-crime-lawyer' },
  { label: 'Child Pornography', url: '/practice-areas/child-pornography-lawyer' },
  { label: 'White Collar Crime', url: '/practice-areas/white-collar-crime-lawyer' },
  { label: 'Fraud', url: '/practice-areas/fraud-lawyers' },
  { label: 'Drug Conspiracy', url: '/practice-areas/drug-conspiracy' },
  { label: 'DWI', url: '/practice-areas/dwi-lawyer-springfield-mo' },
  { label: 'Traffic Tickets', url: '/practice-areas/springfield-traffic-tickets' }
].map(item => ({
  type: 'custom',
  label: item.label,
  url: item.url
}));

// Check if menu already exists, if so update, else push
const existingMenuIndex = seed.menus.findIndex(m => m.name === 'practice_areas_dropdown');
const newMenu = {
  name: 'practice_areas_dropdown',
  label: 'Practice Areas Dropdown',
  items: menuItems
};

if (existingMenuIndex !== -1) {
  seed.menus[existingMenuIndex] = newMenu;
} else {
  seed.menus.push(newMenu);
}

// 3. Clean up content (remove 'featured' flag from data)
if (seed.content && seed.content.practice_areas) {
  seed.content.practice_areas = seed.content.practice_areas.map(pa => {
    delete pa.data.featured;
    return pa;
  });
}

fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2));
console.log('Successfully implemented native menu structure in seed.json');
