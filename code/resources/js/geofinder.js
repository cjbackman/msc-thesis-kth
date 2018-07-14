var Geofinder = (function () {

	"use strict";

	var _API_KEY = globals.API_KEY_GOOGLE;
	//Administrative levels (e.g. municipality, county, country)
	var levels = {
		adm0: "",
		adm1: "",
		adm2: "",
		coords: {}
	};

	var getLocation = function (useIP) {
		//Get coords from HTML5 Geolevels as default
		return new Promise (function (resolve, reject) {
			if (!useIP) resolve(navigator.geolocation.getCurrentPosition(_getLocationFromHTML, _getLocationFromIP));
			else resolve(_getLocationFromIP());
		});	
	};

	var _getLocationFromHTML = function (position) {
		//console.log("Getting position from HTML5.");
		var latlng = position.coords.latitude + "," + position.coords.longitude;

		return new Promise (function (resolve, reject) { 
			//Resolve coords using Google Places API
			d3.json("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&key=" + _API_KEY, function(error, data) {
				if (error) reject(console.warn(error));
				if (data.status != "OK") reject(console.warn("Request responded with " + data.status)); 
				resolve(_extractADM(data)); 
			});
		});
	};

	//Get location from IP if HTML5 fails
	var _getLocationFromIP = function () {
		//console.log("Getting position from IP.");

		return new Promise (function (resolve, reject) {
			//Get city from IP-API
		    d3.json("http://ip-api.com/json", function(error, data) {
		    	if (error) reject(console.warn(error));

		    	if (data.status == "success") {
				    //Resolve city using Google Places API
					d3.json("https://maps.googleapis.com/maps/api/geocode/json?address=" + data.city + "&key=" + _API_KEY, function(error, data) {
						if (error) reject(console.warn(error));
						if (data.status != "OK") reject(console.warn("Request responded with " + data.status));
						resolve(_extractADM(data));
					});
		    	}
		    	else reject(console.warn("Query for " + data.city + " responded with " + data.message));
		    });
	    });
	};

	//Extract ADM levels
	var _extractADM = function (data) {

		//console.log("Resolving coordinates with Google API...");
		for (var i=0; i<data.results.length;i++) {
			if (data.results[i].types.indexOf("political") > -1) {
				//Get data from types "administrative_area_level_2", "administrative_area_level_1" and "country"
				for (var j=0; j<data.results[i].address_components.length; j++) {
					if (data.results[i].address_components[j].types.indexOf("administrative_area_level_2") > -1) levels.adm2 = data.results[i].address_components[j].long_name;
					if (data.results[i].address_components[j].types.indexOf("administrative_area_level_1") > -1) levels.adm1 = data.results[i].address_components[j].long_name;
					if (data.results[i].address_components[j].types.indexOf("country") > -1) levels.adm0 = data.results[i].address_components[j].long_name;
				}
				levels.coords = data.results[i].geometry.location;
			}
			//TODO: If cannot find type=political
		}
		//console.log("Coordinates extracted.");
		return levels;	
	};

	return {
		getLocation: getLocation,
		location: levels
	};

}());

