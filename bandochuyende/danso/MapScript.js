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
$.getJSON("../../../WebAtlas_VietNam_data/danso/spatial_data/point_dothi_2009.geojson", function (dothi_09) {
    //$.getJSON("../../../WebAtlas_VietNam_data/danso/spatial_data/polygon_danso_2009.geojson", function (density_pop_09) {
        $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/tinh_ranhgioi.geojson", function (ranhgioi_tinh) {
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

                /*** Mật độ dân số năm 2009 (Vector Tiles) ***/
                var density_pop_09 = service_tiles + "atlas_vietnam_tiles/t_polygon_danso_2009/{z}/{x}/{y}.pbf";

                function getColor_danso(d) {
                    return d > 2000 ? "#C04460" :
                        d > 1000 ? "#E29EB5" :
                            d > 500 ? "#DCB4A5" :
                                d > 200 ? "#D2CA66" :
                                    d > 100 ? "#ECEE7A" :
                                        d > 50 ? "#F3F8A9" :
                                            "#F6F9E8";
                }

                var style_matdo_09 = {
                    polygon_danso_2009: function (feat) {
                        return {
                            fill:true,
                            fillColor: getColor_danso(feat.Density_09),
                            weight: 0,
                            color: "transparent",
                            fillOpacity: 1
                        }
                    }
                }

                var view_matdo_09 = L.vectorGrid.protobuf(density_pop_09, {
                    vectorTileLayerStyles: style_matdo_09,
                    interactive: true,
                    maxZoom: 19,
                    maxNativeZoom: 14,
                    getFeatureId: function (feat) {
                        return feat.properties.Density_09;
                    }
                })

                view_matdo_09.on('click', function (e) {
                    //console.log(e.layer.properties["Quan_Huyen"]);
                    if (e.layer.properties["Quan_Huyen"] != null)
                    {
                        view_matdo_09.bindPopup("<span style='color: #767676; " +
                            "font-weight: bolder; font-family: Arial'>" + e.layer.properties["Quan_Huyen"] +
                            ": " + "<span style='color: red; font-family: Arial'>" +
                            e.layer.properties["Density_09"] + " người/km²" + "</span>" +
                            "</span>")
                    } else {
                        view_matdo_09.bindPopup("<span style='color: #767676; " +
                            "font-weight: bolder; font-family: Arial'>" + e.layer.properties["NAME_2"] +
                            ": " + "<span style='color: red; font-family: Arial'>" +
                            e.layer.properties["Density_09"] + " người/km²" + "</span>" +
                            "</span>")
                    }

                })

                /* View dạng GeoJSON
                var view_matdo_09 = L.geoJSON(density_pop_09, {
                    style: style_matdo_09,
                    onEachFeature: function (feat, layer) {
                        if (feat.properties && feat.properties.Quan_Huyen) {
                            layer.bindPopup("<span style='color: #767676; " +
                                "font-weight: bolder; font-family: Arial'>" + feat.properties.Quan_Huyen +
                                ": " + "<span style='color: red; font-family: Arial'>" +
                                feat.properties.Density_09 + " người/km²" + "</span>" +
                                "</span>");
                        }
                    }
                }); */

                /*** Quy mô dân số và Phân cấp đô thị năm 2009 ***/
                var view_quymo_danso_TS_T1_T2 = L.geoJSON(dothi_09, {
                    pointToLayer: function (feat, latlng) {
                        if (feat.properties.T_Cities == "T_S") {
                            var label_TS = '<p class="TS_dothi_label"><b>' + feat.properties.name + '</b></p>';
                            return L.marker(latlng, {
                                icon: L.divIcon({
                                    html: "<i class='fa fa-building-o TS_dothi_symbol'></i>",
                                    popupAnchor: [0, 0],
                                    iconAnchor: [8, 8],
                                    className: 'mouse_pointer TS_dothi_divIcon'
                                })
                            }).bindTooltip(label_TS, {
                                permanent: true,
                                direction: "center",
                                opacity: 0
                            }).openTooltip();
                        } else if (feat.properties.T_Cities == "T_1") {
                            var label_T1 = '<p class="T1_dothi_label"><b>' + feat.properties.name + '</b></p>';
                            return L.marker(latlng, {
                                icon: L.divIcon({
                                    html: "<i class='fa fa-university T1_dothi_symbol'></i>",
                                    popupAnchor: [0, 0],
                                    iconAnchor: [8, 8],
                                    className: 'mouse_pointer T1_dothi_divIcon'
                                })
                            }).bindTooltip(label_T1, {
                                permanent: true,
                                direction: "center",
                                opacity: 0
                            }).openTooltip();
                        } else if (feat.properties.T_Cities == "T_2") {
                            var label_T2 = '<p class="T2_dothi_label"><b>' + feat.properties.name + '</b></p>';
                            return L.marker(latlng, {
                                icon: L.divIcon({
                                    html: "<i class='fa fa-home T2_dothi_symbol'></i>",
                                    popupAnchor: [1, 1],
                                    iconAnchor: [4, 4],
                                    className: 'mouse_pointer T2_dothi_divIcon'
                                })
                            }).bindTooltip(label_T2, {
                                permanent: true,
                                direction: "center",
                                opacity: 0
                            }).openTooltip();
                        }
                    }
                })

                var view_quymo_danso_T3_T4 = L.geoJSON(dothi_09, {
                    pointToLayer: function (feat, latlng) {
                        if (feat.properties.T_Cities == "T_3") {
                            var label_T3 = '<p class="T3_dothi_label"><b>' + feat.properties.name + '</b></p>';
                            return L.marker(latlng, {
                                icon: L.divIcon({
                                    html: "<i class='fa fa-dot-circle-o T3_dothi_symbol'></i>",
                                    popupAnchor: [1, 1],
                                    iconAnchor: [4, 4],
                                    className: 'mouse_pointer T3_dothi_divIcon'
                                })
                            }).bindTooltip(label_T3, {
                                permanent: true,
                                direction: "center",
                                opacity: 0
                            }).openTooltip();
                        } else if (feat.properties.T_Cities == "T_4") {
                            var label_T4 = '<p class="T4_dothi_label"><b>' + feat.properties.name + '</b></p>';
                            return L.marker(latlng, {
                                icon: L.divIcon({
                                    html: "<i class='fa fa-circle T4_dothi_symbol'></i>",
                                    popupAnchor: [1, 1],
                                    iconAnchor: [4, 4],
                                    className: 'mouse_pointer T4_dothi_divIcon'
                                })
                            }).bindTooltip(label_T4, {
                                permanent: true,
                                direction: "center",
                                opacity: 0
                            }).openTooltip();
                        }
                    }
                });

                /*** Hàm Collison Labels ***/
                var i = 0;
                var hideLabel = function (label) {
                    label.labelObject.style.opacity = 0;
                };
                var showLabel = function (label) {
                    label.labelObject.style.opacity = 1;
                };
                labelEngine = new labelgun.default(hideLabel, showLabel);

                view_quymo_danso_TS_T1_T2.eachLayer(function (label) {
                    label.added = true;
                    addLabel(label, i);
                    i++;
                });
                view_quymo_danso_TS_T1_T2.addTo(map);
                map.on("zoomend", function () {
                    resetLabels(view_quymo_danso_TS_T1_T2);
                });
                resetLabels(view_quymo_danso_TS_T1_T2);

                view_quymo_danso_T3_T4.eachLayer(function (label) {
                    label.added = true;
                    addLabel(label, i);
                    i++;
                });
                view_quymo_danso_T3_T4.addTo(map);
                map.on("zoomend", function () {
                    resetLabels(view_quymo_danso_T3_T4);
                });
                resetLabels(view_quymo_danso_T3_T4);

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
                var matdo_09_legend = L.control({position: "topleft"});
                matdo_09_legend.onAdd = map => {
                    var div = L.DomUtil.create('div', 'info legend');

                    div.innerHTML =
                        "<div class='legend-content' style='margin-top: 15%'>" +
                        "<div class='legend'>" +
                        ("<p class='title-legend-chart'>Mật độ dân số</p>") +
                        ("<p class='subtitle-chart'>(năm 2009; đơn vị: người/km²)</p>") +
                        "<div class='row_legend'>" +
                        ("<div class='col_legend'>" +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #F6F9E8'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Dưới 50" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #F3F8A9'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 50 - 100" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #ECEE7A'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 101 - 200" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #D2CA66'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 201 - 500" + "</span>" +
                                "</div>") +
                            "</div>") +
                        ("<div class='col_legend'>" +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #DCB4A5'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 501 - 1000" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #E29EB5'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 1001 - 2000" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_rec'>" +
                                "<div class='rec' style='background-color: #C04460'></div>" +
                                "<span class='label_legend_rec' style='margin-left: 60px'>" + "Trên 2000" + "</span>" +
                                "</div>") +
                            "</div>") +
                        "</div>" +
                        ("<p class='title-legend-chart' style='padding: 0'>Các đô thị</p>") +
                        "<div class='row_legend'>" +
                        ("<div class='col_legend' style='padding: 0'>" +
                            ("<p class='title-legend-chart' style='font-size: 12px'>Quy mô dân số</p>") +
                            ("<div class='container_poi'>" +
                                "<div class='poi' style='height: 30px; width: 30px'></div>" +
                                "<span class='label_legend_poi' style='margin-left: 35px; margin-top: 5px'>" + "Trên 1 000 000 người" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_poi'>" +
                                "<div class='poi' style='height: 20px; width: 20px; margin-left: 5px; margin-top: 12px'></div>" +
                                "<span class='label_legend_poi' style='margin-left: 35px; margin-top: 5px'>" + "Từ 500 001 -" + '<br>' + " 1 000 000 người" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_poi'>" +
                                "<div class='poi' style='height: 17px; width: 17px; margin-left: 6px; margin-top: 13px'></div>" +
                                "<span class='label_legend_poi' style='margin-left: 35px; margin-top: 5px'>" + "Từ 200 001 -" + '<br>' + " 500 000 người" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_poi'>" +
                                "<div class='poi' style='height: 15px; width: 15px; margin-left: 7px; margin-top: 15px'></div>" +
                                "<span class='label_legend_poi' style='margin-left: 35px; margin-top: 5px'>" + "Từ 100 001 -" + '<br>' + " 200 000 người" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_poi'>" +
                                "<div class='poi' style='height: 10px; width: 10px; margin-left: 9px; margin-top: 3px'></div>" +
                                "<span class='label_legend_poi' style='margin-left: 35px'>" + "Dưới 100 000 người" + "</span>" +
                                "</div>") +
                            "</div>") +
                        ("<div class='col_legend' style='padding: 0'>" +
                            ("<p class='title-legend-chart' style='font-size: 12px'>Phân cấp đô thị</p>") +
                            ("<div class='container_poi'>" +
                                "<div class='fa fa-building-o fontaws_poi' style='padding-left: 2px'></div>" +
                                "<span class='label_legend_poi_fa' style='margin-left: 10px; font-weight: bold; text-transform: uppercase'>" + "Đô thị đặc biệt" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_poi'>" +
                                "<div class='fa fa-university fontaws_poi' style='margin-left: 23px !important'></div>" +
                                "<span class='label_legend_poi_fa' style='margin-left: 12px; font-weight: lighter; text-transform: uppercase'>" + "Đô thị loại 1" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_poi'>" +
                                "<div class='fa fa-home fontaws_poi'></div>" +
                                "<span class='label_legend_poi_fa' style='margin-left: 11px; font-weight: lighter; text-transform: normal'>" + "Đô thị loại 2" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_poi'>" +
                                "<div class='fa fa-dot-circle-o fontaws_poi' style='padding-left: 1px'></div>" +
                                "<span class='label_legend_poi_fa' style='margin-left: 11px; font-weight: bolder; font-style: italic'>" + "Đô thị loại 3" + "</span>" +
                                "</div>") + '<br>' +
                            ("<div class='container_poi'>" +
                                "<div class='fa fa-circle fontaws_poi' style='padding-left: 4px; font-size: 13px;'></div>" +
                                "<span class='label_legend_poi_fa' style='margin-left: 11px; font-weight: lighter; font-style: italic'>" + "Đô thị loại 4" + "</span>" +
                                "</div>") +
                            "</div>") +
                        "</div>" +
                        "</div>" +
                        "</div>";
                    var draggable = new L.Draggable(div);
                    draggable.enable();
                    return div;
                };
                matdo_09_legend.addTo(map);

                /*** Chart ***/
                var danso_0919_chart = L.control({position: "topright"});
                danso_0919_chart.onAdd = map => {
                    var div = L.DomUtil.create('div', 'info legend');

                    /* Make Chart */
                    /*-- Group/Stacked Chart --*/
                    d3.json("../../../WebAtlas_VietNam_data/danso/chart_data/danso_year.json", function (danso_year) {
                        nv.addGraph(function () {
                            var chart = nv.models.multiBarChart()
                                .useInteractiveGuideline(true)
                                .reduceXTicks(true)
                                .rotateLabels(0)
                                .showControls(true)
                                .stacked(true)
                                .groupSpacing(0.5)
                                .color(['#fee82f', '#ff9ddb'])

                            chart.xAxis
                                .axisLabel('Năm')
                                .showMaxMin(true)
                                .tickFormat(d3.format(',f'));

                            chart.yAxis
                                .axisLabel('Số người (triệu người)')
                                .tickFormat(d3.format(',.001f'));

                            d3.select('#col_chart-pop')
                                .datum(danso_year)
                                .call(chart);

                            nv.utils.windowResize(function () {
                                chart.update()
                            });
                            return chart;
                        });
                    });

                    /*-- Area Chart--*/
                    d3.json('../../../WebAtlas_VietNam_data/danso/chart_data/danso_area.json', function (danso_area) {
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
                                .showControls(true)
                                .color(["#FCF98E", "#E9A3B3", "#72A970"])
                                .clipEdge(true);

                            chart.xAxis
                                .axisLabel('Năm')
                                .tickFormat(d3.format(',f'));

                            chart.yAxis
                                .tickFormat(d3.format(',.01f'));

                            chart.style('expand');

                            d3.select('#area_chart-pop')
                                .datum(danso_area)
                                .call(chart);

                            nv.utils.windowResize(function () {
                                chart.update()
                            });
                            return chart;
                        });
                    })

                    /*-- Pyramid Chart --*/
                    $.getJSON("../../../WebAtlas_VietNam_data/danso/chart_data/pyramid_pop_09.json", function (vnData) {
                        render_pyramid("pyramid_09", vnData, "Nhóm tuổi", "Nam", "Nữ");
                    });

                    $.getJSON("../../../WebAtlas_VietNam_data/danso/chart_data/pyramid_pop_19.json", function (vnData) {
                        render_pyramid("pyramid_19", vnData, "Nhóm tuổi", "Nam", "Nữ");
                    })

                    div.innerHTML =
                        "<div class='chart-content'>" +
                        "<div class='chart'>" +
                        "<div class='chart_front'>" +
                        ("<p class='title-legend-chart'>Dân số Việt Nam qua các năm</p>") +
                        ("<p class='subtitle-chart'>(đơn vị: triệu người)</p>") +
                        /* DOM Chart */
                        /** lồng Svg vào thẻ div mới có thể style height width **/
                        "<div style='width: 400px; height: 200px'>" +
                        "<svg id='col_chart-pop' class='mybarstackedchart'></svg>" +
                        "</div>" +
                        ("<p class='title-legend-chart'>Cơ cấu lao động đang làm việc<br>phân theo khu vực kinh tế</p>") +
                        ("<p class='subtitle-chart'>(đơn vị: %)</p>") +
                        "<div style='width: 450px; height: 250px'>" +
                        "<svg id='area_chart-pop' class='myarechart'></svg>" +
                        "</div>" +
                        "</div>" +
                        "<div class='chart_back'>" +
                        ("<p class='title-legend-chart' style='margin-top: 10px'>Tháp dân số</p>") +
                        ("<p class='subtitle-chart' style='margin-left: 75px; font-size: 16px; font-weight: bold; display: inline'>Năm 2009</p>") +
                        ("<p class='subtitle-chart' style='margin-left: 50.5px; font-size: 15px; " +
                            "font-weight: bold; display: inline; color: #a2d8f2'>Nữ</p>") +
                        ("<p class='subtitle-chart' style='margin-left: 30px; font-size: 15px; " +
                            "font-weight: bold; display: inline; color: #f5b3cc'>Nam</p>") +
                        ("<p class='subtitle-chart' style='margin-left: 50px; font-size: 16px; font-weight: bold; display: inline'>Năm 2019</p>") +
                        "<div style='width: 400px; height: 200px'>" +
                        "<div id='pyramid_09'></div>" +
                        "<div id='pyramidchart_axes'>" +
                        "<p>85+</p>" +
                        "<p>80-84</p>" +
                        "<p>75-79</p>" +
                        "<p>70-74</p>" +
                        "<p>65-69</p>" +
                        "<p>60-64</p>" +
                        "<p>55-59</p>" +
                        "<p>50-54</p>" +
                        "<p>45-49</p>" +
                        "<p>40-44</p>" +
                        "<p>35-39</p>" +
                        "<p>30-34</p>" +
                        "<p>25-29</p>" +
                        "<p>20-24</p>" +
                        "<p>15-19</p>" +
                        "<p>10-14</p>" +
                        "<p>5-9</p>" +
                        "<p>0-4</p>" +
                        "</div>" +
                        "<div id='pyramid_19'></div>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</div>";
                    var draggable = new L.Draggable(div);
                    draggable.enable();
                    return div;
                }
                danso_0919_chart.addTo(map);

                /*--- Control Chart & Legend ---*/
                $('#switch_chart').change(function () {
                    if ($(this).prop('checked')) {
                        map.addControl(danso_0919_chart);
                    } else {
                        map.removeControl(danso_0919_chart);
                    }
                });
                $('#switch_legend').change(function () {
                    if ($(this).prop('checked')) {
                        map.addControl(matdo_09_legend);
                    } else {
                        map.removeControl(matdo_09_legend);
                    }
                });

                viet_bando.addTo(map);
                //Hydda_base.addTo(map);
                view_biengioi.addTo(map);

                view_matdo_09.addTo(map);
                view_ranhgioi_tinh.addTo(map);

                view_quymo_danso_TS_T1_T2.addTo(map);
                view_quymo_danso_T3_T4.addTo(map);

                /*--- Control Layer Data ---*/
                $('#density_data').change(function () {
                    if ($(this).prop('checked')) {
                        map.addLayer(view_matdo_09);
                    } else {
                        map.removeLayer(view_matdo_09);
                    }
                });
                $('#cities_data').change(function () {
                    if ($(this).prop('checked')) {
                        map.addLayer(view_quymo_danso_TS_T1_T2);
                        map.addLayer(view_quymo_danso_T3_T4);
                    } else {
                        map.removeLayer(view_quymo_danso_TS_T1_T2);
                        map.removeLayer(view_quymo_danso_T3_T4);
                    }
                });
            });
        });
    //});
})