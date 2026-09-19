async function api(path, opts) {
  const res = await fetch(path, { headers: { "content-type": "application/json" }, ...opts });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

const listEl = document.getElementById("list");
const view = document.getElementById("view");
const out = document.getElementById("out");

async function loadPages() {
  const { pages } = await api("/api/pages");
  listEl.innerHTML = pages.map((p) => `<a class="page" href="#" data-slug="${p.slug}">${p.title}</a>`).join("");
  listEl.querySelectorAll(".page").forEach((el) => {
    el.addEventListener("click", async (e) => {
      e.preventDefault();
      listEl.querySelectorAll(".page").forEach((n) => n.classList.remove("on"));
      el.classList.add("on");
      const { page } = await api("/api/pages/" + el.dataset.slug);
      view.innerHTML = `<h3>${page.title}</h3><p>${page.body}</p>`;
    });
  });
  const first = listEl.querySelector(".page");
  if (first) first.click();
}

async function ask() {
  const q = document.getElementById("q").value.trim();
  if (!q) return;
  const data = await api("/api/ask", { method: "POST", body: JSON.stringify({ q }) });
  if (data.refused) {
    out.innerHTML = `<div class="sheet"><header><span>/ask</span><span>refused</span></header><div class="a">${data.answer}</div></div>`;
    return;
  }
  const cites = (data.citations || []).map((c, i) => `<b>[${i + 1}] ${c.title}</b><br />"${c.quote}"`).join("<br /><br />");
  out.innerHTML = `<div class="sheet"><header><span>/ask</span><span>cited</span></header><div class="q">${q}</div><div class="a">${data.answer}</div><div class="cite">${cites}</div></div>`;
}

document.getElementById("go").addEventListener("click", () => ask().catch((e) => { out.textContent = e.message; }));
document.getElementById("q").addEventListener("keydown", (e) => { if (e.key === "Enter") ask(); });
document.getElementById("ingest").addEventListener("click", async () => {
  const msg = document.getElementById("ingest-msg");
  try {
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const r = await api("/api/ingest", { method: "POST", body: JSON.stringify({ title, body }) });
    msg.textContent = `Indexed ${r.passages} passages.`;
    document.getElementById("body").value = "";
    await loadPages();
  } catch (e) {
    msg.textContent = e.message;
  }
});

loadPages().catch((e) => { view.textContent = "Start the worker: npm run dev — " + e.message; });
