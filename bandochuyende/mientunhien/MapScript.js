//console.log("hahaha");
var op_street = L.tileLayer.provider("OpenStreetMap"),
    esri = L.tileLayer.provider("Esri.WorldImagery"),
    CartoDB = L.tileLayer.provider("CartoDB.Voyager"),
    Hydda_base = L.tileLayer.provider("Hydda.Base");

var ggbasemap = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    attribution: 'Google Terrain',
    maxZoom: 20,
    minZoom: 0,
    label: 'Bản đồ địa hình Google',
    iconURL: 'https://mt1.google.com/vt/lyrs=p&x=101&y=60&z=7'
});

/*---- Đọc WMS Geosever ----*/
/*var base = L.tileLayer.wms('http://localhost:8080/geoserver/cite/wms?', {
    layers: 'tn_hanhchinh',
    tiled: true,
    format: 'image/png',
    transparent: true
});*/

$.getJSON("../../../WebAtlas_VietNam_data/mientunhien/spatial_data/mientunhien.geojson", function(mientunhien) {
    $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/vn_biengioi.geojson", function (biengioi) {
        /*** Main Map
         var map = L.map('mymap', {
            center: [16.10, 108.20],
            zoom: 6,
            zoomControl: true
        }
         ); ***/

        /*** leaflet Elevation Control ***/
        var opts = {
            map: {
                center: [16.10, 108.20],
                zoom: 6,
                markerZoomAnimation: true,
                zoomControl: true,
            },
            zoomControl: {
                position: 'topleft',
            },
            elevation: {
                options: {
                    theme: 'yellow-theme',
                    detachedView: true,
                    elevationDiv: '#elevation-div',
                },
            },
        };

        var tracks = [
            "../../../WebAtlas_VietNam_data/mientunhien/spatial_data/latcatAB.gpx",
            "../../../WebAtlas_VietNam_data/mientunhien/spatial_data/latcatCD.gpx",
            "../../../WebAtlas_VietNam_data/mientunhien/spatial_data/latcatEF.gpx"
        ];

        var map = L.map('mymap', opts.map);

        var view_latcat = L.gpxGroup(tracks, {
            elevation: true,
            elevation_options: {
                theme: "custom-theme",
                detachedView: true,
                elevationDiv: '#elevation-div',
                followPositionMarker: true,
                zFollow: 10
            },
            legend: false,
            distanceMarkers: false,
        });

        map.on('eledata_added eledata_clear', function (e) {
            var p = document.querySelector(".chart-placeholder");
            if (p) {
                p.style.display = e.type == 'eledata_added' ? 'none' : '';
            }
        });

        map.on('eledata_added', function (e) {
            var q = document.querySelector.bind(document);
            var track = e.track_info;

            //controlLayer.addOverlay(e.layer, e.name);
            q('.totlen .summaryvalue').innerHTML = track.distance.toFixed(2) + " km";
            q('.maxele .summaryvalue').innerHTML = track.elevation_max.toFixed(2) + " m";
            q('.minele .summaryvalue').innerHTML = track.elevation_min.toFixed(2) + " m";
        });
        view_latcat.addTo(map);

        /*** Ranh giới Việt Nam ***/
        var view_biengioi = L.geoJSON(biengioi, {
            style: function (feat) {
                return {
                    stroke: true,
                    color: "#000000",
                    weight: 0.5,
                    dashArray: '8, 3'
                }
            },
        });

        /*** Miền tự nhiên Việt Nam ***/
        function getColor_mientunhien(d) {
            return d == "Miền Bắc và Đông Bắc Bắc Bộ" ? "#c6ff61" :
                d == "Miền Tây Bắc và Bắc Trung Bộ" ? "#fffd8a" :
                    "#ffc4e2";
        }

        function style_mientunhien(feat) {
            return {
                fillColor: getColor_mientunhien(feat.properties.NAME_0),
                weight: 1,
                dashArray: '10, 8',
                color: "#ff1a4a",
                fillOpacity: 0.25
            }
        }

        var view_mientunhien = L.geoJSON(mientunhien, {
            style: style_mientunhien,
            onEachFeature: function (feat, layer) {
                if (feat.properties && feat.properties.NAME_0) {
                    layer.bindPopup("<span style='color: #767676; " +
                        "font-weight: bolder; font-family: Arial'>" + feat.properties.NAME_0 +
                        "</span>");
                }
            }
        });

        /*** Legend Chart Elevation ***/
        var mientunhien_legend = L.control({position: "topleft"});
        mientunhien_legend.onAdd = map => {
            var div = L.DomUtil.create('div', 'info legend');

            div.innerHTML =
                "<div class='legend-content' style='margin-top: 40%'>" +
                "<div class='legend'>" +
                ("<p class='title-legend-chart'>Lát cắt địa hình</p>") +
                "<div id='elevation-div' style='font-family: Arial'>" +
                "<p class='chart-placeholder'>Click chuột vào các lát cắt địa hình để xem biểu đồ...</p>" +
                "</div>" +
                "<div id='data-summary' class='data-summary'>" +
                "<span class='totlen'>" +
                "<span class='summarylabel' style='font-family: Arial'>Tổng chiều dài: </span>" +
                "<span class='summaryvalue' style='font-family: Arial'>0 km</span>" +
                "</span>" +
                " &amp; " +
                "<span class='maxele'>" +
                "<span class='summarylabel' style='font-family: Arial'>Điểm cao nhất: </span>" +
                "<span class='summaryvalue' style='font-family: Arial'>0 m</span>" +
                "</span>" +
                " &amp; " +
                "<span class='minele'>" +
                "<span class='summarylabel' style='font-family: Arial'>Điểm thấp nhất: </span>" +
                "<span class='summaryvalue' style='font-family: Arial'>0 m</span>" +
                "</span>" +
                "</div>" +
                "</div>" +
                "</div>";
            var draggable = new L.Draggable(div);
            draggable.enable();
            return div;
        };
        mientunhien_legend.addTo(map);

        /*--- Control Legend Chart Elevation ---*/
        $('#switch_legend').change(function () {
            if ($(this).prop('checked')) {
                map.addControl(mientunhien_legend);
            } else {
                map.removeControl(mientunhien_legend);
            }
        });

        ggbasemap.addTo(map);
        view_mientunhien.addTo(map);
        view_biengioi.addTo(map);

        /*--- Control Layer Data ---*/
        $('#mientunhien_data').change(function () {
            if ($(this).prop('checked')) {
                map.addLayer(view_mientunhien);
            } else {
                map.removeLayer(view_mientunhien);
            }
        });
    })
})