import React, { Component } from 'react';
import { array, bool } from 'prop-types';
import { Scoped, k } from 'kremling';

import equalizer from '../assets/equalizer.gif';
import equalizerPaused from '../assets/equalizer-pause.gif';
import { Button } from './button.component';
import { playerState } from '../core/player-state';
import { Dropdown } from '../components/dropdown.component';
import { Icon } from './icon.component';

function getActiveSong(queue, queueActiveIndex) {
  return queue.length ? queue[queueActiveIndex] : null;
}

export class SongList extends Component {
  static propTypes = {
    songs: array.isRequired,
    album: bool,
  }

  state = {
    activeSong: getActiveSong(playerState.state.queue, playerState.state.queueActiveIndex),
    audioPlaying: playerState.state.audioPlaying,
  }

  componentDidMount() {
    this.playerObservable = playerState.subscribe(({ queue, queueActiveIndex, audioPlaying }) => {
      this.setState({
        activeSong: getActiveSong(queue, queueActiveIndex),
        audioPlaying,
      });
    }, 'queue', 'queueActiveIndex', 'audioPlaying');

  }

  componentWillUnmount() {
    this.playerObservable.unsubscribe();
  }

  render() {
    const { songs, album } = this.props;
    const { activeSong, audioPlaying } = this.state;
    return (
      <Scoped css={css}>
        <div className="song-list-parent">
          <table className="song-list">
            <thead>
            <tr>
              <th style={{ paddingRight: '2.4rem'}}>
                {album && `#`}
              </th>
              <th>Name</th>
              <th>Album</th>
              <th>Artist</th>
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
                    ) : album ? (
                      <div className="track-container">
                        <div className="track-container__inner">
                          {song.track}
                        </div>
                        <div
                          className="track-container__play"
                          onClick={() => playerState.queuePlaylist(songs, i)}
                        >
                          <Icon name="play" size={14} />
                        </div>
                      </div>
                    ) : (
                      <div className="play">
                        <div
                          className="play-btn"
                          onClick={() => playerState.queuePlaylist(songs, i)}
                        >
                          <Icon name="play" size={14} />
                        </div>
                        <div
                          className="play-img"
                          style={{
                            backgroundImage: `url('${song.album.img}')`,
                          }}
                        />
                      </div>
                    )}
                </td>
                <td>{song.name}</td>
                <td>{song.album.name}</td>
                <td>{song.artist.name}</td>
                <td>
                  <Dropdown
                    inline
                    horizontal="west"
                    cover
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
        </div>
      </Scoped>
    );
  }
}

const css = k`
  .song-list-parent {
    padding: 1.6rem 0;
  }
  
  .song-list {
    border-collapse: collapse;
    table-layout: auto;
    width: 100%;
    cursor: default;
    user-select: none;
  }
  
  .track-container__inner {
    width: 4rem;
    height: 4rem;
    align-items: center;
    justify-content: flex-end;
    line-height: 1;
    padding-right: 1rem;
    color: var(--color-grey-500);
    display: flex;
  }
  
  .track-container__play {
    display: none;
    height: 4rem;
    width: 4rem;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  
  .track-container__play svg {
    fill: var(--color-grey-900);
  }
  
  .song-list tbody tr:hover {
    background-color: var(--color-primary-highlight);
  }

  .song-list tbody tr:hover .track-container__inner {
    display: none;
  }

  .song-list tbody tr:hover .track-container__play {
    display: flex;
  }

  .song-list tr .list-options {
    opacity: 0;
  }

  .song-list tbody tr:hover .list-options {
    opacity: 1;
  }
  
  .song-list tr > th {
    padding-bottom: .8rem;
    font-size: 1.2rem;
    text-transform: uppercase;
    color: var(--color-grey-500);
    border-bottom: solid .1rem var(--color-grey-100);
    padding-right: 1.6rem;
  }
  
  .song-list tr > td {
    padding: .4rem 1.6rem .4rem 0;
    border-bottom: solid .1rem var(--color-grey-100);
  }
  
  .song-list tr > th:first-child,
  .song-list tr > td:first-child {
    padding-left: 1.6rem;
    width: 4rem;
    text-align: right;
  }
  
  .play {
    width: 4rem;
    height: 4rem;
    position: relative;
    border-radius: .3rem;
    overflow: hidden;
  }

  .play-btn {
    width: 4rem;
    height: 4rem;
    border-radius: .1rem;
    position: relative;
    background-color: var(--color-grey-900);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
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
    z-index: 1;
    pointer-events: none;
  }
  
  .play-btn svg {
    fill: #fff;
  }

  .song-list tbody tr:hover .play-img {
    display: none;
  }
`;