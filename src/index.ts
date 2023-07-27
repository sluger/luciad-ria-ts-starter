import "../license/license-loader";
import { WMSTileSetModel } from "@luciad/ria/model/tileset/WMSTileSetModel.js";
import { Map } from "@luciad/ria/view/Map.js";
import { WebGLMap } from "@luciad/ria/view/WebGLMap.js";
import { RasterTileSetLayer } from "@luciad/ria/view/tileset/RasterTileSetLayer.js";

import { getReference } from "@luciad/ria/reference/ReferenceProvider.js";
import { createBounds } from "@luciad/ria/shape/ShapeFactory.js";
import { createCitiesLayer } from "./vectorData";

//Create a new map instance, and display it in the div with the "map" id
const mapReference = getReference("EPSG:4978");
const map = new WebGLMap("map", { reference: mapReference });

//Add some WMS data to the map
const server = "https://sampleservices.luciad.com/wms";
const dataSetName = "4ceea49c-3e7c-4e2d-973d-c608fb2fb07e";
WMSTileSetModel.createFromURL(server, [{ layer: dataSetName }]).then((model) => {
  const layer = new RasterTileSetLayer(model);
  map.layerTree.addChild(layer, "bottom");

  if (layer.model && layer.model.bounds) {
    // Fitting to the bounds of a raster layer
    map.mapNavigator.fit({
      bounds: layer.model.bounds,
      animate: true,
    });
  }
});

createCitiesLayer(map).then(function (citiesLayer) {
  const queryFinishedHandle = citiesLayer.workingSet.on("QueryFinished", function () {
    if (citiesLayer.bounds) {
      map.mapNavigator.fit({
        bounds: citiesLayer.bounds,
        animate: true,
      });
    }
    queryFinishedHandle.remove();
  });
});

map.on("SelectionChanged", function (selectionChangeEvent) {
  const selectedCity = selectionChangeEvent.selectionChanges[0].selected[0];
  //@ts-ignore
  if (selectedCity && selectedCity.shape && selectedCity.shape.focusPoint) {
    map.mapNavigator.pan({
      animate: true,
      //@ts-ignore
      targetLocation: selectedCity.shape.focusPoint,
    });
  }
});
