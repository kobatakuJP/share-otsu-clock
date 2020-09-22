const vm = new Vue({
  el: "#clock",
  data: {
    date: Date.now(),
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
      return createDashArray(p, 1 / 3);
    },
    mDashArray: (vm) => {
      const p = ((vm.min + vm.sec / 60) / 60) * 100;
      return createDashArray(p, 2 / 3);
    },
    sDashArray: (vm) => {
      const p = ((vm.sec + vm.ms / 1000) / 60) * 100;
      return createDashArray(p, 1);
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
  vm.date = Date.now();
  requestAnimationFrame(tick);
}

tick();
