const DEFAULT_PAGES = [
  { id: "pricing", title: "Pricing", slug: "pricing", body: "Starter is $29 per month and includes one docs site on a Citepage subdomain and /ask with citations. Pro is $49 per month and adds a custom domain and removes the Citepage mark. SSO and SCIM are not part of Pro. They are listed only under Business." },
  { id: "sso", title: "SSO", slug: "sso", body: "SSO and SCIM are available on the Business plan. Pro customers who need SSO should upgrade. We do not enable SSO on Starter or Pro even as an add-on." },
  { id: "api", title: "API keys", slug: "api", body: "Each workspace has one live API key. Rotate it from Settings. Keys never appear in /ask answers. Rate limits follow the published Pricing page." },
  { id: "ask", title: "How /ask works", slug: "ask", body: "Citepage retrieves passages from indexed pages only. If no passage matches, /ask must refuse. It must not invent plans, prices, or features. Every accepted answer includes a citation to a page title and a quoted span." }
];

function passagesFrom(page) {
  return page.body.split(/(?<=\.)\s+/).map((s) => s.trim()).filter((s) => s.length > 20).map((body, i) => ({
    id: `${page.id}-${i}`, page_id: page.id, title: page.title, body
  }));
}

function score(q, text) {
  const words = q.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const hay = text.toLowerCase();
  return words.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0);
}

function retrieve(pages, q) {
  const bag = pages.flatMap((p) => passagesFrom(p).map((pass) => ({ ...pass, score: score(q, pass.title + " " + pass.body) })));
  return bag.filter((p) => p.score > 0).sort((a, b) => b.score - a.score).slice(0, 3);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" }
  });
}

const memory = { pages: DEFAULT_PAGES.map((p) => ({ ...p })) };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "GET,POST,OPTIONS" } });
    }
    if (url.pathname === "/api/pages" && request.method === "GET") {
      return json({ pages: memory.pages.map(({ id, title, slug }) => ({ id, title, slug })) });
    }
    if (url.pathname.startsWith("/api/pages/") && request.method === "GET") {
      const slug = url.pathname.split("/").pop();
      const page = memory.pages.find((p) => p.slug === slug || p.id === slug);
      if (!page) return json({ error: "not found" }, 404);
      return json({ page });
    }
    if (url.pathname === "/api/ingest" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const title = String(body.title || "Untitled").slice(0, 120);
      const text = String(body.body || "").trim();
      if (text.length < 20) return json({ error: "body too short" }, 400);
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "page";
      const id = crypto.randomUUID();
      memory.pages = memory.pages.filter((p) => p.slug !== slug);
      memory.pages.push({ id, title, slug, body: text });
      return json({ ok: true, id, slug, passages: passagesFrom({ id, title, body: text }).length });
    }
    if (url.pathname === "/api/ask" && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const q = String(body.q || "").trim();
      if (!q) return json({ error: "empty question" }, 400);
      const hits = retrieve(memory.pages, q);
      if (!hits.length) {
        return json({ refused: true, answer: "That is not on these pages. Citepage will not invent it.", citations: [] });
      }
      const top = hits[0];
      return json({ refused: false, answer: top.body, citations: hits.map((h) => ({ title: h.title, quote: h.body, page_id: h.page_id })) });
    }
    if (env.ASSETS) return env.ASSETS.fetch(request);
    return new Response("Citepage", { headers: { "content-type": "text/plain" } });
  }
};
