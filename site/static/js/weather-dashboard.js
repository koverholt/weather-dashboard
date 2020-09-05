/*
 Geolocation script
*/

var x = document.getElementById("location");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  document.getElementById("location").value = position.coords.latitude + ", "  + position.coords.longitude
  document.forms[0].submit()
}

/*
 URL parameters
*/

var param = new Vue({
  created()
  {
    let uri = window.location.search.substring(1);
    let params = new URLSearchParams(uri);
    window.value = params.get("location");
  },
});

/*
 Query
*/

var input_location = window.value || "Austin, TX"

var input = {"location": input_location};
Algorithmia.client("simTS7wndR7Mfcm5OGkylKw5JFt1")
  .algo("koverholt/weather_dashboard/0.1.0?timeout=300")
  .pipe(input)
  .then(function(output) {
    var obj = output.result;
    var location_not_found = obj["location_not_found"];
    var village = obj["village"];
    var town = obj["town"];
    var city = obj["city"];
    var county = obj["county"];
    var state = obj["state"];
    var country = obj["country"];
    var current_time = obj["current_time"];
    var current_temperature = obj["current_temperature"];
    var current_apparent_temperature = obj["current_apparent_temperature"];
    var current_humidity = obj["current_humidity"];
    var current_wind_speed = obj["current_wind_speed"];
    var forecast_days_text = obj["forecast_days_text"];
    var forecast_days = obj["forecast_days"];
    var forecast_morning = obj["forecast_morning"];
    var daily_forecast_icons = obj["daily_forecast_icons"];
    var daily_temperature_high = obj["daily_temperature_high"];
    var daily_temperature_high_time = obj["daily_temperature_high_time"];
    var daily_temperature_low = obj["daily_temperature_low"];
    var daily_temperature_low_time = obj["daily_temperature_low_time"];
    var daily_precip_intensity = obj["daily_precip_intensity"];
    var zipped_temperature_high = obj["zipped_temperature_high"];
    var zipped_temperature_low = obj["zipped_temperature_low"];
    var zipped_temperature = obj["zipped_temperature"];
    var zipped_humidity = obj["zipped_humidity"];
    var zipped_cloud_cover = obj["zipped_cloud_cover"];
    var zipped_precip_probability = obj["zipped_precip_probability"];
    var zipped_wind_speed = obj["zipped_wind_speed"];
    var timezone = obj["timezone"];

    var app = new Vue({
      el: "#app",
      data: {
        current_temperature: current_temperature,
        current_apparent_temperature: current_apparent_temperature,
        current_humidity: current_humidity,
        current_wind_speed: current_wind_speed,
        village: village,
        town: town,
        city: city,
        state: state,
        country: country,
      }
    })

    if( /Android|webOS|iPhone|iPod/i.test(navigator.userAgent) ) {
      annotations_labels_point_y_forecast = 200
      annotations_labels_point_y_precip = 60
      annotations_labels_text_precip_suffix = "<br />&nbsp;in"
      xAxis_fontSize = "1.2em"
      xAxis_labels_x = 20
      xAxis_dateTimeLabelFormats_day = "%a"
    } else {
      annotations_labels_point_y_forecast = Math.max(...daily_temperature_high)
      annotations_labels_point_y_precip = 67
      annotations_labels_text_precip_suffix = " in"
      xAxis_fontSize = "1.6em"
      xAxis_labels_x = 85
      xAxis_dateTimeLabelFormats_day = "%A"
    }

    var i;
    var forecast_condition = {};
    for (i = 0; i < forecast_days.length; i++) {
      if (daily_forecast_icons[i] == "clear-day") {
        forecast_condition[i] = "<center>Clear</center>";
      }
      else if (daily_forecast_icons[i] == "rain") {
        forecast_condition[i] = "<center>Rain</center>";
      }
      else if (daily_forecast_icons[i] == "snow") {
        forecast_condition[i] = "<center>Snow</center>";
      }
      else if (daily_forecast_icons[i] == "sleet") {
        forecast_condition[i] = "<center>Sleet</center>";
      }
      else if (daily_forecast_icons[i] == "wind") {
        forecast_condition[i] = "<center>Wind</center>";
      }
      else if (daily_forecast_icons[i] == "fog") {
        forecast_condition[i] = "<center>Fog</center>";
      }
      else if (daily_forecast_icons[i] == "cloudy") {
        forecast_condition[i] = "<center>Mostly Cloudy</center>";
      }
      else if (daily_forecast_icons[i] == "partly-cloudy-day") {
        forecast_condition[i] = "<center>Partly Cloudy</center>";
      }
      else {
        forecast_condition[i] = "<center>Clear</center>";
      }
    }

    Highcharts.chart("container", {
            title: {
                text: null,
            },
            chart: {
                backgroundColor: "#eeeeee",
            },
            legend: {
                enabled: false,
            },
            credits: {
                enabled: false,
            },
            time: {
                timezone: timezone,
            },
            annotations: [{
                labelOptions: {
                    shape: "rect",
                    backgroundColor: "rgba(0, 0, 0, 0.80)",
                    useHTML: true,
                },
                labels: [
                    {
                    point: {
                        xAxis: 0,
                        yAxis: 0,
                        x: forecast_days[0],
                        y: annotations_labels_point_y_forecast,
                    },
                    text: forecast_condition[0],
                    align: "left",
                    x: 10,
                    y: 0,
                    },
                    {
                    point: {
                        xAxis: 0,
                        yAxis: 0,
                        x: forecast_days[1],
                        y: annotations_labels_point_y_forecast,
                    },
                    text: forecast_condition[1],
                    align: "left",
                    x: 10,
                    y: 0,
                    },
                    {
                    point: {
                        xAxis: 0,
                        yAxis: 0,
                        x: forecast_days[2],
                        y: annotations_labels_point_y_forecast,
                    },
                    text: forecast_condition[2],
                    align: "left",
                    x: 10,
                    y: 0,
                    },
                    {
                    point: {
                        xAxis: 0,
                        yAxis: 0,
                        x: forecast_days[3],
                        y: annotations_labels_point_y_forecast,
                    },
                    text: forecast_condition[3],
                    align: "left",
                    x: 10,
                    y: 0,
                    },
                    {
                    point: {
                        xAxis: 0,
                        yAxis: 0,
                        x: forecast_days[4],
                        y: annotations_labels_point_y_forecast,
                    },
                    text: forecast_condition[4],
                    align: "left",
                    x: 10,
                    y: 0,
                    },
                    {
                    point: {
                        xAxis: 0,
                        yAxis: 0,
                        x: forecast_days[5],
                        y: annotations_labels_point_y_forecast,
                    },
                    text: forecast_condition[5],
                    align: "left",
                    x: 10,
                    y: 0,
                    },
                ],
            }, {
                labelOptions: {
                    shape: "rect",
                    backgroundColor: "rgba(0, 0, 0, 0.80)",
                    useHTML: true,
                },
                labels: [
                  {
                    point: {
                        xAxis: 0,
                        yAxis: 1,
                        x: forecast_days[0],
                        y: annotations_labels_point_y_precip,
                    },
                    text: daily_precip_intensity[0] + annotations_labels_text_precip_suffix,
                    align: "left",
                    x: 10,
                  },
                  {
                    point: {
                        xAxis: 0,
                        yAxis: 1,
                        x: forecast_days[1],
                        y: annotations_labels_point_y_precip,
                    },
                    text: daily_precip_intensity[1] + annotations_labels_text_precip_suffix,
                    align: "left",
                    x: 10,
                  },
                  {
                    point: {
                        xAxis: 0,
                        yAxis: 1,
                        x: forecast_days[2],
                        y: annotations_labels_point_y_precip,
                    },
                    text: daily_precip_intensity[2] + annotations_labels_text_precip_suffix,
                    align: "left",
                    x: 10,
                  },
                  {
                    point: {
                        xAxis: 0,
                        yAxis: 1,
                        x: forecast_days[3],
                        y: annotations_labels_point_y_precip,
                    },
                    text: daily_precip_intensity[3] + annotations_labels_text_precip_suffix,
                    align: "left",
                    x: 10,
                  },
                  {
                    point: {
                        xAxis: 0,
                        yAxis: 1,
                        x: forecast_days[4],
                        y: annotations_labels_point_y_precip,
                    },
                    text: daily_precip_intensity[4] + annotations_labels_text_precip_suffix,
                    align: "left",
                    x: 10,
                  },
                  {
                    point: {
                        xAxis: 0,
                        yAxis: 1,
                        x: forecast_days[5],
                        y: annotations_labels_point_y_precip,
                    },
                    text: daily_precip_intensity[5] + annotations_labels_text_precip_suffix,
                    align: "left",
                    x: 10,
                  },
                ],
            }],
            xAxis: {
                type: "datetime",
                min: forecast_days[0],
                max: forecast_days[6],
                opposite: true,
                alternateGridColor: "#f3f3f3",
                showLastLabel: false,
                labels: {
                    x: xAxis_labels_x,
                    style: {
                        fontSize: xAxis_fontSize,
                        fontWeight: "bold",
                    },
                },
                units: [
                    ["day", [1]]
                ],
                dateTimeLabelFormats: {
                    day: xAxis_dateTimeLabelFormats_day,
                },
                title: {
                    text: null
                },
                crosshair: {
                    color: "orange"
                },
                plotLines: [{
                    color: "black",
                    value: current_time,
                    width: 1,
                },
                {
                    color: "lightgray",
                    value: forecast_days[0],
                    width: 2,
                },
                {
                    color: "lightgray",
                    value: forecast_days[1],
                    width: 2,
                },
                {
                    color: "lightgray",
                    value: forecast_days[2],
                    width: 2,
                },
                {
                    color: "lightgray",
                    value: forecast_days[3],
                    width: 2,
                },
                {
                    color: "lightgray",
                    value: forecast_days[4],
                    width: 2,
                },
                {
                    color: "lightgray",
                    value: forecast_days[5],
                    width: 2,
                },
                {
                    color: "lightgray",
                    value: forecast_days[6],
                    width: 2,
                },
                ],
            },
            yAxis: [{
                title: {
                    text: "Temperature",
                    style: {
                        fontSize: "1.2em",
                        fontWeight: "bold",
                    },
                },
                labels: {
                    enabled: false,
                    format: "{value} °F"
                },
                min: Math.min(...daily_temperature_low) - 5,
                max: Math.max(...daily_temperature_high) + 5,
                startOnTick: false,
                endOnTick: false,
                height: "30%",
                top: "0%",
                offset: 0,
                plotLines: [{
                    color: "lightblue",
                    value: 32,
                    width: 2,
                }],
            }, {
                title: {
                    text: "Precipitation",
                    style: {
                        fontSize: "1.2em",
                        fontWeight: "bold",
                    },
                },
                labels: {
                    enabled: false,
                    format: "{value} %"
                },
                min: 0,
                max: 100,
                height: "30%",
                top: "35%",
                offset: 0,
            }, {
                title: {
                    text: "Moisture",
                    style: {
                        fontSize: "1.2em",
                        fontWeight: "bold",
                    },
                },
                labels: {
                    enabled: false,
                    format: "{value} %"
                },
                min: 0,
                max: 100,
                height: "30%",
                top: "70%",
                offset: 0,
            }],
            series: [{
                    name: "Temperature",
                    type: "line",
                    color: "red",
                    data: zipped_temperature,
                    yAxis: 0,
                    marker: {
                        enabled: false
                    },
                    label: {
                      enabled: false,
                    },
                }, {
                    name: "High Temperature",
                    type: "line",
                    color: "black",
                    lineWidth: 0,
                    data: zipped_temperature_high,
                    yAxis: 0,
                    enableMouseTracking: false,
                    stickyTracking: false,
                    marker: {
                        enabled: true,
                        symbol: "circle",
                    },
                    tooltip: {
                        valueDecimals: 2,
                    },
                    states: {
                        hover: {
                            enabled: false,
                        },
                        inactive: {
                            enabled: false,
                        },
                    },
                    dataLabels: {
                        enabled: true,
                        crop: false,
                        overflow: "allow",
                        verticalAlign: "bottom",
                    },
                    label: {
                      enabled: false,
                    },
                },
                {
                    name: "Low Temperature",
                    type: "line",
                    color: "black",
                    lineWidth: 0,
                    data: zipped_temperature_low,
                    yAxis: 0,
                    enableMouseTracking: false,
                    stickyTracking: false,
                    marker: {
                        enabled: true,
                        symbol: "circle",
                    },
                    tooltip: {
                        valueDecimals: 2,
                    },
                    states: {
                        hover: {
                            enabled: false,
                        },
                        inactive: {
                            enabled: false,
                        },
                    },
                    dataLabels: {
                        enabled: true,
                        crop: false,
                        overflow: "allow",
                        verticalAlign: "top",
                    },
                    label: {
                      enabled: false,
                    },
                }, {
                    name: "Precipitation Probability",
                    type: "column",
                    color: "blue",
                    data: zipped_precip_probability,
                    yAxis: 1,
                    marker: {
                        enabled: false
                    },
                    label: {
                      enabled: false,
                    },
                }, {
                    name: "Humidity",
                    type: "line",
                    color: "green",
                    data: zipped_humidity,
                    yAxis: 2,
                    marker: {
                        enabled: false
                    },
                    label: {
                      enabled: false,
                    },
                }, {
                    name: "Cloud Cover",
                    type: "line",
                    color: "gray",
                    dashStyle: "Dash",
                    data: zipped_cloud_cover,
                    yAxis: 2,
                    marker: {
                        enabled: false
                    },
                    label: {
                      enabled: false,
                    },
                }
            ],
            tooltip: {
                split: true,
            },
        });
});
