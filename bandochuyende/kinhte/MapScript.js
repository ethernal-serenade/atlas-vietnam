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

$.getJSON("../../../WebAtlas_VietNam_data/kinhte/spatial_data/cangbien.geojson", function (cangbien) {
    $.getJSON("../../../WebAtlas_VietNam_data/kinhte/spatial_data/cuakhau.geojson", function (cuakhau) {
        $.getJSON("../../../WebAtlas_VietNam_data/kinhte/spatial_data/kinhte_line.geojson", function (kinh_te_line) {
            $.getJSON("../../../WebAtlas_VietNam_data/kinhte/spatial_data/quoclo.geojson", function (quoclo) {
                $.getJSON("../../../WebAtlas_VietNam_data/kinhte/spatial_data/duongsat.geojson", function (duongsat) {
                    $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/tinh_ranhgioi.geojson", function (ranhgioi_tinh) {
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

                            /*** Ranh giới tỉnh ***/
                            var view_ranhgioi_tinh = L.geoJSON(ranhgioi_tinh, {
                                style: function (feat) {
                                    return {
                                        stroke: true,
                                        color: "#999999",
                                        weight: 0.5,
                                        dashArray: '4, 2'
                                    }
                                },
                            });

                            /*** Ranh giới vùng kinh tế ***/
                            var view_vung_kinh_te = L.geoJSON(kinh_te_line, {
                                style: function (feat) {
                                    return {
                                        stroke: true,
                                        color: "#c660ac",
                                        weight: 3
                                    }
                                },
                            });

                            /*** Đường quốc lộ ***/
                            var view_quoclo = L.geoJSON(quoclo, {
                                style: function (feat) {
                                    return {
                                        stroke: true,
                                        color: "#ff0012",
                                        weight: 0.5
                                    }
                                },
                                onEachFeature: function (feat, layer) {
                                    layer.bindPopup("<span style='font-weight: bold; font-family: Arial'>Tên tuyến " +
                                        feat.properties.ref + "</span>");
                                }
                            });

                            /*** Đường sắt ***/
                            var view_duongsat = L.geoJSON(duongsat, {
                                style: function (feat) {
                                    return {
                                        stroke: true,
                                        color: "#000000",
                                        weight: 1,
                                    }
                                }
                            });

                            /*** Cảng biển ***/
                            var view_cang_bien = L.geoJSON(cangbien, {
                                pointToLayer: function (feat, latlng) {
                                    var label_cangbien = '<p class="cangbien_label">' + feat.properties.ten_cang + '</p>';
                                    return L.marker(latlng, {
                                        icon: L.divIcon({
                                            html: "<i class='fa fa-ship cangbien_symbol'></i>",
                                            popupAnchor: [0, 0],
                                            iconAnchor: [8, 8],
                                            className: 'mouse_pointer cangbien_divIcon'
                                        })
                                    }).bindTooltip(label_cangbien, {
                                        permanent: true,
                                        direction: "center",
                                        opacity: 0
                                    }).openTooltip();
                                }
                            })

                            /*** Cửa khẩu ***/
                            var view_cua_khau = L.geoJSON(cuakhau, {
                                pointToLayer: function (feat, latlng) {
                                    var label_cuakhau = '<p class="cuakhau_label">' + feat.properties.ten + '</p>';
                                    return L.marker(latlng, {
                                        icon: L.divIcon({
                                            html: "<i class='fa fa-arrow-up cuakhau_symbol_up'></i>" +
                                                "<i class='fa fa-arrow-down cuakhau_symbol_down'></i>",
                                            popupAnchor: [0, 0],
                                            iconAnchor: [8, 8],
                                            className: 'mouse_pointer cuakhau_divIcon'
                                        })
                                    }).bindTooltip(label_cuakhau, {
                                        permanent: true,
                                        direction: "center",
                                        opacity: 0
                                    }).openTooltip();
                                }
                            })

                            /*** Hàm Collison Labels ***/
                            var i = 0;
                            var hideLabel = function (label) {
                                label.labelObject.style.opacity = 0;
                            };
                            var showLabel = function (label) {
                                label.labelObject.style.opacity = 1;
                            };
                            labelEngine = new labelgun.default(hideLabel, showLabel);

                            view_cang_bien.eachLayer(function (label) {
                                label.added = true;
                                addLabel(label, i);
                                i++;
                            });

                            view_cua_khau.eachLayer(function (label) {
                                label.added = true;
                                addLabel(label, i);
                                i++;
                            });

                            view_cang_bien.addTo(map);
                            map.on("zoomend", function () {
                                resetLabels(view_cang_bien);
                            });
                            resetLabels(view_cang_bien);

                            view_cua_khau.addTo(map);
                            map.on("zoomend", function () {
                                resetLabels(view_cua_khau);
                            });
                            resetLabels(view_cua_khau);

                            function resetLabels(markers) {
                                var i = 0;
                                markers.eachLayer(function (label) {
                                    addLabel(label, ++i);
                                });
                                labelEngine.update();
                            }

                            function addLabel(layer, id) {
                                var label = layer.getTooltip()._source._tooltip._container;
                                if (label) {
                                    var rect = label.getBoundingClientRect();
                                    var bottomLeft = map.containerPointToLatLng([rect.left, rect.bottom]);
                                    var topRight = map.containerPointToLatLng([rect.right, rect.top]);
                                    var boundingBox = {
                                        bottomLeft: [bottomLeft.lng, bottomLeft.lat],
                                        topRight: [topRight.lng, topRight.lat]
                                    };
                                    labelEngine.ingestLabel(
                                        boundingBox,
                                        id,
                                        parseInt(Math.random() * (5 - 1) + 1),
                                        label,
                                        false
                                    );
                                    if (!layer.added) {
                                        layer.addTo(map);
                                        layer.added = true;
                                    }
                                }
                            }

                            /*** Legend ***/
                            var kinhte_legend = L.control({position: "topleft"});
                            kinhte_legend.onAdd = map => {
                                var div = L.DomUtil.create('div', 'info legend');

                                div.innerHTML =
                                    "<div class='legend-content' style='margin-top: 25%'>" +
                                    "<div class='legend'>" +
                                    ("<p class='title-legend-chart'>GDP bình quân tính theo đầu người <br> của các tỉnh năm 2007</p>") +
                                    ("<p class='subtitle-chart'>(theo giá thực tế; đơn vị: triệu đồng)</p>") +
                                    "<div class='row_legend'>" +
                                    ("<div class='col_legend'>" +
                                        ("<div class='container_rec'>" +
                                            "<div class='rec' style='background-color: #F6F9E8'></div>" +
                                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Dưới 6" + "</span>" +
                                            "</div>") + '<br>' +
                                        ("<div class='container_rec'>" +
                                            "<div class='rec' style='background-color: #F3F8A9'></div>" +
                                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 6 đến 9" + "</span>" +
                                            "</div>") + '<br>' +
                                        ("<div class='container_rec'>" +
                                            "<div class='rec' style='background-color: #ECEE7A'></div>" +
                                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 10 đến 12" + "</span>" +
                                            "</div>") +
                                        "</div>") +
                                    ("<div class='col_legend'>" +
                                        ("<div class='container_rec'>" +
                                            "<div class='rec' style='background-color: #DCB4A5'></div>" +
                                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 13 đến 15" + "</span>" +
                                            "</div>") + '<br>' +
                                        ("<div class='container_rec'>" +
                                            "<div class='rec' style='background-color: #E29EB5'></div>" +
                                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 16 đến 18" + "</span>" +
                                            "</div>") + '<br>' +
                                        ("<div class='container_rec'>" +
                                            "<div class='rec' style='background-color: #C04460'></div>" +
                                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Trên 18" + "</span>" +
                                            "</div>") +
                                        "</div>") +
                                    "</div>" +
                                    "</div>" +
                                    "</div>";
                                var draggable = new L.Draggable(div);
                                draggable.enable();
                                return div;
                            };
                            kinhte_legend.addTo(map);

                            /*** Chart ***/
                            var kinhte_chart = L.control({position: "topright"});
                            kinhte_chart.onAdd = map => {
                                var div = L.DomUtil.create('div', 'info legend');

                                /* Make Chart */
                                /*-- Line plus Bar Chart --*/
                                $.getJSON("../../../WebAtlas_VietNam_data/kinhte/chart_data/gdp_speed_year.json", function (gdp_speed_year) {
                                    render_linebar_kinhte("line_bar_gdp_chart", gdp_speed_year, "Năm",
                                        "Tốc độ", "GDP");
                                })
                                /*-- Area Chart --*/
                                d3.json('../../../WebAtlas_VietNam_data/kinhte/chart_data/cocaugdp_area.json', function (cocaugdp_area) {
                                    nv.addGraph(function () {
                                        var chart = nv.models.stackedAreaChart()
                                            .x(function (d) {
                                                return d[0]
                                            })
                                            .y(function (d) {
                                                return d[1] / 1000000
                                            })
                                            .useInteractiveGuideline(true)
                                            .rightAlignYAxis(false)
                                            .showControls(false)
                                            .color(["#F4FE2E", "#E6286E", "#2C916E"])
                                            .clipEdge(true);

                                        chart.xAxis
                                            .axisLabel('Năm')
                                            .tickFormat(d3.format(',f'));

                                        chart.yAxis
                                            .tickFormat(d3.format(',.01f'));

                                        chart.style('expand');

                                        d3.select('#area_gdp_chart')
                                            .datum(cocaugdp_area)
                                            .call(chart);

                                        nv.utils.windowResize(function () {
                                            chart.update()
                                        });
                                        return chart;
                                    });
                                })

                                div.innerHTML =
                                    "<div class='chart-content'>" +
                                    "<div class='chart'>" +
                                    ("<p class='title-legend-chart'>GDP và tốc độ tăng trưởng qua các năm</p>") +
                                    ("<p class='subtitle-chart'>(theo giá thực tế, quy đổi 1$ = 23000VNĐ)</p>") +
                                    /* DOM Chart */
                                    "<div id='line_bar_gdp_chart' class='mylinebarchart'></div>" +
                                    ("<p class='title-legend-chart'>Cơ cấu GDP phân theo khu vực kinh tế</p>") +
                                    ("<p class='subtitle-chart'>(giai đoạn 1990 - 2007)</p>") +
                                    "<svg id='area_gdp_chart' class='myareachart'></svg>" +
                                    "</div>" +
                                    "</div>";
                                var draggable = new L.Draggable(div);
                                draggable.enable();
                                return div;
                            }
                            kinhte_chart.addTo(map);

                            /*--- Control Chart & Legend ---*/
                            $('#switch_chart').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addControl(kinhte_chart);
                                } else {
                                    map.removeControl(kinhte_chart);
                                }
                            });
                            $('#switch_legend').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addControl(kinhte_legend);
                                } else {
                                    map.removeControl(kinhte_legend);
                                }
                            });

                            Hydda_base.addTo(map);
                            view_ranhgioi_tinh.addTo(map);
                            view_biengioi.addTo(map);
                            view_vung_kinh_te.addTo(map);

                            view_cang_bien.addTo(map);
                            view_cua_khau.addTo(map);
                            view_duongsat.addTo(map);
                            view_quoclo.addTo(map);

                            /*--- Control Layer Data ---*/
                            $('#quoclo_data').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addLayer(view_quoclo);
                                } else {
                                    map.removeLayer(view_quoclo);
                                }
                            });
                            $('#duongsat_data').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addLayer(view_duongsat);
                                } else {
                                    map.removeLayer(view_duongsat);
                                }
                            });
                            $('#cuakhau_data').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addLayer(view_cua_khau);
                                } else {
                                    map.removeLayer(view_cua_khau);
                                }
                            });
                            $('#cangbien_data').change(function () {
                                if ($(this).prop('checked')) {
                                    map.addLayer(view_cang_bien);
                                } else {
                                    map.removeLayer(view_cang_bien);
                                }
                            });
                        })
                    })
                })
            })
        })
    })
})