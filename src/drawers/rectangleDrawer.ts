/**
 * Copyright 2014-present Palantir Technologies
 * @license MIT
 */

import * as d3 from "d3";

import { Dataset } from "../core/dataset";

import { Drawer } from "./drawer";
import { AppliedDrawStep } from "./index";

export class Rectangle extends Drawer {

  constructor(dataset: Dataset) {
    super(dataset);
    this._svgElementName = "rect";
  }

  protected _canvasDraw(data: any[], step: AppliedDrawStep, context: CanvasRenderingContext2D) {
    const attrToAppliedProjector = step.attrToAppliedProjector;
    data.forEach((point, index) => {
      const resolvedAttrs = Object.keys(attrToAppliedProjector).reduce((obj, attrName) => {
        obj[attrName] = attrToAppliedProjector[attrName](point, index);
        return obj;
      }, {} as { [key: string]: any | number | string });

      context.beginPath();
      context.rect(resolvedAttrs["x"], resolvedAttrs["y"], resolvedAttrs["width"], resolvedAttrs["height"]);
      if (resolvedAttrs["stroke"]) {
        const strokeColor = d3.color(resolvedAttrs["stroke"]);
        if (resolvedAttrs["opacity"]) {
          strokeColor.opacity = resolvedAttrs["opacity"];
        }
        context.strokeStyle = strokeColor.rgb().toString();
        context.stroke();
      }
      if (resolvedAttrs["fill"]) {
        const fillColor = d3.color(resolvedAttrs["fill"]);
        if (resolvedAttrs["opacity"]) {
          fillColor.opacity = resolvedAttrs["opacity"];
        }
        context.fillStyle = fillColor.rgb().toString();
        context.fill();
      }
    });

    // if (this._className != null) {
    //   this.selection().classed(this._className, true);
    // }
  }

}
