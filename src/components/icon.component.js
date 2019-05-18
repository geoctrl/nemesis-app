import React, { Component } from 'react';
import { Scoped, k } from 'kremling';
import { string, number } from 'prop-types';

export class Icon extends Component {
  static propTypes = {
    name: string,
    size: number,
    className: string,
    fill: string,
  };
  render() {
    const { name, size = 20, fill, className, ...rest } = this.props;
    return (
      <Scoped css={css}>
        <svg
          {...rest}
          className={`icon ${className || ''}`}
          style={{ width: `${size / 10}rem`, height: `${size / 10}rem`, fill }}
        >
          <use href={`#${name}`} xlinkHref={`#${name}`} />
        </svg>
      </Scoped>
    );
  }
}

const css = k`
  .icon {
    width: 20px;
    fill: currentColor;
  }
`;