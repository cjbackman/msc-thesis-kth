var storyPiece = storyPiece || {};

storyPiece.deficit = {
  initHTML: function (settings, data) {

      var selection = d3.select(settings.bindto);

      selection.append("h3").text("År kvar tills arbetet är slutfört");
      selection.append("p").html("Nedan visas en graf över antal år som det kommer att ta för Migrationsverket att gå igenom 2015 års inkomna ansökningar, som funktion av antal anställda.\
        Beräkningarna är baserade på handläggningstiden i december 2015 (247 timmar); att ett år har 1812 arbetstimmar samt att minst 104 075 av de inkomna\
        ansökningarna var obehandlade vid slutet av 2015.");
      selection.append("div").attr("id", "chart-deficit");
      selection.append("p").attr("class", "source").text("Källa: " + settings.data.source);
  },
  initChart: function (settings, data) {
    globals.chart.deficitChart = c3.generate(c3Settings.deficitChart);
  }
}



