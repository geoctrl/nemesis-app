import React, { Component } from 'react';
import { string, node, bool, object, func, oneOfType, oneOf } from 'prop-types';
import { a } from 'kremling';

import { Icon } from './icon.component';

export class Button extends Component {
  static propTypes = {
    actionType: oneOf(['primary', 'flat', 'grey', 'grey-dark']),
    icon: string,
    children: node,
    block: bool,
    small: bool,
    large: bool,
    className: oneOfType([string, object]),
    onClick: func,
    disabled: bool,
    dropdown: bool,
    circle: bool,
    square: bool,
    tag: string,
  };
  static defaultProps = {
    actionType: 'grey',
    icon: '',
    tag: 'button',
  };
  render() {
    const {
      actionType,
      icon,
      children,
      block,
      small,
      large,
      className,
      dropdown,
      circle,
      square,
      tag,
      ...rest
    } = this.props;
    const Tag = tag;
    return (
      <Tag
        {...rest}
        className={a(`btn btn--${actionType} ${className || ''}`)
          .m('btn--icon', icon)
          .m('btn--block', block)
          .m('btn--small', small)
          .m('btn--large', large)
          .m('btn--dropdown', dropdown)
          .m('btn--square', square)}
      >
        {icon ? (
          <span className="inner-icon">
          <Icon name={icon} size={small ? 12 : 16} />
        </span>
        ) : (
          <span className="inner-content">{children}</span>
        )}
        {dropdown && <Icon name="solid-caret-down" size={12} />}
      </Tag>
    );
  }
}
