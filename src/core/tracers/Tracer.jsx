import React from 'react';
import Renderer from '../renderers/Renderer';

class Tracer {
  constructor(key, getObject, title) {
    this.key = key;
    this.getObject = getObject;
    this.title = title;
    this.init();
    this.reset();
  }

  getRendererClass() {
    return Renderer;
  }

  getTypeName() {
    return this.constructor.name;
  }

  init() {
  }

  render() {
    const RendererClass = this.getRendererClass();
    return (
      <RendererClass key={this.key} title={this.title} data={this} />
    );
  }

  set() {
  }

  reset() {
    this.set();
  }

  captureState() {
    return {
      type: this.getTypeName(),
      key: this.key,
      title: this.title,
    };
  }

  restoreState(state) {
    this.title = state.title;
  }
}

export default Tracer;
