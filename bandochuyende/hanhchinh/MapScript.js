//console.log("hahaha");
var op_street = L.tileLayer.provider("OpenStreetMap"),
    esri = L.tileLayer.provider("Esri.WorldImagery"),
    CartoDB = L.tileLayer.provider("CartoDB.Voyager"),
    Hydda_base = L.tileLayer.provider("Hydda.Base");

/*---- Đọc WMS Geosever ----*/
var base_vn = L.tileLayer.wms('http://opengis.vn:8080/geoserver/atlas_vietnam/wms?service=WMS', {
    layers: 'atlas_vietnam:gadm36_vnm_1',
    tiled: true,
    format: 'image/png',
    opacity: 0.3,
    transparent: true
});

/*---- Base Việt Bản đồ ----*/
var viet_bando = L.tileLayer('http://images.vietbando.com/ImageLoader/GetImage.ashx?Ver=2016&LayerIds=VBD&X={x}&Y={y}&Level={z}', {
    attribution: 'Map tiles by Vietbando',
    minZoom: 0
});

//$.getJSON("../../../WebAtlas_VietNam_data/hanhchinh/spatial_data/quoclo.geojson", function (quoclo) {
    $.getJSON("../../../WebAtlas_VietNam_data/hanhchinh/spatial_data/duongsat.geojson", function (duongsat) {
        $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/tinh_ranhgioi.geojson", function (ranhgioi_tinh) {
            $.getJSON("../../../WebAtlas_VietNam_data/general_spatial_data/vietnam_centroids.geojson", function (vn_point) {
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

                    /*** Đường quốc lộ (Vector Tiles) ***/
                    var quoclo = service_tiles + "atlas_vietnam_tiles/t_quoclo/{z}/{x}/{y}.pbf";

                    var style_quoclo = {
                        quoclo: function (feat) {
                            return {
                                stroke: true,
                                color: "#ff0012",
                                weight: 0.5
                            }
                        }
                    }

                    var view_quoclo = L.vectorGrid.protobuf(quoclo, {
                        endererFactory: L.canvas.tile,
                        vectorTileLayerStyles: style_quoclo,
                        interactive: true,
                        maxZoom: 19,
                        maxNativeZoom: 14,
                        getFeatureId: function (feat) {
                            return feat.properties.ref;
                        }
                    })

                    view_quoclo.on('click', function (e) {
                        view_quoclo.bindPopup("<span style='font-weight: bold; font-family: Arial'>Tên tuyến " +
                            e.layer.properties["ref"] + "</span>")
                    })

                    /* View dạng GeoJSON
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
                    }); */

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

                    /*** Tên tỉnh ***/
                    var view_labelvn = L.geoJSON(vn_point, {
                        pointToLayer: function (feat, latlng) {
                            var label_VN = '<p class="VN_label" style="top: -3px; ' +
                                'left: 0px"><b>' + feat.properties.Name_Pro + '</b></p>';
                            return L.marker(latlng, {
                                icon: L.divIcon({
                                    html: "<i class='fa fa-dot-circle-o VN_symbol'></i>",
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

                    viet_bando.addTo(map);
                    //CartoDB.addTo(map);
                    base_vn.addTo(map);
                    view_biengioi.addTo(map);
                    view_ranhgioi_tinh.addTo(map);
                    view_quoclo.addTo(map);
                    view_duongsat.addTo(map);

                    /*--- Control Layer Data ---*/
                    $('#province_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(base_vn);
                        } else {
                            map.removeLayer(base_vn);
                        }
                    });
                    $('#centroids_province_data').change(function () {
                        if ($(this).prop('checked')) {
                            map.addLayer(view_labelvn);
                        } else {
                            map.removeLayer(view_labelvn);
                        }
                    });
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
                })
            })
        })
    })
//})