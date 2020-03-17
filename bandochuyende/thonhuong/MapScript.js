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

/*---- Dữ liệu Geojson ----*/
//$.getJSON("../../../WebAtlas_VietNam_data/thonhuong/spatial_data/dat_vn.geojson", function (thonhuong) {
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

        /*** Thổ nhưỡng ***/
        var thonhuong = service_tiles + "atlas_vietnam_tiles/t_dat_vn/{z}/{x}/{y}.pbf";

        function getColor_thonhuong(d) {
            return d == "Đất feralit trên đá badan" ? "#F43E1C" :
                d == "Đất feralit trên đá vôi" ? "#C56393" :
                    d == "Đất feralit trên các loại đá khác" ? "#E4A369" :
                        d == "Đất phù sa sông" ? "#98BF62" :
                            d == "Đất phèn" ? "#A2ADED" :
                                d == "Đất mặn" ? "#595FAA" :
                                    d == "Đất cát biển" ? "#fff84e" :
                                        d == "Đất xám trên phù sa cổ" ? "#bebebe" :
                                            "#92513D";
        }

        var style_thonhuong = {
            dat_vn: function (feat) {
                return {
                    fill: true,
                    fillColor: getColor_thonhuong(feat.type_dat),
                    weight: 0,
                    color: "transparent",
                    fillOpacity: 1
                }
            }
        }

        var view_thonhuong = L.vectorGrid.protobuf(thonhuong, {
            vectorTileLayerStyles: style_thonhuong,
            interactive: true,
            maxZoom: 19,
            maxNativeZoom: 14,
            getFeatureId: function (feat) {
                return feat.properties.type_dat;
            }
        })

        view_thonhuong.on('click', function (e) {
            view_thonhuong.bindPopup("<span style='color: #ff8d3b; " +
                "font-weight: bolder;'>Loại đất: " + e.layer.properties.type_dat + "</span>")
        })

        /* View dạng GeoJSON
        var view_thonhuong = L.geoJSON(thonhuong, {
            style: style_thonhuong,
            onEachFeature: function (feat, layer) {
                if (feat.properties && feat.properties.type_dat) {
                    layer.bindPopup("<span style='color: #ff8d3b; " +
                        "font-weight: bolder;'>Loại đất: " + feat.properties.type_dat + "</span>");
                }
            }
        }) */

        /*** Legend ***/
        var thonhuong_legend = L.control({position: "topleft"});
        thonhuong_legend.onAdd = map => {
            var div = L.DomUtil.create('div', 'info legend');

            div.innerHTML =
                "<div class='legend-content' style='margin-top: 35%'>" +
                "<div class='legend'>" +
                ("<p class='title-legend-chart' style='font-size: 20px'>Các nhóm và các loại đất chính</p>") +
                ("<p class='title-legend-chart'>Nhóm đất feralit</p>") +
                "<div class='row_legend'>" +
                ("<div class='col_legend'>" +
                    ("<div class='container_rec'>" +
                        "<div class='rec' style='background-color: #F43E1C'></div>" +
                        "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất feralit trên đá badan" + "</span>" +
                        "</div>") + '<br>' +
                    ("<div class='container_rec'>" +
                        "<div class='rec' style='background-color: #C56393'></div>" +
                        "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất feralit trên đá vôi" + "</span>" +
                        "</div>") +
                    "</div>") +
                ("<div class='col_legend'>" +
                    ("<div class='container_rec'>" +
                        "<div class='rec' style='background-color: #E4A369'></div>" +
                        "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất feralit trên các loại đá khác" + "</span>" +
                        "</div>") +
                    "</div>") +
                "</div>" +
                ("<p class='title-legend-chart'>Nhóm đất phù sa</p>") +
                "<div class='row_legend'>" +
                ("<div class='col_legend'>" +
                    ("<div class='container_rec'>" +
                        "<div class='rec' style='background-color: #98BF62'></div>" +
                        "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất phù sa sông" + "</span>" +
                        "</div>") + '<br>' +
                    ("<div class='container_rec'>" +
                        "<div class='rec' style='background-color: #A2ADED'></div>" +
                        "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất phèn" + "</span>" +
                        "</div>") + '<br>' +
                    ("<div class='container_rec'>" +
                        "<div class='rec' style='background-color: #595FAA'></div>" +
                        "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất mặn" + "</span>" +
                        "</div>") +
                    "</div>") +
                ("<div class='col_legend'>" +
                    ("<div class='container_rec'>" +
                        "<div class='rec' style='background-color: #fff84e'></div>" +
                        "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất cát biển" + "</span>" +
                        "</div>") + '<br>' +
                    ("<div class='container_rec'>" +
                        "<div class='rec' style='background-color: #bebebe'></div>" +
                        "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất xám trên phù sa cổ" + "</span>" +
                        "</div>") +
                    "</div>") +
                "</div>" +
                ("<p class='title-legend-chart'>Nhóm đất khác và núi đá</p>") +
                "<div class='row_legend'>" +
                ("<div class='col_legend'>" +
                    ("<div class='container_rec'>" +
                        "<div class='rec' style='background-color: #92513D'></div>" +
                        "<span class='label_legend_rec' style='margin-left: 60px'>" + "Các loạt đất khác và núi đá" + "</span>" +
                        "</div>") +
                    "</div>") +
                "</div>" +
                "</div>" +
                "</div>";
            var draggable = new L.Draggable(div);
            draggable.enable();
            return div;
        };
        thonhuong_legend.addTo(map);

        /*--- Control Legend ---*/
        $('#switch_legend').change(function () {
            if ($(this).prop('checked')) {
                map.addControl(thonhuong_legend);
            } else {
                map.removeControl(thonhuong_legend);
            }
        });

        Hydda_base.addTo(map);
        view_biengioi.addTo(map);
        view_thonhuong.addTo(map);

        /*--- Control Layer Data ---*/
        $('#thonhuong_data').change(function () {
            if ($(this).prop('checked')) {
                map.addLayer(view_thonhuong);
            } else {
                map.removeLayer(view_thonhuong);
            }
        });

        var miniMap = new L.Control.MiniMap(esri, {
            toggleDisplay: true,
        }).addTo(map);
    })
//})