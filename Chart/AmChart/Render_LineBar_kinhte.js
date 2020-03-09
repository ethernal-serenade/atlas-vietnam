function render_linebar_kinhte(div_id, data_chart, key_line_bar, data_line, data_bar) {
    am4core.useTheme(am4themes_animated);
    am4core.ready(function () {
        var chart = am4core.create(div_id, am4charts.XYChart);
        chart.data = data_chart;
        
        chart.logo.height = -500;
        chart.fontSize = 13;

        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 30;
        dateAxis.gridIntervals.setAll([
            { timeUnit: "year", count: 1 },
            { timeUnit: "year", count: 6 }
        ]);

        var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis1.title.text = "Nghìn tỷ đồng";

        var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis2.title.text = "%";
        valueAxis2.renderer.opposite = true;
        valueAxis2.renderer.grid.template.disabled = true;

        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.dataFields.valueY = data_bar;
        series1.dataFields.dateX = key_line_bar;
        series1.yAxis = valueAxis1;
        series1.name = "GDP";
        series1.fontSize = 13;
        series1.tooltipText = "{name}\n[bold font-size: 13]{valueY}[/]";
        series1.fill = "#ff8400";
        series1.strokeWidth = 0;
        series1.clustered = false;
        series1.columns.template.width = am4core.percent(40);

        var series2 = chart.series.push(new am4charts.LineSeries());
        series2.dataFields.valueY = data_line;
        series2.dataFields.dateX = key_line_bar;
        series2.name = "Tốc độ tăng trưởng (năm 2000 = 100%)";
        series2.strokeWidth = 2;
        series2.tensionX = 0.7;
        series2.yAxis = valueAxis2;
        series2.tooltipText = "Tốc độ tăng trưởng\n[bold font-size: 13]{valueY}[/]";

        var bullet2 = series2.bullets.push(new am4charts.CircleBullet());
        bullet2.circle.radius = 3;
        bullet2.circle.strokeWidth = 2;
        bullet2.circle.fill = am4core.color("#fff556");

        chart.cursor = new am4charts.XYCursor();

        chart.legend = new am4charts.Legend();
        chart.legend.position = "bottom";
    });
};