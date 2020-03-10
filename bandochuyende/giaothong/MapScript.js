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

$.getJSON("../../../WebAtlas_VietNam_data/giaothong/spatial_data/sanbay.geojson", function (sanbay) {
    $.getJSON("../../../WebAtlas_VietNam_data/giaothong/spatial_data/cangbien.geojson", function (cangbien) {
        $.getJSON("../../../WebAtlas_VietNam_data/giaothong/spatial_data/cuakhau.geojson", function (cuakhau) {
            $.getJSON("../../../WebAtlas_VietNam_data/giaothong/spatial_data/quoclo.geojson", function (quoclo) {
                $.getJSON("../../../WebAtlas_VietNam_data/giaothong/spatial_data/duongsat.geojson", function (duongsat) {
                    $.getJSON("../../../WebAtlas_VietNam_data/giaothong/spatial_data/duongbien.geojson", function (duongbien) {
                        $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/vietnam_base.geojson", function (vietnam_base) {
                            $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/tinh_ranhgioi.geojson", function (ranhgioi_tinh) {
                                $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/vn_biengioi.geojson", function (biengioi) {

                                    /*** Main Map ***/
                                    var map = L.map('mymap', {
                                            center: [16.10, 108.20],
                                            zoom: 6,
                                            zoomControl: true
                                        }
                                    );

                                    /*** Lớp nền Việt Nam ***/
                                    var view_vietnam_base = L.geoJSON(vietnam_base, {
                                        style: {
                                            fillColor: "#fffd8a",
                                            weight: 1,
                                            dashArray: '3',
                                            color: "white",
                                            fillOpacity: 0.75
                                        }
                                    })

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

                                    /*** Đường biển ***/
                                    var view_duongbien = L.geoJSON(duongbien, {
                                        style: function (feat) {
                                            return {
                                                stroke: true,
                                                color: "#009bff",
                                                weight: 1.5,
                                                dashArray: '6, 3'
                                            }
                                        },
                                        onEachFeature: function (feat, layer) {
                                            layer.setText(feat.properties.tuyen, {
                                                offset: -5,
                                                center: true,
                                                attributes: {
                                                    fill: "#0065ff",
                                                    'font-size': '9px',
                                                    'font-style': 'italic',
                                                    'font-weight': 'bold'
                                                }
                                            })
                                        }
                                    });

                                    /*** Sân bay ***/
                                    var view_san_bay = L.geoJSON(sanbay, {
                                        pointToLayer: function (feat, latlng) {
                                            if (feat.properties.loai == "Nội địa") {
                                                var label_sanbay_nd = '<p class="sanbaynd_label">' + feat.properties.ten + '</p>';
                                                return L.marker(latlng, {
                                                    icon: L.divIcon({
                                                        html: "<i class='fa fa-plane sanbaynd_symbol'></i>",
                                                        popupAnchor: [0, 0],
                                                        iconAnchor: [8, 8],
                                                        className: 'mouse_pointer sanbaynd_divIcon'
                                                    })
                                                }).bindTooltip(label_sanbay_nd, {
                                                    permanent: true,
                                                    direction: "center",
                                                    opacity: 0
                                                }).openTooltip();
                                            } else {
                                                var label_sanbay_qt = '<p class="sanbayqt_label">' + feat.properties.ten + '</p>';
                                                return L.marker(latlng, {
                                                    icon: L.divIcon({
                                                        html: "<i class='fa fa-plane sanbayqt_symbol'></i>",
                                                        popupAnchor: [0, 0],
                                                        iconAnchor: [8, 8],
                                                        className: 'mouse_pointer sanbayqt_divIcon'
                                                    })
                                                }).bindTooltip(label_sanbay_qt, {
                                                    permanent: true,
                                                    direction: "center",
                                                    opacity: 0
                                                }).openTooltip();
                                            }
                                        }
                                    })

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

                                    view_san_bay.eachLayer(function (label) {
                                        label.added = true;
                                        addLabel(label, i);
                                        i++;
                                    });

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

                                    view_san_bay.addTo(map);
                                    map.on("zoomend", function () {
                                        resetLabels(view_san_bay);
                                    });
                                    resetLabels(view_san_bay);

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
                                    var giaothong_legend = L.control({position: "topleft"});
                                    giaothong_legend.onAdd = map => {
                                        var div = L.DomUtil.create('div', 'info legend');

                                        div.innerHTML =
                                            "<div class='legend-content' style='margin-top: 50%'>" +
                                            "<div class='legend'>" +
                                            ("<p class='title-legend-chart' style='font-size: 12px'>Chú thích giao thông</p>") +
                                            ("<div class='container_poi'>" +
                                                "<div class='fa fa-plane fontaws_poi' style='padding-left: 2px; " +
                                                "margin-left: 15px'></div>" +
                                                "<span class='label_legend_poi_fa' style='margin-left: 20px; " +
                                                "font-size: 13px; " +
                                                "font-family: Arial !important'>" + "Sân bay nội địa" + "</span>" +
                                                "</div>") + '<br>' +
                                            ("<div class='container_poi'>" +
                                                "<div class='fa fa-plane fontaws_poi' style='padding-left: 2px; " +
                                                "color: red; " +
                                                "margin-left: 15px'></div>" +
                                                "<span class='label_legend_poi_fa' style='margin-left: 20px;" +
                                                "font-size: 13px; " +
                                                "font-family: Arial !important'>" + "Sân bay quốc tế" + "</span>" +
                                                "</div>") + '<br>' +
                                            ("<div class='container_poi'>" +
                                                "<div class='overlay_poi' style='width: 31px;" +
                                                "height: 31px;" +
                                                "margin-top: -3px;" +
                                                "margin-left: 11px;'></div>" +
                                                "<div class='fa fa-ship fontaws_poi' style='margin-left: 15px; " +
                                                "color: #5c88ff'></div>" +
                                                "<span class='label_legend_poi_fa' style='margin-left: 28.5px; " +
                                                "font-size: 13px; " +
                                                "font-family: Arial !important'>" + "Cảng biển" + "</span>" +
                                                "</div>") + '<br>' +
                                            ("<div class='container_poi'>" +
                                                "<div class='overlay_poi' style='width: 31px;" +
                                                "height: 23px;" +
                                                "margin-top: -3px;" +
                                                "margin-left: 11px;" +
                                                "border-color: #000000;" +
                                                "border-width: 1px;" +
                                                "border-style: solid;" +
                                                "border-radius: 0%'></div>" +
                                                "<div class='fa fa-arrow-up fontaws_poi' style='margin-top: 0px;" +
                                                "margin-left: 15px;" +
                                                "font-size: 16px;" +
                                                "color: #3078f2;" +
                                                "display: inline;'></div>" +
                                                "<div class='fa fa-arrow-down fontaws_poi' style='margin-top: 4px;" +
                                                "margin-left: -6px;" +
                                                "font-size: 16px;" +
                                                "color: #f2000c;" +
                                                "display: inline;'></div>" +
                                                "<span class='label_legend_poi_fa' style='margin-left: 20px; " +
                                                "font-size: 13px; " +
                                                "font-family: Arial !important'>" + "Cửa khẩu" + "</span>" +
                                                "</div>") + '<br>' +
                                            ("<div class='container_poi' style='margin-top: -15px'>" +
                                                "<svg height='40' width='50'>" +
                                                "<g fill='none'>" +
                                                "<path stroke='#ff0012' d='M5 20 l215 0' />" +
                                                "</g>" +
                                                "</svg>" +
                                                "<span class='label_legend_poi_fa' style='margin-left: 20px; " +
                                                "font-size: 13px; " +
                                                "font-family: Arial !important'>" + "Đường quốc lộ" + "</span>" +
                                                "</div>") + '<br>' +
                                            ("<div class='container_poi' style='margin-top: -30px'>" +
                                                "<svg height='40' width='50'>" +
                                                "<g fill='none'>" +
                                                "<path stroke='#000000' d='M5 20 l215 0' />" +
                                                "</g>" +
                                                "</svg>" +
                                                "<span class='label_legend_poi_fa' style='margin-left: 20px; " +
                                                "font-size: 13px; " +
                                                "font-family: Arial !important'>" + "Đường sắt" + "</span>" +
                                                "</div>") + '<br>' +
                                            ("<div class='container_poi' style='margin-top: -47px'>" +
                                                "<svg height='40' width='50' style='vertical-align: unset'>" +
                                                "<g fill='none' stroke='#0065ff' stroke-width='4'>" +
                                                "<path stroke-dasharray='10,10' d='M5 40 l215 0' />" +
                                                "</g>" +
                                                "</svg>" +
                                                "<span class='label_legend_poi_fa' style='margin-left: 20px; " +
                                                "font-size: 13px; " +
                                                "font-family: Arial !important'>" + "Đường biển" + "</span>" +
                                                "</div>") + '<br>' +
                                            "</div>" +
                                            "</div>";
                                        var draggable = new L.Draggable(div);
                                        draggable.enable();
                                        return div;
                                    };
                                    giaothong_legend.addTo(map);

                                    /*--- Control Legend ---*/
                                    $('#switch_legend').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addControl(giaothong_legend);
                                        } else {
                                            map.removeControl(giaothong_legend);
                                        }
                                    });

                                    CartoDB.addTo(map);
                                    view_vietnam_base.addTo(map);
                                    view_biengioi.addTo(map);
                                    view_ranhgioi_tinh.addTo(map);

                                    view_cang_bien.addTo(map);
                                    view_cua_khau.addTo(map);
                                    view_san_bay.addTo(map);
                                    view_duongbien.addTo(map);
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
                                    $('#duongbien_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_duongbien);
                                        } else {
                                            map.removeLayer(view_duongbien);
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
                                    $('#sanbay_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_san_bay);
                                        } else {
                                            map.removeLayer(view_san_bay);
                                        }
                                    });
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})