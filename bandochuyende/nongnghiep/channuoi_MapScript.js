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
$.getJSON("../../../WebAtlas_VietNam_data/nongnghiep/spatial_data/total_nongnghiep_18.geojson", function (nongnghiep_pois) {
    $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/vietnam_centroids.geojson", function (vn_point) {
        $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/tinh_ranhgioi.geojson", function (ranhgioi_tinh) {
            $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/vn_biengioi.geojson", function (biengioi) {

                /*** Main Map ***/
                var map = L.map('mymap', {
                        center: [16.10, 108.60],
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

                /*** Tên tỉnh ***/
                var view_labelvn = L.geoJSON(vn_point, {
                    pointToLayer: function (feat, latlng) {
                        var label_VN = '<p class="VN_label"><b>' + feat.properties.Name_Pro + '</b></p>';
                        return L.marker(latlng, {
                            icon: L.divIcon({
                                popupAnchor: [0, 0],
                                iconAnchor: [8, 8],
                                className: 'dummy'
                            })
                        }).bindTooltip(label_VN, {
                            permanent: true,
                            direction: "center",
                            opacity: 0
                        }).openTooltip();
                    }
                })

                /*** Chăn nuôi gia súc, gia cầm ***/
                var view_channuoichart = L.layerGroup();
                var charts = {};
                for (var attr in nongnghiep_pois.features) {
                    var props = nongnghiep_pois.features[attr].properties;
                    var coord = nongnghiep_pois.features[attr].geometry;
                    var data_feat = [
                        props['sl_trau'],
                        props['sl_bo'],
                        props['sl_lon'],
                        props['sl_giacam']
                    ];
                    charts[props['tong']] = L.minichart([coord.coordinates[1], coord.coordinates[0]], {
                        type: 'bar',
                        data: data_feat,
                        maxValues: 800,
                        width: 32,
                        height: 40,
                        colors: ["#51b83a", "#00f3ff", "#fff44a", "#ffa864"]
                    });
                    charts[props['tong']].bindPopup("<div id='popup_tb'>" + "<table class='chart_data'>" +
                        "<tbody>" +
                        "<tr>" +
                        "<td class='key_tb'>Số lượng trâu: </td>" + "<td>" + props['sl_trau'] + " nghìn con</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td class='key_tb'>Số lượng bò: </td>" + "<td>" + props['sl_bo'] + " nghìn con</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td class='key_tb'>Số lượng lợn: </td>" + "<td>" + props['sl_lon'] + " nghìn con</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td class='key_tb'>Số lượng gia cầm: </td>" + "<td>" + props['sl_giacam'] + " nghìn con</td>" +
                        "</tr>" +
                        "</tbody>" +
                        "</table>" + "</div>");
                    view_channuoichart.addLayer(charts[props['tong']]);
                }

                /*** Hàm Collison Labels ***/
                var i = 0;
                var hideLabel = function (label) {
                    label.labelObject.style.opacity = 0;
                };
                var showLabel = function (label) {
                    label.labelObject.style.opacity = 1;
                };
                labelEngine = new labelgun.default(hideLabel, showLabel);

                view_labelvn.eachLayer(function (label) {
                    label.added = true;
                    addLabel(label, i);
                    i++;
                });
                view_labelvn.addTo(map);
                map.on("zoomend", function () {
                    resetLabels(view_labelvn);
                });
                resetLabels(view_labelvn);

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
                var channuoi_legend = L.control({position: "topleft"});
                channuoi_legend.onAdd = map => {
                    var div = L.DomUtil.create('div', 'info legend');

                    div.innerHTML =
                        "<div class='legend-content' style='margin-top: 40%'>" +
                        "<div class='legend'>" +
                        ("<p class='title-legend-chart'>Sản lượng thịt hơi xuất chuồng <br> " +
                            "của các tỉnh phân theo đầu người</p>") +
                        ("<p class='subtitle-chart'>(đơn vị: kg/người)</p>") +
                        "<div class='row_legend'>" +
                        ("<div class='col_legend'>" +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #FCF9EB'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Dưới 20" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #F0E8E8'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 21 đến 30" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #E9D3D8'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 31 đến 40" + "</span>" +
                                "</div>") +
                            "</div>") +
                        ("<div class='col_legend'>" +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #E2A0B1'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 41 đến 50" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #EA8198'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Trên 50" + "</span>" +
                                "</div>") +
                            "</div>") +
                        "</div>" +
                        ("<p class='title-legend-chart' style='padding: 0'>Số lượng gia súc và gia cầm các tỉnh</p>") +
                        ("<p class='subtitle-chart'>(năm 2018; đơn vị: nghìn con)</p>") +
                        "<div class='row_legend'>" +
                        ("<div class='col_legend'>" +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #51b83a'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Số lượng trâu" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #00f3ff'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Số lượng bò" + "</span>" +
                                "</div>") +
                            "</div>") +
                        ("<div class='col_legend'>" +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #fff44a'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Số lượng lợn" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #ffa864'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Số lượng gia cầm" + "</span>" +
                                "</div>") +
                            "</div>") +
                        "</div>" +
                        "</div>" +
                        "</div>";
                    var draggable = new L.Draggable(div);
                    draggable.enable();
                    return div;
                };
                channuoi_legend.addTo(map);

                /*** Chart ***/
                var channuoi_chart = L.control({position: "topright"});
                channuoi_chart.onAdd = map => {
                    var div = L.DomUtil.create('div', 'info legend');

                    /* Make Chart */
                    /*-- Area Chart 1 --*/
                    d3.json('../../../WebAtlas_VietNam_data/nongnghiep/chart_data/channuoi_area_1.json', function (channuoi_area_1) {
                        nv.addGraph(function () {
                            var chart = nv.models.stackedAreaChart()
                                .x(function (d) {
                                    return d[0]
                                })
                                .y(function (d) {
                                    return d[1]
                                })
                                .useInteractiveGuideline(true)
                                .rightAlignYAxis(false)
                                .showControls(false)
                                .color(["#72A970", "#E9A3B3", "#FCF98E"])
                                .clipEdge(true);

                            chart.xAxis
                                .axisLabel('Năm')
                                .tickFormat(d3.format(',f'));

                            chart.yAxis
                                .tickFormat(d3.format(',.1f'));

                            chart.style('stack');

                            d3.select('#area_chart_channuoi_1')
                                .datum(channuoi_area_1)
                                .call(chart);

                            nv.utils.windowResize(function () {
                                chart.update()
                            });
                            return chart;
                        });
                    })

                    /*-- Area Chart 2 --*/
                    d3.json('../../../WebAtlas_VietNam_data/nongnghiep/chart_data/channuoi_area_2.json', function (channuoi_area_2) {
                        nv.addGraph(function () {
                            var chart = nv.models.stackedAreaChart()
                                .x(function (d) {
                                    return d[0]
                                })
                                .y(function (d) {
                                    return d[1]
                                })
                                .useInteractiveGuideline(true)
                                .rightAlignYAxis(false)
                                .showControls(false)
                                .color(["#e9a666", "#E9A3B3","#FCF98E"])
                                .clipEdge(true);

                            chart.xAxis
                                .axisLabel('Năm')
                                .tickFormat(d3.format(',f'));

                            chart.yAxis
                                .tickFormat(d3.format(',.1f'));

                            chart.style('stack');

                            d3.select('#area_chart_channuoi_2')
                                .datum(channuoi_area_2)
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
                        /* DOM Chart */
                        /** lồng Svg vào thẻ div mới có thể style height width **/
                        ("<p class='title-legend-chart'>Giá trị sản xuất ngành chăn nuôi<br>" +
                            "trong tổng giá trị sản xuất nông nghiệp</p>") +
                        ("<p class='subtitle-chart'>(đơn vị: %)</p>") +
                        //"<div style='width: 450px; height: 250px'>" +
                        "<svg id='area_chart_channuoi_1' class='myarechart'></svg>" +
                        //"</div>" +
                        ("<p class='title-legend-chart'>Cơ cấu giá trị sản xuất<br>" +
                            "ngành chăn nuôi qua các năm</p>") +
                        ("<p class='subtitle-chart'>(đơn vị: %)</p>") +
                        //"<div style='width: 450px; height: 250px'>" +
                        "<svg id='area_chart_channuoi_2' class='myarechart'></svg>" +
                        //"</div>" +
                        "</div>" +
                        "</div>";
                    var draggable = new L.Draggable(div);
                    draggable.enable();
                    return div;
                };
                channuoi_chart.addTo(map);

                /*--- Control Chart & Legend ---*/
                $('#switch_chart').change(function () {
                    if ($(this).prop('checked')) {
                        map.addControl(channuoi_chart);
                    } else {
                        map.removeControl(channuoi_chart);
                    }
                });
                $('#switch_legend').change(function () {
                    if ($(this).prop('checked')) {
                        map.addControl(channuoi_legend);
                    } else {
                        map.removeControl(channuoi_legend);
                    }
                });

                Hydda_base.addTo(map);
                view_biengioi.addTo(map);
                view_ranhgioi_tinh.addTo(map);
                view_channuoichart.addTo(map);

                /*--- Control Layer Data ---*/
                $('#channuoichart_data').change(function () {
                    if ($(this).prop('checked')) {
                        map.addLayer(view_channuoichart);
                    } else {
                        map.removeLayer(view_channuoichart);
                    }
                });
            })
        })
    })
})