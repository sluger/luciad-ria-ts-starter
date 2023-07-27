import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer.js";
import { FeatureModel } from "@luciad/ria/model/feature/FeatureModel.js";
import { LayerType } from "@luciad/ria/view/LayerType.js";
import { Map } from "@luciad/ria/view/Map.js";
import { WFSFeatureStore } from "@luciad/ria/model/store/WFSFeatureStore.js";
import { CityPainter } from "./CityPainter";
import { addSelection } from "@luciad/ria/view/feature/FeaturePainterUtil.js";
import { LoadSpatially } from "@luciad/ria/view/feature/loadingstrategy/LoadSpatially.js";
import { QueryProvider } from "@luciad/ria/view/feature/QueryProvider.js";
import { gte, literal, property } from "@luciad/ria/ogc/filter/FilterFactory.js";

const BIG_CITY_FILTER = gte(property("TOT_POP"), literal(1000000));

class CityQueryProvider extends QueryProvider {
  getQueryLevelScales() {
    return [1 / 50000000];
  }

  getQueryForLevel(level: number) {
    return level === 0 ? { filter: BIG_CITY_FILTER } : null;
  }
}

function createCityLoadingStrategy() {
  // use dedicated
  return new LoadSpatially({ queryProvider: new CityQueryProvider() });
}

export function createCitiesLayer(map: Map) {
  const url = "https://sampleservices.luciad.com/wfs";
  const featureTypeName = "cities";
  // Create a WFS store
  return WFSFeatureStore.createFromURL(url, featureTypeName).then((wfsSore: WFSFeatureStore) => {
    // Create a model based on the created store
    const featureModel = new FeatureModel(wfsSore);
    // Create a feature layer
    const featureLayer = new FeatureLayer(featureModel, {
      label: "US Cities",
      layerType: LayerType.STATIC,
      painter: addSelection(new CityPainter()),
      selectable: true,
      loadingStrategy: createCityLoadingStrategy(),
    });
    // Add a layer to the map
    map.layerTree.addChild(featureLayer);
    return featureLayer;
  });
}
