// Builds dist/desk.js (everything) and dist/version.js (one line) from gordons-desk.html + package.json.
// shell.html is the thin loader each person publishes; it never changes for a normal release.
const fs = require("fs");
const path = require("path");
const src = fs.readFileSync(path.join(__dirname, "gordons-desk.html"), "utf8");
const css = src.match(/<style>([\s\S]*?)<\/style>/)[1];
const body = src.slice(src.indexOf("</style>") + 8, src.indexOf("<script>")).trim();
const js = src.match(/<script>([\s\S]*)<\/script>/)[1];
const ver = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8")).version;
const out = `/* Gordon's Desk v${ver} — Wheel & Anchor. Built ${new Date().toISOString().slice(0,10)}.
   Loaded by each person's own artifact shell. Holds no data: reads Monday, Gmail and Calendar live through the viewer's connectors. */
(function(){
  var VER = "${ver}", CDN = "https://cdn.jsdelivr.net/npm/wa-gordons-desk";
  if(window.__GD_DESK_LOADED) return;

  function boot(){
    if(window.__GD_DESK_LOADED) return; window.__GD_DESK_LOADED = VER;
    var st = document.createElement("style"); st.textContent = ${JSON.stringify(css)}; document.head.appendChild(st);
    var root = document.getElementById("desk-root") || document.body;
    root.innerHTML = ${JSON.stringify(body)};
    ${js}
  }

  /* Self-update. Browsers keep the "@1" copy of this file for up to 7 days (jsDelivr's cache-control),
     so a plain refresh can run a stale build. On every open we fetch a one-line, cache-busted version.js;
     if it names a newer 1.x than this file, we load that exact version instead and let it boot. */
  if(window.__GD_DESK_EXACT){ boot(); return; }
  function newer(a, b){ a = String(a).split("."); b = String(b).split("."); for(var i = 0; i < 3; i++){ var x = +a[i] || 0, y = +b[i] || 0; if(x !== y) return x > y; } return false; }
  var decided = false;
  function decide(){
    if(decided) return; decided = true;
    var latest = window.__GD_DESK_LATEST;
    if(latest && /^1\\./.test(latest) && newer(latest, VER)){
      window.__GD_DESK_EXACT = true;
      var s = document.createElement("script"); s.src = CDN + "@" + latest + "/dist/desk.js"; s.onerror = boot;
      document.head.appendChild(s);
      setTimeout(boot, 8000);   /* newer build never arrived — run this one rather than nothing */
    } else boot();
  }
  var v = document.createElement("script");
  v.src = CDN + "@1/dist/version.js?t=" + Date.now(); v.onload = decide; v.onerror = decide;
  document.head.appendChild(v);
  setTimeout(decide, 2500);     /* slow network — don't keep the page blank waiting on the check */
})();
`;
fs.mkdirSync(path.join(__dirname, "dist"), {recursive:true});
fs.writeFileSync(path.join(__dirname, "dist", "desk.js"), out);
fs.writeFileSync(path.join(__dirname, "dist", "version.js"), `window.__GD_DESK_LATEST="${ver}";\n`);
new Function(out);
console.log("desk.js", out.length, "bytes, v" + ver);
