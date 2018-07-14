var storyManager = {
	generate: function (settings) {

		//Get data
		switch (settings.data.reader) {
			case "csv":
				if (typeof settings.data.path == "string") {
					d3.csv(settings.data.path, init);
				}
				if (typeof settings.data.path == "object") {
					var q = d3_queue.queue();
					for (var i=0; i < settings.data.path.length; i++) {
						q.defer(d3.csv, settings.data.path[i]);
					}
					q.awaitAll(init);
				}
				break;
			case "json":
				d3.json(settings.data.path, init);
				break;
			case "none":
				init();
				break;
			default:
				throw "Reader " + settings.data.reader + " not supported.";
		}

		//Initialize chart
		function init (error, data) {
			if (error) throw error;

			var promise = new Promise(
					function (resolve, reject) {
						//Add HTML
						storyPiece[settings.piece].initHTML(settings, data);
						resolve();
					}
				);
			promise.then(
					function () {
						//Render chart
						storyPiece[settings.piece].initChart(settings, data);
					}
				)
			.catch(
					function (reason) {
						throw "Error: " + reason;
					}
			);
		}
	},
	generateVega: function (mode, specFile, el) {
		if (mode == "vega-lite") {
			d3.json(specFile, function (error, spec) {
				if (error) throw error;

				var embedSpec = {
					mode: mode,
					spec: spec
				};

				vg.embed(el, embedSpec);			
			});
		}
		if (mode == "vega") {
			//d3.json(specFile, function (error, spec) {
			//	if (error) throw error;

				function parse(spec) {
		    		vg.parse.spec(spec, function (chart) { chart({"el": el}).update(); });
		    	}
		    	parse(specFile);
		    //});
		}
	}
};