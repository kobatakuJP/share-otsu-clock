import fetch from "node-fetch";

const API_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";

exports.handler = async (event, context) => {
  const lat = event.queryStringParameters.lat;
  const lon = event.queryStringParameters.lon;
  const { OSM_API_KEY } = process.env;
  console.log(lat, lon, OSM_API_KEY);
  if (lat && lon && OSM_API_KEY) {
    const url = `${API_ENDPOINT}?lat=${lat}&lon=${lon}&appid=${OSM_API_KEY}`;
    return fetch(url, { headers: { Accept: "application/json" } })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return {
          statusCode: 200,
          body: JSON.stringify(data)
        };
      })
      .catch((error) => ({ statusCode: 422, body: String(error) }));
  }
};
