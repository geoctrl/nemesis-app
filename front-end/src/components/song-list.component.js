import React, { Component } from 'react';
import { array, bool } from 'prop-types';
import { Scoped, k } from 'kremling';

import equalizer from '../assets/equalizer.gif';
import equalizerPaused from '../assets/equalizer-pause.gif';
import { Button } from './button.component';
import { playerState } from '../core/player-state';
import { Dropdown } from '../components/dropdown.component';
import { Icon } from './icon.component';

export class SongList extends Component {
  static propTypes = {
    songs: array.isRequired,
    album: bool,
    artist: bool,
    track: bool,
  }

  state = {
    activeSong: null,
    audioPlaying: false,
  }

  componentDidMount() {
    this.playerObservable = playerState.subscribe(({ queue, queueActiveIndex, audioPlaying }) => {
      this.setState({
        activeSong: queue.length ? queue[queueActiveIndex] : null,
        audioPlaying,
      });
    }, 'queue', 'queueActiveIndex', 'audioPlaying');

  }

  componentWillUnmount() {
    this.playerObservable.unsubscribe();
  }

  render() {
    const { songs, album, artist, track } = this.props;
    const { activeSong, audioPlaying } = this.state;
    return (
      <Scoped css={css}>
        <table className="song-list">
          <thead>
          <tr>
            <th />
            {track && <th>Track</th>}
            <th>Name</th>
            {album && <th>Album</th>}
            {artist && <th>Artist</th>}
            <th />
          </tr>
          </thead>
          <tbody>
          {songs.map((song, i) => (
            <tr key={song.id}>
              <td>
                {activeSong && activeSong.id === song.id ?
                  (
                    <>
                      {audioPlaying ? (
                        <img src={equalizer} alt=""/>
                      ) : (
                        <img src={equalizerPaused} alt=""/>
                      )}
                    </>
                  ) : (
                    <div className="play">
                      <Button
                        className="play-btn"
                        onClick={() => playerState.queuePlaylist(songs, i)}
                      >
                        <Icon name="play" size={8} />
                      </Button>
                      <div
                        className="play-img"
                        style={{
                          backgroundImage: `url('${song.album.img}')`,
                        }}
                      />
                    </div>
                  )}
              </td>
              {track && (
                <td>{song.track}</td>
              )}
              <td>{song.name}</td>
              {album && (
                <td>{song.album.name}</td>
              )}
              {artist && (
                <td>{song.artist.name}</td>
              )}
              <td>
                  <Dropdown
                    inline
                    trigger={({ isOpen }) => (
                      <Button
                        className={isOpen ? '' : 'list-options'}
                        actionType="flat"
                        icon="ellipsis-h"
                      />
                    )}
                    content={() => (
                      <ul className="select-list">
                        <li>
                          <a onClick={() => playerState.addToQueue(song)}>
                            Add to Queue
                          </a>
                        </li>
                        <li>
                          <a onClick={() => playerState.addToQueueNext(song)}>
                            Play Next
                          </a>
                        </li>
                        <li className="divider" />
                        <li>
                          <a>
                            Add to Playlist
                          </a>
                        </li>
                      </ul>
                    )}
                  />
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </Scoped>
    );
  }
}

const css = k`
  .song-list {
    border-collapse: collapse;
    table-layout: auto;
    width: 100%;
    cursor: default;
    user-select: none;
  }
  
  .song-list tr {
  }

  .song-list tr:hover {
    background-color: var(--color-grey-25);
  }

  .song-list tr .list-options {
    opacity: 0;
  }

  .song-list tr:hover .list-options {
    opacity: 1;
  }
  
  .song-list tr > td {
    padding: .4rem;
    border-bottom: solid .1rem var(--color-grey-100);
  }
  
  .song-list tr > td:first-child {
    padding-left: 1.6rem;
  }
  
  .play {
    width: 3rem;
    height: 3rem;
    border-radius: .1rem;
    position: relative;
  }
  
  .play-btn {
    width: 3rem;
    height: 3rem;
    border-radius: .1rem;
    position: relative;
  }
  
  .play-img {
    background-position: center;
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: .1rem;
  }
  
  .play-btn svg {
    
  }
`;