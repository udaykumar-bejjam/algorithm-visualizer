import GraphTracer from './GraphTracer';
import { GraphRenderer } from '../renderers';

class TreeTracer extends GraphTracer {
  getRendererClass() {
    return GraphRenderer;
  }

  set(root) {
    this.nodes = [];
    this.edges = [];
    this.directed(true);
    if (root != null) {
      const rootId = this.ingestTree(root);
      if (rootId != null) this.layoutTree(rootId);
    }
  }

  ingestTree(node, parentId = null) {
    if (node == null) return null;

    let value;
    let children = [];
    if (Array.isArray(node)) {
      [value, ...children] = node;
    } else if (typeof node === 'object') {
      value = node.value != null ? node.value : node.id;
      children = node.children || [];
    } else {
      value = node;
    }

    const id = this.nodes.length;
    this.nodes.push({ id, weight: value, x: 0, y: 0, visitedCount: 0, selectedCount: 0 });
    if (parentId != null) {
      this.edges.push({ source: parentId, target: id, weight: null, visitedCount: 0, selectedCount: 0 });
    }
    children.forEach(child => this.ingestTree(child, id));
    return id;
  }
}

export default TreeTracer;
