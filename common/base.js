const time_update_list = [];
let time_updater_init = false;

function updateTime() {
  const d = new Date(new Date().getTime() + 8 * 3600 * 1000).toISOString().replace("T", " ");
  for (const item of time_update_list) {
    for (const element of document.querySelectorAll(item.selector)) {
      element.innerText = d.slice(item.start, item.end);
    }
  }
};

function setDynamicTime(selector, start = 0, end = 19) {
  time_update_list.push({
    selector: selector,
    start: start,
    end: end,
  });
  updateTime();
  if (!time_updater_init) {
    time_updater_init = true;
    window.setInterval(updateTime, 1000);
  }
}

function setStaticTime(selector, start = 0, end = 19, traceback_hours = 0) {
  for (const element of document.querySelectorAll(selector)) {
    const hours = element.attributes["data-traceback-hours"].value
      ? (parseFloat(element.attributes["data-traceback-hours"].value) + 
            (Math.random() - 0.5) * 
            parseFloat(element.attributes["data-traceback-range"].value || 0))
      : traceback_hours;
    const d = new Date(new Date().getTime() + 8 * 3600 * 1000 - hours * 3600 * 1000).toISOString().replace("T", " ");
    element.innerText = d.slice(start, end);
  }
}

const presetFilters = {
  name: (x) => x.length == 2 ? x[0] + "*" : x[0] + "*".repeat(x.length - 2) + x.slice(-1),
  lastnameonly: (x) => x[0] + "*".repeat(x.length - 1),
  firstnameonly: (x) => "*" + x.slice(1),
  lastcharonly: (x) => "*".repeat(x.length - 1) + x.slice(-1),
  idcard: (start = 2, end = 2, mask = 18 - start - end) => (x) => x.slice(0, start) + "*".repeat(mask) + x.slice(-end),
  phone: (start = 3, end = 4, mask = 11 - start - end) => (x) => x.slice(0, start) + "*".repeat(mask) + x.slice(-end),
};

function addStorageField(id, selector, name, placeholder, filter = (x) => x) {
  placeholder = filter(placeholder);
  const elements = document.querySelectorAll(selector);
  for (const element of elements) {
    element.innerText = localStorage.getItem(id) || placeholder;
    element.addEventListener("click", () => {
      let res = window.prompt("修改" + name + "：", element.innerText);
      if (res == "" || res == null) {
        localStorage.removeItem(id);
      } else {
        res = filter(res);
        localStorage.setItem(id, res);
      }
      for (const _element of elements) {
        _element.innerText = res || placeholder;
      }
    });
  }
}

const nav_scroll = () => {
  if (document.querySelector(".nav")) {
    window.addEventListener('scroll', () => {
      const percentage = Math.max(0, Math.min(window.pageYOffset / document.documentElement.clientHeight / 0.18, 1));
      document.querySelector(".nav").style.backgroundColor = `rgba(255, 255, 255, ${percentage})`;
      const color = 255 - Math.ceil(percentage * 255);
      document.querySelector(".nav").style.color = `rgb(${color}, ${color}, ${color})`;
      document.querySelector(".nav > img") && (document.querySelector(".nav > img").style.filter = `brightness(${(1 - percentage).toFixed(1)})`);
    });
  }
};
if (document.readyState === "complete" || document.readyState === "interactive") {
  setTimeout(nav_scroll, 1);
} else {
  document.addEventListener("DOMContentLoaded", nav_scroll);
}

function navigateHome() {
  window.location.href = '/';
}

function navigateToTripCard() {
  window.location.href = '/trip-card';
}