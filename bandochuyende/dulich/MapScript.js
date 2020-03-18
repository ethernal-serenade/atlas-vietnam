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

/*---- Bộ Symbol các loại hình du lịch ----*/
var trees = L.icon({
    iconUrl: 'symbols/trees_symbol.png',
    iconSize: [30, 30],
    iconAnchor: [19, 20],
    shadowUrl: 'symbols/circle_bg.png',
    shadowSize: [40, 40],
    shadowAnchor: [25, 25]
});

var flower = L.icon({
    iconUrl: 'symbols/flower_symbol.png',
    iconSize: [35, 25],
    iconAnchor: [21.5, 18],
    shadowUrl: 'symbols/circle_bg.png',
    shadowSize: [40, 40],
    shadowAnchor: [25, 25]
});

var water = L.icon({
    iconUrl: 'symbols/water_symbol.png',
    iconSize: [41, 35],
    iconAnchor: [26.5, 22],
    shadowUrl: 'symbols/circle_bg.png',
    shadowSize: [40, 40],
    shadowAnchor: [25, 25]
});

var beach = L.icon({
    iconUrl: 'symbols/beach_symbol.png',
    iconSize: [30, 30],
    iconAnchor: [19, 20],
});

var cave = L.icon({
    iconUrl: 'symbols/cave_symbol.png',
    iconSize: [25, 25],
    iconAnchor: [19, 20]
});

var deer = L.icon({
    iconUrl: 'symbols/deer_symbol.png',
    iconSize: [26, 26],
    iconAnchor: [18, 20],
    shadowUrl: 'symbols/circle_bg.png',
    shadowSize: [40, 40],
    shadowAnchor: [25, 25]
});

var travel = L.icon({
    iconUrl: 'symbols/travel_symbol.png',
    iconSize: [30, 30],
    iconAnchor: [19, 20],
    shadowUrl: 'symbols/circle_bg.png',
    shadowSize: [40, 40],
    shadowAnchor: [25, 25]
});

var flag = L.icon({
    iconUrl: 'symbols/flag_symbol.png',
    iconSize: [30, 30],
    iconAnchor: [19, 20],
    shadowUrl: 'symbols/circle_bg.png',
    shadowSize: [40, 40],
    shadowAnchor: [25, 25]
});

var culture = L.icon({
    iconUrl: 'symbols/culture_symbol.png',
    iconSize: [20, 35],
    iconAnchor: [17, 18],
});

var hotel = L.icon({
    iconUrl: 'symbols/hotel_symbol.png',
    iconSize: [35, 35],
    iconAnchor: [17, 18],
});

$.getJSON("../../../WebAtlas_VietNam_data/dulich/spatial_data/diem_rung_khubaoton.geojson", function (rung) {
    $.getJSON("../../../WebAtlas_VietNam_data/dulich/spatial_data/khachsan.geojson", function (khachsan) {
        $.getJSON("../../../WebAtlas_VietNam_data/dulich/spatial_data/diem_dulich.geojson", function (diem_dulich) {
            $.getJSON("../../../WebAtlas_VietNam_data/dulich/spatial_data/lehoi.geojson", function (lehoi) {
                $.getJSON("../../../WebAtlas_VietNam_data/dulich/spatial_data/vanhoalichsu.geojson", function (vanhoalichsu) {
                    $.getJSON("../../../WebAtlas_VietNam_data/dulich/spatial_data/vung_dulich.geojson", function (vung_dulich) {
                        $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/vn_biengioi.geojson", function (biengioi) {

                            /*** Main Map ***/
                            var map = L.map('mymap', {
                                    center: [16.10, 108.20],
                                    zoom: 6,
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

                            /*** Điểm du lịch ***/
                            /*** Hàm quản lý dữ liệu trong 1 file Geojson ***/
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

                            var categories_diemdulich = {}, category_diemdulich;
                            function add_diemdulich(data, map) {
                                L.geoJson(data, {
                                    onEachFeature: function (feat, layer) {
                                        layer.bindPopup("<span style='font-weight: bold; font-family: Arial'>" +
                                            feat.properties.ddl_ten + "</span> <br>" +
                                            "<span style='font-weight: bold; font-family: Arial; color: #ff5f8c'>Loại hình: " +
                                            feat.properties.ddl_type_name + "</span>");

                                        category_diemdulich = feat.properties.ddl_type_name;
                                        if (typeof categories_diemdulich[category_diemdulich] === "undefined") {
                                            if (category_diemdulich != "Vườn quốc gia" || category_diemdulich != "Khu bảo tồn") {
                                                categories_diemdulich[category_diemdulich] = L.layerGroup().addTo(map);
                                            }
                                        }
                                        categories_diemdulich[category_diemdulich].addLayer(layer);

                                        /*--- Control Layer Data cho bộ điểm du lịch ---*/
                                        if (category_diemdulich == "Khu du lịch") {
                                            $('#travel_data').change(function () {
                                                if ($(this).prop('checked')) {
                                                    map.addLayer(layer);
                                                } else {
                                                    map.removeLayer(layer);
                                                }
                                            });
                                        } else if (category_diemdulich == "Nước khoáng") {
                                            $('#water_data').change(function () {
                                                if ($(this).prop('checked')) {
                                                    map.addLayer(layer);
                                                } else {
                                                    map.removeLayer(layer);
                                                }
                                            });
                                        } else if (category_diemdulich == "Hang, động") {
                                            $('#cave_data').change(function () {
                                                if ($(this).prop('checked')) {
                                                    map.addLayer(layer);
                                                } else {
                                                    map.removeLayer(layer);
                                                }
                                            });
                                        } else if (category_diemdulich == "Bãi tắm") {
                                            $('#beach_data').change(function () {
                                                if ($(this).prop('checked')) {
                                                    map.addLayer(layer);
                                                } else {
                                                    map.removeLayer(layer);
                                                }
                                            });
                                        } else if (category_diemdulich == "Thắng cảnh") {
                                            $('#flower_data').change(function () {
                                                if ($(this).prop('checked')) {
                                                    map.addLayer(layer);
                                                } else {
                                                    map.removeLayer(layer);
                                                }
                                            });
                                        }
                                    },
                                    pointToLayer: function (feat, latlng) {
                                        if (feat.properties.ddl_type_name == "Thắng cảnh") {
                                            return L.marker(latlng, {icon: flower});
                                        } else if (feat.properties.ddl_type_name == "Bãi tắm") {
                                            return L.marker(latlng, {icon: beach});
                                        } else if (feat.properties.ddl_type_name == "Nước khoáng") {
                                            return L.marker(latlng, {icon: water});
                                        } else if (feat.properties.ddl_type_name == "Hang, động") {
                                            return L.marker(latlng, {icon: cave});
                                        } else if (feat.properties.ddl_type_name == "Khu du lịch"){
                                            return L.marker(latlng, {icon: travel});
                                        }
                                    }
                                });
                            };
                            add_diemdulich(diem_dulich, map);

                            /*** Lễ hội ***/
                            var view_lehoi = L.geoJSON(lehoi, {
                                onEachFeature: function (feat, layer) {
                                    layer.bindPopup("<span style='font-weight: bold; font-family: Arial'>" +
                                        feat.properties.lh_dtst + "</span> <br>" +
                                        "<span style='font-weight: bold; font-family: Arial; color: #eea1cf'>Thời gian: " +
                                        feat.properties.lh_thoigia + "</span>");
                                },
                                pointToLayer: function (feat, latlng) {
                                    return L.marker(latlng, {icon: flag});
                                }
                            })

                            /*** Văn hóa lịch sử ***/
                            var view_vanhoalichsu = L.geoJSON(vanhoalichsu, {
                                onEachFeature: function (feat, layer) {
                                    layer.bindPopup("<span style='font-weight: bold; font-family: Arial'>" +
                                        feat.properties.vs_ten + "</span> <br>" +
                                        "<span style='font-weight: bold; font-family: Arial; color: #8924ee'>Địa chỉ: " +
                                        feat.properties.vs_diachi + "</span>");
                                },
                                pointToLayer: function (feat, latlng) {
                                    return L.marker(latlng, {icon: culture});
                                }
                            })

                            /*** Khách sạn ***/
                            var view_khachsan = L.geoJSON(khachsan, {
                                onEachFeature: function (feat, layer) {
                                    layer.bindPopup("<span style='font-weight: bold; font-family: Arial'>" +
                                        feat.properties.ks_ten + "</span> <br>" +
                                        "<span style='font-weight: bold; font-family: Arial; color: #eebc14'>Địa chỉ: " +
                                        feat.properties.ks_diachi + "</span>");
                                },
                                pointToLayer: function (feat, latlng) {
                                    return L.marker(latlng, {icon: hotel});
                                }
                            })

                            /*** Vùng du lịch ***/
                            function getColor_dulich(d) {
                                return d == "Du lịch miền núi Tây Bắc" ? "#BDC661" :
                                    d == "Du lịch miền núi Đông Bắc" ? "#A9C8E7" :
                                        d == "Du lịch Trung tâm Bắc Bộ" ? "#ffd2ac" :
                                            d == "Du lịch Phía Bắc - Bắc Trung Bộ" ? "#daef4d" :
                                                d == "Du lịch Bắc Trung Bộ" ? "#b8ebe2" :
                                                    d == "Du lịch Phía Nam - Bắc Trung Bộ" ? "#C2CC34" :
                                                        d == "Du lịch Tây Nguyên" ? "#A8A3D6" :
                                                            d == "Du lịch Duyên Hải Nam Trung Bộ" ? "#7EACA0" :
                                                                d == "SDu lịch Đông Nam Bộ" ? "#d280ee" :
                                                                    d == "Du lịch Tây Nam Bộ" ? "#eeb56e" :
                                                                        d == "Du lịch Duyên hải Bắc Bộ" ? "#93ee93" :
                                                                            "#DFC6DD";
                            }

                            function style_luuvuc(feat) {
                                return {
                                    fillColor: getColor_dulich(feat.properties.v_tieuvung),
                                    weight: 1,
                                    dashArray: '3',
                                    color: "white",
                                    fillOpacity: 0.75
                                }
                            }

                            var view_vungdulich = L.geoJSON(vung_dulich, {
                                style: style_luuvuc,
                                onEachFeature: function (feat, layer) {
                                    if (feat.properties && feat.properties.v_tieuvung) {
                                        layer.bindPopup("<span style='color: #ff001f; " +
                                            "font-weight: bolder; font-size: 15px; font-family: Arial; font-style: italic'>" +
                                            feat.properties.v_tieuvung + "</span>");
                                    }
                                }
                            })

                            /*** Legend ***/
                            var dulich_legend = L.control({position: "topleft"});
                            dulich_legend.onAdd = map => {
                                var div = L.DomUtil.create('div', 'info legend');
                                labels = ["symbols/trees_symbol.png", "symbols/deer_symbol.png",
                                    "symbols/cave_symbol.png", "symbols/beach_symbol.png",
                                    "symbols/travel_symbol.png", "symbols/flower_symbol.png",
                                    "symbols/water_symbol.png", "symbols/flag_symbol.png",
                                    "symbols/hotel_symbol.png", "symbols/culture_symbol.png"];

                                div.innerHTML =
                                    "<div class='legend-content' style='margin-top: 15%'>" +
                                    "<div class='legend'>" +
                                    ("<p class='title-legend-chart'>Loại hình du lịch tại việt nam</p>") +
                                    ("<div class='container_poi'>" +
                                        "<div class='overlay_poi'></div>" +
                                        "<img src=" + labels[0] + " width='40' height='40' style='margin:15px 0px 0px 8px'>" +
                                        "<span class='label_legend_symbol'>" + "Vườn quốc gia" + "</span>" +
                                        "</div>") +
                                    ("<div class='container_poi'>" +
                                        "<div class='overlay_poi'></div>" +
                                        "<img src=" + labels[1] + " width='35' height='35' style='margin:15px 0px 0px 9px'>" +
                                        "<span class='label_legend_symbol' style='margin-top: 25px; margin-left: 18px; font-size: 14.25px'>" +
                                        "Khu bảo tồn thiên nhiên" + "</span>" +
                                        "</div>") +
                                    ("<div class='container_poi'>" +
                                        "<img src=" + labels[2] + " width='40' height='40' style='margin:15px 0px 0px 8px'>" +
                                        "<span class='label_legend_symbol'>" + "Hang, động" + "</span>" +
                                        "</div>") +
                                    ("<div class='container_poi'>" +
                                        "<img src=" + labels[3] + " width='40' height='40' style='margin:15px 0px 0px 8px'>" +
                                        "<span class='label_legend_symbol'>" + "Bãi tắm" + "</span>" +
                                        "</div>") +
                                    ("<div class='container_poi'>" +
                                        "<div class='overlay_poi'></div>" +
                                        "<img src=" + labels[4] + " width='40' height='40' style='margin:15px 0px 0px 8px'>" +
                                        "<span class='label_legend_symbol'>" + "Khu du lịch" + "</span>" +
                                        "</div>") +
                                    ("<div class='container_poi'>" +
                                        "<div class='overlay_poi'></div>" +
                                        "<img src=" + labels[5] + " width='60' height='40' style='margin:15px 0px 0px -3.25px'>" +
                                        "<span class='label_legend_symbol' style='margin-left: 6px'>" + "Thắng cảnh" + "</span>" +
                                        "</div>") +
                                    ("<div class='container_poi'>" +
                                        "<div class='overlay_poi'></div>" +
                                        "<img src=" + labels[6] + " width='58.5' height='50' style='margin:10px 0px 0px -4.25px'>" +
                                        "<span class='label_legend_symbol' style='margin-left: 10px'>" + "Nước khoáng" + "</span>" +
                                        "</div>") +
                                    ("<div class='container_poi'>" +
                                        "<div class='overlay_poi'></div>" +
                                        "<img src=" + labels[7] + " width='40' height='40' style='margin:15px 0px 0px 6px'>" +
                                        "<span class='label_legend_symbol' style='margin-left: 18.5px'>" + "Lễ hội" + "</span>" +
                                        "</div>") +
                                    ("<div class='container_poi'>" +
                                        "<img src=" + labels[8] + " width='40' height='40' style='margin:15px 0px 0px 6px'>" +
                                        "<span class='label_legend_symbol' style='margin-left: 18.5px'>" + "Khách sạn" + "</span>" +
                                        "</div>") +
                                    ("<div class='container_poi'>" +
                                        "<img src=" + labels[9] + " width='35' height='60' style='margin:15px 0px 0px 8px'>" +
                                        "<span class='label_legend_symbol' style='margin-top: 28px; margin-left: 21px;'>" + "Văn hóa lịch sử" + "</span>" +
                                        "</div>") +
                                    "</div>" +
                                    "</div>";
                                var draggable = new L.Draggable(div);
                                draggable.enable();
                                return div;
                            };
                            dulich_legend.addTo(map);

                            /*** Chart ***/
                            var dulich_chart = L.control({position: "topright"});
                            dulich_chart.onAdd = map => {
                                var div = L.DomUtil.create('div', 'info legend');

                                /* Make Chart */
                                /*-- Line plus Stacked Bar Chart --*/
                                $.getJSON("../../../WebAtlas_VietNam_data/dulich/chart_data/dulich_LineBar_stacked.json", function (dulich_LineBar_Stacked) {
                                    render_linebarStacked_dulich("linebarStacked_dulich_chart", dulich_LineBar_Stacked,
                                        "Năm", "Doanh thu", "Khách nội địa", "Khách quốc tế");
                                })
                                /*-- Pie Chart have Series --*/
                                $.getJSON("../../../WebAtlas_VietNam_data/dulich/chart_data/dulich_Pie_timeline.json", function (dulich_Pie) {
                                    //console.log(dulich_Pie);
                                    render_pie_TimeLine_dulich("pie_chart_dulich", dulich_Pie)
                                })

                                div.innerHTML =
                                    "<div class='chart-content'>" +
                                    "<div class='chart'>" +
                                    ("<p class='title-legend-chart'>Khách du lịch và doanh thu từ du lịch</p>") +
                                    /* DOM Chart */
                                    "<div id='linebarStacked_dulich_chart' class='mylinebarstackedchart'></div>" +
                                    ("<p class='title-legend-chart' style='margin-top: -15px;'>" +
                                        "Cơ cấu khách du lịch quốc tế <br> phân theo khu vực quốc gia và vùng lãnh thổ" +
                                        "</p>") +
                                    ("<p class='subtitle-chart'>(đơn vị: %)</p>") +
                                    "<div id='pie_chart_dulich' class='mypiechart'></div>"
                                "</div>" +
                                "</div>";
                                var draggable = new L.Draggable(div);
                                draggable.enable();
                                return div;
                            }
                            dulich_chart.addTo(map);

                            /*--- Control Chart & Legend ---*/
                            $('#switch_chart').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addControl(dulich_chart);
                                } else {
                                    map.removeControl(dulich_chart);
                                }
                            });
                            $('#switch_legend').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addControl(dulich_legend);
                                } else {
                                    map.removeControl(dulich_legend);
                                }
                            });

                            viet_bando.addTo(map);
                            //Hydda_base.addTo(map);
                            view_biengioi.addTo(map);
                            view_vungdulich.addTo(map);
                            view_lehoi.addTo(map);
                            view_khachsan.addTo(map);
                            //view_vanhoalichsu.addTo(map);

                            /*--- Control Layer Data ---*/
                            $('#vungdulich_data').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addLayer(view_vungdulich);
                                } else {
                                    map.removeLayer(view_vungdulich);
                                }
                            });
                            $('#flag_data').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addLayer(view_lehoi);
                                } else {
                                    map.removeLayer(view_lehoi);
                                }
                            });
                            $('#culture_data').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addLayer(view_vanhoalichsu);
                                } else {
                                    map.removeLayer(view_vanhoalichsu);
                                }
                            });
                            $('#hotel_data').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addLayer(view_khachsan);
                                } else {
                                    map.removeLayer(view_khachsan);
                                }
                            });
                        })
                    })
                })
            })
        })
    })
})

