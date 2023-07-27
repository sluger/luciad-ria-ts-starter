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
import { clusteredFeatures, isCluster } from "@luciad/ria/view/feature/transformation/ClusteringTransformer.js";

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
    if (isCluster(feature)) {
      const featuresInCluster = clusteredFeatures(feature);
      const numberOfFeaturesInCluster = featuresInCluster.length;
      const firstFeatureInCluster = featuresInCluster[0];
      const style = this.isBigCity(firstFeatureInCluster) ? this._bigCityStyle : this._cityStyle;
      style.zOrder = firstFeatureInCluster.properties.TOT_POP * numberOfFeaturesInCluster;
      geoCanvas.drawIcon(shape, style);
    } else {
      const style = this.isBigCity(feature) ? this._bigCityStyle : this._cityStyle;
      style.zOrder = feature.properties.TOT_POP;
      geoCanvas.drawIcon(shape, style);
    }
  }

  paintLabel(labelCanvas: LabelCanvas, feature: Feature, shape: Shape, layer: Layer, map: Map, paintState: PaintState) {
    if (isCluster(feature)) {
      const featuresInCluster = clusteredFeatures(feature);

      let contents;
      if (paintState.selected) {
        contents = featuresInCluster
          .map((aFeature) => {
            return this.getContentsElements("City", aFeature.properties.CITY);
          })
          .join("");
      } else {
        const total = featuresInCluster.reduce((sum, aFeature) => sum + aFeature.properties.TOT_POP, 0);
        contents = this.getContentsElements("Total", total);
      }
      const header = `Cluster of ${featuresInCluster.length}`;
      const label = this.getLabelText(header, contents);
      labelCanvas.drawLabel(label, shape, this._labelStyle);
    } else {
      const populationInfo = paintState.selected
        ? this.getContentsElements("Population", feature.properties.TOT_POP)
        : "";

      const contents = this.getContentsElements("State", feature.properties.STATE) + populationInfo;
      const label = this.getLabelText(feature.properties.CITY, contents);
      labelCanvas.drawLabel(label, shape, this._labelStyle);
    }
  }

  getContentsElements(caption: string, value: string | number) {
    return `<div class="type">${caption} : ${value}</div>`;
  }

  getLabelText(header: string, contents: string) {
    return `
            <div class="labelwrapper">
              <div class="blueColorLabel">
                <div class="theader">
                  <div class="leftTick blueColorTick"></div>
                  <div class="rightTick blueColorTick"></div>
                  <div class="name">${header}</div>
                </div>
                ${contents}
              </div>
            </div>`;
  }

  isBigCity(feature: Feature) {
    return !!feature.properties.TOT_POP && feature.properties.TOT_POP > 1000000;
  }
}
