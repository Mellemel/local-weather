/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */
function WeatherModel(data) {
  this.location = data.location
  this.currentWeather = data.currentWeather
  this.forecast = data.forecast

  this.unitChange = new Event(this)
}

WeatherModel.prototype = {
  toCelsius: function () {
    this.currentWeather.temp = (this.currentWeather.temp - 32) * 5 / 9
    this.forecast.forEach((day) => {
      day.high = (day.high - 32) * 5 / 9
      day.high = (day.high - 32) * 5 / 9
    })
  },
  toFahrenheit: function () {
    this.currentWeather.temp = (this.currentWeather.temp * 9 / 5) - 32
    this.forecast.forEach((day) => {
      day.high = (day.high * 9 / 5) - 32
      day.high = (day.high * 9 / 5) - 32
    })
  }
}

/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interraction.
 */
function WeatherView(model, elements) {
  this._model = model
  this._elements = elements

  this.unitButtonClicked = new Event(this)

  var _this = this

  // attach model listeners
  this._model.unitChange.attach(() => {
    _this.convertUnits()
  })

  // attach listeners to HTML controls
  this._elements.unitButton.click(() => {
    _this.unitButtonClicked.notify()
  })
}

WeatherView.prototype = {
  show: function () {
    let location = this._elements.location,
      cc = this._elements.currentWeather,
      forecast = this._elements.forecast,
      model = this._model

    location.html(model.location.city + ', ' + model.location.region)

    cc.html(
      '<h3>' + model.currentWeather.date + '</h3>' +
      '<h1>' + model.currentWeather.temp + '<span>&deg;F</span></h1>' +
      '<h3>' + model.currentWeather.text + '</h3>'
    )

    forecast.html((index) => {
      return '<td>' + model.forecast[index].day + '</td>' +
        '<td>' + model.forecast[index].date + '</td>' +
        '<td>' + model.forecast[index].high + '<span class="unit">&deg;F</span></td>' +
        '<td>' + model.forecast[index].low + '<span class="unit">&deg;F</span></td>' +
        '<td>' + model.forecast[index].text + '</td>'
    })

  },
  convertUnits: function () {

  }
}

/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */
function WeatherCtrl(model, view) {
  this._model = model
}

function Event(sender) {
  this._sender = sender
  this._listeners = []
}

Event.prototype = {
  attach: function(listener) {
    this._listeners.push(listener)
  },
  notify: function(args) {
    for (let i = 0; i < this._listeners.length; i++) {
      this._listeners[i](this._sender, args)
    }
  }
}

module.exports = {
  Model: WeatherModel,
  View: WeatherView,
  Ctrl: WeatherCtrl
}