const data = require('./data');

function songSrc(artistSlug, albumSlug, songSlug, track) {
  const trackStr = track < 10 ? `0${track}` : `${track}`;
  return `/assets/music/${artistSlug}/${albumSlug}/${trackStr}-${songSlug}.mp3`;
}

module.exports = () => {
  return {

    // ARTISTS
    artists: data.map(nextArtist => {
      const { albums, ...artist } = nextArtist;
      const { artistAlbums, artistSongs } = albums.reduce((accumulator, nextAlbum) => {
        const { songs, ...album } = nextAlbum;
        return {
          artistAlbums: [...accumulator.artistAlbums, album],
          artistSongs: [
            ...accumulator.artistSongs,
            ...songs.map(song => ({
              ...song,
              artist,
              album,
              src: songSrc(artist.slug, album.slug, song.slug, song.track),
            })),
          ],
        };
      }, {
        artistAlbums: [],
        artistSongs: [],
      });
      return {
        ...nextArtist,
        albums: artistAlbums,
        songs: artistSongs,
      };
    }),

    // ALBUMS
    albums: data.reduce((accumulator, next) => {
      const { albums, ...artist } = next;
      return [
        ...accumulator,
        ...albums.map(album => {
          const { songs, ...restOfAlbum } = album;
          return {
            ...album,
            songs: songs.map(song => ({
              ...song,
              artist,
              album: restOfAlbum,
              src: songSrc(artist.slug, album.slug, song.slug, song.track),
            })),
            artist,
          };
        }),
      ];
    }, []),

    // SONGS
    songs: data.reduce((accParent, nextArtist) => {
      const { albums, ...artist } = nextArtist;
      return [
        ...accParent,
        ...albums.reduce((accumulator, nextAlbum) => {
          const { songs, ...album } = nextAlbum;
          return [
            ...accumulator,
            ...nextAlbum.songs.map(song => ({
              ...song,
              artist,
              album,
              src: songSrc(artist.slug, album.slug, song.slug, song.track),
            })),
          ];
        }, []),
      ];
    }, []),
  };
}