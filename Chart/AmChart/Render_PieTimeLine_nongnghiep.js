function render_pie_TimeLine_nongnghiep(div_id, data_chart) {
    am4core.useTheme(am4themes_animated);
    am4core.ready(function () {
        var chart = am4core.create(div_id, am4charts.PieChart);
        var chartData = data_chart;

        chart.logo.height = -500;
        chart.data = [
            {
                "sector": "Nông nghiệp",
                "size": 129017.7
            },
            {
                "sector": "Lâm nghiệp",
                "size": 7675.7
            },
            {
                "sector": "Thủy sản",
                "size": 26620.1
            }
        ];
        chart.fontSize = 13;
        chart.fontStyle = "bold";

        chart.legend = new am4charts.Legend();
        chart.legend.useDefaultMarker = true;
        chart.legend.position = "right";
        chart.legend.valueLabels.template.align = "right";
        chart.legend.valueLabels.template.textAlign = "end";
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
        label.text = "2000";
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = 13;

        var pieSeries = chart.series.push(new am4charts.PieSeries());
        var colorSet = new am4core.ColorSet();
        colorSet.list = ["#fff44a", "#90d730", "#009bff"].map(function(color) {
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
            if (target.dataItem && (target.dataItem.values.value.percent < 20)) {
                return am4core.color("#ffffff");
            } else if (target.dataItem && (target.dataItem.values.value.percent > 40)) {
                return am4core.color("#ff0f00");
            }
            return color;
        });
        pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
        pieSeries.labels.template.radius = am4core.percent(-70);
        pieSeries.labels.template.fill = am4core.color("white");
        pieSeries.labels.template.relativeRotation = 90;

        var currentYear = 2000;
        function getCurrentData() {
            label.text = currentYear;
            var data = chartData[currentYear];
            currentYear++;
            if (currentYear > 2002)
                currentYear = 2000;
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