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
$.getJSON("../../../WebAtlas_VietNam_data/khihau/spatial_data/doam_vung.geojson", function (doam_vung) {
    $.getJSON("../../../WebAtlas_VietNam_data/khihau/spatial_data/nhietdo_vung.geojson", function (nhietdo_vung) {
        $.getJSON("../../../WebAtlas_VietNam_data/khihau/spatial_data/phanvung_khihau.geojson", function (phanvung_khihau) {
            $.getJSON("../../../WebAtlas_VietNam_data/khihau/spatial_data/tramdo.geojson", function (tramdo) {
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

                    /*** Phân vùng khí hậu ***/
                    function getColor_phanvungkhihau(d) {
                        return d == "Vùng khí hậu Tây Bắc Bộ" ? "#edf4be" :
                            d == "Vùng khí hậu Đông Bắc Bộ" ? "#77b896" :
                                d == "Vùng khí hậu Trung và Nam Bắc Bộ" ? "#cdebe9" :
                                    d == "Vùng khí hậu Bắc Trung Bộ" ? "#cec347" :
                                        d == "Vùng khí hậu Nam Trung Bộ" ? "#fbfd92" :
                                            d == "Vùng khí hậu Tây Nguyên" ? "#fac579" :
                                                "#e3846f";
                    }

                    function style_phanvungkhihau(feat) {
                        return {
                            fillColor: getColor_phanvungkhihau(feat.properties.name_vungkh),
                            weight: 1,
                            dashArray: '6, 3',
                            color: "#5656ff",
                            fillOpacity: 0.75
                        }
                    }

                    var view_phanvungkhihau = L.geoJSON(phanvung_khihau, {
                        style: style_phanvungkhihau,
                        onEachFeature: function (feat, layer) {
                            if (feat.properties && feat.properties.name_vungkh) {
                                layer.bindPopup("<span style='color: #000000; " +
                                    "font-weight: bolder;'>" + feat.properties.name_vungkh + "</span>");
                            }
                        }
                    })

                    /*** Độ ẩm ***/
                    function getColor_doam(d) {
                        return d > 86 ? "#3657a2" :
                            d > 84 ? "#2a7bd4" :
                                d > 82 ? "#3caef5" :
                                    d > 80 ? "#7cbff1" :
                                        "#aad2e5";
                    }

                    function style_doam(feat) {
                        return {
                            fillColor: getColor_doam(feat.properties.doam_tb),
                            weight: 0,
                            color: "transparent",
                            fillOpacity: 1
                        }
                    }

                    var view_doam = L.geoJSON(doam_vung, {
                        style: style_doam,
                        onEachFeature: function (feat, layer) {
                            if (feat.properties && feat.properties.doam_tb) {
                                layer.bindPopup("<span style='color: #4095f3; " +
                                    "font-weight: bolder; font-family: Arial'>Độ ẩm trung bình: " + feat.properties.doam_tb +
                                    " %</span>");
                            }
                        }
                    });

                    /*** Nhiệt độ ***/
                    function getColor_nhietdo(d) {
                        return d > 28 ? "#fa645f" :
                            d > 24 ? "#fc783f" :
                                d > 20 ? "#fcae5c" :
                                    d > 18 ? "#fccd73" :
                                        "#fdfcd3";
                    }

                    function style_nhietdo(feat) {
                        return {
                            fillColor: getColor_nhietdo(feat.properties.vung_tb),
                            weight: 0,
                            color: "transparent",
                            fillOpacity: 1
                        }
                    }

                    var view_nhietdo = L.geoJSON(nhietdo_vung, {
                        style: style_nhietdo,
                        onEachFeature: function (feat, layer) {
                            if (feat.properties && feat.properties.vung_tb) {
                                layer.bindPopup("<span style='color: #ff004b; " +
                                    "font-weight: bolder; font-family: Arial'>Nhiệt độ trung bình: " + feat.properties.vung_tb +
                                    "°C</span>");
                            }
                        }
                    });

                    /*** Trạm đo nhiệt độ ***/

                    /*** Legend ***/
                    var khihau_legend = L.control({position: "topleft"});
                    khihau_legend.onAdd = map => {
                        var div = L.DomUtil.create('div', 'info legend');

                        div.innerHTML = "";
                        var draggable = new L.Draggable(div);
                        draggable.enable();
                        return div;
                    };
                    khihau_legend.addTo(map);

                    /*--- Control Chart & Legend ---*/

                    Hydda_base.addTo(map);
                    view_biengioi.addTo(map);
                    //view_phanvungkhihau.addTo(map);
                    //view_nhietdo.addTo(map);
                    //view_doam.addTo(map);

                    /*--- Control Layer Data ---*/
                    $('#vungkhihau_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(view_phanvungkhihau);
                        } else {
                            map.removeLayer(view_phanvungkhihau);
                        }
                    });
                    $('#temp_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(view_nhietdo);
                        } else {
                            map.removeLayer(view_nhietdo);
                        }
                    });
                    $('#humidity_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(view_doam);
                        } else {
                            map.removeLayer(view_doam);
                        }
                    });
                });
            })
        })
    })
})