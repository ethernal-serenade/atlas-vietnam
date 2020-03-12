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
                color: "#00ebff",
                weight: 3,
                dashArray: '8, 3'
            }
        },
    });

    /*var view_docaodiahinh = L.leafletGeotiff(
        url = '../../../WebAtlas_VietNam_data/hinhthe/spatial_data/dem_vn.tif',
        options = {
            band: 0,
            displayMin: 0,
            displayMax: 30,
            name: 'Dem Viet Nam',
            colorScale: 'greens',
            clampLow: false,
            clampHigh: false,
            //vector:true,
            arrowSize: 20,
        }
    );*/

    esri.addTo(map);
    view_biengioi.addTo(map);
    //view_docaodiahinh.addTo(map);
})