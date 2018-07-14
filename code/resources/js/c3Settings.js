var c3Settings = {
	"opinionChart": {
		bindto: "#chart-opinion",
		data: {
			xFormat: "%Y-%b",
			json: [],
			keys: {
				value: [],
				x: ""
			},
			type: "bar",
			groups: [[]],
			colors: {
				"Fler" : "#7f7f7f",
				"Färre" : "#bcbd22",
				"Samma": "#17becf"
			}
		},
		legend : {
			position: "right"
		},
		axis: {
			x: {
				type: "category",
				tick: {
					format: function (d) { 
						return d ? (d == 2 ? "December" : "Oktober") : "September";
					}
				}
			},
			y: {
				show: false,
				tick: {
					format: d3.format("%")
				}
			}
		},
		tooltip: {
			format: {
				value: d3.format("%")
			}
		}
	},
	"asylumChart" : {
		bindto: "#chart-asylum",
		data: {
			x: "x",
			xFormat: "%Y-%m",
			type: "bar",
			axes: {},
			types: {},
			colors: {
				"Ansökningar": "#1f77b4",
				"Beslut": "#ff7f0e",
				"Beviljade": "#2ca02c",
				"Handläggningstid": "#d62728"
			}
		},
		axis: {
			x: {
				type: "timeseries",
				tick: {
					format: function (d) {
						var translation = {
							"Jan": "Jan",
							"Feb": "Feb",
							"Mar": "Mar",
							"Apr": "April",
							"May": "Maj",
							"Jun": "Jun",
							"Jul": "Jul",
							"Aug": "Aug",
							"Sep": "Sep",
							"Oct": "Okt",
							"Nov": "Nov",
							"Dec": "Dec"
						};
						return translation[d3.time.format("%b")(d)];
					}
				}
			},
			y: {
				label: "Antal"
			},
			y2: {
				label: "Handläggningstid (dagar)",
				show: true
			}
		}
	},
	"arrivalsChart" : {
		bindto: "#chart-arrivals",
		data: {
			json: [],
			keys: {
				x: "",
				value: [],
			},
			type: "bar",
			groups: [
            	["Kvotflykting", "Ordnat", "Övriga", "Anhöriga", "Eget"],
            	["0-17", "18-19", "20-64", ">64"]
        	],
        	colors: {
        		"Kvotflykting": "#ff7f0e", 
        		"Ordnat": "#2ca02c", 
        		"Övriga": "#d62728", 
        		"Anhöriga": "#9467bd", 
        		"Eget": "#8c564b", 
        		"0-17": "#e377c2", 
        		"18-19": "#7f7f7f", 
        		"20-64": "#bcbd22", 
        		">64": "#17becf"
        	}
		},
		size: {
			height: 500
		},
		axis: {
			rotated: true,
			x: {
				type: "category",
				tick: {
					multiline: false,
				}
			},
			y: {
				tick: {},
				label: "Antal"
			}
		},
		legend: {
			position: "right"
		},
		grid: {
			y: {
				show: true
			}
		}
	},
	"citizenshipChart": {
		bindto: "#chart-arrivals-citizenship",
		padding: {
			right: 50,
			bottom: 10
		},
		data: {
			json: [],
			keys: {
				x: "",
				value: [],
			},
			type: "bar",			
		},
		size: {
			height: 500
		},
		axis: {
			rotated: false,
			x: {
				type: "category",
				tick: {
					multiline: false,
					rotate: 45
				}
			},
			y: {
				tick: {
					format: function (d) { 
		              if (d == 0.1) return 1;
		              if (d == 0) return 0;
		              else return Math.pow(10,d).toFixed(0);
		            }
				}
			}
		},
		legend: {
			show: false
		},
		tooltip: {
			format: {}
		}
	},
	"deficitChart": {
		bindto: "#chart-deficit",
		data: {
			x: "x",
			columns: [
				["x",500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6000,6500,7000,7500],
				["År",29.0, 14.0, 9.0, 7.0, 5.0, 4.0, 4.0, 3.0, 3.0, 2.0, 2.0, 2.0, 2.0, 2.0, 1.0]
			],
			type: "line",
			colors: {
				"År": "#8c564b"
			}
		},
		legend: {
			show: false
		},
	    grid: {
	        x: {
	            lines: [
	                {value: 2500, text: 'Nuvarande antal'},
	            ]
	        }
	    },
	    axis: {
	    	x: {
	    		label: "Handläggare"
	    	},
	    	y: {
	    		label: "År"
	    	}
	    },
	    tooltip: {
	        format: {
	            title: function (d) { return "Antal handläggare: " + d; }
	        }
		}
	}
}