var storyPiece = storyPiece || {};

storyPiece.map = {
	initHTML: function (settings, data) {

		var selection = d3.select(settings.bindto);

		selection.append("h3").text("Mottagna per capita");
		selection.append("p").text("I kartan nedanför är Sveriges län och kommuner färglagda baserat på hur många mottagna per capita som respektive område välkomnat under 2015.\
			Mörkare färg betyder högre andel per capita. Klicka på kartan zooma och få statistik på kommunal nivå istället.");
		selection.append("div", "chart-map").attr("id", "chart-map");
		selection.append("p").attr("class", "source").text("Källa: " + settings.data.source);
	},
	initChart: function (settings, data) {
	    //Draw map
	    var map = mapChart();
	    map(d3.select("#chart-map"));
	    d3.select(window).on("resize", map.render);
	}
};