// Endereço do Worker que recebe os pedidos (troque pelo seu depois do deploy na Cloudflare).
const WORKER_URL = "https://crumbs-convites.SEU-SUBDOMINIO.workers.dev/convite";

const fmt = new Intl.NumberFormat("pt-BR");

async function carregarContador() {
  try {
    const r = await fetch("stats.json", { cache: "no-store" });
    if (!r.ok) return;
    const s = await r.json();
    if (!(s.downloads > 0 || s.convites > 0)) return;
    document.getElementById("n-downloads").textContent = fmt.format(s.downloads || 0);
    document.getElementById("n-convites").textContent = fmt.format(s.convites || 0);
    document.getElementById("contador").hidden = false;
  } catch {
    /* sem contador: a página continua igual */
  }
}

function configurarFormulario() {
  const form = document.getElementById("form-convite");
  const status = document.getElementById("f-status");
  const botao = document.getElementById("f-enviar");
  const avisar = (msg, tipo) => { status.textContent = msg; status.className = `status ${tipo}`; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    dados.github = String(dados.github || "").trim().replace(/^@/, "");
    if (!dados.github) return avisar("Informe seu usuário do GitHub.", "erro");
    if (!dados.sistema) return avisar("Escolha o seu sistema.", "erro");

    botao.disabled = true;
    avisar("Enviando…", "");
    try {
      const r = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const resp = await r.json().catch(() => ({}));
      if (r.ok) {
        form.reset();
        avisar(resp.repetido
          ? "Já tínhamos o seu pedido. Assim que for aprovado, o convite chega no e-mail da sua conta do GitHub."
          : "Pedido recebido! Se aprovado, o convite chega no e-mail da sua conta do GitHub.", "ok");
      } else {
        avisar(resp.erro || "Não foi possível enviar agora. Tente de novo em instantes.", "erro");
      }
    } catch {
      avisar("Não foi possível enviar agora. Tente de novo em instantes.", "erro");
    } finally {
      botao.disabled = false;
    }
  });
}

carregarContador();
configurarFormulario();
