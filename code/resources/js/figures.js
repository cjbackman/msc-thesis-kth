var storyPiece = storyPiece || {};

storyPiece.figures = {
	initHTML: function (settings, data) {
		var selection = d3.select(settings.bindto);

		//selection.append("p").attr("class", "chart-title").style("margin-top", "20px").text("2015 i siffror");
		selection.append("h3").text("2015 i siffror");

		var row = selection.append("div").attr("class", "row");
		
		row.append("div").attr("class", "col-md-6 text-center").html("\
			<p id='tot-applications'><span class='figure-num'></span><br>ansökte om asyl i Sverige.</p>\
			<p id='tot-applications-female'><span class='figure-num'></span><br>var kvinnor.</p>\
			<p id='tot-applications-children'><span class='figure-num'></span><br>var ensamkommande barn.</p>\
			<p id='tot-granted'><span class='figure-num'></span><br>beviljades asyl i Sverige.</p>");

		row.append("div").attr("class", "col-md-6 text-center").html("<p id='tot-granted-percentage'><span class='figure-num'></span><br> av alla behandlade asylansökningar blev beviljade.</p>\
			<p id='avg-handling-time'><span class='figure-num'></span><br>dagar var den genomsnittliga handläggningstiden.</p>\
			<p id='common-countries'><span class='figure-text'></span>, <span class='figure-text'></span> och <span class='figure-text'></span><br> var de vanligaste ursprungsländerna bland de asylsökande.</p>\
			<p id='common-countries-granted'><span class='figure-text'></span>, <span class='figure-text'></span> och <span class='figure-text'></span><br> var de vanligaste ursprungsländerna bland de som beviljades asyl.</p>");

		selection.append("p").attr("class", "source").text("Källa: " + settings.data.source);
	},
	initChart: function (settings, data) {
		var asylum = data[0];
		var coo = data[1];
		var cooGranted = data[2];

		//Get data for asylum applications and decisions
		var total = asylum[asylum.length - 1];

		//Get top 3 citizenships for asylum applications
		var topApplications = coo.slice(1,4); //First row is sum
		var apps = topApplications.map(function (d) { return d["Citizenship"].charAt(0) + d["Citizenship"].slice(1).toLowerCase(); });

		//Get top 3 citizenships for granted asylum
		var topGranted = cooGranted.slice(1,4);
		var granted = topGranted.map(function (d) { return d["Citizenship"].charAt(0) + d["Citizenship"].slice(1).toLowerCase(); });

		//Add figures to DOM
		updateFigures(total, apps, granted);

		function updateFigures (total, coo, granted) {
	        if (total["Number"]) d3.select("#tot-applications").select(".figure-num").text(total["Number"]);
	        if (total["of which female"]) d3.select("#tot-applications-female").select(".figure-num").text(total["of which female"] + " (" + (100*total["of which female"]/total["Number"]).toFixed(0) + "%)");
	        if (total["of which unaccompanied minors *1"]) d3.select("#tot-applications-children").select(".figure-num").text(total["of which unaccompanied minors *1"] +  " (" + (100*total["of which unaccompanied minors *1"]/total["Number"]).toFixed(0) + "%)");
	        if (total["of which granted"]) d3.select("#tot-granted").select(".figure-num").text(total["of which granted"]);
	        if (total["Average handling time"]) d3.select("#avg-handling-time").select(".figure-num").text(((+total["Average handling time"])).toFixed(0));
	        if (total["Proportion of total number of granted decisions"]) d3.select("#tot-granted-percentage").select(".figure-num").text(((+total["Proportion of total number of granted decisions"])*100).toFixed(0) + "%");
		    if (apps) d3.select("#common-countries").selectAll(".figure-text").data(apps).text(function (d) { return d; });
			if (granted) d3.select("#common-countries-granted").selectAll(".figure-text").data(granted).text(function (d) { return d; });
		}
	}
}
