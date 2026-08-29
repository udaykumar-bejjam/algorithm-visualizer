import GraphTracer from './GraphTracer';
import { GraphRenderer } from '../renderers';

class LinkedListTracer extends GraphTracer {
  getRendererClass() {
    return GraphRenderer;
  }

  set(array = []) {
    this.nodes = [];
    this.edges = [];
    this.directed(true);
    array.forEach((value, index) => {
      this.nodes.push({ id: index, weight: value, x: 0, y: 0, visitedCount: 0, selectedCount: 0 });
    });
    for (let i = 0; i < array.length - 1; i++) {
      this.edges.push({ source: i, target: i + 1, weight: null, visitedCount: 0, selectedCount: 0 });
    }
    this.layoutLinkedList();
  }

  layoutLinkedList() {
    this.callLayout = { method: this.layoutLinkedList, args: [] };
    const rect = this.getRect();
    const count = Math.max(this.nodes.length, 1);
    this.nodes.forEach((node, index) => {
      node.x = rect.left + ((index + 0.5) / count) * rect.width;
      node.y = (rect.top + rect.bottom) / 2;
    });
  }
}

export default LinkedListTracer;
