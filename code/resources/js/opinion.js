var storyPiece = storyPiece || {};

storyPiece.opinion = {
  initHTML: function (settings, data) {

      var selection = d3.select(settings.bindto);
      var format = d3.time.format("%B %Y");
      var btnFormat = d3.time.format("%b");

      selection.append("h3").text("Svensk opinion");
      selection.append("p").html("I en undersökning som genomfördes vid tre olika tillfällen under 2015 ställdes frågan <i>Anser du att Sverige bör ta emot fler eller färre flyktingar?</i> Resultatet vid varje undersökning syns här nedanför.");

      selection.append("p").attr("class", "text-center chart-title").attr("id", "chart-title-opinion");
      selection.append("div").attr("id", "chart-opinion");
      selection.append("p").attr("class", "source").text("Källa: " + settings.data.source);

      function changeMonth (d) {
        
        var month = d3.select(this).attr("data-month");

        d3.select("#chart-title-opinion").text("");
        d3.select("#chart-title-opinion").text(format(new Date(month)));

        var newData = {};
        newData["json"] = globals.data.opinion.data[globals.data.opinion.data.map(function (d) { return d.key; }).indexOf(month)].values;
        newData["keys"] = {};
        newData.keys["value"] = globals.data.opinion.keys;

        globals.chart.opinionChart.load(newData);
      }
  },
  initChart: function (settings, data) {
    var format = d3.time.format("%B %Y");

    globals.data.opinion = globals.data.opinion || {};
    globals.data.opinion.data = data;

    //Update chart settings
    c3Settings.opinionChart.data.json = data;
    var keys = d3.keys(data[0]);
    c3Settings.opinionChart.data.keys.value = keys.slice(1, keys.length - 1);
    c3Settings.opinionChart.data.keys.x = keys[0];

    //Generate chart and add title
    globals.chart.opinionChart = c3.generate(c3Settings.opinionChart);
  }
}



