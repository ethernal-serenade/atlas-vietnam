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
$.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/mo_khoangsan.geojson", function (mo_khoangsan) {
    $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/mo_daukhi.geojson", function (mo_daukhi) {
        $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/gian_khoan.geojson", function (giankhoan) {
            $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/phanlo_daukhi.geojson", function (phanlo_daukhi) {
                $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/vung_betramtich.geojson", function (betramtich) {
                    $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/dutgay_diachat.geojson", function (dutgay_diachat) {
                        $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/dutgay_vungbien.geojson", function (dutgay_vungbien) {
                            $.getJSON("../../../WebAtlas_VietNam_data/diachatkhoangsan/spatial_data/nen_diachat.geojson", function (nen_diachat) {
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

                                    /*** Nền địa chất ***/

                                    /*** Phân lô dầu khí ***/
                                    function style_phanlodaukhi(feat) {
                                        return {
                                            fillColor: "#7c79ef",
                                            weight: 0,
                                            dashArray: '3',
                                            color: "#ffffff",
                                            fillOpacity: 1
                                        }
                                    }

                                    var view_phanlodaukhi = L.geoJSON(phanlo_daukhi, {
                                        style: style_phanlodaukhi,
                                        onEachFeature: function (feat, layer) {
                                            if (feat.properties && feat.properties.ten_lo) {
                                                layer.bindPopup("<span style='color: #ff8dbc; " +
                                                    "font-weight: bolder; font-family: Arial'>Tên lô: " + feat.properties.ten_lo +
                                                    "<br>" + "<p style='color: #ffae8a; font-family: Arial'>Tên giếng: " +
                                                    feat.properties.ten_gieng_ + "</p>" +
                                                    "</span>");
                                            }
                                        }
                                    })

                                    /*** Vùng bể trầm tích ***/
                                    function style_betramtich(feat) {
                                        return {
                                            fillColor: "#daef4d",
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
                                                    "<br>" + "<p style='color: #a795ef; font-family: Arial'>Diện tích: " +
                                                    feat.properties.dien_tich + "</p>" +
                                                    "</span>");
                                            }
                                        }
                                    })

                                    /*** Legend ***/

                                    /*--- Control Legend ---*/

                                    Hydda_base.addTo(map);
                                    view_biengioi.addTo(map);
                                    view_betramtich.addTo(map);
                                    view_phanlodaukhi.addTo(map);

                                    /*--- Control Layer Data ---*/
                                });
                            })
                        })
                    })
                })
            })
        })
    })
})