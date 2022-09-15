
var map = L.map('map').setView([9.69957,-83.50116],8.2)
var google=L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {attribution: '<a href="https://www.google.at/permissions/geoguidelines/attr-guide.html">Map data ©2015 Google</a>',

}).addTo(map);

var carto_light = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})

var minimap = new L.Control.MiniMap(carto_light,
    {
        toggleDisplay: true,
        minimized: false,
        position: "bottomright"

    }).addTo(map);

// area de conservacion

// Crear funciones de interacción con el mouse (tema - intema - zoom)

// Función tema de zoom
function highlight (layer) {
	layer.setStyle({
        weight: 3,
        color: '#ece2f0',
        dashArray: '',
        fillOpacity: '0'
	});
	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
}

// Función reseteo de tema
function dehighlight (layer) {
  if (selected === null || selected._leaflet_id !== layer._leaflet_id) {
	  area_conservacion.resetStyle(layer);
  }
}

// Fución de zoom (fitBounds, flyToBounds)
function select (layer) {
  if (selected !== null) {
	var previous = selected;
  }
	map.flyToBounds(layer.getBounds());
	selected = layer;
	if (previous) {
	  dehighlight(previous);
	}
}

var selected = null;

// Función de features parta ingresar en onEachFeature dentor de L.geojson
function on_feature (feature, layer) {
	layer.on({
		'mouseover': function (e) {
		highlight(e.target);
		},
		'mouseout': function (e) {
		dehighlight(e.target);
		},
		'click': function (e) {
		select(e.target);
		}
	});
}

function style2(feature){
    return {
        fillColor: '#31a354',
        weight: 3,
        opacity: 5,
        color: '#a1d99b',
        dashArray: '1',
        fillOpacity: '0.7'
    };
}

var area_conservacion= L.geoJson(area_conservacion,{onEachFeature: on_feature,style: style2}).bindPopup(function(layer){
    let div = L.DomUtil.create('div');

    let handleObject = feature=>typeof(feature)=='object' ? JSON.stringify(feature) : feature;
    let fields = ["nombre_ac", "siglas_ac"];
    let aliases = ["Nombre:", "Siglas:"];
    let table = '<table>' +
        String(
        fields.map(
        (v,i)=>
        `<tr>
            <th>${aliases[i].toLocaleString()}</th>

            <td>${handleObject(layer.feature.properties[v]).toLocaleString()}</td>
        </tr>`).join(''))
    +'</table>';
    div.innerHTML=table;

    return div
    }
    ,{"className": "a_c"}).addTo(map);

// agregando control de capas y leyenda

var baseLayers = {
    "Google Satelital": google,
 };
 
 var overlays = {
    "Áreas de Conservación": area_conservacion,
 };
    
 L.control.layers(baseLayers, overlays, { collapsed:false, position:'bottomleft' }).addTo(map);
 area_conservacion.bringToFront();
 
