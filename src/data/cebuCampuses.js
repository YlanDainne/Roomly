export const campusOptions = [
  'All Universities',
  'CIT University',
  'University of San Jose-Recoletos Basak Campus',
  'University of San Jose-Recoletos Main Campus',
  'University of Cebu Pardo-Talisay Campus',
  'University of Cebu Main Campus',
  'University of Cebu METC',
  'University of Cebu Banilad Campus',
  "Cebu Doctors' University",
  'Velez College',
  'Southwestern University PHINMA',
  'Cebu Technological University Main Campus',
  'Cebu Normal University',
  'University of San Carlos South Campus',
  'University of San Carlos Main Campus',
  'University of San Carlos Talamban Campus'
];

export const campusCatalog = [
  {
    name: 'CIT University',
    city: 'Cebu City',
    neighborhood: 'Mambaling',
    latitude: 10.29,
    longitude: 123.873,
    hotspotLabel: 'Mambaling / CIT'
  },
  {
    name: 'University of San Jose-Recoletos Basak Campus',
    city: 'Cebu City',
    neighborhood: 'Basak Pardo',
    latitude: 10.2798,
    longitude: 123.8469,
    hotspotLabel: 'Basak Pardo / USJ-R'
  },
  {
    name: 'University of San Jose-Recoletos Main Campus',
    city: 'Cebu City',
    neighborhood: 'Magallanes',
    latitude: 10.2956,
    longitude: 123.8982,
    hotspotLabel: 'Colon / USJ-R Main'
  },
  {
    name: 'University of Cebu Pardo-Talisay Campus',
    city: 'Cebu City',
    neighborhood: 'Pardo',
    latitude: 10.2658,
    longitude: 123.8378,
    hotspotLabel: 'Pardo / UC Pardo-Talisay'
  },
  {
    name: 'University of Cebu Main Campus',
    city: 'Cebu City',
    neighborhood: 'Colon',
    latitude: 10.2969,
    longitude: 123.8978,
    hotspotLabel: 'Colon / UC Main'
  },
  {
    name: 'University of Cebu METC',
    city: 'Mandaue City',
    neighborhood: 'Subangdaku',
    latitude: 10.3274,
    longitude: 123.9324,
    hotspotLabel: 'Subangdaku / UC METC'
  },
  {
    name: 'University of Cebu Banilad Campus',
    city: 'Cebu City',
    neighborhood: 'Banilad',
    latitude: 10.3377,
    longitude: 123.906,
    hotspotLabel: 'Banilad / UC Banilad'
  },
  {
    name: "Cebu Doctors' University",
    city: 'Mandaue City',
    neighborhood: 'Mandaue',
    latitude: 10.3303,
    longitude: 123.939,
    hotspotLabel: 'Mandaue / CDU'
  },
  {
    name: 'Velez College',
    city: 'Cebu City',
    neighborhood: 'Capitol Site',
    latitude: 10.3045,
    longitude: 123.8907,
    hotspotLabel: 'Capitol Site / Velez'
  },
  {
    name: 'Southwestern University PHINMA',
    city: 'Cebu City',
    neighborhood: 'Urgello',
    latitude: 10.3018,
    longitude: 123.8894,
    hotspotLabel: 'Urgello / SWU'
  },
  {
    name: 'Cebu Technological University Main Campus',
    city: 'Cebu City',
    neighborhood: 'San Roque',
    latitude: 10.2966,
    longitude: 123.9065,
    hotspotLabel: 'San Roque / CTU Main'
  },
  {
    name: 'Cebu Normal University',
    city: 'Cebu City',
    neighborhood: 'Osmena Boulevard',
    latitude: 10.2958,
    longitude: 123.8937,
    hotspotLabel: 'Osmena Boulevard / CNU'
  },
  {
    name: 'University of San Carlos South Campus',
    city: 'Cebu City',
    neighborhood: 'Sambag I',
    latitude: 10.3013,
    longitude: 123.8926,
    hotspotLabel: 'Sambag I / USC South'
  },
  {
    name: 'University of San Carlos Main Campus',
    city: 'Cebu City',
    neighborhood: 'Magallanes',
    latitude: 10.2983,
    longitude: 123.8975,
    hotspotLabel: 'Magallanes / USC Main'
  },
  {
    name: 'University of San Carlos Talamban Campus',
    city: 'Cebu City',
    neighborhood: 'Talamban',
    latitude: 10.3768,
    longitude: 123.9146,
    hotspotLabel: 'Talamban / USC Talamban'
  }
];

export const mapCenter = [10.3157, 123.8854];

export const getCampusByName = (name) => campusCatalog.find((campus) => campus.name === name);
