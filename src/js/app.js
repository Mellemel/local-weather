var weather = require('./weather.js'), moment = require('moment')

$(document).ready(() => {

  let ip = {
    url: 'https://api.ipify.org',
    format: '?format=json'
  }

  // retrieve ip address
  $.get(ip.url + ip.format, (data) => {
    let location = {
      url: 'https://freegeoip.net/',
      format: 'json/',
      ip: data.ip
    }

    // get location of ip address
    $.getJSON(location.url + location.format + location.ip, (data) => {
      let city = data['city'], state = data['region_code']
      if (/the/gi.test(city)) {
        city = city.split(' ')[1]
      }

      // get weather info from yahooapis
      let w = {
        url: 'https://query.yahooapis.com/v1/public/yql?q=',
        query: encodeURI('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + city + ', ' + state + '")'),
        setting: '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
      }

      $.getJSON(w.url + w.query + w.setting).then((data) => {

        var intel = {
          location: data.query.results.channel.location,
          currentWeather: data.query.results.channel.item.condition,
          forecast: data.query.results.channel.item.forecast
        }

        sanitizeData(intel)

        var model = new weather.Model(intel)

        var view = new weather.View(model, {
          location: $('#location'),
          currentWeather: $('#today'),
          forecast: $('.day')
        })

        var controller = new weather.Ctrl(model, view)

        view.show().init()
      })
    })
    function sanitizeData(data) {
      let tmpDate = moment.utc(new Date(data.currentWeather.date).toISOString())

      data.currentWeather.date = tmpDate.format('ddd, MMM Do YYYY h:mm A')

      data.currentWeather.temp = parseInt(data.currentWeather.temp)

      data.forecast.forEach((object) => {
        object.date = moment.utc(new Date(object.date).toISOString())
        object.date = moment(object.date).format('DD MMM')
        object.high = parseInt(object.high)
        object.low = parseInt(object.low)
      })
    }
  })
})