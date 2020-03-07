function render_pie_TimeLine_dulich(div_id, data_chart) {
    am4core.useTheme(am4themes_animated);
    am4core.ready(function () {
        var chart = am4core.create(div_id, am4charts.PieChart);
        var chartData = data_chart;

        chart.logo.height = -500;
        chart.data = [
            {
                "sector": "Bỉ",
                "size": 0
            },
            {
                "sector": "Campuchia",
                "size": 0
            },
            {
                "sector": "Canada",
                "size": 0
            },
            {
                "sector": "Các quốc gia khác",
                "size": 93.247
            },
            {
                "sector": "Châu Mỹ",
                "size": 0
            },
            {
                "sector": "Châu Phi",
                "size": 0
            },
            {
                "sector": "Châu Á",
                "size": 0
            },
            {
                "sector": "Châu Âu",
                "size": 0
            },
            {
                "sector": "Châu Úc",
                "size": 0
            },
            {
                "sector": "Hoa Kỳ",
                "size": 38.404
            },
            {
                "sector": "Hà Lan",
                "size": 0
            },
            {
                "sector": "Hàn Quốc",
                "size": 32.727
            },
            {
                "sector": "Hồng Kông",
                "size": 0
            },
            {
                "sector": "Indonesia",
                "size": 0
            },
            {
                "sector": "Lào",
                "size": 0
            },
            {
                "sector": "Malaysia",
                "size": 19.863
            },
            {
                "sector": "Na Uy",
                "size": 0
            },
            {
                "sector": "New Zealand",
                "size": 0
            },
            {
                "sector": "Nga",
                "size": 0
            },
            {
                "sector": "Nhật Bản",
                "size": 34.788
            },
            {
                "sector": "Philippines",
                "size": 0
            },
            {
                "sector": "Pháp",
                "size": 16.565
            },
            {
                "sector": "Phần Lan",
                "size": 0
            },
            {
                "sector": "Singapore",
                "size": 21.49
            },
            {
                "sector": "Thái Lan",
                "size": 14.125
            },
            {
                "sector": "Thụy sĩ",
                "size": 0
            },
            {
                "sector": "Thụy Điển",
                "size": 0
            },
            {
                "sector": "Trung Quốc",
                "size": 59.114
            },
            {
                "sector": "Tây Ban Nha",
                "size": 0
            },
            {
                "sector": "Vương quốc Anh",
                "size": 0
            },
            {
                "sector": "Úc",
                "size": 23.814
            },
            {
                "sector": "Ý",
                "size": 0
            },
            {
                "sector": "Đan mạch",
                "size": 0
            },
            {
                "sector": "Đài Loan",
                "size": 21.858
            },
            {
                "sector": "Đức",
                "size": 0
            },
            {
                "sector": "Ấn Độ",
                "size": 0
            }
        ];
        chart.fontSize = 13;
        chart.fontStyle = "bold";

        chart.legend = new am4charts.Legend();
        chart.legend.useDefaultMarker = true;
        chart.legend.position = "right";
        chart.legend.valueLabels.template.align = "right";
        chart.legend.valueLabels.template.textAlign = "start";
        chart.legend.minWidth = 250;
        chart.legend.maxHeight = 200;
        chart.legend.scrollable = true;

        var marker = chart.legend.markers.template.children.getIndex(0);
        marker.cornerRadius(12, 12, 12, 12);
        marker.strokeWidth = 2;
        marker.strokeOpacity = 1;
        marker.stroke = am4core.color("#ccc");

        chart.innerRadius = 20;
        var label = chart.seriesContainer.createChild(am4core.Label);
        label.text = "2008";
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 13;

        var pieSeries = chart.series.push(new am4charts.PieSeries());
        var colorSet = new am4core.ColorSet();
        colorSet.list = ["#388E3C", "#FBC02D", "#0288d1", "#b783bc", "#c9a1d4",
            "#fff556", "rgba(133,122,123,0.27)", "#d03cd1", "#00f485", "#c3d4a1",
            "#3dd8ff", "#c0f1ff", "#024b79", "#f47bc7", "#005d8c",
            "#a012ff", "#c3b0fb", "#ffbeb8", "#65f4bc", "#0eb32c",
            "#ff2f4d", "#0eb195", "#55d1cd", "#aeb15a", "#b30e4a",
            "#11ebd2", "#5653e8", "#92d481", "#bbc7d8", "#87697f",
            "#007e73", "#0071fb", "#b3ff03", "#bc8778", "#b8ffda"].map(function(color) {
            return new am4core.color(color);
        });
        pieSeries.colors = colorSet;
        pieSeries.dataFields.value = "size";
        pieSeries.dataFields.category = "sector";
        pieSeries.ticks.template.disabled = true;
        pieSeries.alignLabels = false;
        pieSeries.labels.template.adapter.add("radius", function(radius, target) {
            if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
                return 0;
            }
            return radius;
        });

        pieSeries.labels.template.adapter.add("text", function(text, target) {
            if (target.dataItem && (target.dataItem.values.value.percent < 5)) {
                return "";
            }
            return text;
        });

        pieSeries.labels.template.adapter.add("fill", function(color, target) {
            if (target.dataItem && (target.dataItem.values.value.percent < 10)) {
                return am4core.color("#0071fb");
            } else if (target.dataItem && (target.dataItem.values.value.percent > 10)) {
                return am4core.color("#ff0f00");
            }
            return color;
        });
        pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
        pieSeries.labels.template.radius = am4core.percent(-70);
        pieSeries.labels.template.fill = am4core.color("white");
        pieSeries.labels.template.relativeRotation = 90;

        var currentYear = 2008;
        function getCurrentData() {
            label.text = currentYear;
            var data = chartData[currentYear];
            currentYear++;
            if (currentYear > 2019)
                currentYear = 2008;
            return data;
        }

        function loop() {
            var data = getCurrentData();
            for (var i = 0; i < data.length; i++) {
                chart.data[i].size = data[i].size;
            }
            chart.invalidateRawData();
            chart.setTimeout(loop, 3000);
        }
        loop();
    });
}