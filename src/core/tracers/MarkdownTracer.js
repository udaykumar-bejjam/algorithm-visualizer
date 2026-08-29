import Tracer from './Tracer';
import { MarkdownRenderer } from '../renderers';

class MarkdownTracer extends Tracer {
  getRendererClass() {
    return MarkdownRenderer;
  }

  set(markdown = '') {
    this.markdown = markdown;
    super.set();
  }

  captureState() {
    return {
      ...super.captureState(),
      markdown: this.markdown || '',
    };
  }

  restoreState(state) {
    super.restoreState(state);
    this.markdown = state.markdown || '';
  }
}

export default MarkdownTracer;
