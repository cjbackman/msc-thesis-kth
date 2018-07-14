var storyPiece = storyPiece || {};

storyPiece.asylum = {
	initHTML: function (settings, data) {

		var selection = d3.select(settings.bindto);

		selection.append("h3").text("Asylansökningar och handläggningstid");
		selection.append("p").text("Här visas en årlig översikt (2015) av antal asylansökningar, antal beslut som Migrationsverket fattat i asylärenden,\
      antal beviljade asylansökningar samt den genomsnittliga handläggningstiden per ärende. ");
		selection.append("div").attr("id", "chart-asylum");
		selection.append("p").attr("class", "source").text("Källa: " + settings.data.source);

	},
	initChart: function (settings, data) {
      var applications = ["Ansökningar"];
      var decisions = ["Beslut"];
      var granted = ["Beviljade"];
      var handlingTime = ["Handläggningstid"];
      var time = ["x"];

      data.forEach(function (d, i) {
        if (i != data.length - 1) {
          decisions.push(d["Decisions"]);
          applications.push(d["Number"]);
          granted.push(d["of which granted"]);
          handlingTime.push(d["Average handling time"]);
          time.push(d["Year-month"]);
        }
      });

      //Update chart settings
      c3Settings.asylumChart.data["columns"] = [time, applications, decisions, granted, handlingTime];
      c3Settings.asylumChart.data.axes[handlingTime[0]] = "y2";
      c3Settings.asylumChart.data.types[handlingTime[0]] = "line";

      //Generate chart
      globals.chart.asylumChart = c3.generate(c3Settings.asylumChart);
	}
}