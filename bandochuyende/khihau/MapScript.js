//console.log("hahaha");
var op_street = L.tileLayer.provider("OpenStreetMap"),
    esri = L.tileLayer.provider("Esri.WorldImagery"),
    CartoDB = L.tileLayer.provider("CartoDB.Voyager"),
    Hydda_base = L.tileLayer.provider("Hydda.Base");

/*---- Base Việt Bản đồ ----*/
var viet_bando = L.tileLayer('http://images.vietbando.com/ImageLoader/GetImage.ashx?Ver=2016&LayerIds=VBD&X={x}&Y={y}&Level={z}', {
    attribution: 'Map tiles by Vietbando',
    minZoom: 0
});

/*---- Dữ liệu Geojson ----*/
//$.getJSON("../../../WebAtlas_VietNam_data/khihau/spatial_data/doam_vung.geojson", function (doam_vung) {
    //$.getJSON("../../../WebAtlas_VietNam_data/khihau/spatial_data/nhietdo_vung.geojson", function (nhietdo_vung) {
        //$.getJSON("../../../WebAtlas_VietNam_data/khihau/spatial_data/phanvung_khihau.geojson", function (phanvung_khihau) {
            $.getJSON("../../../WebAtlas_VietNam_data/khihau/spatial_data/tramdo.geojson", function (tramdo) {
                $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/vn_biengioi.geojson", function (biengioi) {

                    /*** Main Map ***/
                    var map = L.map('mymap', {
                            center: [16.10, 108.20],
                            zoom: 6,
                            maxZoom: 8,
                            zoomControl: true
                        }
                    );

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

                    /*** Phân vùng khí hậu (Vector Tiles) ***/
                    var phanvung_khihau = service_tiles + "atlas_vietnam_tiles/t_phanvung_khihau/{z}/{x}/{y}.pbf";

                    function getColor_phanvungkhihau(d) {
                        return d == "Vùng khí hậu Tây Bắc Bộ" ? "#edf4be" :
                            d == "Vùng khí hậu Đông Bắc Bộ" ? "#77b896" :
                                d == "Vùng khí hậu Trung và Nam Bắc Bộ" ? "#cdebe9" :
                                    d == "Vùng khí hậu Bắc Trung Bộ" ? "#cec347" :
                                        d == "Vùng khí hậu Nam Trung Bộ" ? "#fbfd92" :
                                            d == "Vùng khí hậu Tây Nguyên" ? "#fac579" :
                                                "#e3846f";
                    }

                    var style_phanvungkhihau = {
                        phanvung_khihau: function (feat) {
                            return {
                                fill:true,
                                fillColor: getColor_phanvungkhihau(feat.name_vungkh),
                                weight: 1,
                                dashArray: '6, 3',
                                color: "#5656ff",
                                fillOpacity: 0.75
                            }
                        }
                    }

                    var view_phanvungkhihau = L.vectorGrid.protobuf(phanvung_khihau, {
                        vectorTileLayerStyles: style_phanvungkhihau,
                        interactive: true,
                        maxZoom: 19,
                        maxNativeZoom: 14,
                        getFeatureId: function (feat) {
                            return feat.properties.name_vungkh;
                        }
                    })

                    view_phanvungkhihau.on('click', function (e) {
                        //console.log(e.layer.properties["Quan_Huyen"]);
                        view_phanvungkhihau.bindPopup("<span style='color: #000000; " +
                            "font-weight: bolder;'>" + e.layer.properties["name_vungkh"] + "</span>")
                    })

                    /* View dạng GeoJSON
                    var view_phanvungkhihau = L.geoJSON(phanvung_khihau, {
                        style: style_phanvungkhihau,
                        onEachFeature: function (feat, layer) {
                            if (feat.properties && feat.properties.name_vungkh) {
                                layer.bindPopup("<span style='color: #000000; " +
                                    "font-weight: bolder;'>" + feat.properties.name_vungkh + "</span>");
                            }
                        }
                    }) */

                    /*** Độ ẩm (Vector Tiles) ***/
                    var doam_vung = service_tiles + "atlas_vietnam_tiles/t_doam_vung/{z}/{x}/{y}.pbf";

                    function getColor_doam(d) {
                        return d > 86 ? "#3657a2" :
                            d > 84 ? "#2a7bd4" :
                                d > 82 ? "#3caef5" :
                                    d > 80 ? "#7cbff1" :
                                        "#aad2e5";
                    }

                    var style_doam = {
                        doam_vung: function (feat) {
                            return {
                                fill:true,
                                fillColor: getColor_doam(feat.doam_tb),
                                weight: 0,
                                color: "transparent",
                                fillOpacity: 1
                            }
                        }
                    }

                    var view_doam = L.vectorGrid.protobuf(doam_vung, {
                        vectorTileLayerStyles: style_doam,
                        interactive: true,
                        maxZoom: 19,
                        maxNativeZoom: 14,
                        getFeatureId: function (feat) {
                            return feat.properties.name_vungkh;
                        }
                    })

                    view_doam.on('click', function (e) {
                        //console.log(e.layer.properties["Quan_Huyen"]);
                        view_doam.bindPopup("<span style='color: #4095f3; " +
                            "font-weight: bolder; font-family: Arial'>Độ ẩm trung bình: " + e.layer.properties.doam_tb +
                            " %</span>")
                    })

                    /* View dạng GeoJSON
                    var view_doam = L.geoJSON(doam_vung, {
                        style: style_doam,
                        onEachFeature: function (feat, layer) {
                            if (feat.properties && feat.properties.doam_tb) {
                                layer.bindPopup("<span style='color: #4095f3; " +
                                    "font-weight: bolder; font-family: Arial'>Độ ẩm trung bình: " + feat.properties.doam_tb +
                                    " %</span>");
                            }
                        }
                    }); */

                    /*** Nhiệt độ (Vector Tiles) ***/
                    var nhietdo_vung = service_tiles + "atlas_vietnam_tiles/t_nhietdo_vung/{z}/{x}/{y}.pbf";

                    function getColor_nhietdo(d) {
                        return d > 28 ? "#fa645f" :
                            d > 24 ? "#fc783f" :
                                d > 20 ? "#fcae5c" :
                                    d > 18 ? "#fccd73" :
                                        "#fdfcd3";
                    }

                    var style_nhietdo = {
                        nhietdo_vung: function (feat) {
                            return {
                                fill:true,
                                fillColor: getColor_nhietdo(feat.vung_tb),
                                weight: 0,
                                color: "transparent",
                                fillOpacity: 1
                            }
                        }
                    }

                    var view_nhietdo = L.vectorGrid.protobuf(nhietdo_vung, {
                        vectorTileLayerStyles: style_nhietdo,
                        interactive: true,
                        maxZoom: 19,
                        maxNativeZoom: 14,
                        getFeatureId: function (feat) {
                            return feat.properties.vung_tb;
                        }
                    })

                    view_nhietdo.on('click', function (e) {
                        //console.log(e.layer.properties["Quan_Huyen"]);
                        view_nhietdo.bindPopup("<span style='color: #ff004b; " +
                            "font-weight: bolder; font-family: Arial'>Nhiệt độ trung bình: " + e.layer.properties.vung_tb +
                            "°C</span>")
                    })

                    /* View dạng GeoJSON
                    var view_nhietdo = L.geoJSON(nhietdo_vung, {
                        style: style_nhietdo,
                        onEachFeature: function (feat, layer) {
                            if (feat.properties && feat.properties.vung_tb) {
                                layer.bindPopup("<span style='color: #ff004b; " +
                                    "font-weight: bolder; font-family: Arial'>Nhiệt độ trung bình: " + feat.properties.vung_tb +
                                    "°C</span>");
                            }
                        }
                    }); */

                    /*** Trạm đo nhiệt độ và lượng mưa***/
                    /* Nhiệt độ */
                    var view_temp_chart = L.layerGroup();
                    var charts_temp = {};
                    for (var attr_temp in tramdo.features) {
                        var props_temp = tramdo.features[attr_temp].properties;
                        var coord_temp = tramdo.features[attr_temp].geometry;
                        var data_feat_temp = [
                            props_temp['ndo1'],props_temp['ndo2'],props_temp['ndo3'],props_temp['ndo4'],
                            props_temp['ndo5'],props_temp['ndo6'],props_temp['ndo7'],props_temp['ndo8'],
                            props_temp['ndo9'],props_temp['ndo10'],props_temp['ndo11'],props_temp['ndo12']
                        ];
                        charts_temp[props_temp['tentram']] = L.minichart([coord_temp.coordinates[1], coord_temp.coordinates[0]], {
                            type: 'bar',
                            data: data_feat_temp,
                            maxValues: 35,
                            width: 40,
                            height: 50,
                            colors: "#ff5454",
                            label: "auto",
                            labelColor: "auto"
                        });
                        charts_temp[props_temp['tentram']].bindPopup("<div id='popup_tb'>" + "<table class='chart_data'>" +
                            "<tbody>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 1: </td>" + "<td>" + props_temp['ndo1'] + " °C</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 2: </td>" + "<td>" + props_temp['ndo2'] + " °C</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 3: </td>" + "<td>" + props_temp['ndo3'] + " °C</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 4: </td>" + "<td>" + props_temp['ndo4'] + " °C</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 5: </td>" + "<td>" + props_temp['ndo5'] + " °C</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 6: </td>" + "<td>" + props_temp['ndo6'] + " °C</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 7: </td>" + "<td>" + props_temp['ndo7'] + " °C</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 8: </td>" + "<td>" + props_temp['ndo8'] + " °C</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 9: </td>" + "<td>" + props_temp['ndo9'] + " °C</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 10: </td>" + "<td>" + props_temp['ndo10'] + " °C</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 11: </td>" + "<td>" + props_temp['ndo11'] + " °C</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 12: </td>" + "<td>" + props_temp['ndo12'] + " °C</td>" +
                            "</tr>" +
                            "</tbody>" +
                            "</table>" + "</div>");
                        view_temp_chart.addLayer(charts_temp[props_temp['tentram']]);
                    }

                    /* Lượng mưa */
                    var view_rain_chart = L.layerGroup();
                    var charts_rain = {};
                    for (var attr_rain in tramdo.features) {
                        var props_rain = tramdo.features[attr_rain].properties;
                        var coord_rain = tramdo.features[attr_rain].geometry;
                        var data_feat_rain = [
                            props_rain['lmua1'], props_rain['lmua2'], props_rain['lmua3'], props_rain['lmua4'],
                            props_rain['lmua5'], props_rain['lmua6'], props_rain['lmua7'], props_rain['lmua8'],
                            props_rain['lmua9'], props_rain['lmua10'], props_rain['lmua11'], props_rain['lmua12']
                        ];
                        charts_rain[props_rain['tentram']] = L.minichart([coord_rain.coordinates[1], coord_rain.coordinates[0]], {
                            type: 'bar',
                            data: data_feat_rain,
                            maxValues: 'auto',
                            width: 40,
                            height: 50,
                            colors: "#2890ff",
                            label: "auto",
                            labelColor: "auto"
                        });
                        charts_rain[props_rain['tentram']].bindPopup("<div id='popup_tb'>" + "<table class='chart_data'>" +
                            "<tbody>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 1: </td>" + "<td>" + props_rain['lmua1'] + " mm</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 2: </td>" + "<td>" + props_rain['lmua2'] + " mm</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 3: </td>" + "<td>" + props_rain['lmua3'] + " mm</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 4: </td>" + "<td>" + props_rain['lmua4'] + " mm</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 5: </td>" + "<td>" + props_rain['lmua5'] + " mm</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 6: </td>" + "<td>" + props_rain['lmua6'] + " mm</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 7: </td>" + "<td>" + props_rain['lmua7'] + " mm</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 8: </td>" + "<td>" + props_rain['lmua8'] + " mm</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 9: </td>" + "<td>" + props_rain['lmua9'] + " mm</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 10: </td>" + "<td>" + props_rain['lmua10'] + " mm</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 11: </td>" + "<td>" + props_rain['lmua11'] + " mm</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Tháng 12: </td>" + "<td>" + props_rain['lmua12'] + " mm</td>" +
                            "</tr>" +
                            "</tbody>" +
                            "</table>" + "</div>");
                        view_rain_chart.addLayer(charts_rain[props_rain['tentram']]);
                    }

                    /*** Legend ***/
                    var khihau_legend = L.control({position: "topleft"});
                    khihau_legend.onAdd = map => {
                        var div = L.DomUtil.create('div', 'info legend');

                        div.innerHTML =
                            "<div class='legend-content' style='margin-top: 25%'>" +
                            "<div class='legend'>" +
                            ("<p class='title-legend-chart'>Các vùng khí hậu</p>") +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #edf4be'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Vùng khí hậu Tây Bắc Bộ" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #77b896'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Vùng khí hậu Đông Bắc Bộ" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #cdebe9'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Vùng khí hậu Trung và Nam Bắc Bộ" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #cec347'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Vùng khí hậu Bắc Trung Bộ" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #fbfd92'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Vùng khí hậu Nam Trung Bộ" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #fac579'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Vùng khí hậu Tây Nguyên" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #e3846f'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Vùng khí hậu Nam Bộ" + "</span>" +
                                "</div>") + '<br>' +
                            ("<p class='title-legend-chart'>Biểu đồ lượng mưa và nhiệt độ</p>") +
                            ("<div class='container_rec' style='margin-top: -5px'>" +
                                "<img src='images/luongmua_tramdo.png' width='50' height='80' style='margin-left: 50px'>" +
                                "<span class='label_legend_rec'>" + "Lượng mưa" + "</span>" +
                                "</div>") +
                            ("<div class='container_rec'>" +
                                "<img src='images/nhietdo_tramdo.png' width='50' height='80' style='margin-left: 50px'>" +
                                "<span class='label_legend_rec'>" + "Nhiệt độ" + "</span>" +
                                "</div>") +
                            "</div>" +
                            "</div>";
                        var draggable = new L.Draggable(div);
                        draggable.enable();
                        return div;
                    };
                    khihau_legend.addTo(map);

                    /*--- Control Legend ---*/
                    $('#switch_legend').change(function () {
                        if ($(this).prop('checked')) {
                            map.addControl(khihau_legend);
                        } else {
                            map.removeControl(khihau_legend);
                        }
                    });

                    viet_bando.addTo(map);
                    //CartoDB.addTo(map);
                    view_biengioi.addTo(map);
                    view_phanvungkhihau.addTo(map);
                    //view_nhietdo.addTo(map);
                    //view_doam.addTo(map);
                    //view_temp_chart.addTo(map);
                    view_rain_chart.addTo(map);

                    /*--- Control Layer Data ---*/
                    $('#vungkhihau_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(view_phanvungkhihau);
                        } else {
                            map.removeLayer(view_phanvungkhihau);
                        }
                    });
                    $('#temp_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(view_nhietdo);
                        } else {
                            map.removeLayer(view_nhietdo);
                        }
                    });
                    $('#humidity_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(view_doam);
                        } else {
                            map.removeLayer(view_doam);
                        }
                    });
                    $('#chart_temp_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(view_temp_chart);
                        } else {
                            map.removeLayer(view_temp_chart);
                        }
                    });
                    $('#chart_rain_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(view_rain_chart);
                        } else {
                            map.removeLayer(view_rain_chart);
                        }
                    });
                });
            })
        //})
    //})
//})