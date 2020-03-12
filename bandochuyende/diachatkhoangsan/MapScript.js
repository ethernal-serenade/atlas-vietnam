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

/*** Symbol mỏ Dầu khí ***/
var oil = L.icon({
    iconUrl: 'symbols/oil_symbol.png',
    iconSize: [30, 30],
    iconAnchor: [0, 0]
});

var gas = L.icon({
    iconUrl: 'symbols/gas_symbol.png',
    iconSize: [30, 30],
    iconAnchor: [0, 0],
});

var oil_shore = L.icon({
    iconUrl: 'symbols/oilshore_symbol.png',
    iconSize: [27, 27],
    iconAnchor: [19, 18],
    shadowUrl: 'symbols/circle_bg.png',
    shadowSize: [40, 40],
    shadowAnchor: [25, 25]
});

/*** Symbol mỏ Khoáng sản (Các mỏ khoáng sản hóa chất
 ký hiệu bằng chữ dạng Bold, Arial và theo màu hóa chất) ***/
var cement = L.icon({
    iconUrl: 'symbols/cement_symbol.png',
    iconSize: [30, 30],
    iconAnchor: [0, 0]
});

var salt = L.icon({
    iconUrl: 'symbols/salt_symbol.png',
    iconSize: [30, 30],
    iconAnchor: [0, 0],
});

var fer = L.icon({
    iconUrl: 'symbols/fer_symbol.png',
    iconSize: [30, 30],
    iconAnchor: [0, 0],
});

var coal = L.icon({
    iconUrl: 'symbols/coal_symbol.png',
    iconSize: [26, 26],
    iconAnchor: [18, 18],
    shadowUrl: 'symbols/circle_bg.png',
    shadowSize: [40, 40],
    shadowAnchor: [25, 25]
});

/*---- Dữ liệu Geojson ----*/
$.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/mo_khoangsan_2.geojson", function (mo_khoangsan) {
    $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/mo_daukhi.geojson", function (mo_daukhi) {
        $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/gian_khoan.geojson", function (giankhoan) {
            $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/dutgay_diachat.geojson", function (dutgay_diachat) {
                $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/dutgay_vungbien.geojson", function (dutgay_vungbien) {
                    $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/nen_diachat.geojson", function (nen_diachat) {
                        $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/phanlo_daukhi.geojson", function (phanlo_daukhi) {
                            $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/vung_betramtich.geojson", function (betramtich) {
                                $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/vn_biengioi.geojson", function (biengioi) {

                                    /*** Main Map ***/
                                    var map = L.map('mymap', {
                                            center: [16.10, 105.20],
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

                                    /*** Nền địa chất ***/
                                    function style_nendiachat(feat) {
                                        //console.log(feat.properties["COLOR"]);
                                        return {
                                            weight: 0,
                                            dashArray: '3',
                                            color: feat.properties["COLOR"],
                                            fillOpacity: 0.5
                                        }
                                    }

                                    var view_nendiachat = L.geoJSON(nen_diachat, {
                                        style: style_nendiachat,
                                        onEachFeature: function (feat, layer) {
                                            if (feat.properties && feat.properties.GEN_GLG) {
                                                layer.bindPopup("<span style='color: #ff1a4a; " +
                                                    "font-weight: bolder; font-family: Arial'>Tên lớp nền địa chất: " +
                                                    feat.properties.GEN_GLG + "</span>");
                                            }
                                        }
                                    })

                                    /*** Phân lô dầu khí ***/
                                    function style_phanlodaukhi(feat) {
                                        return {
                                            fillColor: "#fff48c",
                                            weight: 0.5,
                                            dashArray: '3',
                                            color: "#000000",
                                            fillOpacity: 1
                                        }
                                    }

                                    var view_phanlodaukhi = L.geoJSON(phanlo_daukhi, {
                                        style: style_phanlodaukhi,
                                        onEachFeature: function (feat, layer) {
                                            if (feat.properties && feat.properties.ten_lo) {
                                                layer.bindPopup("<span style='color: #ff8dbc; " +
                                                    "font-weight: bolder; font-family: Arial'>Tên lô: " + feat.properties.ten_lo +
                                                    "<br>" + "<span style='color: #ffae8a; font-family: Arial'>Tên giếng: " +
                                                    feat.properties.ten_gieng_ + "</span>" +
                                                    "</span>");
                                            }
                                        }
                                    })

                                    /*** Vùng bể trầm tích ***/
                                    function style_betramtich(feat) {
                                        return {
                                            fillColor: "#ffba72",
                                            weight: 0,
                                            dashArray: '3',
                                            color: "#ffffff",
                                            fillOpacity: 1
                                        }
                                    }

                                    var view_betramtich = L.geoJSON(betramtich, {
                                        style: style_betramtich,
                                        onEachFeature: function (feat, layer) {
                                            if (feat.properties && feat.properties.dien_tich) {
                                                layer.bindPopup("<span style='color: #ff8dbc; " +
                                                    "font-weight: bolder; font-family: Arial'>Tên bể: " + feat.properties.ten_be +
                                                    "<br>" + "<span style='color: #a795ef; font-family: Arial'>Diện tích: " +
                                                    feat.properties.dien_tich + "</span>" +
                                                    "</span>");
                                            }
                                        }
                                    })

                                    /*** Đứt gãy địa chất ***/
                                    var view_dutgaydiachat = L.geoJSON(dutgay_diachat, {
                                        style: function (feat) {
                                            return {
                                                stroke: true,
                                                color: "#ff1a4a",
                                                weight: 0.25
                                            }
                                        }
                                    });

                                    /*** Đứt gãy vùng biển ***/
                                    var view_dutgayvungbien = L.geoJSON(dutgay_vungbien, {
                                        style: function (feat) {
                                            return {
                                                stroke: true,
                                                color: "#0000ff",
                                                weight: 0.5
                                            }
                                        }
                                    });

                                    /*** Mỏ khoáng sản ***/
                                    var view_mokhoangsan = L.geoJSON(mo_khoangsan, {
                                        onEachFeature: function (feat, layer) {
                                            layer.bindPopup("<span style='font-weight: bold; font-family: Arial'>Tên mỏ khoáng sản: " +
                                                feat.properties.LOCATION + "</span> <br>" +
                                                "<span style='font-weight: bold; font-family: Arial; color: #f30024'>Loại: " +
                                                feat.properties.COMMODITY + "</span>");
                                        },
                                        pointToLayer: function (feat, latlng) {
                                            if (feat.properties.COMMODITY == "Xi măng") {
                                                return L.marker(latlng, {icon: cement});
                                            } else if (feat.properties.COMMODITY == "Phân bón") {
                                                return L.marker(latlng, {icon: fer});
                                            } else if (feat.properties.COMMODITY == "Muối") {
                                                return L.marker(latlng, {icon: salt});
                                            } else if (feat.properties.COMMODITY == "Đồng") {
                                                return L.marker(latlng, {
                                                    icon: L.divIcon({
                                                        html: "<i class='copper_symbol'>Cu</i>",
                                                        popupAnchor: [0, 0],
                                                        iconAnchor: [8, 8],
                                                        className: 'mokhoangsan_DivIcon'
                                                    })
                                                })
                                            } else if (feat.properties.COMMODITY == "Crôm") {
                                                return L.marker(latlng, {
                                                    icon: L.divIcon({
                                                        html: "<i class='chromite_symbol'>Cr</i>",
                                                        popupAnchor: [0, 0],
                                                        iconAnchor: [8, 8],
                                                        className: 'mokhoangsan_DivIcon'
                                                    })
                                                })
                                            } else if (feat.properties.COMMODITY == "Kẽm") {
                                                return L.marker(latlng, {
                                                    icon: L.divIcon({
                                                        html: "<i class='zinc_symbol'>Zn</i>",
                                                        popupAnchor: [0, 0],
                                                        iconAnchor: [8, 8],
                                                        className: 'mokhoangsan_DivIcon'
                                                    })
                                                })
                                            } else if (feat.properties.COMMODITY == "Sắt") {
                                                return L.marker(latlng, {
                                                    icon: L.divIcon({
                                                        html: "<i class='iron_symbol'>Fe</i>",
                                                        popupAnchor: [0, 0],
                                                        iconAnchor: [8, 8],
                                                        className: 'mokhoangsan_DivIcon'
                                                    })
                                                })
                                            } else if (feat.properties.COMMODITY == "Than") {
                                                return L.marker(latlng, {icon: coal});
                                            } else if (feat.properties.COMMODITY == "Thiếc") {
                                                return L.marker(latlng, {
                                                    icon: L.divIcon({
                                                        html: "<i class='tin_symbol'>Sn</i>",
                                                        popupAnchor: [0, 0],
                                                        iconAnchor: [8, 8],
                                                        className: 'mokhoangsan_DivIcon'
                                                    })
                                                })
                                            } else {
                                                return L.marker(latlng, {
                                                    icon: L.divIcon({
                                                        html: "<i class='titanium_symbol'>Ti</i>",
                                                        popupAnchor: [0, 0],
                                                        iconAnchor: [8, 8],
                                                        className: 'mokhoangsan_DivIcon'
                                                    })
                                                })
                                            }
                                        }
                                    })

                                    /*** Mỏ dầu khí ***/
                                    var view_modaukhi = L.geoJSON(mo_daukhi, {
                                        onEachFeature: function (feat, layer) {
                                            layer.bindPopup("<span style='font-weight: bold; font-family: Arial'>Tên mỏ: " +
                                                feat.properties.mo_ten_mo + "</span> <br>" +
                                                "<span style='font-weight: bold; font-family: Arial; color: #f30024'>Loại: " +
                                                feat.properties.mo_sp + "</span>");
                                        },
                                        pointToLayer: function (feat, latlng) {
                                            if (feat.properties.mo_sp == "Dầu") {
                                                return L.marker(latlng, {icon: oil});
                                            } else if (feat.properties.mo_sp == "Khí") {
                                                return L.marker(latlng, {icon: gas});
                                            }
                                        }
                                    })

                                    /*** Giàn khoan ***/
                                    var view_giankhoan = L.geoJSON(giankhoan, {
                                        onEachFeature: function (feat, layer) {
                                            layer.bindPopup("<span style='font-weight: bold; font-family: Arial'>Tên giàn khoan: " +
                                                feat.properties.g_khoan_ca + "</span> <br>" +
                                                "<span style='font-weight: bold; font-family: Arial; color: #4095f3'>Loại: " +
                                                feat.properties.g_khoan_ke + "</span>");
                                        },
                                        pointToLayer: function (feat, latlng) {
                                            if (feat.properties.g_khoan_ke != null &&
                                                (feat.properties.g_khoan_ke == "Phát hiện dầu và khí" ||
                                                    feat.properties.g_khoan_ke == "Phát hiện dầu" ||
                                                    feat.properties.g_khoan_ke == "Phát hiện khí")) {
                                                return L.marker(latlng, {icon: oil_shore});
                                            }
                                        }
                                    })

                                    /*** Legend ***/
                                    var dcks_legend_1 = L.control({position: "topleft"});
                                    dcks_legend_1.onAdd = map => {
                                        var div = L.DomUtil.create('div', 'info legend');

                                        div.innerHTML =
                                            "<div class='legend-content' style='margin-top: 5%'>" +
                                            "<div class='legend'>" +
                                            ("<p class='title-legend-chart'>Địa tầng</p>") +
                                            "<div class='row_legend'>" +
                                            ("<div class='col_legend'>" +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #4ce11d; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đại Thái cổ" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #bae286; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Than đá/Thạch thán" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #a16cdf; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Than đá và Devon" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #19d159; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Liên đại Cambri" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #c585ee; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Phấn trắng" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #edef6a; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Phấn trắng và Jura" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #f16dd2; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đại Trung sinh" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #ccb96b; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Tân cận" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #d55ae8; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Ordovic và Cambri" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #581be2; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đại Tân sinh" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #20c8e1; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Devon" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #85db83; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Devon và Silur" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #85db83; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Sông, hồ" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #df89ba; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Jura" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #5662d3; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Jura và Trias" + "</span>" +
                                                    "</div>") +
                                                "</div>") +
                                            ("<div class='col_legend'>" +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #cf8b5d; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Ordovic" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #bded1f; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Permi" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #cb0d55; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Permi và Than đá/Thạch thán" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #cb0d55; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Permi và Cambri" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #38446e; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Cổ cận" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #a6e279; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Liên đại Nguyên sinh" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #7ee8ea; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đại Cổ sinh" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #1add2d; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Hậu đại Cổ sinh" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #d97f90; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Đại Cổ sinh/Tiền Cambri" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #df706b; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Tiền đại Cổ sinh" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #d0b285; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Đệ tứ" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #ed7356; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Silur" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #d53bd5; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Silur và Ordovic" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #58bfea; opacity: 0.5'></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Trias" + "</span>" +
                                                    "</div>") + '<br>' +
                                                ("<div class='container_rec'>" +
                                                    "<div class='rec' style='background-color: #2ecd83'; opacity: 0.5></div>" +
                                                    "<span class='label_legend_rec' style='margin-left: 60px'>" + "Kỷ Trias và Permin" + "</span>" +
                                                    "</div>") + '<br>' +
                                                "</div>") +
                                            "</div>" +
                                            "</div>" +
                                            "</div>";
                                        var draggable = new L.Draggable(div);
                                        draggable.enable();
                                        return div;
                                    };
                                    dcks_legend_1.addTo(map);

                                    var dcks_legend_2 = L.control({position: "topright"});
                                    dcks_legend_2.onAdd = map => {
                                        var div = L.DomUtil.create('div', 'info legend');
                                        labels = ["symbols/cement_symbol.png", "symbols/coal_symbol.png",
                                            "symbols/fer_symbol.png", "symbols/salt_symbol.png",
                                            "symbols/oil_symbol.png", "symbols/gas_symbol.png",
                                            "symbols/oilshore_symbol.png"]

                                        div.innerHTML =
                                            "<div class='legend-content' style='width: 390px;'>" +
                                            "<div class='legend'>" +
                                            ("<p class='title-legend-chart'>Loại khoáng sản</p>") +
                                            "<div class='row_legend' style='margin-top: -20px'>" +
                                            ("<div class='col_legend'>" +
                                                ("<div class='container_poi'>" +
                                                    "<img src=" + labels[0] + " width='40' height='40' style='margin:15px 0px 0px 8px'>" +
                                                    "<span class='label_legend_symbol'>" + "Xi măng" + "</span>" +
                                                    "</div>") +
                                                ("<div class='container_poi'>" +
                                                    "<div class='overlay_poi'></div>" +
                                                    "<img src=" + labels[1] + " width='35' height='35' style='margin:15px 0px 0px 9px'>" +
                                                    "<span class='label_legend_symbol' style='margin-top: 25px; margin-left: 18px; font-size: 14.25px'>" +
                                                    "Than đá" + "</span>" +
                                                    "</div>") +
                                                ("<div class='container_poi'>" +
                                                    "<img src=" + labels[2] + " width='40' height='40' style='margin:15px 0px 0px 8px'>" +
                                                    "<span class='label_legend_symbol'>" + "Phân bón" + "</span>" +
                                                    "</div>") +
                                                ("<div class='container_poi'>" +
                                                    "<img src=" + labels[3] + " width='40' height='40' style='margin:15px 0px 0px 8px'>" +
                                                    "<span class='label_legend_symbol'>" + "Muối" + "</span>" +
                                                    "</div>") +
                                                ("<div class='container_poi'>" +
                                                    "<img src=" + labels[4] + " width='40' height='40' style='margin:15px 0px 0px 8px'>" +
                                                    "<span class='label_legend_symbol'>" + "Dầu" + "</span>" +
                                                    "</div>") +
                                                ("<div class='container_poi'>" +
                                                    "<img src=" + labels[5] + " width='55' height='50' style='margin:15px 0px 0px 0px'>" +
                                                    "<span class='label_legend_symbol' style='margin-left: 6px'>" + "Khí tự nhiên" + "</span>" +
                                                    "</div>") +
                                                ("<div class='container_poi'>" +
                                                    "<div class='overlay_poi'></div>" +
                                                    "<img src=" + labels[6] + " width='40' height='40' style='margin:14px 0px 0px 6px'>" +
                                                    "<span class='label_legend_symbol' style='margin-left: 15px'>" + "Giàn khoan" + "</span>" +
                                                    "</div>") +
                                                "</div>") +
                                            ("<div class='col_legend' style='margin-top: 10px;'>" +
                                                ("<div class='container_poi'>" +
                                                    "<span class='text_symbol copper_symbol'>Cu</span>" +
                                                    "<span class='label_legend_symbol' style='margin-top: 13px'>" + "Đồng" + "</span>" +
                                                    "</div>") + "<br>" +
                                                ("<div class='container_poi'>" +
                                                    "<span class='text_symbol iron_symbol' style='padding:0px 7.5px 0px'>Fe</span>" +
                                                    "<span class='label_legend_symbol' style='margin-top: 13px'>" + "Sắt" + "</span>" +
                                                    "</div>") + "<br>" +
                                                ("<div class='container_poi'>" +
                                                    "<span class='text_symbol tin_symbol' style='padding:0px 6px 0px'>Sn</span>" +
                                                    "<span class='label_legend_symbol' style='margin-top: 13px'>" + "Thiếc" + "</span>" +
                                                    "</div>") + "<br>" +
                                                ("<div class='container_poi'>" +
                                                    "<span class='text_symbol zinc_symbol' style='padding:0px 7px 0px'>Zn</span>" +
                                                    "<span class='label_legend_symbol' style='margin-top: 13px'>" + "Kẽm" + "</span>" +
                                                    "</div>") + "<br>" +
                                                ("<div class='container_poi'>" +
                                                    "<span class='text_symbol titanium_symbol' style='padding:0px 12.25px 0px'>Ti</span>" +
                                                    "<span class='label_legend_symbol' style='margin-top: 13px'>" + "Titanium" + "</span>" +
                                                    "</div>") + "<br>" +
                                                ("<div class='container_poi'>" +
                                                    "<span class='text_symbol chromite_symbol' style='padding:0px 9px 0px'>Cr</span>" +
                                                    "<span class='label_legend_symbol' style='margin-top: 13px'>" + "Crôm" + "</span>" +
                                                    "</div>") +
                                                "</div>") +
                                            "</div>" +
                                            "</div>";
                                        var draggable = new L.Draggable(div);
                                        draggable.enable();
                                        return div;
                                    };
                                    dcks_legend_2.addTo(map);

                                    /*--- Control Legend ---*/
                                    $('#switch_legend').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addControl(dcks_legend_1);
                                            map.addControl(dcks_legend_2);
                                        } else {
                                            map.removeControl(dcks_legend_1);
                                            map.removeControl(dcks_legend_2);
                                        }
                                    });

                                    CartoDB.addTo(map);
                                    view_biengioi.addTo(map);
                                    view_nendiachat.addTo(map);
                                    //view_betramtich.addTo(map);
                                    //view_phanlodaukhi.addTo(map);
                                    view_dutgaydiachat.addTo(map);
                                    //view_dutgayvungbien.addTo(map);
                                    view_mokhoangsan.addTo(map);
                                    //view_modaukhi.addTo(map);
                                    //view_giankhoan.addTo(map);

                                    /*--- Control Layer Data ---*/
                                    $('#mineral_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_mokhoangsan);
                                        } else {
                                            map.removeLayer(view_mokhoangsan);
                                        }
                                    });
                                    $('#betramtich_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_betramtich);
                                        } else {
                                            map.removeLayer(view_betramtich);
                                        }
                                    });
                                    $('#phanlodaukhi_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_phanlodaukhi);
                                        } else {
                                            map.removeLayer(view_phanlodaukhi);
                                        }
                                    });
                                    $('#dutgayvungbien_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_dutgayvungbien);
                                        } else {
                                            map.removeLayer(view_dutgayvungbien);
                                        }
                                    });
                                    $('#mineral_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_dutgaydiachat);
                                        } else {
                                            map.removeLayer(view_dutgaydiachat);
                                        }
                                    });
                                    $('#oilgas_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_modaukhi);
                                        } else {
                                            map.removeLayer(view_modaukhi);
                                        }
                                    });
                                    $('#oilgas_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_modaukhi);
                                        } else {
                                            map.removeLayer(view_modaukhi);
                                        }
                                    });
                                    $('#giankhoan_data').change(function () {
                                        if ($(this).prop('checked')) {
                                            map.addLayer(view_giankhoan);
                                        } else {
                                            map.removeLayer(view_giankhoan);
                                        }
                                    });
                                });
                            })
                        })
                    })
                })
            })
        })
    })
})