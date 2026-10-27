// Builds desk.js (everything) and shell.html (thin loader) from gordons-desk.html
const fs = require("fs");
const src = fs.readFileSync("/home/claude/gordons-desk.html", "utf8");
const css = src.match(/<style>([\s\S]*?)<\/style>/)[1];
const body = src.slice(src.indexOf("</style>") + 8, src.indexOf("<script>")).trim();
const js = src.match(/<script>([\s\S]*)<\/script>/)[1];
const ver = JSON.parse(fs.readFileSync("/home/claude/desk-pkg/package.json", "utf8")).version;
const out = `/* Gordon's Desk v${ver} — Wheel & Anchor. Built ${new Date().toISOString().slice(0,10)}.
   Loaded by each person's own artifact shell. Holds no data: reads Monday, Gmail and Calendar live through the viewer's connectors. */
(function(){
  if(window.__GD_DESK_LOADED) return; window.__GD_DESK_LOADED = "${ver}";
  var st = document.createElement("style"); st.textContent = ${JSON.stringify(css)}; document.head.appendChild(st);
  var root = document.getElementById("desk-root") || document.body;
  root.innerHTML = ${JSON.stringify(body)};
  ${js}
})();
`;
fs.mkdirSync("/home/claude/desk-pkg/dist", {recursive:true});
fs.writeFileSync("/home/claude/desk-pkg/dist/desk.js", out);
new Function(out);
console.log("desk.js", out.length, "bytes, v" + ver);
