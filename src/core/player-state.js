import SimpleState from '@geoctrl/simple-state';
import uuid from 'uuid/v4';
import { REPEAT, REPEAT_NONE } from './player-contants';

let durationInterval = null;
const initialState = {
  currentTime: 0,
  queue: [],
  queueName: null,
  queueActiveIndex: 0,
  audio: null,
  audioPlaying: false,
  duration: 0,
  repeat: REPEAT,
  volume: 1,
};

class PlayerState extends SimpleState {
  setAudio = (audio) => {
    this.set({ audio });
    audio.onended = this.onEnded;
    audio.ondurationchange = this.updateCurrentTime;
  }

  ready = () => {
    const { audio, queue, queueActiveIndex } = this.state;
    if (!audio.getAttribute('src')) {
      audio.setAttribute('src', queue[queueActiveIndex].src);
    }
  }

  stop = () => {
    clearInterval(durationInterval);
    this.set({
      audioPlaying: false,
    });
    const { audio } = this.state;
    audio.setAttribute('src', '');
  }

  play = () => {
    durationInterval = setInterval(this.updateCurrentTime, 249);
    const { audio } = this.state;
    audio.play();
    this.set({ audioPlaying: true });
  }

  pause = () => {
    clearInterval(durationInterval);
    const { audio } = this.state;
    audio.pause();
    this.set({ audioPlaying: false });
  }

  next = () => {
    const { repeat, queue, queueActiveIndex, audioPlaying } = this.state;
    const lastIndex = queue.length - 1 !== queueActiveIndex;
    if (lastIndex || repeat === REPEAT) {
      this.stop();
      this.set({ queueActiveIndex: lastIndex ? queueActiveIndex + 1 : 0 });
      this.ready();
      if (audioPlaying) {
        this.play();
      }
    }
  }

  back = () => {
    const { repeat, queue, queueActiveIndex, audioPlaying } = this.state;
    if (queueActiveIndex > 0 || repeat === REPEAT) {
      this.stop();
      this.set({
        queueActiveIndex: queueActiveIndex > 0
          ? queueActiveIndex - 1
          : queue.length - 1,
      });
      this.ready();
      if (audioPlaying) {
        this.play();
      }
    }
  }

  shuffle = () => {
    const { queue, queueActiveIndex } = this.state;
    const currentSong = queue[queueActiveIndex];
    let currentIndex = queue.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = queue[currentIndex];
      queue[currentIndex] = queue[randomIndex];
      queue[randomIndex] = temporaryValue;
    }
    currentIndex = queue.findIndex(song => song.key === currentSong.key);
    this.set({
      queue: [
        currentSong,
        ...queue.slice(0, currentIndex),
        ...queue.slice(currentIndex + 1),
      ],
      queueActiveIndex: 0,
    });
  }

  seek = (seekTo) => {
    const { audio } = this.state;
    const duration = audio.duration;
    const currentTime = (duration * seekTo) / 100;
    audio.currentTime = currentTime < duration - 1 ? currentTime : currentTime - 1;
    this.updateCurrentTime();
  }

  repeatNext = () => {
    const { repeat } = this.state;
    this.set({
      repeat: repeat === REPEAT
        ? REPEAT_NONE
        : REPEAT,
    });
  }

  onEnded = () => {
    const { queue, queueActiveIndex } = this.state;
    this.stop();
    if (queue[queueActiveIndex + 1]) {
      this.set({ queueActiveIndex: queueActiveIndex + 1 });
      this.ready();
      this.play();
    }
  }

  updateCurrentTime = () => {
    const { audio } = this.state;
    this.set({
      currentTime: audio.currentTime,
      duration: audio.duration,
    });
  }

  addToQueue = (song) => {
    this.set({
      queue: [
        ...this.state.queue,
        {
          ...song,
          key: uuid(),
        },
      ],
    });
    this.ready();
  }

  addToQueueNext = (song) => {
    this.set({
      queue: [
        ...this.state.queue.slice(0, this.state.queueActiveIndex + 1),
        {
          ...song,
          key: uuid(),
        },
        ...this.state.queue.slice(this.state.queueActiveIndex + 1),
      ],
    });
    this.ready();
  }

  queuePlaylist = (playlist, index) => {
    this.stop();
    this.set({
      queue: playlist.map(song => ({
        ...song,
        key: uuid(),
      })),
      queueActiveIndex: index,
    });
    this.ready();
    this.play();
  }

  queueGoTo = (queueActiveIndex) => {
    this.stop();
    this.set({ queueActiveIndex });
    this.ready();
    this.play();
  }

  updateVolume = (volume) => {
    this.state.audio.volume = volume;
    this.set({ volume });
  }
}

export const playerState = new PlayerState(initialState);