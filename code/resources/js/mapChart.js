function mapChart () {
	
	var width, height, scale, projection, path, svg, svgCanvas, chartWrapper, countriesPath, boundariesPath, _selection, _coords=null, pos, tip, zoomed=false, colorCounty, colorMunicipality, legend, countyIDToPC = {}, county2DOM = {}. muniIDToPC = {}, muniData;

	//Zoom settings
	var activeCounty = d3.select(null);
	var regions = d3.select(null); 
	//var border = d3.select(null);


	function f (selection) {

		_selection = selection;
		
		//Get data, then draw map
		var q = d3_queue.queue();
		q
			.defer(d3.json, "resources/data/sweden.json")
			.defer(d3.csv, "resources/data/arrivals-pc-county.csv")
			.defer(d3.csv, "resources/data/domID-county.csv")
			.defer(d3.csv, "resources/data/arrivals-pc-municipality.csv")
			.await(init);
	};

	function init (error, geo, data, domIDs, arrivalsMuni) {		
		if (error) return console.warn(error);

		//Color setting (color by percentage of arrivals)
		var _range = ["#1919ff","#3232ff","#4c4cff","#6666ff","#7f7fff","#9999ff","#b2b2ff","#ccccff","#e5e5ff", "#ffffff"].reverse();
		var _domain = getColorDomain(data, false);
		countyIDToPC = makeHashTable(data);
		muniIDToPC = makeHashTable(arrivalsMuni);
		muniData = arrivalsMuni;
		
		colorCounty = d3.scale.threshold().domain(_domain).range(_range);
		colorMunicipality = d3.scale.threshold().range(_range);

		//Create lookup table county -> domID
		domIDs.forEach(function (d, i) {
			county2DOM[d.county] = d.domID;
		});

		//Geo data
		var counties = topojson.feature(geo, geo.objects.counties).features;
		var municipalities = topojson.feature(geo, geo.objects.municipalities).features;
		var countyBoundaries = topojson.mesh(geo, geo.objects.counties, function (a, b) { return a !== b; });

		//Tooltip settings
		tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset(function (d) {
				var _this = d3.select("#" + d.id.replace(".","-")).node();
				var county = zoomed ? false : true;
				var h = county ? _this.getBBox().height / 3 : _this.getBBox().height;
				var w = county ? 0 : 0;
				return [h, w]; 
			})
			.html(function (d) { 
				var format = d3.format(".3n")
				var name = zoomed ? d.properties.municipality_name : d.properties.county_name;
				var pc =  "<br><br>" + ( zoomed ? format(muniIDToPC[d.id.split(".").join("-")]) : format(countyIDToPC[d.id.split(".").join("-")]) ) + " mottagna per capita";
				return name + pc;
			});

		//Init all graphical elements
	    projection = d3.geo.mercator();
	    path = d3.geo.path().projection(projection);

	    svg = _selection.append("svg");
		chartWrapper = svg.append("g").call(tip);
		svgCanvas = svg.append("rect").attr("class", "map-background");

	    countyPath = chartWrapper.selectAll(".county")
	      	.data(counties)
	        .enter()
	        .append("path")
	        .attr("class", "county")
	        .attr("id", function (d) { return d.id.split(".").join("-"); })
	        .attr("data-name", function (d) { return d.county_name; })
	        .style("fill", function (d) { return colorCounty(countyIDToPC[d.id.split(".").join("-")]); })
	        .on("click", function (d) {
	        	clicked(d, this);
	        })
	        .on("mouseover", function (d) {
	        	tip.show(d);
	        })
	        .on("mouseout", tip.hide);

	    countyBorders = chartWrapper.insert("path")
	        .datum(countyBoundaries)
	        .attr("class", "county-border");

	    municipalityPath = chartWrapper.selectAll(".municipality")
	    	.data(municipalities)
	    	.enter()
	    	.append("path")
	    	.attr("class", function (d) { 
	    		//Hack to take care of invalid values
	    		if (d.id == null) d.id = "SE.VG.ML";
	    		if (d.id == "SE.UP.??") d.id = "SE.UP.KN";
	    		return "municipality c" + d.id.split(".").slice(0,2).join("-");
	    	})
	    	.attr("id", function (d) { 
	    		return d.id.split(".").join("-"); 
	    	})
	    	.attr("data-name", function (d) { return d.municipality_name; })
			.on("click", function (d) {
				clicked(d, this);
			})
		    .on("mouseover", tip.show)
		    .on("mouseout", tip.hide);

		//Draw chart
	    render();

	    //Zoom in on visitor's current county
	   	if (globals.location) {
	    	//Convert county to ID
	    	var county = globals.location.split(" ");
	    	county = county.slice(0, county.length - 1).join(" ").toUpperCase();
	    	var en_county = county.replace("Å", "A").replace("Ä", "A").replace("Ö", "O");
	    	if (county in county2DOM || en_county in county2DOM) {
	    		//Select county and get data
	    		var e = d3.select("#" + county2DOM[county])[0][0]
	    		var d = e.__data__;
	    		//Call clicked with data
	    		clicked(d, e);
	    	}
	    	else throw "County " + county + " not found";
	    }

	    //Callbacks
	    function clicked (d, e) {

	    	var _this = e;

	    	//Return if you click on the same county or a municipality in that county
		  	if (activeCounty.node() === _this) return reset();
		  	if (d3.select(_this).attr("class").split(" ")[0] == "municipality") {
		  		var countyID = d3.select(_this).attr("class").split(" ")[1].slice(1);
		    	if (activeCounty.attr("id") === countyID) return reset();
		  	}

	    	//Dispatch event
	    	globals.dispatch.zoomIn(d);

		  	activeCounty = d3.select(_this);
		  	zoomed = true;

		  	//Zoom in by changing projection according to size of county
		  	var bounds = path.bounds(d);
		  	var dx = bounds[1][0] - bounds[0][0];
		  	var dy = bounds[1][1] - bounds[0][1];
		  	var x = (bounds[0][0] + bounds[1][0]) / 2;
		  	var y = (bounds[0][1] + bounds[1][1]) / 2;
		  	var scale = .9 / Math.max(dx / width, dy / height);
		  	var translate = [width / 2 - scale * x, height / 2 - scale * y];

		  	//Zoom in, make all counties gray and disable tooltip
		  	chartWrapper.transition()
			  	.duration(750)
			  	.attr("transform", "translate(" + translate + ")scale(" + scale + ")")
			  	.selectAll(".county")
			  	.style("opacity", "0.5")
				.style("fill", "#ccc")
				.each("end", function (d) {
					d3.select(this).on("mouseover", null);
					d3.select(this).on("mouseout", null);
				});

			//Make municipalities in selected county appear
			if (regions) resetRegions();
			regions = d3.selectAll(".municipality.c" + d.id.split(".").join("-"));
			if (d.id != "SE.GT") {
				var _domain = getColorDomain(muniData, true, d.id.split(".").join("-"));
				colorMunicipality.domain(_domain);
			}

			var d_county = d;
			regions.transition()
				.duration(750)
				.style("opacity", 1)
				.style("fill", function (d) { 
					return colorMunicipality(muniIDToPC[d.id.split(".").join("-")]); })
				.each("start", function (d) {
					d3.select(this).style("display", "inline");
				})
				.each("end", function (d) {
					d3.select(this).on("mouseover", tip.show);
					d3.select(this).on("mouseout", tip.hide);
				});
		}

		function reset() {

			//Dispatch event
			globals.dispatch.zoomOut();

			zoomed = false;
			activeCounty = d3.select(null);

			//Zoom out and bring all counties back to normal opacity
			chartWrapper.transition()
				.duration(750)
				.attr("transform", "")
				.selectAll(".county")
				.style("opacity", "1")
				.style("fill", function (d) { return colorCounty(countyIDToPC[d.id.split(".").join("-")]); })
				.each("end", function (d) {
					d3.select(this).on("mouseover", tip.show);
					d3.select(this).on("mouseout", tip.hide);
					//resetRegions();
				});
			resetRegions();
		}

		function resetRegions () {
			//Remove mouseover stuff
			regions
				.transition()
				.delay(400)
				.duration(200)
				.style("opacity", 0)
				.style("fill", "none")
				.each("end", function (d) {
					d3.select(this).style("display", "none");
					d3.select(this).on("mouseover", null);
					d3.select(this).on("mouseout", null);
				});
			regions = d3.select(null);
		}		
	} //End of init

	function render () {
		var config = _selection.node().getBoundingClientRect();

		width = config.width - 20;
		height = 1.2 * width;
		scale = 2 * width;

		projection = projection.scale(scale).center([16.325556, 62.3875]).translate([width/2, height/2]);
		path = path.projection(projection);

		svg.attr("width", width).attr("height", height);
		svgCanvas.attr("width", width).attr("height", height);

		countyPath.attr("d", path);
		municipalityPath.attr("d", path);
		countyBorders.attr("d", path);

	};

	function getColorDomain (data, muni, county) {
		//Color settings
		if (!muni) var minmax = d3.extent(data.map(function (d) { return +d.percent; }));
		else var minmax = d3.extent(data.filter(function (d) { return d.domID.slice(0,5) == county}).map(function (d) { return +d.percent; }));
		var domain = [];
		var stepSize = (minmax[1] - minmax[0])/8;
		for (var i=(+minmax[0]); i<= (+minmax[1]) + stepSize; i = i + stepSize) {
			domain.push(i);
		}
		return domain;
	}

	function makeHashTable (data) {
		var tmp = {};
		//Create a hash table as domID: percent
		data.forEach(function (d) {
			tmp[d.domID] = d.percent;
		});
		return tmp;
	}

	//Public function
	f.render = function () {
		render();
	}

	f.height = function (value) {
		if (!arguments.length) return value;
		height = value;
		return f;
	}

	return f;
}