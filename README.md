# WebAtlas VietNam

### Chuyên đề:
 + Sông ngòi: done (21 đến 22/2)
 + Dân số: done (23/2 đến 26/2)
 + Kinh tế: pending 80% (26/2 đến 28/2) - đã khai thác hết dữ liệu về kinh tế
 + Du lịch: done (28/2 đến 1/3)
 + Địa chất - khoáng sản: [pending (1/3 đến 3/3) - đợt 1], [đợt 2]
 + Thổ nhưỡng: done (3/3)
 + Lâm nghiệp: done (3/3)
 + Thủy sản: done (3/3)
 + Sinh vật: done (4/3) - đã khai thác hết dữ liệu về sinh vật (hiện tại chưa có động vật)
 + Nông nghiệp: done (4/3)
 + Miền tự nhiên: done (5/3 dến 7/3)

### Ý tưởng:
 + Có nên làm legend và chart bật tắt từng thành phần không? (Pending) ==> Bỏ qua
 + Loại bỏ logo AmChart (Done)
 + Cần tối ưu hóa (Pending)
 + Chuyển sang tile vector (mapbox hoặc tương tự) để giải quyết bài toán dữ liệu lớn (dự tính trên 1mb sẽ tile dữ liệu)
 
### Khó khăn phát sinh:
 + Dữ liệu lên đến hơn 700mb ==> Úp github lên không nổi ==> Chuyển bộ dữ liệu sang 1 nơi khác (không để chung với code)
 + Đóng lại github và link repo ==> Đổi từ public sang private (7/3)
 + Chuyển path của data sang địa chỉ mới, chia làm 2 loại là spatial_data và chart_data (hiện tại mới chỉ là local)
    + Đối với spatial_data: `../../../WebAtlas_VietNam_data/[tên chuyên đề]/spatial_data/[filename].geojson`
    + Đối với chart_data: `../../../WebAtlas_VietNam_data/[tên chuyên đề]/chart_data/[filename].json`
    + Đối với các dữ liệu sử dụng chung trong nhiều chuyên đề (như ranh giới tỉnh hay ranh giới quốc gia):
    `../../../WebAtlas_VietNam_data/general_spatial_data/[filename].geojson`

### Note
 + Interactive Map: https://leafletjs.com/examples/choropleth/
 + Sử dụng leaflet_textPath để label lớp sông lượn theo tuyến sông
 + Stacked/Group Chart: http://nvd3.org/examples/multiBar.html
    + Cấu trúc file json:
        ```
        [
            {
                "key": ... (thường là biến dữ liệu - trục tung),
                "values": 
                [
                    {
                        "x": ... (thường là biến năm - trục hoành),
                        "y": ... (dữ liệu)
                    },
                    {
                        Tương tự
                    },
                    ...
                ]
            }
        ]
        ```
 + Population Pyramid Chart (áp dụng làm tháp dân số): https://codepen.io/pen/?editors=0010
 + Stacked/Stream/Expanded Area Chart (làm biểu đồ miền tuyệt đối và phần trăm): http://nvd3.org/examples/stackedArea.html
 + Pie Chart (áp dụng làm biểu đồ tròn - single): http://nvd3.org/examples/pie.html
    + Cấu trúc file json:
        ```
        [
            {
                "key": ... (tên biến),
                "values": ... (dữ liệu)
            },
            {
                Tương tự
            },
            ...
        ]
        ```
 + Cumulative Line Chart (áp dụng làm biểu đồ đường): http://nvd3.org/examples/cumulativeLine.html
    + Cấu trúc file json:
        ```
        [
            {
                "key": ... (tên biến)
                "values":[
                    [
                        [thời gian - trục hoành],
                        [dữ liệu]
                    ],
                    [
                        Tương tự
                    ],
                    ...
                ]
            },
            {
                Tương tự
            },
            ...
        ]
        ```
 + Line plus bar chart using AmChart: https://www.amcharts.com/demos/combined-bullet-column-line-chart/
 + Remove "NV-content" in NVD3.js: https://stackoverflow.com/questions/40879908/about-nvd3-js-how-to-delete-nv-context-in-lineplusbarchart
 + Change width and height: https://embed.plnkr.co/plunk/TbdUoR
 + Show All xAxis: https://stackoverflow.com/questions/34807771/nvd3-force-all-xaxis-labels-to-show-on-line-chart
 + Customize Color: https://stackoverflow.com/questions/16191542/how-to-customize-color-in-pie-chart-of-nvd3/16197159
 + FullScreen và F11 hoàn toàn khác nhau khi nhấn (nếu nhấn F11 sẽ lỗi page ==> tắt chế độ F11)
 + FullScreen.js: https://github.com/nguyenduclam/screenfull.js
 + Boostrap Toggle: https://www.bootstraptoggle.com/
 + Label Collision: https://geovation.github.io/labelgun/examples/leaflet/index.html
 + Flip Div on Click: https://jsfiddle.net/james2doyle/qsQun/
 + Don't Display Export in AmChart:
    ```
   .amcharts-amexport-menu {
               display: none !important;
           }
   ```
 + Timeline Animated Pie Chart: https://www.amcharts.com/demos/animated-time-line-pie-chart/
 + Control Specific data in 1 layer: https://next.plnkr.co/edit/H6E6q0vKwb3RPOZBWs27?p=preview&preview
 + Disable Control Layer and Container: https://gis.stackexchange.com/questions/259134/how-to-disable-leaflet-layers-control
 + Leaflet Gpx and Leaflet Elevation: https://raruto.github.io/leaflet-elevation/examples/leaflet-elevation_hoverable-tracks.html