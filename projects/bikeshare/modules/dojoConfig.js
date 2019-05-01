
// Load custom modules
// script source must be placed above 'https://js.arcgis.com/4.9/'
var dojoConfig = {
  packages: [
    {
      name: "modules",
      location: location.pathname.replace(/\/[^/]+$/, "") + "/modules",
      main: "MapLayout"
    }
  ]
};