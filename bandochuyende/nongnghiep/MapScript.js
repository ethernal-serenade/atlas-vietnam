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
$.getJSON("../../../WebAtlas_VietNam_data/nongnghiep/spatial_data/nongnghiep_line.geojson", function (line_nn) {
    $.getJSON("../../../WebAtlas_VietNam_data/nongnghiep/spatial_data/point_nongnghiep.geojson", function (point_nn) {
        $.getJSON("../../../WebAtlas_VietNam_data/nongnghiep/spatial_data/ht_sudungdat.geojson", function (ht_sudungdat) {
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

                /*** Ranh giới nông nghiệp Việt Nam ***/
                var view_line_nn = L.geoJSON(line_nn, {
                    style: function (feat) {
                        return {
                            stroke: true,
                            color: "#bf8575",
                            weight: 3
                        }
                    },
                });

                /*** Label vùng nông nghiệp Việt Nam ***/
                var view_label_nn = L.geoJSON(point_nn, {
                    pointToLayer: function (feat, latlng) {
                        var label_nn = '<p class="nn_label"><b>' + feat.properties.label_symb + '</b></p>';
                        return L.marker(latlng, {
                            icon: L.divIcon({
                                popupAnchor: [0, 0],
                                iconAnchor: [8, 8],
                                className: 'dummy'
                            })
                        }).bindTooltip(label_nn, {
                            permanent: true,
                            direction: "center",
                            opacity: 0
                        }).openTooltip();
                    }
                })

                /*** Hiện trạng sử dụng đất ***/
                /** Can not change var d **/
                function getColor_ht_sudungdat(d) {
                    return d == "Đất trồng cây lương thực, thực phẩm và cây hằng năm" ? "#fffa6a" :
                        d == "Đất trồng cây công nghiệp lâu năm và cây ăn quả" ? "#f3ab51" :
                            d == "Đất lâm nghiệp có rừng" ? "#73cb28" :
                                d == "Đất mặt nước nuôi trồng thủy sản" ? "#03dfff" :
                                    d == "Đất phi nông nghiệp" ? "#d8baff" :
                                        d == "Đất khác và núi đá" ? "#ad5a1b" :
                                            "#0000ff";
                }

                function style_ht_sudungdat(feat) {
                    return {
                        fillColor: getColor_ht_sudungdat(feat.properties.type_htrang),
                        weight: 0,
                        color: "transparent",
                        fillOpacity: 1
                    }
                }

                var view_ht_sudungdat = L.geoJSON(ht_sudungdat, {
                    style: style_ht_sudungdat,
                    onEachFeature: function (feat, layer) {
                        if (feat.properties && feat.properties.type_htrang) {
                            layer.bindPopup("<span style='color: #000000; " +
                                "font-weight: bolder;'>Loại đất: " + feat.properties.type_htrang + "</span>");
                        }
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

                view_label_nn.eachLayer(function (label) {
                    label.added = true;
                    addLabel(label, i);
                    i++;
                });
                view_label_nn.addTo(map);
                map.on("zoomend", function () {
                    resetLabels(view_label_nn);
                });
                resetLabels(view_label_nn);

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
                var nongnghiep_legend = L.control({position: "topleft"});
                nongnghiep_legend.onAdd = map => {
                    var div = L.DomUtil.create('div', 'info legend');

                    div.innerHTML =
                        "<div class='legend-content' style='margin-top: 35%'>" +
                        "<div class='legend'>" +
                        ("<p class='title-legend-chart'>Hiện trạng sử dụng đất</p>") +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #fffa6a'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất trồng cây lương thực, thực phẩm " +
                            "<br> và cây hằng năm" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #f3ab51'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất trồng cây công nghiệp lâu năm " +
                            "<br> và cây ăn quả" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #73cb28'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất lâm nghiệp có rừng" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #03dfff'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất mặt nước nuôi trồng thủy sản" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #d8baff'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất phi nông nghiệp" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #ad5a1b'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đất khác và núi đá" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<div class='rec' style='background-color: #0000ff'></div>" +
                            "<span class='label_legend_rec' style='margin-left: 60px'>" + "Sông, hồ" + "</span>" +
                            "</div>") +
                        ("<p class='title-legend-chart'>Các vùng nông nghiệp</p>") +
                        ("<div class='container_rec'>" +
                            "<span style='color: #bf6737; font-weight: bolder; margin-left: 20px'>I</span>" +
                            "<span class='label_legend_rec' style='margin-left: 10px'>" + "Trung du và miền núi Bắc Bộ" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<span style='color: #bf6737; font-weight: bolder; margin-left: 15px'>II</span>" +
                            "<span class='label_legend_rec' style='margin-left: 10px'>" + "Đồng bằng sông Hồng" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<span style='color: #bf6737; font-weight: bolder; margin-left: 10px'>III</span>" +
                            "<span class='label_legend_rec' style='margin-left: 10px'>" + "Bắc Trung Bộ" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<span style='color: #bf6737; font-weight: bolder; margin-left: 10px'>IV</span>" +
                            "<span class='label_legend_rec' style='margin-left: 10px'>" + "Duyên Hải Nam Trung Bộ" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<span style='color: #bf6737; font-weight: bolder; margin-left: 13px'>V</span>" +
                            "<span class='label_legend_rec' style='margin-left: 10px'>" + "Tây Nguyên" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<span style='color: #bf6737; font-weight: bolder; margin-left: 11px'>VI</span>" +
                            "<span class='label_legend_rec' style='margin-left: 10px'>" + "Đông Nam Bộ" + "</span>" +
                            "</div>") + '<br>' +
                        ("<div class='container_rec'>" +
                            "<span style='color: #bf6737; font-weight: bolder; margin-left: 6px'>VII</span>" +
                            "<span class='label_legend_rec' style='margin-left: 10px'>" + "Đồng bằng sông Cửu Long" + "</span>" +
                            "</div>") +
                        "</div>" +
                        "</div>";
                    var draggable = new L.Draggable(div);
                    draggable.enable();
                    return div;
                };
                nongnghiep_legend.addTo(map);

                /*** Chart ***/
                var nongnghiep_chart = L.control({position: "topright"});
                nongnghiep_chart.onAdd = map => {
                    var div = L.DomUtil.create('div', 'info legend');

                    /*-- Pie Chart have Series --*/
                    $.getJSON("../../../WebAtlas_VietNam_data/nongnghiep/chart_data/nongnghiep_Pie_timeline.json", function (nongnghiep_Pie) {
                        //console.log(nongnghiep_Pie);
                        render_pie_TimeLine_nongnghiep("pie_chart_nongnghiep", nongnghiep_Pie);
                    })

                    div.innerHTML =
                        "<div class='chart-content'>" +
                        "<div class='chart'>" +
                        ("<p class='title-legend-chart'>" +
                            "Cơ cấu giá trị sản xuất nông lâm thủy sản <br> phân theo ngành" +
                            "</p>") +
                        ("<p class='subtitle-chart'>(phân giá thực tế, đơn vị: %)</p>") +
                        "<div id='pie_chart_nongnghiep' class='mypiechart'></div>" +
                        "</div>" +
                        "</div>";
                    var draggable = new L.Draggable(div);
                    draggable.enable();
                    return div;
                };
                nongnghiep_chart.addTo(map);

                /*--- Control Chart & Legend ---*/
                $('#switch_legend').change(function () {
                    if ($(this).prop('checked')) {
                        map.addControl(nongnghiep_legend);
                    } else {
                        map.removeControl(nongnghiep_legend);
                    }
                });
                $('#switch_chart').change(function () {
                    if ($(this).prop('checked')) {
                        map.addControl(nongnghiep_chart);
                    } else {
                        map.removeControl(nongnghiep_chart);
                    }
                });

                Hydda_base.addTo(map);
                view_biengioi.addTo(map);
                view_ht_sudungdat.addTo(map);
                view_line_nn.addTo(map);

                /*--- Control Layer Data ---*/
                $('#ht_sudungdat_data').change(function () {
                    if ($(this).prop('checked')) {
                        map.addLayer(view_ht_sudungdat);
                    } else {
                        map.removeLayer(view_ht_sudungdat);
                    }
                });

                var miniMap = new L.Control.MiniMap(esri, {
                    toggleDisplay: true,
                }).addTo(map);
            })
        })
    })
})