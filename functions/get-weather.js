import fetch from "node-fetch";

const API_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";

exports.handler = async (event, context) => {
  const lat = event.queryStringParameters.lat;
  const lon = event.queryStringParameters.lon;
  const { OSM_API_KEY } = process.env;
  if (lat && lon && OSM_API_KEY) {
    const url = `${API_ENDPOINT}?lat=${lat}&lon=${lon}&appid=${OSM_API_KEY}`;
    return fetch(url, { headers: { Accept: "application/json" } })
      .then((response) => response.json())
      .then((data) => {
        return {
          statusCode: 200,
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        };
      })
      .catch((error) => {
        console.log(String(error));
        return { statusCode: 422, body: "error occur. see server logs." };
      });
  }
};
