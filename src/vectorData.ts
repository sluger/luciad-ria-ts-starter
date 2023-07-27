import { FeatureLayer } from "@luciad/ria/view/feature/FeatureLayer.js";
import { FeatureModel } from "@luciad/ria/model/feature/FeatureModel.js";
import { LayerType } from "@luciad/ria/view/LayerType.js";
import { Map } from "@luciad/ria/view/Map.js";
import { WFSFeatureStore } from "@luciad/ria/model/store/WFSFeatureStore.js";

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
      selectable: true,
    });
    // Add a layer to the map
    map.layerTree.addChild(featureLayer);
    return featureLayer;
  });
}
