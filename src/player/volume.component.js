import React, { Component, createRef } from 'react';
import { bool, number, func, string } from 'prop-types';
import { Scoped, k } from 'kremling';

import { Dropdown } from '../components/dropdown.component';
import { Button } from '../components/button.component';
import { Icon } from '../components/icon.component';

export class Volume extends Component {
  constructor(props) {
    super(props);
    this.barRef = createRef();
  }

  static propTypes = {
    disabled: bool,
    volume: number,
    volumeIcon: string,
    onUpdate: func,
  }

  componentWillUnmount() {
    this.timeObservable.unsubscribe();
    this.queueObservable.unsubscribe();
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown = (e) => {
    this.setState({ dragging: true });
    this.onDrag(e);
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onDrag = (e) => {
    const { left, width } = this.barRef.current.getBoundingClientRect();
    const position = (e.pageX - left) / width;
    this.props.onUpdate(position < 0 ? 0 : position > 1 ? 1 : position);
  }

  onMouseUp = () => {
    this.setState({ dragging: false });
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  render() {
    const { disabled, volume, volumeIcon } = this.props;
    return (
      <Scoped css={css}>
        <div className="volume">
          <Dropdown
            horizontal="west"
            round
            size={140}
            cover
            allowContentClicks
            disabled={disabled}
            trigger={() => (
              <Button
                actionType="flat"
                icon={volumeIcon}
                disabled={disabled}
                large
                circle
              />
            )}
            content={() => (
              <div className="volume-parent">
                <div className="volume-content">
                  <div className="volume-bar" ref={this.barRef}>
                    <div className="volume-bar__inner" style={{ width: `${volume * 100}%` }} />
                  </div>
                  <div
                    className="volume-control"
                    onMouseDown={this.onMouseDown}
                  >
                    <div
                      className="volume-handle"
                      style={{ width: `${volume * 100}%` }}
                    />
                  </div>
                </div>
                <div className="volume-icon">
                  <Icon name={volumeIcon} size={16} />
                </div>
              </div>
            )}
          />
        </div>
      </Scoped>
    );
  }
}

const css = k`
  .volume {
    display: inline-block;
  }
  
  .volume-parent {
    display: flex;
  }
  
  .volume-icon {
    height: 3.6rem;
    width: 3.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .volume-icon svg {
    fill: var(--color-grey-700);
  }
  
  .volume-content {
    margin: 1.5rem .8rem 1.5rem 1.5rem;
    position: relative;
    flex-grow: 1;
  }
  
  .volume-bar {
    height: .6rem;
    background-color: var(--color-grey-50);
    border-radius: 10rem;
    overflow: hidden;
  }
  
  .volume-bar__inner {
    border-radius: 10rem;
    background-color: var(--color-primary);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  .volume-control {
    position: absolute;
    top: -.4rem;
    left: 0;
    right: 0;
    bottom: -.4rem;
    cursor: pointer;
  }
  
  .volume-handle {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    
  }
  
  .volume-handle::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    height: 1.4rem;
    width: 1.4rem;
    border-radius: 10rem;
    background-color: #637BC5;
    transform: translateX(.7rem);
  }
`;