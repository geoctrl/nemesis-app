import React, { Component, createRef } from 'react';
import { func, bool, string, number, oneOf, oneOfType } from 'prop-types';
import { a } from 'kremling';
import { createPortal } from 'react-dom';
import { isNumber } from 'lodash';

export class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.dropdownEl = createRef();
    this.contentEl = createRef();
  }
  static propTypes = {
    trigger: func.isRequired,
    content: func.isRequired,
    inline: bool,
    allowContentClicks: bool,
    horizontal: oneOf(['east', 'west']),
    size: oneOfType([number, oneOf(['sm', 'md', 'lg', 'block'])]),
    contentHeight: oneOfType([string, number]),
    fixedContent: bool,
    cover: bool,
  };
  static defaultProps = {
    horizontal: 'east',
    size: 'sm',
    contentHeight: 'auto',
  };
  state = {
    isOpen: false,
    openAbove: false,
  };

  doesContain = (parent, child) => {
    if (!child || !child.classList) return false;
    if (child.classList.contains('dropdown-content')) return true;
    if (!child.parentNode && child.nodeName !== '#document') return true;
    return this.doesContain(parent, child.parentNode);
  };

  documentClickHandler = e => {
    if (!this.dropdownEl || !this.dropdownEl.current) return;
    const contains =
      this.dropdownEl.current.contains(e.target) ||
      this.doesContain(this.dropdownEl.current, e.target);
    if ((contains && !this.props.allowContentClicks) || !contains) {
      this.close();
    }
  };
  toggle = e => {
    if (this.state.isOpen) {
      this.close(e);
    } else {
      this.open(e);
    }
  };
  open = e => {
    if (e) e.stopPropagation();
    this.setState({ isOpen: true }, () => {
      const viewHeight = window.innerHeight;
      const rect = this.contentEl.current.getBoundingClientRect();
      this.setState({ openAbove: rect.top + rect.height > viewHeight });
    });
    document.addEventListener('click', this.documentClickHandler);
  };
  close = e => {
    if (e) e.stopPropagation();
    this.setState({ isOpen: false, openAbove: false });
    document.removeEventListener('click', this.documentClickHandler);
  };
  componentWillUnmount() {
    document.removeEventListener('click', this.documentClickHandler);
  }
  render() {
    const { trigger, inline, fixedContent } = this.props;
    const { isOpen } = this.state;
    return (
      <div
        className={a('dropdown').m('dropdown--inline', inline)}
        ref={this.dropdownEl}
      >
      <span className="dropdown-trigger" onClick={this.toggle}>
        {trigger({ isOpen })}
      </span>
        {fixedContent
          ? createPortal(this.renderContent(), document.body)
          : this.renderContent()}
      </div>
    );
  }
  renderContent = () => {
    const {
      content,
      horizontal,
      size,
      contentHeight,
      fixedContent,
      cover,
    } = this.props;
    const { isOpen, openAbove } = this.state;
    let positionStyles = {};
    if (
      fixedContent &&
      this.dropdownEl &&
      this.dropdownEl.current &&
      this.contentEl &&
      this.contentEl.current
    ) {
      const dropdownRect = this.dropdownEl.current.getBoundingClientRect();
      const contentRect = this.contentEl.current.getBoundingClientRect();
      const viewWidth = window.innerWidth;
      positionStyles.right = viewWidth - dropdownRect.right;
      if (openAbove) {
        positionStyles.top = cover
          ? dropdownRect.top + dropdownRect.height - contentRect.height
          : dropdownRect.top - contentRect.height;
      } else {
        positionStyles.top = cover
          ? dropdownRect.top
          : dropdownRect.top + dropdownRect.height;
      }
    }
    return (
      <div
        ref={this.contentEl}
        onClick={e => e.stopPropagation()}
        className={a('dropdown-content')
          .m('dropdown-content--fixed', fixedContent)
          .m('dropdown-content--hide', !isOpen)
          .m('dropdown-content--above', !fixedContent && openAbove)
          .m('dropdown-content--cover', !fixedContent && cover)
          .m('dropdown-content--east', horizontal === 'east')
          .m('dropdown-content--west', horizontal === 'west')
          .m('dropdown-content--md', size === 'md')
          .m('dropdown-content--lg', size === 'lg')
          .m('dropdown-content--block', size === 'block')}
        style={{
          maxHeight: contentHeight,
          ...(isNumber(size) ? { width: `${size / 10}rem` } : {}),
          ...positionStyles,
        }}
      >
        {content({ isOpen, close: this.close })}
      </div>
    );
  };
}