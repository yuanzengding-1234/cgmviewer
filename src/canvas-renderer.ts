/**
 * Canvas rendering utilities for CGM preview
 */
export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  setupTransforms(): void {
    // Setup transformation tracking similar to the original code
    this.trackTransforms();
  }

  setTextAttributes(fontName: string, fontSize: number, bold: boolean, hjust: number, vjust: number): void {
    const fsize = fontSize.toString() + "px";
    const horizontal = ["left", "left", "center", "right"];
    const vertical = ["top", "hanging", "middle", "ideographic", "alphabetic", "bottom"];
    const font = fontName.toLowerCase();

    let fnt: string;
    const bld = (font.includes("bold") || font.includes("_demi")) ? "_bold" : "";
    const itc = (font.includes("italic") || font.includes("oblique")) ? "_italic" : "";

    if (font.includes("palatino")) {
      fnt = "palatino";
    } else if (font.includes("times")) {
      fnt = "Times";
    } else if (font.includes("helvetic_narrow")) {
      fnt = "arial_narrow";
    } else if (font.includes("helvetica")) {
      fnt = "arial";
    } else if (font.includes("arial")) {
      fnt = "arial";
    } else if (font.includes("courier")) {
      fnt = "courier";
    } else {
      fnt = "arial";
    }

    const fullFont = `${fsize} ${fnt}${bld}${itc}`;
    this.ctx.font = fullFont;
    this.ctx.textAlign = horizontal[hjust] as CanvasTextAlign;
    this.ctx.textBaseline = vertical[vjust] as CanvasTextBaseline;
  }

  private trackTransforms(): void {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    const xform = svg.createSVGMatrix();
    
    (this.ctx as any).getTransform = function() { return xform; };

    const savedTransforms: any[] = [];
    const save = this.ctx.save;
    this.ctx.save = function() {
      savedTransforms.push(xform.translate(0, 0));
      return save.call(this);
    };

    const restore = this.ctx.restore;
    this.ctx.restore = function() {
      const saved = savedTransforms.pop();
      if (saved) {
        Object.assign(xform, saved);
      }
      return restore.call(this);
    };

    const scale = this.ctx.scale;
    this.ctx.scale = function(sx: number, sy: number) {
      Object.assign(xform, xform.scaleNonUniform(sx, sy));
      return scale.call(this, sx, sy);
    };

    const translate = this.ctx.translate;
    this.ctx.translate = function(dx: number, dy: number) {
      Object.assign(xform, xform.translate(dx, dy));
      return translate.call(this, dx, dy);
    };

    const setTransform = this.ctx.setTransform;
    this.ctx.setTransform = function(a: number, b: number, c: number, d: number, e: number, f: number) {
      xform.a = a;
      xform.b = b;
      xform.c = c;
      xform.d = d;
      xform.e = e;
      xform.f = f;
      return setTransform.call(this, a, b, c, d, e, f);
    };

    const pt = svg.createSVGPoint();
    (this.ctx as any).transformedPoint = function(x: number, y: number) {
      pt.x = x;
      pt.y = y;
      return pt.matrixTransform(xform.inverse());
    };
  }
}