import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import Accessibility from 'highcharts/modules/accessibility';
Accessibility(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather-dashboard';
  location_not_found: any;
  village: any;
  town: any;
  city: any;
  county: any;
  state: any;
  country: any;
  current_time: any;
  current_temperature: any;
  current_apparent_temperature: any;
  current_humidity: any;
  current_wind_speed: any;
  forecast_days_text: any;
  forecast_days: any;
  forecast_morning: any;
  daily_forecast_icons: any;
  daily_temperature_high: any;
  daily_temperature_high_time: any;
  daily_temperature_low: any;
  daily_temperature_low_time: any;
  daily_precip_intensity: any;
  zipped_temperature_high: any;
  zipped_temperature_low: any;
  zipped_temperature: any;
  zipped_humidity: any;
  zipped_cloud_cover: any;
  zipped_precip_probability: any;
  zipped_wind_speed: any;
  timezone: any;
  forecast_condition: any;
  position: any;

  // Geolocation

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      document.getElementById("location")!.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  // @ts-ignore
  showPosition(position) {
    // @ts-ignore
    document.getElementById("location").value = position.coords.latitude + ", " + position.coords.longitude
    document.forms[0].submit()
  }

  constructor() {

    // URL parameters

    let uri = window.location.search.substring(1);
    let params = new URLSearchParams(uri);
    var input_location = params.get("location") || "Austin, TX"
    var input = { "location": input_location };

    // Request

    var xhr = new XMLHttpRequest();
    var self = this;
    xhr.open("POST", "https://weather-dashboard-67ugd5bjtq-uc.a.run.app");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(input));

    xhr.onload = function () {
      var obj = JSON.parse(this.response)
      self.location_not_found = obj["location_not_found"];
      self.village = obj["village"];
      self.town = obj["town"];
      self.city = obj["city"];
      self.county = obj["county"];
      self.state = obj["state"];
      self.country = obj["country"];
      self.current_time = obj["current_time"];
      self.current_temperature = obj["current_temperature"];
      self.current_apparent_temperature = obj["current_apparent_temperature"];
      self.current_humidity = obj["current_humidity"];
      self.current_wind_speed = obj["current_wind_speed"];
      self.forecast_days_text = obj["forecast_days_text"];
      self.forecast_days = obj["forecast_days"];
      self.forecast_morning = obj["forecast_morning"];
      self.daily_forecast_icons = obj["daily_forecast_icons"];
      self.daily_temperature_high = obj["daily_temperature_high"];
      self.daily_temperature_high_time = obj["daily_temperature_high_time"];
      self.daily_temperature_low = obj["daily_temperature_low"];
      self.daily_temperature_low_time = obj["daily_temperature_low_time"];
      self.daily_precip_intensity = obj["daily_precip_intensity"];
      self.zipped_temperature_high = obj["zipped_temperature_high"];
      self.zipped_temperature_low = obj["zipped_temperature_low"];
      self.zipped_temperature = obj["zipped_temperature"];
      self.zipped_humidity = obj["zipped_humidity"];
      self.zipped_cloud_cover = obj["zipped_cloud_cover"];
      self.zipped_precip_probability = obj["zipped_precip_probability"];
      self.zipped_wind_speed = obj["zipped_wind_speed"];
      self.timezone = obj["timezone"];

      if (/Android|webOS|iPhone|iPod/i.test(navigator.userAgent)) {
        var annotations_labels_point_y_forecast = 200
        var annotations_labels_point_y_precip = 60
        var annotations_labels_text_precip_suffix = "<br />&nbsp;in"
        var xAxis_fontSize = "1.2em"
        var xAxis_labels_x = 20
        var xAxis_dateTimeLabelFormats_day = "%a"
      } else {
        annotations_labels_point_y_forecast = Math.max(...self.daily_temperature_high)
        annotations_labels_point_y_precip = 67
        annotations_labels_text_precip_suffix = " in"
        xAxis_fontSize = "1.6em"
        xAxis_labels_x = 85
        xAxis_dateTimeLabelFormats_day = "%A"
      }

      var i;
      var forecast_condition: { [index: string]: any } = {};
      for (i = 0; i < self.forecast_days.length; i++) {
        if (self.daily_forecast_icons[i] == "clear-day") {
          forecast_condition[i] = "Clear";
        }
        else if (self.daily_forecast_icons[i] == "rain") {
          forecast_condition[i] = "Rain";
        }
        else if (self.daily_forecast_icons[i] == "snow") {
          forecast_condition[i] = "Snow";
        }
        else if (self.daily_forecast_icons[i] == "sleet") {
          forecast_condition[i] = "Sleet";
        }
        else if (self.daily_forecast_icons[i] == "wind") {
          forecast_condition[i] = "Wind";
        }
        else if (self.daily_forecast_icons[i] == "fog") {
          forecast_condition[i] = "Fog";
        }
        else if (self.daily_forecast_icons[i] == "cloudy") {
          forecast_condition[i] = "Mostly Cloudy";
        }
        else if (self.daily_forecast_icons[i] == "partly-cloudy-day") {
          forecast_condition[i] = "Partly Cloudy";
        }
        else {
          forecast_condition[i] = "Clear";
        }
      }

      // @ts-ignore
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
          timezone: self.timezone,
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
                x: self.forecast_days[0],
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
                x: self.forecast_days[1],
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
                x: self.forecast_days[2],
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
                x: self.forecast_days[3],
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
                x: self.forecast_days[4],
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
                x: self.forecast_days[5],
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
                x: self.forecast_days[0],
                y: annotations_labels_point_y_precip,
              },
              text: self.daily_precip_intensity[0] + annotations_labels_text_precip_suffix,
              align: "left",
              x: 10,
            },
            {
              point: {
                xAxis: 0,
                yAxis: 1,
                x: self.forecast_days[1],
                y: annotations_labels_point_y_precip,
              },
              text: self.daily_precip_intensity[1] + annotations_labels_text_precip_suffix,
              align: "left",
              x: 10,
            },
            {
              point: {
                xAxis: 0,
                yAxis: 1,
                x: self.forecast_days[2],
                y: annotations_labels_point_y_precip,
              },
              text: self.daily_precip_intensity[2] + annotations_labels_text_precip_suffix,
              align: "left",
              x: 10,
            },
            {
              point: {
                xAxis: 0,
                yAxis: 1,
                x: self.forecast_days[3],
                y: annotations_labels_point_y_precip,
              },
              text: self.daily_precip_intensity[3] + annotations_labels_text_precip_suffix,
              align: "left",
              x: 10,
            },
            {
              point: {
                xAxis: 0,
                yAxis: 1,
                x: self.forecast_days[4],
                y: annotations_labels_point_y_precip,
              },
              text: self.daily_precip_intensity[4] + annotations_labels_text_precip_suffix,
              align: "left",
              x: 10,
            },
            {
              point: {
                xAxis: 0,
                yAxis: 1,
                x: self.forecast_days[5],
                y: annotations_labels_point_y_precip,
              },
              text: self.daily_precip_intensity[5] + annotations_labels_text_precip_suffix,
              align: "left",
              x: 10,
            },
          ],
        }],
        xAxis: {
          type: "datetime",
          min: self.forecast_days[0],
          max: self.forecast_days[6],
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
            value: self.current_time,
            width: 1,
          },
          {
            color: "lightgray",
            value: self.forecast_days[0],
            width: 2,
          },
          {
            color: "lightgray",
            value: self.forecast_days[1],
            width: 2,
          },
          {
            color: "lightgray",
            value: self.forecast_days[2],
            width: 2,
          },
          {
            color: "lightgray",
            value: self.forecast_days[3],
            width: 2,
          },
          {
            color: "lightgray",
            value: self.forecast_days[4],
            width: 2,
          },
          {
            color: "lightgray",
            value: self.forecast_days[5],
            width: 2,
          },
          {
            color: "lightgray",
            value: self.forecast_days[6],
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
          min: Math.min(...self.daily_temperature_low) - 5,
          max: Math.max(...self.daily_temperature_high) + 5,
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
          data: self.zipped_temperature,
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
          data: self.zipped_temperature_high,
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
          data: self.zipped_temperature_low,
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
          data: self.zipped_precip_probability,
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
          data: self.zipped_humidity,
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
          data: self.zipped_cloud_cover,
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
    };
  };
};
