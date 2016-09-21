import {Tooltip} from 'phylocanvas';

export class PhyloCanvasTooltip extends Tooltip {
  constructor(tree, options) {
    super(tree, options);
  }

  createContent(node) {
    debugger
    let text = node.getChildProperties('id').length;
    const textNode = document.createTextNode(node.getChildProperties('id').length);
    this.element.appendChild(textNode);
  }
}
