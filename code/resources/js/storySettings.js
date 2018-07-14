var storySettings = {
	opinion: {
			bindto: "#wrapper-opinion",
			piece: "opinion",
		data: {
			reader: "csv",
			path: "resources/data/opinion.csv",
			source: "DN/Ipsos"
		}
	},
	figures: {
		bindto: "#wrapper-figures",
		piece: "figures",
		data: {
			reader: "csv",
			path: [
				"resources/data/asylum.csv",
				"resources/data/asylum-coo.csv",
				"resources/data/asylum-coo-granted.csv",
			],
			source: "Migrationsverket"
		}
	},
	asylum: {
		bindto: "#wrapper-asylum",
		piece: "asylum",
		data: {
			reader: "csv",
			path: "resources/data/asylum.csv",
			source: "Migrationsverket"
		}
	},
	arrivals: {
		bindto: "#wrapper-arrivals",
		piece: "arrivals",
		data: {
			reader: "csv",
			path: [
				"resources/data/arrivals-reason.csv",
				"resources/data/arrivals-age.csv",
				"resources/data/arrivals-citizenship.csv"
				],
			source: "Migrationsverket"
		}
	},
	map: {
		bindto: "#wrapper-map",
		piece: "map",
		data: {
			reader: "none",
			source: "Migrationsverket, SCB"
		}
	}
}
/*
	deficit: {
		bindto: "#wrapper-deficit",
		piece: "deficit",
		data: {
			reader: "none",
			source: "Migrationsverket"
		}
	}
}
*/