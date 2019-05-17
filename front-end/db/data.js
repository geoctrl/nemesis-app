const requireAll = require('require-all');
const path = require('path');

function getDataFromSlug(slug) {
  const songs = requireAll(path.resolve(__dirname, `artists/${slug}`));
  const keys = Object.keys(songs);
  return {
    slug,
    albums: keys.map((key) => songs[key]),
  }
}

module.exports = [
  {
    id: '1',
    name: '"Weird Al" Yankovic',
    ...getDataFromSlug('weird-al-yankovic'),
  },
  {
    id: '2',
    name: 'Ben Harper',
    ...getDataFromSlug('ben-harper'),
  },
];