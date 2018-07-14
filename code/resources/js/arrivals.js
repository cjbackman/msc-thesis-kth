var storyPiece = storyPiece || {};

storyPiece.arrivals = {
	initHTML: function (settings, data) {
		var selection = d3.select(settings.bindto);

		selection.append("h3").text("Mottagna i absoluta tal");
		selection.append("p").attr("id", "text-arrivals");

		var btnGroup = selection.append("div").attr("class", "btn-group").attr("id", "btn-group-arrivals").attr("role", "group");

		var buttonValues = ["reason", "age"];
        var _this = this;
		btnGroup.selectAll("button")
			.data(buttonValues)
			.enter()
			.append("button")
			.attr("type", "button")
            .attr("id", function (d) {
                return "btn-" + d; 
            })
			.attr("class", function (d) {
                return d == "reason" ? "btn btn-default active" : "btn btn-default";
            })
			.attr("data-type", function (d) { return d; })
			.text(function (d) {
				return d == "reason" ? "Kategori" : "Ålder";
			})
			.on("click", function (d) {

                if (globals.type != d) {
                    d3.select(this).classed("active", true);
                    d3.select("#btn-" + globals.type).classed("active", false);
                    
                    globals.type = d;

                    if (globals.zoom) _this.renderChart(d, true, false, globals.county);
                    else _this.renderChart(d, true, false);
                }
            });

		selection.append("p").attr("class", "text-center chart-title").attr("id", "chart-title-arrivals");
		selection.append("div").attr("id", "chart-arrivals");
        selection.append("p").attr("class", "source").text("Källa: " + settings.data.source);

        //Citizenship
        var _selection = d3.select("#wrapper-arrivals-citizenship");
        _selection.append("a").attr("name", "coo");
        _selection.append("h4").attr("id", "chart-arrivals-citizenship-title");
        _selection.append("div").attr("id", "text-arrivals-citizenship");
        _selection.append("p").attr("class", "text-center chart-title").attr("id", "chart-title-arrivals-citizenship");
        _selection.append("div").attr("id", "chart-arrivals-citizenship");
		_selection.append("p").attr("class", "source")
            .attr("id", "citizenship-source")
            .style("visibility", "hidden")
            .text("Källa: " + settings.data.source);

		//Store data
		globals.data.arrivals = globals.data.arrivals || {};
		globals.data.arrivals.data = globals.data.arrivals.data || {};
		globals.data.arrivals.data.reason = data[0];
		globals.data.arrivals.data.age = data[1];
        globals.data.arrivals.data.citizenship = data[2];
	},
	initChart: function (settings, data) {

		//Set some chart settings
        c3Settings.arrivalsChart.legend.show = true;
        c3Settings.arrivalsChart.axis.y.tick.format = "";
 	
 		//Render chart
        globals.type = "reason";
 		this.renderChart(globals.type, false, true);

        //Add listener
        var _this = this;
        globals.dispatch.on("zoomIn", function (d) {
            globals.zoom = true;
            globals.county = d;
            _this.renderChart(globals.type, false, true, d);

            //TODO: This should not be done here...
            d3.select("#scroll-btn").transition().duration(1000).style("opacity",1);
            d3.select("#scroll-county").text(d.properties.county_name);
        });
        globals.dispatch.on("zoomOut", function (d) {
            globals.zoom = false;
            _this.renderChart(globals.type, false, true);

            //TODO: This should not be done here...
            d3.select("#scroll-btn").transition().duration(500).style("opacity",0);
        });
	},
	renderChart: function (type, load, updateCitiChart, county) {

		var data = globals.data.arrivals.data[type];

		if (!county) {
          	//Get data for counties
            var countySums = getCountySums(data);
            
            //Sort in descending order
            countySums.sort(function (a,b) { return b.total - a.total; })

            //Update chart settings
            c3Settings.arrivalsChart.data.json = countySums;
            c3Settings.arrivalsChart.data.keys.value = getKeys(type);
            c3Settings.arrivalsChart.data.keys.x = "county";
            var categories = countySums.map( function (d) { return d.county; });

            //Update text
            updateText(type);
            type == "reason" ? d3.select("#arrivals-explanation-link").on("click", showExplanation) : "";

            //Update or create new
            if (load) updateChart(countySums, getKeys(type), categories);
            else globals.chart.arrivalsChart = c3.generate(c3Settings.arrivalsChart);

            //Hide citizenship chart
            if (updateCitiChart) $("#wrapper-arrivals-citizenship").slideToggle("slow");
            globals.horizontalMove = false;
		}
		else {
			var muniSums = getMunicipalitySums(data, county);

            muniSums.sort(function (a, b) { return b.total - a.total; });

            c3Settings.arrivalsChart.data.json = muniSums;
            c3Settings.arrivalsChart.data.keys.value = getKeys(type);
            c3Settings.arrivalsChart.data.keys.x = "municipality";
            var categories = muniSums.map( function (d) { return d.municipality; });

            //Update or create new
            if (load) updateChart(muniSums, getKeys(type), categories);
            else globals.chart.arrivalsChart = c3.generate(c3Settings.arrivalsChart);

            //Create citizenship chart
            if (updateCitiChart) {
                //Cleanup
                //globals.horizontalMove ? $("#wrapper-arrivals-citizenship").slideToggle("slow") : "";
                d3.select("#chart-arrivals-citizenship").html("");
                d3.select("#chart-arrivals-citizenship-title").html("");
                d3.select("#chart-title-arrivals-citizenship").html("");
                d3.select("#text-arrivals-citizenship").html("");

                //Add title
                d3.select("#chart-arrivals-citizenship-title").text("Varifrån har de kommit?");
                d3.select("#text-arrivals-citizenship").text("Antal mottagna i valt län, sorterat efter ursprungsland. Logaritmisk skala.");
                d3.select("#chart-title-arrivals-citizenship").text(county.properties.county_name);

                //Get data
                var tmp = globals.data.arrivals.data.citizenship;
                var _data = getCitiData(tmp, county);

                c3Settings.citizenshipChart.data.json = _data;
                c3Settings.citizenshipChart.data.keys.value = getKeys("citizenship");
                c3Settings.citizenshipChart.data.keys.x = "key";

                var _categories = _data.map(function (d) { return d.key; });

                //If chart, load
                if (load) updateCitizenshipChart(_data, getKeys("citizenship"), _categories);
                else {
                    globals.chart.citizenshipChart = c3.generate(c3Settings.citizenshipChart);
                    globals.horizontalMove ? "" : $("#wrapper-arrivals-citizenship").slideToggle("slow");
                    //$("#wrapper-arrivals-citizenship").slideToggle("slow");
                }
                globals.horizontalMove = true;
            }

		}

        function getCountySums (data) {
        	var tmp = [];
            data.forEach(function (d) {
              if (d.municipality == "Delsumma") tmp.push(d);
            });
            return tmp;
        }

        function getMunicipalitySums (data, county) {
            var tmp = [];
            var flag = false;
            data.forEach(function (d) {
                if (isCounty(d.county, county.properties.county_name) && d.municipality && d.municipality != "Delsumma") flag = true;
                if (isCounty(d.county, county.properties.county_name) && d.municipality && d.municipality == "Delsumma") flag = false;
                if (flag) tmp.push(d);
            });
            return tmp;
        }

        function getCitiData (data, county) {
            var data = data.filter(function (d) { return isCounty(d.county, county.properties.county_name); })[0]; //Get data for chosen county
            //delete data.county;
            var tmpData = d3.entries(data).filter(function (d) { return d.key != "county"; });

            tmpData = tmpData.filter(function (d) { return d.value > 0; });
            tmpData.sort(function (a,b) {return b.value - a.value;})

            //Make data logarithmic (since C3 does not support log scales)
            tmpData = tmpData.map(function (d) {  
              d.Antal = (d.value == 1 ? 0.1 : Math.log(d.value) / Math.LN10); //Ugly hack not to make value = 0 
              return d; 
            });
            return tmpData;
        }

        function isCounty (fullname, county) {
            var shortname = fullname.split(" ").slice(0, fullname.split(" ").length - 1).join(" "); //remove län
            if (shortname == county.toUpperCase()) return true;
            if (shortname.slice(0, shortname.length - 1) == county.toUpperCase()) return true;
            if (shortname.replace("Ö", "O") == county.toUpperCase()) return true;
            return false;
        }

        function getKeys (type) {
        	switch (type) {
        		case "reason":
        			return ["Kvotflykting", "Ordnat", "Övriga", "Anhöriga", "Eget"];
        			break;
        		case "age":
        			return ["0-17", "18-19", "20-64", ">64"];
        			break;
                case "citizenship":
                    return ["Antal"];
                    break;
        		default:
        			throw "Error: Missing type " + type;
        	}
        }

        function updateChart (data, keys, categories) {
        	var newData = {
        		json: data,
        		keys: {
        			value: keys
        		},
        		unload: true
        	};
            if (categories) newData.categories = categories;

        	globals.chart.arrivalsChart.load(newData);
        }

        function updateCitizenshipChart (data, keys, categories) {
            var newData = {
                json: data,
                keys: {
                    value: keys
                },
                unload: true
            };
            if (categories) newData.categories = categories;

            globals.chart.citizenshipChart.load(newData);
        }

        //TODO: Add transition
        function updateText (type) {
        	switch (type) {
        		case "reason":
        			d3.select("#text-arrivals").text("");
        			d3.select("#chart-title-arrivals").text("");
        			d3.select("#text-arrivals").html("Migrationsverket klassificerar de kommunmottagna efter <button class='btn btn-info btn-xs' id='arrivals-explanation-link'>fem olika kategorier</button>.\
                        Vilken kategori en mottagen hamnar i beror på anledningen varför personen kommit till en viss kommun. Nedan visas totala antalet mottagna (under 2015) per geografiskt område, efter kategori. Filtrera datan genom att föra muspekaren över och/eller klicka på legenden.");
        			
                    d3.select("#chart-title-arrivals").text("Antal mottagna efter kategori");

        			var explanation = d3.select("#arrivals-explanation");
        			if (explanation.empty()) {
        				var explanation = d3.select("body").append("div").attr("id", "arrivals-explanation");

        				explanation.html("\
        					<p><b>Kvotflykting</b> Vidarebosatta (det vill säga kvotflyktingar) som blivit uttagna i utlandet av Migrationsverket i samarbete med FN:s flyktingorganisation UNHCR.</p>\
        					<p><b>Ordnat boende</b> Före detta asylsökande som beviljats uppehållstillstånd (bland annat konventionsflyktingar och skyddsbehövande) som efter anvisning av Arbetsförmedlingen eller Migrationsverket har bosatt sig i en kommun. Kan även avse ensamkommande barn som anvisades kommun redan under tiden som asylsökande.</p>\
        					<p><b>Eget boende</b> Före detta asylsökande som beviljats uppehållstillstånd (bland annat konventionsflyktingar och skyddsbehövande) som ordnat boende i en kommun på egen hand – antingen redan under tiden som asylsökande eller i samband med att personen fått uppehållstillstånd. Kan även avse ensamkommande barn som anvisades kommun redan under tiden som asylsökande.</p>\
        					<p><b>Anhöriga</b> Anhöriga till flyktingar, skyddsbehövande eller personer som fått uppehållstillstånd på synnerligen ömmande omständigheter. Den anhörige ska söka uppehållstillstånd inom viss tid från det att anknytningen (referenspersonen) första gången togs emot i en kommun. Från 1991 fram till 2013 gällde en övre tidsgräns på två år. Under främst 2013 gällde en tillfällig förlängd tid. För anhöriga som får uppehållstillstånd från den 1 januari 2014 gäller en ny permanent tidsgräns på sex år.</p>\
        					<p><b>Övriga</b> Främst personer som utan att ha sökt asyl ändå erhållit uppehållstillstånd, sällan som flykting, skyddsbehövande, men däremot efter synnerligen ömmande omständigheter. Här kan även finnas tidigare asylsökande som efter uppehållstillstånd har lämnat ett anläggningsboende utan att uppge adress och därför blir utskriven från Migrationsverkets mottagningssystem med okänd adress.</p>\
        					<br><br>");

						explanation.append("a").attr("href", "#").text("Stäng").on("click", hideExplanation);
        			}
        			break;
        		case "age":
        			d3.select("#text-arrivals").text("");
        			d3.select("#chart-title-arrivals").text("");
        			d3.select("#text-arrivals").html("Totala antalet kommunmottagna (under 2015) per geografiskt område, efter ålder.");

        			d3.select("#chart-title-arrivals").text("Antal mottagna efter ålder");
        			break;
        		default:
        			throw "Error: Missing type " + type;
        	}
        }
    	function showExplanation (d) {
    		var w = screen.width < 500 ? screen.width * 0.8 : "500px";
    		d3.select("#view-0").style("opacity", 0.3);
    		d3.select("#arrivals-explanation").style("display", "block").style("width", w);
    	}
    	function hideExplanation (d) {
    		d3.select("#arrivals-explanation").style("display", "none");
    		d3.select("#view-0").style("opacity", 1).on("click", null);
    	}
	}
}