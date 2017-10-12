module.exports = {
	/*
	 * Used for testing files computed via python & R
	 * Reads in all the specified data and returns an array 
	*/
	retrieveLocalData: function(){
		var path = './data/',
			filenames = ['Spatial','fish-cluster'],
			data = [];

		filenames.forEach(function(file){
			var content = require(path + file);
			data.push(content);
		});

		return data;
	}
}

return module;