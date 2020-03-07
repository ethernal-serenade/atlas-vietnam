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
$.getJSON("../../../WebAtlas_VietNam_data/songngoi/spatial_data/luuvuc_ranhgioi.geojson", function (luuvuc_ranhgioi) {
    $.getJSON("../../../WebAtlas_VietNam_data/songngoi/spatial_data/luuvuc.geojson", function (luuvuc) {
        $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/vn_biengioi.geojson", function (biengioi) {
            $.getJSON("../../../WebAtlas_VietNam_data/songngoi/spatial_data/songngoi.geojson", function (songngoi) {

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

                /*** Ranh giới lưu vực sông ***/
                var view_luuvuc_ranhgioi = L.geoJSON(luuvuc_ranhgioi, {
                    style: function (feat) {
                        return {
                            stroke: true,
                            color: "#ff0035",
                            weight: 0.5,
                            dashArray: '10, 5'
                        }
                    },
                });

                /*** Lưu vực sông ***/
                /** Can not change var d **/
                function getColor_luuvuc(d) {
                    return d == "Sông Hồng" ? "#BDC661" :
                        d == "Sông Kỳ Cùng - Bằng Giang" ? "#A9C8E7" :
                            d == "Sông Cả" ? "#709747" :
                                d == "Sông Thu Bồn" ? "#EFBC33" :
                                    d == "Sông Ba (Đà Rằng)" ? "#EBBD62" :
                                        d == "Sông Đồng Nai" ? "#C2CC34" :
                                            d == "Sông Mã" ? "#A8A3D6" :
                                                d == "Sông Mê Công (Cửu Long)" ? "#7EACA0" :
                                                    d == "Sông Thái Bình" ? "#EEE996" :
                                                        "#DFC6DD";
                }

                function style_luuvuc(feat) {
                    //console.log(feat.properties.TEN_LUUVUC);
                    return {
                        fillColor: getColor_luuvuc(feat.properties.TEN_LUUVUC),
                        weight: 1,
                        dashArray: '3',
                        color: "white",
                        fillOpacity: 0.75
                    }
                }

                var view_luuvuc = L.geoJSON(luuvuc, {
                    style: style_luuvuc,
                    onEachFeature: function (feat, layer) {
                        if (feat.properties && feat.properties.TEN_LUUVUC) {
                            layer.bindPopup("<span style='color: #0000ff; " +
                                "font-weight: bolder;'>" + feat.properties.TEN_LUUVUC + "</span>");
                        }
                    }
                })

                /*** Polyline và Labels sông ***/
                var view_songngoi = L.geoJSON(songngoi, {
                    style: function (feat) {
                        return {
                            stroke: true,
                            color: "#99CDFF",
                            weight: 0.5
                        }
                    },
                    onEachFeature: function (feat, layer) {
                        //console.log(feat.properties.length);
                        if (feat.properties.length >= 40000) {
                            layer.setText(feat.properties.name, {
                                center: true,
                                attributes: {
                                    fill: "#7872ff",
                                    'font-size': '9px',
                                    'font-style': 'italic'
                                }
                            })
                        }
                    }
                });

                /*** Legend ***/
                var luuvuc_legend = L.control({position: "topleft"});
                luuvuc_legend.onAdd = map => {
                    var div = L.DomUtil.create('div', 'info legend');

                    div.innerHTML =
                        "<div class='legend-content' style='margin-top: 35%'>" +
                        "<div class='legend'>" +
                        ("<p class='title-legend-chart'>Lưu vực chính hệ thống sông lớn</p>") +
                        "<div class='row_legend'>" +
                        ("<div class='col_legend'>" +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #BDC661'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Sông Hồng" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #EEE996'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Sông Thái Bình" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #A9C8E7'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Sông Kỳ Cùng - Bằng Giang" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #A8A3D6'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Sông Mã" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #709747'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Sông Cả" + "</span>" +
                                "</div>") +
                            "</div>") +
                        ("<div class='col_legend'>" +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #EFBC33'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Sông Thu Bồn" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #EBBD62'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Sông Ba (Đà Rằng)" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #C2CC34'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Sông Đồng Nai" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #7EACA0'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Sông Mê Công (Cửu Long)" + "</span>" +
                                "</div>") +
                            "</div>") +
                        "</div>" +
                        ("<p class='title-legend-chart'>Lưu vực các sông nhỏ chảy trực tiếp ra biển</p>") +
                        "<div class='row_legend'>" +
                        ("<div class='col_legend'>" +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #DFC6DD'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Các lưu vực sông khác" + "</span>" +
                                "</div>") +
                            "</div>") +
                        "</div>" +
                        "</div>" +
                        "</div>";
                    var draggable = new L.Draggable(div);
                    draggable.enable();
                    return div;
                };
                luuvuc_legend.addTo(map);

                /*** Chart ***/
                var luuvuc_chart = L.control({position: "topright"});
                luuvuc_chart.onAdd = map => {
                    var div = L.DomUtil.create('div', 'info legend');

                    /* Make Chart */
                    /*-- Pie Char --*/
                    var data_luuvuc = [];
                    for (var attr in luuvuc.features) {
                        data_luuvuc.push(luuvuc.features[attr].properties);
                    }
                    nv.addGraph(function () {
                        var chart = nv.models.pieChart()
                            .x(function (d) {
                                return d.TEN_LUUVUC
                            })
                            .y(function (d) {
                                return d.VOLUME
                            })
                            .width(200)
                            .height(200)
                            .showLegend(false)
                            .showLabels(true)
                            .labelType("percent")
                            .labelThreshold(0.1)
                            .padAngle(0.1)
                            .color(["#BDC661", "#A9C8E7", "#709747", "#EFBC33", "#EBBD62",
                                "#C2CC34", "#A8A3D6", "#7EACA0", "#DFC6DD", "#EEE996"])
                            .showTooltipPercent(true);

                        chart.pie.donutLabelsOutside(false).donut(false);

                        d3.select("#pie_chart-river")
                            .datum(data_luuvuc)
                            .transition().duration(1200)
                            .call(chart);

                        nv.utils.windowResize(function () {
                            chart.update()
                        });
                        return chart;
                    });

                    /*-- Cumulative Line Char --*/
                    d3.json('../../../WebAtlas_VietNam_data/songngoi/chart_data/luuluongnuoc_data.json', function (data) {
                        nv.addGraph(function () {
                            var chart = nv.models.lineChart()
                                .margin({top: 10})
                                .x(function (d) {
                                    return d[0]
                                })
                                .y(function (d) {
                                    return d[1]
                                })
                                .useInteractiveGuideline(true)
                                .width(400)
                                .height(200)
                                .color(d3.scale.category10().range())

                            chart.xAxis
                                .axisLabel('Tháng')
                                .showMaxMin(false)
                                .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
                                .tickFormat(d3.format(',r'));

                            chart.yAxis
                                .axisLabel('Lưu lượng (m³/s)')
                                .tickFormat(d3.format(',r'));

                            d3.select('#line_chart-river')
                                .datum(data)
                                .call(chart);

                            nv.utils.windowResize(function () {
                                chart.update()
                            });
                            return chart;
                        });
                    });

                    div.innerHTML =
                        "<div class='chart-content'>" +
                        "<div class='chart'>" +
                        ("<p class='title-legend-chart'>Tỷ lệ diện tích lưu vực các hệ thống sông</p>") +
                        ("<p class='subtitle-chart'>(đơn vị: &#37;)</p>") +
                        /* DOM Chart */
                        "<svg id='pie_chart-river' class='mypiechart'></svg>" +
                        ("<p class='title-legend-chart'>Lưu lượng nước trung bình</p>") +
                        ("<p class='subtitle-chart'>(đơn vị: m³/s)</p>") +
                        "<svg id='line_chart-river' class='mylinechart'></svg>" +
                        "</div>" +
                        "</div>";
                    var draggable = new L.Draggable(div);
                    draggable.enable();
                    return div;
                }
                luuvuc_chart.addTo(map);

                /*--- Control Chart & Legend ---*/
                $('#switch_chart').change(function () {
                    if ($(this).prop('checked')) {
                        map.addControl(luuvuc_chart);
                    } else {
                        map.removeControl(luuvuc_chart);
                    }
                });
                $('#switch_legend').change(function () {
                    if ($(this).prop('checked')) {
                        map.addControl(luuvuc_legend);
                    } else {
                        map.removeControl(luuvuc_legend);
                    }
                });

                Hydda_base.addTo(map);
                view_biengioi.addTo(map);
                view_luuvuc_ranhgioi.addTo(map);

                view_luuvuc.addTo(map);
                view_songngoi.addTo(map);

                /*--- Control Layer Data ---*/
                $('#luuvuc_data').change(function () {
                    if ($(this).prop('checked')) {
                        map.addLayer(view_luuvuc);
                    } else {
                        map.removeLayer(view_luuvuc);
                    }
                });
                $('#song_data').change(function () {
                    if ($(this).prop('checked')) {
                        map.addLayer(view_songngoi);
                    } else {
                        map.removeLayer(view_songngoi);
                    }
                });

                var miniMap = new L.Control.MiniMap(esri, {
                    toggleDisplay: true,
                }).addTo(map);
            })
        })
    })
})