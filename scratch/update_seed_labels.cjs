const fs = require('fs');
const path = require('path');

const seedPath = '/mnt/c/Users/gavin/OneDrive/Documents/git/emdash-demo/emdashdemo/seed/seed.json';
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

if (seed.content && seed.content.practice_areas) {
  seed.content.practice_areas = seed.content.practice_areas.map(pa => {
    let title = pa.data.title;
    // Common cleanup
    let nav = title
      .replace(/ - Carver & Associates/g, '')
      .replace(/ \| Carver & Associates/g, '')
      .replace(/ - Carver & Associates Law Firm/g, '')
      .replace(/ Lawyer(s)?/g, '')
      .replace(/ Attorney(s)?/g, '')
      .replace(/ Springfield MO/g, '')
      .replace(/ Springfield, MO/g, '')
      .replace(/ Springfield/g, '')
      .replace(/Award-Winning /g, '')
      .replace(/20 Best /g, '')
      .replace(/ - 2016 Award/g, '')
      .trim();
    
    // Capitalize first letter if needed
    nav = nav.charAt(0).toUpperCase() + nav.slice(1);

    pa.data.navigation_label = nav;
    return pa;
  });

  fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2));
  console.log('Successfully updated practice_areas with navigation_label');
} else {
  console.error('Could not find practice_areas content');
}
