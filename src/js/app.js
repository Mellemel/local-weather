$(document).ready(() => {
  let ipLocOptions = {
    url: 'https://freegeoip.net/',
    format: 'json/',
    ip: myip
  }

  // get location of ip address
  $.getJSON(ipLocOptions.url + ipLocOptions.format + ipLocOptions.ip, (info) => {
    let city = info['city'], state = info['region_code']

    if (/the/gi.test(city)) {
      city = city.split(' ')[1]
    }

    // get weather info from yahooapis
    let w = {
      url: 'https://query.yahooapis.com/v1/public/yql?q=',
      query: encodeURI('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + city + ', ' + state + '")'),
      setting: '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
    }

    let weatherURL = w.url + w.query + w.setting
    $.getJSON(weatherURL).then((intel) => {
      var data = intel.query.results.channel,
        location = data.location,
        currentCondition = data.item.condition,
        forecast = data.item.forecast

      $('#today').html(
        '<h3>' + location.city + ', ' + location.region + '</h3>' +
        '<h3>' + currentCondition.date + '</h3>' +
        '<h3>' + currentCondition.temp + '<span>&deg;F</span></h3>' +
        '<h3>' + currentCondition.text + '</h3>'
      )

      $('.day').html((index) => {
        return '<td>' + forecast[index].day + '</td>' +
          '<td>' + forecast[index].date + '</td>' +
          '<td>' + forecast[index].high + '<span>&deg;F</span></td>' + 
          '<td>' + forecast[index].low + '<span>&deg;F</span></td>' +
          '<td>' + forecast[index].text + '</td>'
      })
    })
  })
  function formatDate(Date){
    
  }
})