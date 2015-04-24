///<reference path="../../reference.ts" />

module Plottable {
export module Plots {
  export class Grid extends Rectangle<any, any> {
    private _colorScale: Scales.AbstractScale<any, string>;

    /**
     * Constructs a GridPlot.
     *
     * A GridPlot is used to shade a grid of data. Each datum is a cell on the
     * grid, and the datum can control what color it is.
     *
     * @constructor
     * @param {Scale.AbstractScale} xScale The x scale to use.
     * @param {Scale.AbstractScale} yScale The y scale to use.
     * @param {Scale.Color|Scale.InterpolatedColor} colorScale The color scale
     * to use for each grid cell.
     */
    constructor(xScale: Scales.AbstractScale<any, any>, yScale: Scales.AbstractScale<any, any>,
      colorScale: Scales.AbstractScale<any, string>) {
      super(xScale, yScale);
      this.classed("grid-plot", true);

      // The x and y scales should render in bands with no padding for category scales
      if (xScale instanceof Scales.Category) {
        xScale.innerPadding(0).outerPadding(0);
      }
      if (yScale instanceof Scales.Category) {
        yScale.innerPadding(0).outerPadding(0);
      }

      this._colorScale = colorScale;
      this.animator("cells", new Animators.Null());
    }

    public addDataset(keyOrDataset: any, dataset?: any) {
      if (this._datasetKeysInOrder.length === 1) {
        Utils.Methods.warn("Only one dataset is supported in Grid plots");
        return this;
      }
      super.addDataset(keyOrDataset, dataset);
      return this;
    }

    protected _getDrawer(key: string) {
      return new Drawers.Rect(key, true);
    }

    /**
     * @param {string} attrToSet One of ["x", "y", "x2", "y2", "fill"]. If "fill" is used,
     * the data should return a valid CSS color.
     */
    public project(attrToSet: string, accessor: any, scale?: Scales.AbstractScale<any, any>) {
      super.project(attrToSet, accessor, scale);

      if (attrToSet === "x") {
        if (scale instanceof Scales.Category) {
          this.project("x1", (d: any, i: number, u: any, m: Plots.PlotMetadata) => {
            return scale.scale(this._projections["x"].accessor(d, i, u, m)) - scale.rangeBand() / 2;
          });
          this.project("x2", (d: any, i: number, u: any, m: Plots.PlotMetadata) => {
            return scale.scale(this._projections["x"].accessor(d, i, u, m)) + scale.rangeBand() / 2;
          });
        }
        if (scale instanceof Scales.AbstractQuantitative) {
          this.project("x1", (d: any, i: number, u: any, m: Plots.PlotMetadata) => {
            return scale.scale(this._projections["x"].accessor(d, i, u, m));
          });
        }
      }

      if (attrToSet === "y") {
        if (scale instanceof Scales.Category) {
          this.project("y1", (d: any, i: number, u: any, m: Plots.PlotMetadata) => {
            return scale.scale(this._projections["y"].accessor(d, i, u, m)) - scale.rangeBand() / 2;
          });
          this.project("y2", (d: any, i: number, u: any, m: Plots.PlotMetadata) => {
            return scale.scale(this._projections["y"].accessor(d, i, u, m)) + scale.rangeBand() / 2;
          });
        }
        if (scale instanceof Scales.AbstractQuantitative) {
          this.project("y1", (d: any, i: number, u: any, m: Plots.PlotMetadata) => {
            return scale.scale(this._projections["y"].accessor(d, i, u, m));
          });
        }
      }

      if (attrToSet === "fill") {
        this._colorScale = this._projections["fill"].scale;
      }

      return this;
    }

    protected _generateDrawSteps(): Drawers.DrawStep[] {
      return [{attrToProjector: this._generateAttrToProjector(), animator: this._getAnimator("cells")}];
    }
  }
}
}
