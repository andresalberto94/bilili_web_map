
var map = L.map('map').setView([9.69957,-83.50116],8.2)

var google=L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {attribution: '<a href="https://www.google.at/permissions/geoguidelines/attr-guide.html">Map data ©2015 Google</a>',
}).addTo(map);

var wmsLayer = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
    layers: 'TOPO-OSM-WMS'
}).addTo(map);

var carto_light = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})

var minimap = new L.Control.MiniMap(carto_light,
    {
        toggleDisplay: true,
        minimized: false,
        position: "bottomright"

    }).addTo(map);

// Area de conservacion

// Crear funciones de interacción con el mouse (tema - intema - zoom)

// Función tema de zoom
function highlight_ac (layer) {
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
function dehighlight_ac (layer) {
  if (selected_ac === null || selected_ac._leaflet_id !== layer._leaflet_id) {
	area_conservacion.resetStyle(layer);
  }
}

// Función de zoom (fitBounds, flyToBounds)
function select_ac (layer) {
  if (selected_ac !== null) {
	var previous_ac = selected_ac;
  }
	map.flyToBounds(layer.getBounds());
	selected_ac = layer;
	if (previous_ac) {
	  dehighlight_ac(previous_ac);
	}
}

// Función de features parta ingresar en onEachFeature dentro de L.geojson
function on_feature_ac (feature, layer) {
	layer.on({
		'mouseover': function (e) {
		highlight_ac(e.target);
		},
		'mouseout': function (e) {
		dehighlight_ac(e.target);
		},
		'click': function (e) {
		select_ac(e.target);
		}
	});
}

var selected_ac = null;

// Estilo áreas de Conservación

function style_ac(feature){
    return {
        fillColor: '#31a354',
        weight: 3,
        opacity: 5,
        color: '#a1d99b',
        dashArray: '1',
        fillOpacity: '0.7'
    };
}

var area_conservacion= L.geoJson(area_conservacion,{onEachFeature: on_feature_ac,style: style_ac}).bindPopup(function(layer){
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

// Provincia ------------------------------------------------------------------------------------------------

// Función tema de zoom
function highlight_prov (layer) {
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
function dehighlight_prov (layer) {
  if (selected_prov === null || selected_prov._leaflet_id !== layer._leaflet_id) {
	prov.resetStyle(layer);
  }
}

// Función de zoom (fitBounds, flyToBounds)
function select_prov (layer) {
  if (selected_prov !== null) {
	var previous_prov = selected_prov;
  }
	map.flyToBounds(layer.getBounds());
	selected_prov = layer;
	if (previous_prov) {
	  dehighlight_prov(previous_prov);
	}
}

// Función de features parta ingresar en onEachFeature dentro de L.geojson
function on_feature_prov (feature, layer) {
	layer.on({
		'mouseover': function (e) {
		highlight_prov(e.target);
		},
		'mouseout': function (e) {
		dehighlight_prov(e.target);
		},
		'click': function (e) {
		select_prov(e.target);
		}
	});
}

var selected_prov = null;

// Estilo Provincias

function getColor(league){
    return league == 'Heredia' ? '#B43139' :
          league == 'Alajuela' ? '#283E93' :
          league == 'San José' ? '#755142' :
          league == 'Puntarenas' ? '#F0C816' :
          league == 'Guanacaste' ? '#C25397' :
          league == 'Limón' ? '#C79381' :
          league == 'Cartago' ? '#459449' :
            '#F3F3F3';
}
	   
function style_prov(feature){
    return {
        fillColor: getColor(feature.properties.provincia),
        weight: 2,
        opacity: 1,
        color: '#a1d99b',
        dashArray: '1',
        fillOpacity: 0.4
    };
}

var prov= L.geoJson(prov,{style: style_prov, onEachFeature: on_feature_prov}).bindPopup(function(layers){
    return layers.feature.properties.provincia}, {"className" : "prov"}
).addTo(map);

// ------------------------------------------------------------------------------------------------------------------

// agregando control de capas y leyenda

var baseLayers = {
    "Google Satelital": google,
	"Topo OSM": wmsLayer
 };
 
 var overlays = {
    "Áreas de Conservación": area_conservacion,
	"Provincias": prov
 };
    
L.control.layers(baseLayers, overlays, { collapsed:false, position:'bottomleft' }).addTo(map);
area_conservacion.bringToFront();
wmsLayer.remove();
prov.remove();
 
