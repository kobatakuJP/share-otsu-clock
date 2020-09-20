const vm = new Vue({
  el: "#clock",
  data: {
    date: Date.now(),
  },
  computed: {
    hour: (vm) => new Date(vm.date).getHours(),
    min: (vm) => new Date(vm.date).getMinutes(),
    sec: (vm) => new Date(vm.date).getSeconds(),
    ampm: (vm) => (vm.hour > 11 ? "pm" : "am"),
    hDashArray: (vm) => {
      const p = ((vm.ampm === "am" ? vm.hour : vm.hour - 12) / 12) * 100;
      return createDashArray(p, 1 / 3);
    },
    mDashArray: (vm) => {
      const p = (vm.min / 60) * 100;
      return createDashArray(p, 2 / 3);
    },
    sDashArray: (vm) => {
      const p = (vm.sec / 60) * 100;
      return createDashArray(p, 1);
    },
  },
});

function createDashArray(p, correction) {
  return `${p * correction} ${(100 - p) * correction}`;
}

function tick() {
    vm.date = Date.now();
    requestAnimationFrame(tick)
}

tick();