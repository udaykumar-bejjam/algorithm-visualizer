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
}

export default MarkdownTracer;
