
var map = L.map('map').setView([9.69957,-83.50116],8.2)
var google=L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {attribution: '<a href="https://www.google.at/permissions/geoguidelines/attr-guide.html">Map data ©2015 Google</a>',

}).addTo(map);

//document.getElementById('Área de Interés').addEventListener('change', function(e){
//    let coords = e.target.value.split(",");
//    map.flyTo(coords,13);
//})

var carto_light = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})

var minimap = new L.Control.MiniMap(carto_light,
    {
        toggleDisplay: true,
        minimized: false,
        position: "bottomright"

    }).addTo(map);

//limite centroamerica

function style3(feature){
    return {
        weight: 2,
        opacity: 7,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0
    };
}
var ca= L.geoJson(ca,{style: style3}).addTo(map);

//
function style4(feature){
    return {
        weight: 2,
        opacity: 7,
        color: 'red',
        dashArray: '1',
        fillOpacity: 0.1
    };
}

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
//var area_conservacion= L.geoJson(area_conservacion,{onEachFeature: onEachFeature_2,style: style2}).bindPopup(function(layers){
//    return layers.feature.properties.nombre_ac}, {"className": "a_c"}).addTo(map);


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


// funciones para resaltado

function highlightFeature(e){
    var layer=e.target;
    layer.setStyle({
        weight: 2,
        color: '#e5f5f9',
        dashArray: '5',
        fillOpacity: 0.1
    });
    info.update(layer.feature.properties);
}

var co1;

function resetHighlight_1(e){
    co1.resetStyle(e.target);
    info.update();
}

function zoomToFeature_1(e){
    map.fitBounds(e.target.getBounds());
}

function onEachFeature_1(feature, layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout : resetHighlight_1,
        click:  zoomToFeature_1
    })
};

function style1(feature){
    return {
        weight: 2,
        opacity: 2,
        color: '#3182bd',
        dashArray: '1',
        fillOpacity: 0.1
    };
}
var co1= L.geoJson(co1,{style: style1, onEachFeature: onEachFeature_1 }).bindPopup(function(layers){
    return layers.feature.properties.nombre_cb}, {"className": "co1"}).addTo(map);

function style5(feature){
    return {
        weight: 2,
        opacity: 2,
        color: 'green',
        dashArray: '1',
        fillOpacity: 0.1
    };
}
var m_s= L.geoJson(m_s,{style: style2}).bindPopup(function(layers){
    return layers.feature.properties.name
}).addTo(map);

//rios 

function style7(feature){
    return {
        weight: 2,
        opacity: 2,
        color: '#9ecae1',
        dashArray: '1',
        fillOpacity: 0.1
    };
}
var rios= L.geoJson(rios,{style: style7}).bindPopup(function(layers){
    return layers.feature.properties.Nombre}, {"className" : "z_p"}
).addTo(map);


// puntos de medicion del GAM

function compostaje_gj_pointToLayer( feature , latlng) {
    var opts = {};

    const iconOptions = {"extraClasses": "fa-rotate-0", "icon": "eye-open", "iconColor": "white", "markerColor": "green", "prefix": "m_g"}
    const iconRootAlias = L.AwesomeMarkers
    opts.icon = new iconRootAlias.Icon(iconOptions)

    return new L.Marker(latlng, opts)
}
function compostaje_gj_onEachFeature(feature, layer) {
    layer.on({
    });
};

var m_g= L.geoJson(m_g,{onEachFeature: compostaje_gj_onEachFeature, pointToLayer: compostaje_gj_pointToLayer}).bindPopup(function(layers){
    return layers.feature.properties.Nombre},{"className": "m_g"}).addTo(map);



  // wms 
var snit = L.tileLayer.wms('http://ceniga.go.cr/geoserver/MOCUPU/ows', {
    layers: 'tramaverde_cbima_2021_conDTA',
    trasparent: true,
}).addTo(map);

var wmsLayer = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
    layers: 'SRTM30-Colored-Hillshade'
}).addTo(map);


// agregando control de capas y leyenda

var baseLayers = {
    "Google Satelital": google,
    "Hillshade": wmsLayer,

 };
 
 var overlays = {
    "Límite de Centroamérica": ca,
    "Áreas de Conservación": area_conservacion,
    "Áreas Silvestres":a_s,
    "Corredores Biológicos": co1,
    "Puntos de medición": m_s,
    "GAM":m_g,
    "Zona Protectora Maria Aguilar": zp_ma,
    "Red Hídrica": rios,


 };
    
 L.control.layers(baseLayers, overlays, { collapsed:false, position:'bottomleft' }).addTo(map);
 area_conservacion.bringToFront();
 zp_ma.remove();
 a_s.remove();
 m_s.remove();
 m_g.remove();
 co1.remove();
 snit.remove();
 rios.remove();


 
