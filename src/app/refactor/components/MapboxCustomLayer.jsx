export const createCustomLayer = (layerName, tb, modelData, setPickables) => {
    const customLayer = {
        id: layerName,
        type: "custom",
        renderingMode: "3d",
        onAdd: function (map, gl) {
          const createModels = (modelData) => {
            const options = {
              type: "gltf",
              obj: modelData.url,
              units: "meters",
              scale: 1,
              rotation: modelData.rotation
                ? modelData.rotation
                : { x: 90, y: 180, z: 0 },
              anchor: "center",
              bbox: false,
            };

            tb.loadObj(options, function (model) {
              model.setCoords(modelData.origin);
              model.addTooltip(modelData.name);
              model.traverse((child) => {
                if (child.isMesh && child.material){
                  child.nameId = modelData.id
                }
              })

              model.modelId = modelData.id
              model.addEventListener("SelectedChange", (e) => {console.log(e)})

              tb.add(model);
              setPickables((prev) => [...prev, model]);
            });

            highlightOrigin(modelData.origin);
          };
          
          const highlightOrigin = (origin) => {
            const sphere = tb
              .sphere({
                radius: 1, // adjust radius as needed
                units: "meters",
                color: "black",
                material: "MeshToonMaterial",
                anchor: "center",
              })
              .setCoords(origin);
              sphere.removeLabel();
            tb.add(sphere);
          };
          modelData.map((element) => {
            createModels(element);
          });
        },
        render: function (gl, matrix) {
          tb.update();
        },
      };
      return customLayer;
}