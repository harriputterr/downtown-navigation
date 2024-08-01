export const buildings = [
    {
        id: "sec",
        uuid: "",
        name: "suncor-energy-center",
        structureType: "building",
        origin: [-114.06403763213298, 51.04794111891039, 0],
        url: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/sec.gltf",
        rotation: null,
        color: {b: 1, g:0 , r: 1}
    },

    {
        id: "tel-han",
        uuid: "",
        name: "telus-sky-hanover",
        structureType: "building",
        origin: [-114.06351381509242, 51.047114806967755, 0],
        url: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/telus-sky-hanover-building.glb",
        rotation: null,
        color: {b: 0, g:1 , r: 1}
    },

    {
        id: "bvs",
        uuid: "",
        name: "bow-valley-square",
        structureType: "building",
        origin: [-114.06625834283001, 51.047894691719506, 0],
        url: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/bow-valley-square.glb",
        rotation: null,
        color: {b: 0.96 , g:1 , r: 0} 
    },
    {
        id: "bfp",
        uuid: "",
        name: "brookfield-place",
        structureType: "building",
        origin: [-114.06667232155344,51.04708476058926, 0],
        url: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/brookfield.glb",
        rotation: null,
        color: {b: 0, g:0 ,r: 1}
    },
];

export const mainFloors = [
    {
        id: "sec-m",
        uuid: "",
        name: "suncor-energy-center-main-floor",
        structureType: "main-floor",
        origin: [-114.06399405236901, 51.04800708837064, 0],
        url: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/sec-m.gltf",
        rotation: null,
    },
    {
        id: "tel-han-m",
        uuid: "",
        name: "telus-sky-hanover-main-floor",
        structureType: "main-floor",
        origin: [-114.0635051877224, 51.04696456578236, 0],
        url: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/telus-sky-hanover-main-floor.glb",
        rotation: null,
    },
    {
        id: "bvs-m",
        uuid: "",
        name: "bow-valley-square-main-floor",
        structureType: "main-floor",
        origin: [-114.06660560660066, 51.04804243504623, 0],
        url: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/bow-valley-square-main-floor.glb",
        rotation: null,
    },
    {
        id: "bfp-m",
        uuid: "",
        name: "brookfield-place-main-floor",
        structureType: "main-floor",
        origin: [-114.06667232155344,51.04708476058926, 0],
        url: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/brookfield-main-floor.glb",
        rotation: null,
    },
    
];

export const plus15Floors = [
    {
        id: "bvs-p",
        uuid: "",
        name: "bow-valley-square-plus15",
        structureType: "plus15-floor",
        origin: [-114.06655488802559 ,51.047993544128246, 5],
        url: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/bow-valley-square-plus15-floor.glb",
        rotation: null,
        color: {b:0.3, g:0.8, r: 1}
    },
    {
        id: "tel-han-p",
        uuid: "",
        name: "telus-sky-hanover-plus15-floor",
        structureType: "plus15-floor",
        origin: [-114.0635051877224, 51.04696456578236, 5],
        url: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/telus-sky-hanover-plus15-floor.glb",
        rotation: null,
        color: {b:0.3, g:0.8, r: 1}
    },
    {
        id: "sec-p",
        uuid: "",
        name: "suncor-energy-center-plus15-floor",
        structureType: "plus15-floor",
        origin: [-114.06400075494047, 51.04802945079754, 5],
        url: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/suncor-plus15-level.glb",
        rotation: null,
        color: {b:0.3, g:0.8, r: 1}
    },
    {
        id: "bfp-p",
        uuid: "",
        name: "brookfield-place-plus15-floor",
        structureType: "main-floor",
        origin: [-114.06667232155344,51.04708476058926, 5],
        url: "https://harsingh-validator-bucket.s3.ca-central-1.amazonaws.com/Map+Architecture/GLTF-Files/brookfield-plus15-floor.glb",
        rotation: null,
        color: {b:0.3, g:0.8, r: 1}
    },
];

export const data = {
    buildings,
    mainFloors,
    plus15Floors,
};
