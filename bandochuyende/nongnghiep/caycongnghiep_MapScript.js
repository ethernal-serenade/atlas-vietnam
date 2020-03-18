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

                    /*** Diện tích cây công nghiệp lâu năm và hằng nằm ***/

                    /*** Diện tích gieo trồng cây công nghiệp của các tỉnh ***/

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
                    var caycongnghiep_legend = L.control({position: "topleft"});
                    caycongnghiep_legend.onAdd = map => {
                        var div = L.DomUtil.create('div', 'info legend');

                        div.innerHTML =
                            "<div class='legend-content' style='margin-top: 40%'>" +
                            "<div class='legend'>" +
                            ("<p class='title-legend-chart'>Diện tích gieo trồng cây công nghiệp so với <br> " +
                                "tổng diện tích gieo trồng</p>") +
                            ("<p class='subtitle-chart'>(đơn vị: %)</p>") +
                            "<div class='row_legend'>" +
                            ("<div class='col_legend'>" +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #F5F4C2'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Dưới 10" + "</span>" +
                                    "</div>") + '<br>' +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #DCDF73'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 11 đến 20" + "</span>" +
                                    "</div>") + '<br>' +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #EFF04C'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 21 đến 30" + "</span>" +
                                    "</div>") +
                                "</div>") +
                            ("<div class='col_legend'>" +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #AFCE55'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Từ 31 đến 50" + "</span>" +
                                    "</div>") + '<br>' +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #7EB783'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Trên 50" + "</span>" +
                                    "</div>") +
                                "</div>") +
                            "</div>" +
                            ("<p class='title-legend-chart' style='padding: 0'>Diện tích trồng cây công nghiệp của các tỉnh</p>") +
                            ("<p class='subtitle-chart'>(số liệu sơ bộ năm 2018)</p>") +
                            "<div class='row_legend'>" +
                            ("<div class='col_legend'>" +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #FFCD5F'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Cây công nghiệp hằng năm" + "</span>" +
                                    "</div>") +
                                "</div>") +
                            ("<div class='col_legend'>" +
                                ("<div class='container_rec'>" +
                                    "<div class='rec' style='background-color: #ffa864'></div>" +
                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Cây công nghiệp lâu năm" + "</span>" +
                                    "</div>") +
                                "</div>") +
                            "</div>" +
                            "</div>" +
                            "</div>";
                        var draggable = new L.Draggable(div);
                        draggable.enable();
                        return div;
                    };
                    caycongnghiep_legend.addTo(map);

                    /*** Chart ***/
                    var caycongnghiep_chart = L.control({position: "topright"});
                    caycongnghiep_chart.onAdd = map => {
                        var div = L.DomUtil.create('div', 'info legend');

                        /* Make Chart */
                        /*-- Group/Stacked Chart 1 --*/
                        d3.json("../../../WebAtlas_VietNam_data/nongnghiep/chart_data/caycongnghiep_year.json", function (caycongnghiep_year) {
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

                                d3.select('#col_chart_caycongnghiep')
                                    .datum(caycongnghiep_year)
                                    .call(chart);

                                nv.utils.windowResize(function () {
                                    chart.update()
                                });
                                return chart;
                            });
                        });

                        /*-- Group/Stacked Chart 2 --*/
                        d3.json("../../../WebAtlas_VietNam_data/nongnghiep/chart_data/dt_caycongnghiep_year.json", function (dt_caycongnghiep_year) {
                            nv.addGraph(function () {
                                var chart = nv.models.multiBarChart()
                                    .margin({left: 60})
                                    .useInteractiveGuideline(true)
                                    .reduceXTicks(true)
                                    .rotateLabels(0)
                                    .showControls(true)
                                    .groupSpacing(0.5)
                                    .color(['#ffba72', '#ff806e'])

                                chart.xAxis
                                    .axisLabel('Năm')
                                    .showMaxMin(false)
                                    .tickFormat(d3.format(',f'));

                                chart.yAxis
                                    .axisLabel('Diện tích (nghìn ha)')
                                    .tickFormat(d3.format(',f'));

                                d3.select('#col_chart_dt_caycongnghiep')
                                    .datum(dt_caycongnghiep_year)
                                    .call(chart);

                                nv.utils.windowResize(function () {
                                    chart.update()
                                });
                                return chart;
                            });
                        });

                        /*-- Line plus Bar Chart --*/
                        $.getJSON("../../../WebAtlas_VietNam_data/nongnghiep/chart_data/dt_sl_caycongnghiep.json", function (dt_sl_caycongnghiep) {
                            render_linebar_dtsl_caycongnghiep("line_bar_dtsl_caycongnghiep_chart", dt_sl_caycongnghiep, "Cây công nghiệp",
                                "Diện tích", "Sản lượng");
                        })

                        div.innerHTML =
                            "<div class='chart-content'>" +
                            "<div class='chart'>" +
                            "<div class='chart_front'>" +
                            /* DOM Chart */
                            /** lồng Svg vào thẻ div mới có thể style height width **/
                            ("<p class='title-legend-chart'>Giá trị sản xuất cây công nghiệp <br>" +
                                "trong tổng giá trị sản xuất ngành trồng trọt</p>") +
                            ("<p class='subtitle-chart'>(đơn vị: %)</p>") +
                            "<div style='width: 200px; height: 250px'>" +
                            "<svg id='col_chart_caycongnghiep' class='mybarstackedchart'></svg>" +
                            "</div>" +
                            ("<p class='title-legend-chart'>Diện tích thu hoạch và sản lượng<br>" +
                                "cà phê, cao su, điều năm 2007</p>") +
                            "<div id='line_bar_dtsl_caycongnghiep_chart' class='mylinebarchart'></div>" +
                            "</div>" +
                            "<div class='chart_back' style='margin-top: -124%; height: 99%'>" +
                            ("<p class='title-legend-chart' style='margin-top: 50px'>Diện tích trồng cây " +
                                "công nghiệp qua các năm</p>") +
                            "<div style='width: 200px; height: 250px'>" +
                            "<svg id='col_chart_dt_caycongnghiep' class='mybarstackedchart'></svg>" +
                            "</div>" +
                            "</div>" +
                            "</div>" +
                            "</div>";
                        var draggable = new L.Draggable(div);
                        draggable.enable();
                        return div;
                    };
                    caycongnghiep_chart.addTo(map);

                    /*--- Control Chart & Legend ---*/
                    $('#switch_chart').change(function () {
                        if ($(this).prop('checked')) {
                            map.addControl(caycongnghiep_chart);
                        } else {
                            map.removeControl(caycongnghiep_chart);
                        }
                    });
                    $('#switch_legend').change(function () {
                        if ($(this).prop('checked')) {
                            map.addControl(caycongnghiep_legend);
                        } else {
                            map.removeControl(caycongnghiep_legend);
                        }
                    });

                    viet_bando.addTo(map);
                    //Hydda_base.addTo(map);
                    view_biengioi.addTo(map);
                    view_ranhgioi_tinh.addTo(map);

                    /*--- Control Layer Data ---*/
                })
            })
        })
    })
})