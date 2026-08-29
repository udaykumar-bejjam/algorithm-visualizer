import Array1DTracer from './Array1DTracer';
import { ChartRenderer } from '../renderers';

class ChartTracer extends Array1DTracer {
  getRendererClass() {
    return ChartRenderer;
  }
}

export default ChartTracer;
