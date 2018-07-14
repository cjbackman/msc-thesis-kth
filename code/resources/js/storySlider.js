var storySlider = {
	current: "#wrapper-double",
	left: "#wrapper-income",
	right: "#wrapper-figures",
	slideLeft: function (manager, settings) {
		var _this = this;
		var name = this.current.split("-")[1];

		//Slide title
		var p1 = new Promise(
			function (resolve, reject) {
				$(_this.current + "-title").toggle("slide", {direction: "left"}, function () {
					$(_this.right + "-title").toggle("slide", {direction: "right"});
					resolve();
				});
			}
		);

		//Slide chart
		var p2 = new Promise(
			function (resolve, reject) {
				$(_this.current).toggle("slide", {direction: "left"}, function () {
					$(_this.right).toggle("slide", {direction: "right"});
					resolve();
				});
			}
		);

		//Update parameters
		Promise.all([p1,p2]).then(function () {
			var tmp = _this.current;
			_this.current = _this.right;
			_this.right = _this.left;
			_this.left = tmp;			
		});
	},
	slideRight: function (manager, settings) {
		var _this = this;
		var name = this.current.split("-")[1];

		//Slide title
		var p1 = new Promise(
			function (resolve, reject) {
				$(_this.current + "-title").toggle("slide", {direction: "right"}, function () {
					$(_this.left + "-title").toggle("slide", {direction: "left"});
					resolve();
				});
			}
		);

		//Slide chart
		var p2 = new Promise(
			function (resolve, reject) {
				$(_this.current).toggle("slide", {direction: "right"}, function () {
					$(_this.left).toggle("slide", {direction: "left"});
					resolve();
				});
			}
		);

		//Update parameters
		Promise.all([p1,p2]).then(function () {
			var tmp = _this.current;
			_this.current = _this.left;
			_this.left = _this.right;
			_this.right = tmp;
		});
	}
}