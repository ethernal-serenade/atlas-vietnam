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
$.getJSON("../../../WebAtlas_VietNam_data/nongnghiep/spatial_data/total_nongnghiep_vung_18.geojson", function (nongnghiep_vung) {
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

                    /*** Sản lượng và diện tích lúa ***/
                    var view_luachart = L.layerGroup();
                    var charts = {};
                    for (var attr in nongnghiep_pois.features) {
                        var props = nongnghiep_pois.features[attr].properties;
                        var coord = nongnghiep_pois.features[attr].geometry;
                        var data_feat = [
                            props['area_lua'],
                            props['sl_lua'],
                        ];
                        charts[props['tong']] = L.minichart([coord.coordinates[1], coord.coordinates[0]], {
                            type: 'bar',
                            data: data_feat,
                            maxValues: 150,
                            width: 15,
                            height: 40,
                            colors: ["#51b83a", "#ffa864"]
                        });
                        charts[props['tong']].bindPopup("<div id='popup_tb'>" + "<table class='chart_data'>" +
                            "<tbody>" +
                            "<tr>" +
                            "<td class='key_tb'>Diện tích trồng lúa: </td>" + "<td>" + props['sl_trau'] + " nghìn ha</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td class='key_tb'>Sản lượng lúa: </td>" + "<td>" + props['sl_bo'] + " nghìn tấn</td>" +
                            "</tr>" +
                            "</tbody>" +
                            "</table>" + "</div>");
                        view_luachart.addLayer(charts[props['tong']]);
                    }

                    /*** Diện tích lúa so với diện tích cây lương thực ***/
                    function getColor_dtlua(d) {
                        return d > 90 ? "#FFCD5F" :
                            d > 80 ? "#FFE833" :
                                d > 70 ? "#FEFC19" :
                                    d > 60 ? "#FEFC93" :
                                        "#FCF9EB";
                    }

                    function style_dtlua(feat) {
                        var tyle_dtlua = (feat.properties.area_lua / feat.properties.area_lthuc)*100;
                        tyle_dtlua = tyle_dtlua.toFixed(2)
                        return {
                            fillColor: getColor_dtlua(tyle_dtlua),
                            weight: 0,
                            dashArray: '3',
                            color: "#ffffff",
                            fillOpacity: 1
                        }
                    }

                    var view_dtlua = L.geoJSON(nongnghiep_vung, {
                        style: style_dtlua,
                        onEachFeature: function (feat, layer) {
                            var tyle_dtlua = (feat.properties.area_lua / feat.properties.area_lthuc)*100;
                            tyle_dtlua = tyle_dtlua.toFixed(2)
                            if (feat.properties && feat.properties.NAME_1) {
                                layer.bindPopup("<span style='color: #767676; " +
                                    "font-weight: bolder; font-family: Arial'>Tổng diện tích lúa: " + feat.properties.area_lua +
                                    " nghìn ha" + "<br>" + "<span style='color: red; font-family: Arial'>Tỷ lệ: " +
                                    tyle_dtlua + " %" + "</span>" + "</span>");
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
                    var lua_legend = L.control({position: "topleft"});
                    lua_legend.onAdd = map => {
                        var div = L.DomUtil.create('div', 'info legend');

                        div.innerHTML =
                            "<div class='legend-content' style='margin-top: 40%'>" +
                            "<div class='legend'>" +
                            ("<p class='title-legend-chart'>Diện tích trồng lúa so với <br> " +
                                "diện tích trồng cây lương thực</p>") +
                            ("<p class='subtitle-chart'>(đơn vị: %)</p>") +
                            "<div class='row_legend'>" +
                            ("<div class='col_legend'>" +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #FCF9EB'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Dưới 60" + "</span>" +
                                    "</div>") + '<br>' +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #FEFC93'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 61 đến 70" + "</span>" +
                                    "</div>") + '<br>' +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #FEFC19'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 71 đến 80" + "</span>" +
                                    "</div>") +
                                "</div>") +
                            ("<div class='col_legend'>" +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #FFE833'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 81 đến 90" + "</span>" +
                                    "</div>") + '<br>' +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #FFCD5F'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Trên 90" + "</span>" +
                                    "</div>") +
                                "</div>") +
                            "</div>" +
                            ("<p class='title-legend-chart' style='padding: 0'>Diện tích và sản lượng lúa của các tỉnh</p>") +
                            ("<p class='subtitle-chart'>(số liệu sơ bộ năm 2018)</p>") +
                            "<div class='row_legend'>" +
                            ("<div class='col_legend'>" +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #51b83a'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Diện tích trồng lúa" + "</span>" +
                                    "</div>") +
                                "</div>") +
                            ("<div class='col_legend'>" +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #ffa864'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Sản lượng lúa" + "</span>" +
                                    "</div>") +
                                "</div>") +
                            "</div>" +
                            "</div>" +
                            "</div>";
                        var draggable = new L.Draggable(div);
                        draggable.enable();
                        return div;
                    };
                    lua_legend.addTo(map);

                    /*** Chart ***/
                    var lua_chart = L.control({position: "topright"});
                    lua_chart.onAdd = map => {
                        var div = L.DomUtil.create('div', 'info legend');

                        /* Make Chart */
                        /*-- Group/Stacked Chart --*/
                        d3.json("../../../WebAtlas_VietNam_data/nongnghiep/chart_data/luongthuc_year.json", function (luongthuc_year) {
                            nv.addGraph(function () {
                                var chart = nv.models.multiBarChart()
                                    .margin({left: 60})
                                    .useInteractiveGuideline(true)
                                    .reduceXTicks(true)
                                    .rotateLabels(0)
                                    .showControls(true)
                                    .groupSpacing(0.5)
                                    .color(['#FFE833', '#ffad4f'])

                                chart.xAxis
                                    .axisLabel('Năm')
                                    .showMaxMin(false)
                                    .tickFormat(d3.format(',f'));

                                chart.yAxis
                                    .axisLabel('Giá trị (tỷ đồng)')
                                    .tickFormat(d3.format(',f'));

                                d3.select('#col_chart_luongthuc')
                                    .datum(luongthuc_year)
                                    .call(chart);

                                nv.utils.windowResize(function () {
                                    chart.update()
                                });
                                return chart;
                            });
                        });

                        /*-- Line plus Bar Chart --*/
                        $.getJSON("../../../WebAtlas_VietNam_data/nongnghiep/chart_data/dt_sl_lua_year.json", function (dt_sl_lua_year) {
                            render_linebar_dtsl_lua("line_bar_dtsl_lua_chart", dt_sl_lua_year, "Năm",
                                "Diện tích", "Sản lượng");
                        })

                        div.innerHTML =
                            "<div class='chart-content'>" +
                            "<div class='chart'>" +
                            /* DOM Chart */
                            /** lồng Svg vào thẻ div mới có thể style height width **/
                            ("<p class='title-legend-chart'>Giá trị sản xuất cây lương thực <br>" +
                                "trong tổng giá trị sản xuất ngành trồng trọt</p>") +
                            ("<p class='subtitle-chart'>(đơn vị: %)</p>") +
                            "<div style='width: 200px; height: 250px'>" +
                            "<svg id='col_chart_luongthuc' class='mybarstackedchart'></svg>" +
                            "</div>" +
                            ("<p class='title-legend-chart'>Diện tích và sản lượng<br>" +
                                "cả nước qua các năm</p>") +
                            "<div id='line_bar_dtsl_lua_chart' class='mylinebarchart'></div>" +
                            "</div>" +
                            "</div>";
                        var draggable = new L.Draggable(div);
                        draggable.enable();
                        return div;
                    };
                    lua_chart.addTo(map);

                    /*--- Control Chart & Legend ---*/
                    $('#switch_chart').change(function () {
                        if ($(this).prop('checked')) {
                            map.addControl(lua_chart);
                        } else {
                            map.removeControl(lua_chart);
                        }
                    });
                    $('#switch_legend').change(function () {
                        if ($(this).prop('checked')) {
                            map.addControl(lua_legend);
                        } else {
                            map.removeControl(lua_legend);
                        }
                    });

                    viet_bando.addTo(map);
                    //Hydda_base.addTo(map);
                    view_biengioi.addTo(map);
                    view_dtlua.addTo(map);
                    view_ranhgioi_tinh.addTo(map);
                    view_luachart.addTo(map);

                    /*--- Control Layer Data ---*/
                    $('#luachart_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(view_luachart);
                        } else {
                            map.removeLayer(view_luachart);
                        }
                    });
                    $('#dtlua_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(view_dtlua);
                        } else {
                            map.removeLayer(view_dtlua);
                        }
                    });
                })
            })
        })
    })
})
