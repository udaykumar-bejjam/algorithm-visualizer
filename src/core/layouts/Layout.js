import React from 'react';
import { ResizableContainer } from 'components';

class Layout {
  constructor(key, getObject, children = []) {
    this.key = key;
    this.getObject = getObject;
    this.childKeys = [...children];
    this.children = children.map(childKey => this.getObject(childKey));
    this.weights = children.map(() => 1);
    this.ref = React.createRef();

    this.handleChangeWeights = this.handleChangeWeights.bind(this);
  }

  getTypeName() {
    return this.constructor.name;
  }

  add(key, index = this.children.length) {
    const child = this.getObject(key);
    this.childKeys.splice(index, 0, key);
    this.children.splice(index, 0, child);
    this.weights.splice(index, 0, 1);
  }

  remove(key) {
    const index = this.childKeys.indexOf(key);
    if (~index) {
      this.childKeys.splice(index, 1);
      this.children.splice(index, 1);
      this.weights.splice(index, 1);
    }
  }

  removeAll() {
    this.childKeys = [];
    this.children = [];
    this.weights = [];
  }

  handleChangeWeights(weights) {
    this.weights.splice(0, this.weights.length, ...weights);
    if (this.ref.current) this.ref.current.forceUpdate();
  }

  captureState() {
    return {
      type: this.getTypeName(),
      key: this.key,
      childKeys: [...this.childKeys],
      weights: [...this.weights],
    };
  }

  restoreState(state) {
    this.childKeys = [...(state.childKeys || [])];
    this.children = this.childKeys.map(childKey => this.getObject(childKey));
    this.weights = [...(state.weights || this.childKeys.map(() => 1))];
  }

  render() {
    const horizontal = this.constructor.isHorizontal;

    return (
      <ResizableContainer key={this.key} ref={this.ref} weights={this.weights} horizontal={horizontal}
                          onChangeWeights={this.handleChangeWeights}>
        {
          this.children.map(tracer => tracer && tracer.render())
        }
      </ResizableContainer>
    );
  }
}

Layout.isHorizontal = false;

export default Layout;
