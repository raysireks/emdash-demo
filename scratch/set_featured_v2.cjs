const fs = require('fs');
const path = require('path');

const seedPath = '/mnt/c/Users/gavin/OneDrive/Documents/git/emdash-demo/emdashdemo/seed/seed.json';
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

// The precise 8 items from the original site's menu
const featuredMapping = {
  'federal-criminal-lawyer': 'Federal Criminal',
  'sex-crime-lawyer': 'Sex Crimes',
  'child-pornography-lawyer': 'Child Pornography',
  'white-collar-crime-lawyer': 'White Collar Crime',
  'fraud-lawyers': 'Fraud',
  'drug-conspiracy': 'Drug Conspiracy',
  'dwi-lawyer-springfield-mo': 'DWI',
  'springfield-traffic-tickets': 'Traffic Tickets'
};

if (seed.content && seed.content.practice_areas) {
  seed.content.practice_areas = seed.content.practice_areas.map(pa => {
    if (featuredMapping[pa.id]) {
      pa.data.featured = true;
      pa.data.navigation_label = featuredMapping[pa.id];
    } else {
      pa.data.featured = false;
      // Keep cleaning labels for others (fallback)
      if (!pa.data.navigation_label) {
        let title = pa.data.title;
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
        
        pa.data.navigation_label = nav;
      }
    }
    return pa;
  });

  fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2));
  console.log('Successfully updated 8 featured practice areas with correct slugs.');
} else {
  console.error('Could not find practice_areas content');
}
