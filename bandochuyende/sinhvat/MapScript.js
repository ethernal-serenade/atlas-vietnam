//console.log("hahaha");
var op_street = L.tileLayer.provider("OpenStreetMap"),
    esri = L.tileLayer.provider("Esri.WorldImagery"),
    CartoDB = L.tileLayer.provider("CartoDB.Voyager"),
    Hydda_base = L.tileLayer.provider("Hydda.Base");

/*---- Đọc WMS Geosever ----*/
/*var base = L.tileLayer.wms('http://localhost:8080/geoserver/cite/wms?', {
    layers: 'tn_hanhchinh',
    tiled: true,
    format: 'image/png',
    transparent: true
});*/

/*---- Bộ Symbol 2 loại rừng chính ----*/
var trees = L.icon({
    iconUrl: 'symbols/trees_symbol.png',
    iconSize: [30, 30],
    iconAnchor: [19, 20],
    shadowUrl: 'symbols/circle_bg.png',
    shadowSize: [40, 40],
    shadowAnchor: [25, 25]
});

var deer = L.icon({
    iconUrl: 'symbols/deer_symbol.png',
    iconSize: [26, 26],
    iconAnchor: [18, 20],
    shadowUrl: 'symbols/circle_bg.png',
    shadowSize: [40, 40],
    shadowAnchor: [25, 25]
});

/*---- Dữ liệu Geojson ----*/
$.getJSON("../../../WebAtlas_VietNam_data/sinhvat/spatial_data/diem_rung_khubaoton.geojson", function (rung) {
    $.getJSON("../../../WebAtlas_VietNam_data/sinhvat/spatial_data/thamthucvat.geojson", function (thucvat) {
        $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/vn_biengioi.geojson", function (biengioi) {

            /*** Main Map ***/
            var map = L.map('mymap', {
                    center: [16.10, 106.60],
                    zoom: 6,
                    zoomControl: true
                }
            );

            /*** Ranh giới Việt Nam ***/
            var view_biengioi = L.geoJSON(biengioi, {
                style: function (feat) {
                    return {
                        stroke: true,
                        color: "#767676",
                        weight: 0.5,
                        dashArray: '8, 3'
                    }
                },
            });

            /*** Vườn quốc gia và khu bảo tồn thiên nhiên ***/
            var categories_rung = {}, category_rung;

            function add_rung(data, map) {
                L.geoJson(data, {
                    onEachFeature: function (feat, layer) {
                        layer.bindPopup("<span style='font-weight: bold; font-family: Arial'>" +
                            feat.properties.name_place + "</span> <br>" +
                            "<span style='font-weight: bold; font-family: Arial; color: #ff5f8c'>Loại hình: " +
                            feat.properties.type_place + "</span>");

                        category_rung = feat.properties.type_place;
                        if (typeof categories_rung[category_rung] === "undefined") {
                            //console.log(category_rung);
                            categories_rung[category_rung] = L.layerGroup().addTo(map);
                        }
                        categories_rung[category_rung].addLayer(layer);

                        /*--- Control Layer Data cho bộ điểm rừng ---*/
                        if (category_rung == "Vườn quốc gia") {
                            $('#forest_data').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addLayer(layer);
                                } else {
                                    map.removeLayer(layer);
                                }
                            });
                        } else if (category_rung == "Khu bảo tồn thiên nhiên") {
                            $('#deer_data').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addLayer(layer);
                                } else {
                                    map.removeLayer(layer);
                                }
                            });
                        }
                    },
                    pointToLayer: function (feat, latlng) {
                        //console.log(feat.properties.type_place)
                        if (feat.properties.type_place == "Vườn quốc gia") {
                            return L.marker(latlng, {icon: trees});
                        } else if (feat.properties.type_place == "Khu bảo tồn thiên nhiên") {
                            return L.marker(latlng, {icon: deer});
                        }
                    }
                });
            };
            add_rung(rung, map);

            /*** Thảm thực vật ***/
            /** Can not change var d **/
            function getColor_thamthucvat(d) {
                return d == "Rừng tự nhiên" ? "#00b81c" :
                    d == "Rừng thưa" ? "#8aff78" :
                        d == "Rừng tre nứa" ? "#e0ff22" :
                            d == "Rừng ngập mặn" ? "#989FC6" :
                                d == "Rừng ôn đới núi cao" ? "#6574AA" :
                                    d == "Rừng trồng" ? "#c275ac" :
                                        d == "Trảng cỏ, cây bụi" ? "#acffee" :
                                            d == "Thảm thực vật nông nghiệp" ? "#ffba7d" :
                                                d == "Loại khác" ? "#bf6737" :
                                                    "#0000ff";
            }

            function style_thamthucvat(feat) {
                return {
                    fillColor: getColor_thamthucvat(feat.properties.type_ttv),
                    weight: 0,
                    color: "transparent",
                    fillOpacity: 1
                }
            }

            var view_thamthucvat = L.geoJSON(thucvat, {
                style: style_thamthucvat,
                onEachFeature: function (feat, layer) {
                    if (feat.properties && feat.properties.type_ttv) {
                        layer.bindPopup("<span style='color: #000000; " +
                            "font-weight: bolder;'>Loại thảm thực vật: " + feat.properties.type_ttv + "</span>");
                    }
                }
            })

            /*** Legend ***/
            var thucvat_legend = L.control({position: "topleft"});
            thucvat_legend.onAdd = map => {
                var div = L.DomUtil.create('div', 'info legend');
                labels = ["symbols/trees_symbol.png", "symbols/deer_symbol.png"]

                div.innerHTML =
                    "<div class='legend-content' style='margin-top: 35%'>" +
                    "<div class='legend'>" +
                    ("<p class='title-legend-chart'>Thảm thực vật</p>") +
                    "<div class='row_legend'>" +
                    ("<div class='col_legend'>" +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #00b81c'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Rừng tự nhiên" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #8aff78'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Rừng thưa" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #e0ff22'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Rừng tre nữa" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #989FC6'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Rừng ngập mặn" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #6574AA'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Rừng ôn đới núi cao" + "</span>" +
                            "</div>") +
                        "</div>") +
                    ("<div class='col_legend'>" +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #c275ac'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Rừng trồng" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #acffee'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Trảng cỏ, cây bụi" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #ffba7d'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "TTV nông nghiệp" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #bf6737'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Loại khác" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #0000ff'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Sông, hồ" + "</span>" +
                            "</div>") +
                        "</div>") +
                    "</div>" +
                    ("<p class='title-legend-chart'>Khu bảo tồn thiên nhiên <br> " +
                        "và Vườn quốc gia</p>") +
                    "<div class='row_legend'>" +
                    ("<div class='col_legend'>" +
                        ("<div class='container_poi' style='margin-top: -20px'>" +
                            "<div class='overlay_poi'></div>" +
                            "<img src=" + labels[0] + " width='40' height='40' style='margin:15px 0px 0px 8px'>" +
                            "<span class='label_legend_symbol' style='font-size: 12px; font-weight: normal'>" +
                            "Vườn quốc gia" + "</span>" +
                            "</div>") +
                        "</div>") +
                    ("<div class='col_legend'>" +
                        ("<div class='container_poi' style='margin-top: -20px'>" +
                            "<div class='overlay_poi'></div>" +
                            "<img src=" + labels[1] + " width='35' height='35' style='margin:15px 0px 0px 9px'>" +
                            "<span class='label_legend_symbol' style='margin-top: 20px; margin-left: 18px; " +
                            "font-size: 12px; font-weight: normal'>" + "Khu bảo tồn thiên nhiên" + "</span>" +
                            "</div>") +
                        "</div>") +
                    "</div>" +
                    "</div>" +
                    "</div>";
                var draggable = new L.Draggable(div);
                draggable.enable();
                return div;
            };
            thucvat_legend.addTo(map);

            /*--- Control Legend ---*/
            $('#switch_legend').change(function () {
                if ($(this).prop('checked')) {
                    map.addControl(thucvat_legend);
                } else {
                    map.removeControl(thucvat_legend);
                }
            });

            Hydda_base.addTo(map);
            view_biengioi.addTo(map);
            view_thamthucvat.addTo(map);

            /*--- Control Layer Data ---*/
            $('#thucvat_data').change(function () {
                if ($(this).prop('checked')) {
                    map.addLayer(view_thamthucvat);
                } else {
                    map.removeLayer(view_thamthucvat);
                }
            });

            var miniMap = new L.Control.MiniMap(esri, {
                toggleDisplay: true,
            }).addTo(map);
        })
    })
})