import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer.js";
import { FeatureModel } from "@luciad/ria/model/feature/FeatureModel.js";
import { LayerType } from "@luciad/ria/view/LayerType.js";
import { Map } from "@luciad/ria/view/Map.js";
import { WFSFeatureStore } from "@luciad/ria/model/store/WFSFeatureStore.js";
import { Feature } from "@luciad/ria/model/feature/Feature.js";
import { CityPainter } from "./CityPainter";
import { addSelection } from "@luciad/ria/view/feature/FeaturePainterUtil.js";
import { LoadSpatially } from "@luciad/ria/view/feature/loadingstrategy/LoadSpatially.js";
import { QueryProvider } from "@luciad/ria/view/feature/QueryProvider.js";
import { gte, literal, property } from "@luciad/ria/ogc/filter/FilterFactory.js";
import { create } from "@luciad/ria/view/feature/transformation/ClusteringTransformer.js";
import { Classifier } from "@luciad/ria/view/feature/transformation/Classifier.js";

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

class CityClassifier extends Classifier {
  getClassification(feature: Feature) {
    const isBigCity = feature.properties.TOT_POP > 1000000;
    return isBigCity ? "bigCity" : "city";
  }
}

function createCityTransformer() {
  // Create Clustering transformer
  return create({
    classifier: new CityClassifier(),
    defaultParameters: {
      clusterSize: 100,
      minimumPoints: 3,
    },
  });
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
      transformer: createCityTransformer(),
    });

    // Add a layer to the map
    map.layerTree.addChild(featureLayer);
    return featureLayer;
  });
}

export function createOSMLayer(map: Map) {
  const url = "https://sampleservices.luciad.com/wfs";
  const featureTypeName = "osm_places";

  return WFSFeatureStore.createFromURL(url, featureTypeName).then((wfsSore) => {
    const featureModel = new FeatureModel(wfsSore);
    const featureLayer = new FeatureLayer(featureModel, {
      label: "OSM Places",
      layerType: LayerType.STATIC,
      selectable: true,
      // Here we set the minScale so that the layer will only be rendered when the map scale is less than 1/350000
      minScale: 1 / 350000,
    });
    map.layerTree.addChild(featureLayer);
    return featureLayer;
  });
}
