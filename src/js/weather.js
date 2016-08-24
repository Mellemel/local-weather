/**
 * The Model. Model stores items and notifies
 * observers about changes.
 */
function WeatherModel(data) {
  this.location = data.location
  this.currentWeather = data.currentWeather
  this.forecast = data.forecast
  this.unit = 'F'

  this.unitChange = new Event(this)
}

WeatherModel.prototype = {
  toCelsius: function (num) {
    return Math.round((num - 32) * 5 / 9)
  },
  toFahrenheit: function (num) {
    return Math.round((num * 9 / 5) + 32)
  },
  convertUnit: function () {
    if (this.unit === 'F') {
      this.currentWeather.temp = this.toCelsius(this.currentWeather.temp)
      this.forecast.forEach((day) => {
        day.high = this.toCelsius(day.high)
        day.low = this.toCelsius(day.low)
      })
      this.unit = 'C'
      this.unitChange.notify()
    } else {
      this.currentWeather.temp = this.toFahrenheit(this.currentWeather.temp)
      this.forecast.forEach((day) => {
        day.high = this.toFahrenheit(day.high)
        day.low = this.toFahrenheit(day.low)
      })
      this.unit = 'F'
      this.unitChange.notify()
    }
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
      '<h3>' + model.currentWeather.text + '</h3>' +
      '<h2><span id="todayWeather">' + model.currentWeather.temp + '</span>&deg;<button id="button" class="unit btn btn-primary">F</button></h2>'
      
    )

    forecast.html((index) => {
      return '<td>' + model.forecast[index].day + '</td>' +
        '<td>' + model.forecast[index].date + '</td>' +
        '<td><span class="hweather">' + model.forecast[index].high + '</span>&deg;<span class="unit">F</span></td>' +
        '<td><span class="lweather">' + model.forecast[index].low + '</span>&deg;<span class="unit">F</span></td>' +
        '<td>' + model.forecast[index].text + '</td>'
    })
    return this

  },
  init: function () {
    this._elements.button = $('#button')
    this._elements.unit = $('.unit')
    this._elements.todayWeather = $('#todayWeather')
    this._elements.highWeather = $('.hweather')
    this._elements.lowWeather = $('.lweather')

    // attach listeners to HTML controls
    var _this = this
    this._elements.button.click(() => {
      _this.unitButtonClicked.notify()
    })
  },
  convertUnits: function () {
    this._elements.unit.text(this._model.unit)

    this._elements.todayWeather.text(this._model.currentWeather.temp)

    this._elements.highWeather.text((index) => {
      return this._model.forecast[index].high
    })
    this._elements.lowWeather.text((index) => {
      return this._model.forecast[index].low
    })
  }
}

/**
 * The Controller. Controller responds to user actions and
 * invokes changes on the model.
 */
function WeatherCtrl(model, view) {
  this._model = model
  this._view = view

  var _this = this

  this._view.unitButtonClicked.attach(() => {
    _this.convertUnit()
  })
}

WeatherCtrl.prototype = {
  convertUnit: function () {
    this._model.convertUnit()
  }
}

function Event(sender) {
  this._sender = sender
  this._listeners = []
}

Event.prototype = {
  attach: function (listener) {
    this._listeners.push(listener)
  },
  notify: function (args) {
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