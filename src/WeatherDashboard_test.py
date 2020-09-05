from . import WeatherDashboard

def test_WeatherDashboard():
    assert WeatherDashboard.apply("Jane") == "hello Jane"
