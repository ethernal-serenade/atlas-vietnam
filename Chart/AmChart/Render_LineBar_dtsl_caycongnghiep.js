function render_linebar_dtsl_caycongnghiep(div_id, data_chart, key_line_bar, data_line, data_bar) {
    am4core.useTheme(am4themes_animated);
    am4core.ready(function () {
        var chart = am4core.create(div_id, am4charts.XYChart);
        chart.data = data_chart;

        chart.logo.height = -500;
        chart.fontSize = 13;

        var CategoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        CategoryAxis.dataFields.category = key_line_bar;
        CategoryAxis.renderer.minGridDistance = 30;
        //CategoryAxis.title.text = "Cây công nghiệp";

        var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis1.title.text = "Nghìn tấn";

        var valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis2.title.text = "Nghìn ha";
        valueAxis2.renderer.opposite = true;
        valueAxis2.renderer.grid.template.disabled = true;

        var series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.dataFields.valueY = data_bar;
        series1.dataFields.categoryX = key_line_bar;
        console.log(series1.dataFields.categoryX);
        series1.yAxis = valueAxis1;
        series1.name = "Sản lượng";
        series1.fontSize = 13;
        series1.tooltipText = "{name}\n[bold font-size: 13]{valueY}[/] nghìn tấn";
        series1.fill = "#ff8400";
        series1.strokeWidth = 0;
        series1.clustered = false;
        series1.columns.template.width = am4core.percent(50);

        var series2 = chart.series.push(new am4charts.LineSeries());
        series2.dataFields.valueY = data_line;
        series2.dataFields.categoryX = key_line_bar;
        series2.name = "Diện tích";
        series2.strokeWidth = 2;
        series2.tensionX = 0.7;
        series2.stroke = "#51b83a";
        series2.fill = "#51b83a";
        series2.yAxis = valueAxis2;
        series2.tooltipText = "{name}\n[bold font-size: 13]{valueY}[/] nghìn ha";

        var bullet2 = series2.bullets.push(new am4charts.CircleBullet());
        bullet2.circle.radius = 3;
        bullet2.circle.strokeWidth = 2;
        bullet2.circle.fill = am4core.color("#51b83a");

        chart.cursor = new am4charts.XYCursor();

        chart.legend = new am4charts.Legend();
        chart.legend.position = "bottom";
    });
};