
/// This should go into a common Utils module file.\
/// Overload generic Object class to include a method for loading arguments
/// from a map of K:V pairs. This works nested only 1 level deep, but can be modified to work
/// x levels deep utilizing basic recursion.
Object.prototype.LoadDynamicArgs = function(args){
	if(typeof args == 'object' && typeof this == 'object'){
		var keys = Object.keys(args);
		for (var i = keys.length - 1; i >= 0; i--) {
			var key = keys[i];
			obj[key] = args[key];
		}'
	}
	return obj;
}
