function render_pyramid(div_id, data, key, male, female) {
    am4core.useTheme(am4themes_animated);
    /*** Load thẻ div ==> Chạy am4Core ***/
    am4core.ready(function() {
        var mainContainer = am4core.create(div_id, am4core.Container);
        mainContainer.width = am4core.percent(100);
        mainContainer.height = am4core.percent(100);
        mainContainer.layout = "horizontal";

        /*-- Nam --*/
        /** Remove Logo **/
        $("g[opacity='0.3']").remove();
        $("g[opacity='0.4']").remove();
        var maleChart = mainContainer.createChild(am4charts.XYChart);
        maleChart.paddingRight = 0;
        maleChart.data = JSON.parse(JSON.stringify(data));

        var maleCategoryAxis = maleChart.yAxes.push(new am4charts.CategoryAxis());
        maleCategoryAxis.dataFields.category = key;
        maleCategoryAxis.renderer.grid.template.location = 0;
        maleCategoryAxis.renderer.minGridDistance = 15;
        maleCategoryAxis.renderer.labels.template.disabled = true;
        maleCategoryAxis.fontSize = 13;

        var maleValueAxis = maleChart.xAxes.push(new am4charts.ValueAxis());
        maleValueAxis.renderer.inversed = true;
        maleValueAxis.min = 0;
        maleValueAxis.max = 10;
        maleValueAxis.strictMinMax = true;
        maleValueAxis.fontSize = 13;

        maleValueAxis.numberFormatter = new am4core.NumberFormatter();
        maleValueAxis.numberFormatter.numberFormat = "#.#'%'";

        var maleSeries = maleChart.series.push(new am4charts.ColumnSeries());
        maleSeries.fill = am4core.color("#f5b3cc");
        maleSeries.stroke = am4core.color("#f5b3cc");
        maleSeries.dataFields.valueX = male;
        maleSeries.dataFields.valueXShow = "percent";
        maleSeries.calculatePercent = true;
        maleSeries.dataFields.categoryY = key;
        maleSeries.interpolationDuration = 1000;
        maleSeries.columns.template.tooltipText = "Nam, nhóm tuổi {categoryY}: {valueX} người ({valueX.percent.formatNumber('#.0')}%)";

        /*-- Nữ --*/
        $("g[opacity='0.3']").remove();
        $("g[opacity='0.4']").remove();
        var femaleChart = mainContainer.createChild(am4charts.XYChart);
        femaleChart.paddingLeft = 0;
        femaleChart.data = JSON.parse(JSON.stringify(data));

        var femaleCategoryAxis = femaleChart.yAxes.push(new am4charts.CategoryAxis());
        femaleCategoryAxis.dataFields.category = key;
        femaleCategoryAxis.renderer.grid.template.location = 0;
        femaleCategoryAxis.renderer.minGridDistance = 15;
        femaleCategoryAxis.renderer.labels.template.disabled = true;
        femaleCategoryAxis.fontSize = 13;

        var femaleValueAxis = femaleChart.xAxes.push(new am4charts.ValueAxis());
        femaleValueAxis.min = 0;
        femaleValueAxis.max = 10;
        femaleValueAxis.strictMinMax = true;
        femaleValueAxis.numberFormatter = new am4core.NumberFormatter();
        femaleValueAxis.numberFormatter.numberFormat = "#.#'%'";
        femaleValueAxis.renderer.minLabelPosition = 0.01;
        femaleValueAxis.fontSize = 13;

        var femaleSeries = femaleChart.series.push(new am4charts.ColumnSeries());
        femaleSeries.dataFields.valueX = female;
        femaleSeries.dataFields.valueXShow = "percent";
        femaleSeries.calculatePercent = true;
        femaleSeries.fill = am4core.color("#a2d8f2");
        femaleSeries.stroke = am4core.color("#a2d8f2");
        femaleSeries.columns.template.tooltipText = "Nữ, nhóm tuổi {categoryY}: {valueX} người ({valueX.percent.formatNumber('#.0')}%)";
        femaleSeries.dataFields.categoryY = key;
        femaleSeries.interpolationDuration = 1000;
    });
}