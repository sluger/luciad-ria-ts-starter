import { FeaturePainter, PaintState } from "@luciad/ria/view/feature/FeaturePainter.js";
import { IconStyle } from "@luciad/ria/view/style/IconStyle.js";
import { GeoCanvas } from "@luciad/ria/view/style/GeoCanvas.js";
import { Feature } from "@luciad/ria/model/feature/Feature.js";
import { Shape } from "@luciad/ria/shape/Shape.js";
import { Layer } from "@luciad/ria/view/Layer.js";
import { Map } from "@luciad/ria/view/Map.js";
import { PointLabelStyle } from "@luciad/ria/view/style/PointLabelStyle.js";
import { PointLabelPosition } from "@luciad/ria/view/style/PointLabelPosition.js";
import { LabelCanvas } from "@luciad/ria/view/style/LabelCanvas.js";

export class CityPainter extends FeaturePainter {
  _bigCityStyle: IconStyle = {
    url: "./resources/bigCity.png",
    width: "32px",
    height: "32px",
  };
  _cityStyle: IconStyle = {
    url: "./resources/city.png",
    width: "32px",
    height: "32px",
  };
  _labelStyle: PointLabelStyle = {
    positions: PointLabelPosition.NORTH,
    offset: 15,
  };

  paintBody(geoCanvas: GeoCanvas, feature: Feature, shape: Shape, layer: Layer, map: Map, paintState: PaintState) {
    const style = this.isBigCity(feature) ? this._bigCityStyle : this._cityStyle;
    style.zOrder = feature.properties.TOT_POP;
    geoCanvas.drawIcon(shape, style);
  }

  isBigCity(feature: Feature) {
    return !!feature.properties.TOT_POP && feature.properties.TOT_POP > 1000000;
  }

  paintLabel(labelCanvas: LabelCanvas, feature: Feature, shape: Shape, layer: Layer, map: Map, paintState: PaintState) {
    const moreInfo = paintState.selected ? `<div class="type">Population : ${feature.properties.TOT_POP}</div>` : "";
    const label = `
            <div class="labelwrapper">
              <div class="blueColorLabel">
                <div class="theader">
                  <div class="leftTick blueColorTick"></div>
                  <div class="rightTick blueColorTick"></div>
                  <div class="name">${feature.properties.CITY}</div>
                </div>
                <div class="type">State : ${feature.properties.STATE}</div>
                ${moreInfo}
              </div>
            </div>`;
    labelCanvas.drawLabel(label, shape, this._labelStyle);
  }
}
