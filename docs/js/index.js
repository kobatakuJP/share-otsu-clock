const MORNING_TIME = [4, 10];
const AROUNDNOON_TIME = [10, 16];
const EVENING_TIME = [16, 19];
// NIGHT_TIMEはそのほかとする。（24時をはさむのでめんどい）
const WEATHER_ICON_EP = "http://openweathermap.org/img/w/";
const WEATHER_INTERVAL_MS = 30 * 60 * 1000;
const clockVM = new Vue({
  el: "#clock",
  data: {
    date: Date.now(),
    // hue: 0,
    iconid: "",
    lastIconUpdate: 0
  },
  computed: {
    hour: (vm) => new Date(vm.date).getHours(),
    hour12: (vm) => vm.hour % 12,
    min: (vm) => new Date(vm.date).getMinutes(),
    sec: (vm) => new Date(vm.date).getSeconds(),
    ms: (vm) => new Date(vm.date).getMilliseconds(),
    ampm: (vm) => (vm.hour > 11 ? "pm" : "am"),
    hDashArray: (vm) => {
      const h = vm.ampm === "am" ? vm.hour : vm.hour - 12;
      const p = ((h + vm.min / 60) / 12) * 100;
      return createDashArray(p, 1 / 2);
    },
    mDashArray: (vm) => {
      const p = ((vm.min + vm.sec / 60) / 60) * 100;
      return createDashArray(p, 5 / 6);
    },
    sDashArray: (vm) => {
      const p = ((vm.sec + vm.ms / 1000) / 60) * 100;
      return createDashArray(p, 7 / 6);
    },
    hueOfTime: (vm) => {
      let hue = 0;
      if (isInRange(vm.hour, ...MORNING_TIME)) {
        hue = 188;
      } else if (isInRange(vm.hour, ...AROUNDNOON_TIME)) {
        hue = 47;
      } else if (isInRange(vm.hour, ...EVENING_TIME)) {
        hue = 1;
      } else {
        hue = 266;
      }
      return hue;
    },
    hHSL: (vm) => `hsl(${vm.hueOfTime}, 100%, 70%)`,
    mHSL: (vm) => `hsl(${vm.hueOfTime}, 100%, 50%)`,
    sHSL: (vm) => `hsl(${vm.hueOfTime}, 100%, 40%)`,
    iconHref: (vm) => (vm.iconid ? `${WEATHER_ICON_EP}${vm.iconid}.png` : ""),
  },
  methods: {
    updateWeatherIconIfNeed: function () {
      if (this.date - this.lastIconUpdate > WEATHER_INTERVAL_MS) {
        this.lastIconUpdate = this.date;
        updateWeatherIcon();
      }
    },
  },
});

/**
 * @param {*} p 円を100とした弧の長さ(0~100)
 * @param {*} correction 100 * correction = 実際の円周
 */
function createDashArray(p, correction) {
  return `${p * correction} ${(100 - p) * correction}`;
}

function tick() {
  clockVM.date = Date.now();
  clockVM.updateWeatherIconIfNeed();
  requestAnimationFrame(tick);
}

/** vがmin以上max未満ならtrue */
function isInRange(v, min, max) {
  return v >= min && v < max;
}

const GET_WEATHER_EP = "/.netlify/functions/get-weather";
function updateWeatherIcon() {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const w = await getWeather(pos.coords.latitude, pos.coords.longitude);
    if (w && w.weather && w.weather[0] && w.weather[0].icon) {
      clockVM.iconid = w.weather[0].icon;
    }
  });
}

/** OSMの天気を取得する。proxyに当たるAPIがなかったらあきらめる */
function getWeather(lat, lon) {
  return fetch(`${GET_WEATHER_EP}?lat=${lat}&lon=${lon}`).then((resp) =>
    resp.json()
  );
}

tick();
updateWeatherIcon();
