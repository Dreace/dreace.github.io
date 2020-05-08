const getRealPath = (pathname, desc = false) => {
  if (!pathname) {
    pathname = window.location.pathname;
  }
  let names = pathname.split("/");
  if (desc === false) {
    for (let i = names.length - 1; i >= 0; --i) {
      let name = names[i].trim();
      if (name.length > 0 && name !== "/" && name !== "index.html") {
        return name;
      }
    }
  } else {
    for (let i = 0; i < names.length; ++i) {
      let name = names[i].trim();
      if (name.length > 0 && name !== "/" && name !== "index.html") {
        return name;
      }
    }
  }
  return "/";
};
let links = document.querySelectorAll(".nexmoe-list-item");
let rootRealPath = getRealPath(window.location.pathname, true);
for (let link of links) {
  let linkPath = link.getAttribute("href");
  if (linkPath && getRealPath(linkPath, true) === rootRealPath) {
    link.className = "active nexmoe-list-item mdui-list-item mdui-ripple";
  }
}

var $ = mdui.JQ;
$("table")
  .has("img")
  .addClass("nexmoe-album");

// $("#nexmoe-content img,#nexmoe-header img").each(function() {
//   $(this).attr("data-src", $(this).attr("src"));
//   $(this).attr("src", "");
//   $(this).addClass("lazyload");
//   $(this).attr("referrerPolicy", "no-referrer");
// });


$("#nexmoe-sidebar a").addClass("mdui-ripple");
mdui.mutation();
