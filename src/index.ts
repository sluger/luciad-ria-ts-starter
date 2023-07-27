import "../license/license-loader";
import { WMSTileSetModel } from "@luciad/ria/model/tileset/WMSTileSetModel.js";
import { RasterTileSetLayer } from "@luciad/ria/view/tileset/RasterTileSetLayer.js";
import { getReference } from "@luciad/ria/reference/ReferenceProvider.js";
import { WebGLMap } from "@luciad/ria/view/WebGLMap.js";

//Create a new map instance, and display it in the div with the "map" id
const mapReference = getReference("EPSG:4978");
const map = new WebGLMap("map", { reference: mapReference });

//Add some WMS data to the map
const server = "https://sampleservices.luciad.com/wms";
const dataSetName = "4ceea49c-3e7c-4e2d-973d-c608fb2fb07e";
WMSTileSetModel.createFromURL(server, [{ layer: dataSetName }]).then((model) => {
  //Once the data is available, create a layer for it
  const layer = new RasterTileSetLayer(model);
  //and add the layer to the map
  map.layerTree.addChild(layer);
});
