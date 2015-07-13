function DOMHelper(){
	createEl: function(type, properties, innerHTML){
		innerHTML = (typeof innerHTML === "undefined" ) ? null : innerHTML; //innerHTML optional
		var newEl = document.createElement(type); //TODO: Add validations/tests for type

		for (var i = properties.length - 1; i >= 0; i--) {
			var name = properties.keys[i];
			var value= properties.keys[i];
			newEl.setAttribute(name, value);
		}
		newEl.innerHTML = innerHTML; //create elements inside to out and utilize createEl recursive if needed.
	};
}