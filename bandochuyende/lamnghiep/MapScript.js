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
$.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/vietnam_centroids.geojson", function (vn_point) {
    $.getJSON("../../../WebAtlas_VietNam_data/lamnghiep/spatial_data/diem_lamnghiep_15.geojson", function (lamnghiep_point) {
        $.getJSON("../../../WebAtlas_VietNam_data/lamnghiep/spatial_data/lamnghiep_15.geojson", function (lamnghiep) {
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

                    /*** Tỷ lệ diện tích rừng ***/
                    function getColor_dtrung(d) {
                        return d > 60 ? "#63AF4D" :
                            d > 40 ? "#A5C97B" :
                                d > 20 ? "#E0E09A" :
                                    d > 10 ? "#F3FEC0" :
                                        "#FCF9EB";
                    }

                    function style_dtrung(feat) {
                        return {
                            fillColor: getColor_dtrung(feat.properties.tle),
                            weight: 0,
                            dashArray: '3',
                            color: "#ffffff",
                            fillOpacity: 1
                        }
                    }

                    var view_dtrung = L.geoJSON(lamnghiep, {
                        style: style_dtrung,
                        onEachFeature: function (feat, layer) {
                            if (feat.properties && feat.properties.tong) {
                                layer.bindPopup("<span style='color: #767676; " +
                                    "font-weight: bolder; font-family: Arial'>Tổng diện tích rừng: " + feat.properties.tong +
                                    " nghìn ha" + "<br>" + "<span style='color: red; font-family: Arial'>Tỷ lệ: " +
                                    feat.properties.tle + " %" + "</span>" + "</span>");
                            }
                        }
                    });

                    /*** Diện tích rừng tự nhiên và rừng trồng của các tỉnh ***/
                    var view_lamnghiepchart = L.layerGroup();
                    var charts = {};
                    for (var attr in lamnghiep_point.features) {
                        var props = lamnghiep_point.features[attr].properties;
                        var coord = lamnghiep_point.features[attr].geometry;
                        var data_feat = [
                            props['rtn'],
                            props['rt']
                        ];
                        charts[props['tong']] = L.minichart([coord.coordinates[1], coord.coordinates[0]], {
                            type: 'pie',
                            data: data_feat,
                            maxValues: 'auto',
                            width: 25,
                            colors: ["#ff79ad", "#7dfff8"]
                        });
                        charts[props['tong']].bindPopup("<div id='popup_tb'>" + "<table class='chart_data'>" +
                            "<tbody>" +
                            "<tr>" +
                            "<td class='key_tb'>Rừng tự nhiên: </td>" + "<td>" + props['rtn'] + " nghìn ha</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Rừng trồng: </td>" + "<td>" + props['rt'] + " nghìn ha</td>" +
                            "</tr>" +
                            "</tbody>" +
                            "</table>" + "</div>");
                        view_lamnghiepchart.addLayer(charts[props['tong']]);
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
                    var lamnghiep_legend = L.control({position: "topleft"});
                    lamnghiep_legend.onAdd = map => {
                        var div = L.DomUtil.create('div', 'info legend');

                        div.innerHTML =
                            "<div class='legend-content' style='margin-top: 40%'>" +
                            "<div class='legend'>" +
                            ("<p class='title-legend-chart'>Tỷ lệ diện tích rừng so với diện tích toàn tỉnh</p>") +
                            ("<p class='subtitle-chart'>(năm 2015; đơn vị: %)</p>") +
                            "<div class='row_legend'>" +
                            ("<div class='col_legend'>" +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #FCF9EB'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Dưới 10" + "</span>" +
                                    "</div>") + '<br>' +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #F3FEC0'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 11 đến 20" + "</span>" +
                                    "</div>") + '<br>' +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #E0E09A'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 21 đến 40" + "</span>" +
                                    "</div>") +
                                "</div>") +
                            ("<div class='col_legend'>" +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #A5C97B'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 41 đến 60" + "</span>" +
                                    "</div>") + '<br>' +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #63AF4D'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Trên 60" + "</span>" +
                                    "</div>") +
                                "</div>") +
                            "</div>" +
                            ("<p class='title-legend-chart' style='padding: 0'>Diện tích rừng tự nhiên và rừng trồng</p>") +
                            ("<p class='subtitle-chart'>(năm 2015; đơn vị: nghìn ha)</p>") +
                            "<div class='row_legend'>" +
                            ("<div class='col_legend'>" +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #ff79ad'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Rừng tự nhiên" + "</span>" +
                                    "</div>") +
                                "</div>") +
                            ("<div class='col_legend'>" +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #7dfff8'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Rừng trồng" + "</span>" +
                                    "</div>") +
                                "</div>") +
                            "</div>" +
                            "</div>" +
                            "</div>";
                        var draggable = new L.Draggable(div);
                        draggable.enable();
                        return div;
                    };
                    lamnghiep_legend.addTo(map);

                    /*** Chart ***/
                    var lamnghiep_chart = L.control({position: "topright"});
                    lamnghiep_chart.onAdd = map => {
                        var div = L.DomUtil.create('div', 'info legend');

                        /* Make Chart */
                        /*-- Group/Stacked Chart --*/
                        d3.json("../../../WebAtlas_VietNam_data/lamnghiep/chart_data/lamnghiep_year.json", function (lamnghiep_year) {
                            nv.addGraph(function () {
                                var chart = nv.models.multiBarChart()
                                    .margin({left: 60})
                                    .useInteractiveGuideline(true)
                                    .reduceXTicks(true)
                                    .rotateLabels(0)
                                    .showControls(true)
                                    .groupSpacing(0.5)
                                    .color(['#7dfff8', '#ff79ad'])

                                chart.xAxis
                                    .axisLabel('Năm')
                                    .showMaxMin(false)
                                    .tickFormat(d3.format(',f'));

                                chart.yAxis
                                    .axisLabel('Diện tích rừng (nghìn ha)')
                                    .tickFormat(d3.format(',.1f'));

                                d3.select('#col_chart-lamnghiep')
                                    .datum(lamnghiep_year)
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
                            ("<p class='title-legend-chart'>Diện tích rừng của cả nước qua các năm</p>") +
                            ("<p class='subtitle-chart'>(đơn vị: nghìn ha)</p>") +
                            /* DOM Chart */
                            /** lồng Svg vào thẻ div mới có thể style height width **/
                            "<div style='width: 400px; height: 400px'>" +
                            "<svg id='col_chart-lamnghiep' class='mybarstackedchart'></svg>" +
                            "</div>" +
                            "</div>" +
                            "</div>";
                        var draggable = new L.Draggable(div);
                        draggable.enable();
                        return div;
                    };
                    lamnghiep_chart.addTo(map);

                    /*--- Control Chart & Legend ---*/
                    $('#switch_chart').change(function () {
                        if ($(this).prop('checked')) {
                            map.addControl(lamnghiep_chart);
                        } else {
                            map.removeControl(lamnghiep_chart);
                        }
                    });
                    $('#switch_legend').change(function () {
                        if ($(this).prop('checked')) {
                            map.addControl(lamnghiep_legend);
                        } else {
                            map.removeControl(lamnghiep_legend);
                        }
                    });

                    Hydda_base.addTo(map);
                    view_biengioi.addTo(map);

                    view_dtrung.addTo(map);
                    view_ranhgioi_tinh.addTo(map);
                    view_lamnghiepchart.addTo(map);

                    /*--- Control Layer Data ---*/
                    $('#lamnghiep_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(view_dtrung);
                        } else {
                            map.removeLayer(view_dtrung);
                        }
                    });
                    $('#lamnghiepchart_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(view_lamnghiepchart);
                        } else {
                            map.removeLayer(view_lamnghiepchart);
                        }
                    });
                });
            });
        });
    })
})