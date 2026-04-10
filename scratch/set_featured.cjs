const fs = require('fs');
const path = require('path');

const seedPath = '/mnt/c/Users/gavin/OneDrive/Documents/git/emdash-demo/emdashdemo/seed/seed.json';
const seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));

// The precise 8 items from the original site
const featuredMapping = {
  'federal-criminal-defense': 'Federal Criminal',
  'sex-crimes': 'Sex Crimes',
  'child-pornography': 'Child Pornography',
  'white-collar': 'White Collar Crime',
  'fraud': 'Fraud',
  'drug-conspiracy': 'Drug Conspiracy',
  'dwi': 'DWI',
  'traffic': 'Traffic Tickets'
};

if (seed.content && seed.content.practice_areas) {
  seed.content.practice_areas = seed.content.practice_areas.map(pa => {
    if (featuredMapping[pa.id]) {
      pa.data.featured = true;
      pa.data.navigation_label = featuredMapping[pa.id];
    } else {
      pa.data.featured = false;
      // We also want to keep the cleaned labels for non-featured ones 
      // in case the user navigates to those pages
    }
    return pa;
  });

  fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2));
  console.log('Successfully updated 8 featured practice areas and set labels.');
} else {
  console.error('Could not find practice_areas content');
}
