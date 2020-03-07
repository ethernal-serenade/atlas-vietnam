function render_linebarStacked_dulich(div_id, data_chart, key_line_bar, data_line, data_bar_1, data_bar_2) {
    am4core.useTheme(am4themes_animated);
    am4core.ready(function () {
        var chart = am4core.create(div_id, am4charts.XYChart);
        chart.data = data_chart;

        chart.logo.height = -500;
        chart.fontSize = 13;

        var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = key_line_bar;
        categoryAxis.title.text = "Năm";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.cellStartLocation = 0.1;
        categoryAxis.renderer.cellEndLocation = 0.9;

        var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis1.title.text = "Triệu lượt khách";

        var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis2.title.text = "Nghìn tỷ đồng";
        valueAxis2.renderer.opposite = true;
        valueAxis2.renderer.grid.template.disabled = true;

        function createSeries(field, name, stacked, color, stroke) {
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = field;
            series.dataFields.categoryX = "Năm";
            series.name = name;
            series.columns.template.tooltipText = "{name}\n[bold font-size: 13]{valueY}[/]";
            series.stacked = stacked;
            series.fill = color;
            series.stroke = stroke;
            series.columns.template.width = am4core.percent(95);
        }

        createSeries(data_bar_1, "Khách nội địa", false, "#cda9ff", "#cda9ff");
        createSeries(data_bar_2, "Khách quốc tế", true, "#a9d7ff", "#a9d7ff");

        var series2 = chart.series.push(new am4charts.LineSeries());
        series2.dataFields.valueY = data_line;
        series2.dataFields.categoryX = key_line_bar;
        series2.name = "Doanh thu (theo giá thực tế)";
        series2.strokeWidth = 2;
        series2.tensionX = 1;
        series2.yAxis = valueAxis2;
        series2.stroke = "#ff3c79";
        series2.fill = "#ff3c79";
        series2.tooltipText = "{name}\n[bold font-size: 20]{valueY} nghìn tỷ đồng[/]";

        var bullet2 = series2.bullets.push(new am4charts.CircleBullet());
        bullet2.circle.radius = 3;
        bullet2.circle.strokeWidth = 2;
        bullet2.circle.fill = am4core.color("#ff3c79");

        chart.cursor = new am4charts.XYCursor();

        chart.legend = new am4charts.Legend();
        chart.legend.position = "bottom";
    });
};