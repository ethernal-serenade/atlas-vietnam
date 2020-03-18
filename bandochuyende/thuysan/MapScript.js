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

var fish = L.icon({
    iconUrl: 'symbols/fish_symbol.png',
    iconSize: [25, 25],
    iconAnchor: [0, 0]
});

var shrimp = L.icon({
    iconUrl: 'symbols/shrimp_symbol.png',
    iconSize: [15, 15],
    iconAnchor: [0, 0]
});

/*---- Dữ liệu Geojson ----*/
$.getJSON("../../../WebAtlas_VietNam_data/thuysan/spatial_data/bai_ca.geojson", function (baica) {
    $.getJSON("../../../WebAtlas_VietNam_data/thuysan/spatial_data/bai_tom.geojson", function (baitom) {
        $.getJSON("../../../WebAtlas_VietNam_data/thuysan/spatial_data/vien_baica.geojson", function (vien_baica) {
            $.getJSON("../../../WebAtlas_VietNam_data/thuysan/spatial_data/vien_baitom.geojson", function (vien_baitom) {
                $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/vietnam_centroids.geojson", function (vn_point) {
                    $.getJSON("../../../WebAtlas_VietNam_data/thuysan/spatial_data/thuysan_0516_point.geojson", function (thuysan_0516_point) {
                        $.getJSON("../../../WebAtlas_VietNam_data/thuysan/spatial_data/thuysan_0516.geojson", function (thuysan_0516) {
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

                                    /*** Sản lượng thủy sản năm 2016 ***/
                                    function getColor_slthuysan(d) {
                                        return d > 600000 ? "#D9ADE9" :
                                            d > 300000 ? "#F9D4E1" :
                                                d > 100000 ? "#f1d9ed" :
                                                    d > 60000 ? "#FEC465" :
                                                        d > 30000 ? "#FFDF85" :
                                                            "#FEFABD";
                                    }

                                    function style_slthuysan(feat) {
                                        return {
                                            fillColor: getColor_slthuysan(feat.properties.nt_2016 + feat.properties.kt_2016),
                                            weight: 0,
                                            dashArray: '3',
                                            color: "#ffffff",
                                            fillOpacity: 1
                                        }
                                    }

                                    var view_slthuysan = L.geoJSON(thuysan_0516, {
                                        style: style_slthuysan,
                                        onEachFeature: function (feat, layer) {
                                            if (feat.properties && feat.properties.ten_vi_up) {
                                                var tongsl = feat.properties.nt_2016 + feat.properties.kt_2016;
                                                layer.bindPopup("<span style='color: #767676; " +
                                                    "font-weight: bolder; font-family: Arial'>Tỉnh/thành phố: " + feat.properties.ten_vi_up +
                                                    "<br>" + "<span style='color: red; font-family: Arial'>Sản lượng: " +
                                                    tongsl + " nghìn tấn" + "</span>" + "</span>");
                                            }
                                        }
                                    });

                                    /*** Bãi tôm & Bãi cá ***/
                                    var view_vien_baica = L.geoJSON(vien_baica, {
                                        style: function (feat) {
                                            return {
                                                stroke: true,
                                                color: "#0008ff",
                                                weight: 1,
                                                dashArray: '8, 3'
                                            }
                                        },
                                    });

                                    var view_vien_baitom = L.geoJSON(vien_baitom, {
                                        style: function (feat) {
                                            return {
                                                stroke: true,
                                                color: "#0008ff",
                                                weight: 1,
                                                dashArray: '8, 3'
                                            }
                                        },
                                    });

                                    var view_baica = L.geoJSON(baica, {
                                        pointToLayer: function(feat, latlng) {
                                            return L.marker(latlng, {icon: fish})
                                        }
                                    })

                                    var view_baitom = L.geoJSON(baitom, {
                                        pointToLayer: function(feat, latlng) {
                                            return L.marker(latlng, {icon: shrimp})
                                        }
                                    })

                                    /*** Sản lượng thủy sản khai thác và nuôi trồng của các tỉnh ***/
                                    var view_thuysanchart = L.layerGroup();
                                    var charts = {};
                                    for (var attr in thuysan_0516_point.features) {
                                        var props = thuysan_0516_point.features[attr].properties;
                                        var coord = thuysan_0516_point.features[attr].geometry;
                                        var data_feat = [
                                            props['nt_2016'],
                                            props['kt_2016']
                                        ];
                                        charts[props['ten_vi_up']] = L.minichart([coord.coordinates[1], coord.coordinates[0]], {
                                            type: 'bar',
                                            data: data_feat,
                                            maxValues: 'auto',
                                            width: 25,
                                            height: 40,
                                            colors: ["#7dfff8", "#ff79ad"]
                                        });
                                        charts[props['ten_vi_up']].bindPopup("<div id='popup_tb'>" + "<table class='chart_data'>" +
                                            "<tbody>" +
                                            "<tr>" +
                                            "<td class='key_tb'>Thủy sản khai thác: </td>" + "<td>" + props['kt_2016'] + " nghìn tấn</td>" +
                                            "</tr>" +
                                            "<tr>" +
                                            "<td class='key_tb'>Thủy sản nuôi trồng: </td>" + "<td>" + props['nt_2016'] + " nghìn tấn</td>" +
                                            "</tr>" +
                                            "</tbody>" +
                                            "</table>" + "</div>");
                                        view_thuysanchart.addLayer(charts[props['ten_vi_up']]);
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
                                    var thuysan_legend = L.control({position: "topleft"});
                                    thuysan_legend.onAdd = map => {
                                        var div = L.DomUtil.create('div', 'info legend');
                                        labels = ["symbols/fish_symbol.png", "symbols/shrimp_symbol.png"];

                                        div.innerHTML =
                                            "<div class='legend-content' style='margin-top: 40%'>" +
                                            "<div class='legend'>" +
                                            ("<p class='title-legend-chart'>Sản lượng thủy sản năm 2016</p>") +
                                            ("<p class='subtitle-chart'>(đơn vị: nghìn tấn)</p>") +
                                            "<div class='row_legend'>" +
                                            ("<div class='col_legend'>" +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #FEFABD'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Dưới 31" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #FFDF85'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 31 - 60" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #FEC465'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 61 - 100" + "</span>" +
                                                    "</div>") +
                                                "</div>") +
                                            ("<div class='col_legend'>" +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #f1d9ed'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 101 - 300" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #F9D4E1'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 301 - 600" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #D9ADE9'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Trên 600" + "</span>" +
                                                    "</div>") +
                                                "</div>") +
                                            "</div>" +
                                            ("<p class='title-legend-chart' style='padding: 0'>Sản lượng thủy sản nuôi trồng và khai thác " +
                                                "<br> của các tỉnh năm 2015</p>") +
                                            "<div class='row_legend'>" +
                                            ("<div class='col_legend'>" +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #ff79ad'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px; font-size: 10px'>" +
                                                    "Thủy sản khai thác" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #7dfff8'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px; font-size: 10px'>" +
                                                    "Thủy sản nuôi trồng" + "</span>" +
                                                    "</div>") +
                                                "</div>") +
                                            ("<div class='col_legend'>" +
                                                ("<div class='container_rec'>" +
                                                    "<img src=" + labels[0] + " width='35' height='35' style='margin:-10px 0px 0px 8px'>" +
                                                    "<span class='label_legend_rec' style='margin-left: 10px'>" + "Bãi cá" + "</span>" +
                                                    "</div>") +
                                                ("<div class='container_rec'>" +
                                                    "<img src=" + labels[1] + " width='25' height='25' style='margin:5px 0px 0px 12.5px'>" +
                                                    "<span class='label_legend_rec' style='margin-left: 15px'>" + "Bãi tôm" + "</span>" +
                                                    "</div>") +
                                                "</div>") +
                                            "</div>" +
                                            "</div>" +
                                            "</div>" +
                                            "</div>";
                                        var draggable = new L.Draggable(div);
                                        draggable.enable();
                                        return div;
                                    };
                                    thuysan_legend.addTo(map);

                                    /*** Chart ***/
                                    var thuysan_chart = L.control({position: "topright"});
                                    thuysan_chart.onAdd = map => {
                                        var div = L.DomUtil.create('div', 'info legend');

                                        /* Make Chart */
                                        /*-- Group/Stacked Chart --*/
                                        d3.json("../../../WebAtlas_VietNam_data/thuysan/chart_data/thuysan_year.json", function (thuysan_year) {
                                            nv.addGraph(function () {
                                                var chart = nv.models.multiBarChart()
                                                    .margin({left: 60})
                                                    .useInteractiveGuideline(true)
                                                    .reduceXTicks(true)
                                                    .rotateLabels(0)
                                                    .showControls(true)
                                                    .groupSpacing(0.5)
                                                    .stacked(true)
                                                    .color(['#7dfff8', '#ff79ad'])

                                                chart.xAxis
                                                    .axisLabel('Năm')
                                                    .showMaxMin(false)
                                                    .tickFormat(d3.format(',f'));

                                                chart.yAxis
                                                    .axisLabel('Sản lượng (nghìn tấn)')
                                                    .tickFormat(d3.format(',.1f'));

                                                d3.select('#col_chart-thuysan')
                                                    .datum(thuysan_year)
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
                                            ("<p class='title-legend-chart'>Sản lượng thủy sản của cả nước qua các năm</p>") +
                                            ("<p class='subtitle-chart'>(đơn vị: nghìn tấn)</p>") +
                                            /* DOM Chart */
                                            /** lồng Svg vào thẻ div mới có thể style height width **/
                                            "<div style='width: 400px; height: 400px'>" +
                                            "<svg id='col_chart-thuysan' class='mybarstackedchart'></svg>" +
                                            "</div>" +
                                            "</div>" +
                                            "</div>";
                                        var draggable = new L.Draggable(div);
                                        draggable.enable();
                                        return div;
                                    };
                                    thuysan_chart.addTo(map);

                                    /*--- Control Chart & Legend ---*/
                                    $('#switch_chart').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addControl(thuysan_chart);
                                        } else {
                                            map.removeControl(thuysan_chart);
                                        }
                                    });
                                    $('#switch_legend').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addControl(thuysan_legend);
                                        } else {
                                            map.removeControl(thuysan_legend);
                                        }
                                    });

                                    viet_bando.addTo(map);
                                    //Hydda_base.addTo(map);
                                    view_biengioi.addTo(map);

                                    view_slthuysan.addTo(map);
                                    view_ranhgioi_tinh.addTo(map);
                                    view_thuysanchart.addTo(map);

                                    view_vien_baica.addTo(map);
                                    view_baica.addTo(map);
                                    view_vien_baitom.addTo(map);
                                    view_baitom.addTo(map);

                                    /*--- Control Layer Data ---*/
                                    $('#thuysan_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_slthuysan);
                                        } else {
                                            map.removeLayer(view_slthuysan);
                                        }
                                    });
                                    $('#thuysanchart_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_thuysanchart);
                                        } else {
                                            map.removeLayer(view_thuysanchart);
                                        }
                                    });
                                    $('#baica_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_vien_baica);
                                            map.addLayer(view_baica);
                                        } else {
                                            map.removeLayer(view_vien_baica);
                                            map.removeLayer(view_baica);
                                        }
                                    });
                                    $('#baitom_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_vien_baitom);
                                            map.addLayer(view_baitom);
                                        } else {
                                            map.removeLayer(view_vien_baitom);
                                            map.removeLayer(view_baitom);
                                        }
                                    });
                                });
                            });
                        });
                    })
                })
            })
        })
    })
})