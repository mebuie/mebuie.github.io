
// Load custom modules
// script source must be placed above 'https://js.arcgis.com/4.9/'
var dojoConfig = {
  packages: [
    {
      name: "arcgisaddins",
      location: location.pathname.replace(/\/[^/]+$/, "") + "/arcgisaddins",
      main: "MapLayout"
    },
    {
      name: "rql",
      location: location.pathname.replace(/\/[^/]+$/, "") + "/rql",
    }

  ]
};