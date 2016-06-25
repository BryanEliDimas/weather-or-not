// https://api.forecast.io/forecast/5d41ee0cbd7a3b80aa33249f7c988fdd/LATITUDE,LONGITUDE

var containerNode = $('#container')
var buttonNodes = document.querySelector('#buttons')

var addEventListeners = function(lat, lng) {

  var switchViewType = function(e) {
  	e.preventDefault()
  	var viewType = e.target.value

    location.hash = lat + '/' + lng + '/' + viewType
  }

	buttonNodes.addEventListener('click', switchViewType)
}

var findLocation = function() {

  var found = function(positionObject){
    var lat = positionObject.coords.latitude
    var lng = positionObject.coords.longitude
    addEventListeners(lat, lng)
    location.hash = lat + '/' + lng  + '/currently' // NOTE: THIS LINE WAS MESSING UP THE ROUTE, CHANGING IT AUTO WHEN IT SHOULDN'T // IMPORTANT: MAKE SURE THAT THERE IS NO COMMA IN THE URL, IT'S A FORWARD SLASH!!!!!!
  }

  var error_happened = function(err){
  	console.log(err)
  }


  navigator.geolocation.getCurrentPosition(found, error_happened)
}

/////////////////////////
// THE BACKBONE MODEL //


var WeatherModel = Backbone.Model.extend({
  initialize: function() {

  },

  url: function() {
    return 'https://api.forecast.io/forecast/5d41ee0cbd7a3b80aa33249f7c988fdd/' + window.location.hash.substr(1).split("/")[0] + "," + window.location.hash.split("/")[1]
  },

  // render: function(){
  // 	return "boooyahh"
  // }
})

// MODEL ENDS //
///////////////


//////////////////////////
// THE BACKBONE ROUTER //

var WeatherRouter = Backbone.Router.extend({
  routes: {
    ":lat/:lng/currently": "handleCurrentWeather",
    ":lat/:lng/daily": "handleDailyWeather",
    ":lat/:lng/hourly": "handleHourlyWeather",
    "*catchall": "indexRoute"
  },

  initialize: function() {
    Backbone.history.start()
  },

  indexRoute: function() {
    findLocation()
  },

  handleCurrentWeather: function(lat, lng) {
  		addEventListeners(lat, lng)
  		var superModel = new WeatherModel()

  	  promise_result = superModel.fetch()

  	  promise_result.then(function(res){
		    containerNode.html("<h1>The current weather for: " + lat + ", " + lng + "" + "<br /><br />" + res.currently.summary + "</h1>")
        containerNode.append("<br /> <h1>" + res.currently.temperature + " &deg;F </h1>")
  	  }).catch(function(anError){
  	  	console.log(anError)
  	  })
  },

  handleDailyWeather: function(lat, lng) {
  		addEventListeners(lat, lng)
  		var superModel = new WeatherModel()

  	  promise_result = superModel.fetch()

  	  promise_result.then(function(res){
		    containerNode.html("<h1>The daily weather for: " + lat + ", " + lng + "" + "<br /><br />" + res.daily.summary + "</h1>")
        containerNode.append("<br /> <h1>" + res.currently.temperature + " &deg;F </h1>")
  	  }).catch(function(anError){
  	  	console.log(anError)
  	  })
  },

  handleHourlyWeather: function(lat, lng) {
  		addEventListeners(lat, lng)
  		var superModel = new WeatherModel()

  	  promise_result = superModel.fetch()

  	  promise_result.then(function(res){
		    containerNode.html("<h1>The hourly weather for: " + lat + ", " + lng + "" + "<br /><br />" + res.hourly.summary + "</h1>")
        containerNode.append("<br /> <h1>" + res.currently.temperature + " &deg;F </h1>")
  	  }).catch(function(anError){
  	  	console.log(anError)
  	  })
  }

})

// var WeatherView = Backbone.View.extend({
// 	initialize: function(){
// 		this.weather = this.model
// 	}

// })


// ROUTER END ///
////////////////

var rtr = new WeatherRouter()
// var view = new WeatherView({model: WeatherModel})
