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
              model.nameId = modelData.id

              tb.add(model);
              setPickables((prev) => [...prev, model]);
            });

            highlightOrigin(modelData.origin);
          };
          // const secOptions = {
          //   type: "gltf",
          //   obj: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/sec.gltf",
          //   units: "meters",
          //   scale: 1,
          //   rotation: { x: 90, y: 180, z: 0 },
          //   anchor: "center",
          //   bbox: false,
          // };

          // const floorPlanOptions = {
          //   type: "gltf",
          //   obj: floorPlanUrl,
          //   units: "meters",
          //   scale: 1,
          //   rotation: { x: 90, y: 180, z: 0 },
          //   anchor: "center",
          //   bbox: false,
          // };

          // tb.loadObj(secOptions, function (model) {
          //   model.setCoords(origin);
          //   model.addTooltip(
          //     "Suncor Energy Center Building in Calgary Downtown"
          //   );
          //   tb.add(model);
          //   model.traverse((child) => {
          //     if (child.isMesh && child.material) {
          //       child.material.format = THREE.RGBAFormat;
          //       child.material.transparent = true;
          //       child.material.opacity = 1;
          //       child.material.wireframe = true;
          //       console.log(child)
          //     }
          //   });
          //   pickables.push(model);
          // });

          // tb.loadObj(floorPlanOptions, function (model) {
          //   const origin = [-114.06399405236901, 51.04800708837064, 4.9];
          //   model.setCoords(origin);
          //   tb.add(model);

          //   model.traverse((child) => {
          //     if (child.isMesh && child.material) {
          //       child.material.format = THREE.RGBAFormat;
          //       child.material.transparent = true;
          //       child.material.opacity = 0.1;
          //       console.log(child)
          //     }
          //   });
          //   pickables.push(model);

          //   highlightOrigin(origin);
          // });

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