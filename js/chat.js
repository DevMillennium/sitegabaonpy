const chatToggle = document.getElementById("chat-toggle");
const chatWidget = document.getElementById("chat-widget");
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatLeadPanel = document.getElementById("chat-lead-panel");
const chatLeadForm = document.getElementById("chat-lead-form");
const chatDock = document.getElementById("ayuda-chat");
const chatDragHandle = document.getElementById("chat-drag-handle");
const DOCK_POS_KEY = "gabaon_chat_dock_pos";

const config = window.LANDING_CONFIG || {};

function getVariant() {
  if (window.garbaonAbVariant === "A" || window.garbaonAbVariant === "B") {
    return window.garbaonAbVariant;
  }
  const saved = window.localStorage.getItem("garbaon_ab_variant");
  if (saved === "A" || saved === "B") return saved;
  return "A";
}

function getPageLang() {
  return (document.documentElement.getAttribute("lang") || "es").slice(0, 12);
}

function buildWhatsAppUrl(text) {
  const n = config.whatsappNumber || "595992799800";
  return "https://wa.me/" + n + "?text=" + encodeURIComponent(text || "");
}

if (chatToggle && chatWidget && chatMessages && chatForm && chatInput) {
  const history = [];

  function setChatOpen(wantOpen) {
    if (wantOpen) {
      chatWidget.removeAttribute("hidden");
    } else {
      chatWidget.setAttribute("hidden", "");
    }
    chatToggle.setAttribute("aria-expanded", String(wantOpen));
    if (wantOpen) {
      window.requestAnimationFrame(function () {
        chatInput.focus();
      });
    }
  }

  function toggleChatPanel() {
    setChatOpen(chatWidget.hasAttribute("hidden"));
  }

  function openChatFromNavigation() {
    setChatOpen(true);
  }

  function syncChatFromHash() {
    if (window.location.hash === "#ayuda-chat") {
      openChatFromNavigation();
    }
  }

  if (chatDock && chatDragHandle) {
    function clampDockPosition() {
      const rect = chatDock.getBoundingClientRect();
      const pad = 8;
      let right = window.innerWidth - rect.right;
      let bottom = window.innerHeight - rect.bottom;
      const maxR = Math.max(pad, window.innerWidth - rect.width - pad);
      const maxB = Math.max(pad, window.innerHeight - rect.height - pad);
      right = Math.max(pad, Math.min(right, maxR));
      bottom = Math.max(pad, Math.min(bottom, maxB));
      chatDock.style.right = right + "px";
      chatDock.style.bottom = bottom + "px";
      chatDock.style.left = "auto";
      chatDock.style.top = "auto";
    }

    function loadDockPosition() {
      try {
        const raw = localStorage.getItem(DOCK_POS_KEY);
        if (!raw) return;
        const pos = JSON.parse(raw);
        if (typeof pos.right === "number" && typeof pos.bottom === "number") {
          chatDock.style.right = Math.max(8, pos.right) + "px";
          chatDock.style.bottom = Math.max(8, pos.bottom) + "px";
          chatDock.style.left = "auto";
          chatDock.style.top = "auto";
          window.requestAnimationFrame(clampDockPosition);
        }
      } catch (e) {
        /* ignore */
      }
    }

    loadDockPosition();
    window.addEventListener("resize", clampDockPosition);

    let dockDrag = null;

    chatDragHandle.addEventListener("pointerdown", function (e) {
      e.preventDefault();
      chatDragHandle.setPointerCapture(e.pointerId);
      const rect = chatDock.getBoundingClientRect();
      dockDrag = {
        id: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startRight: window.innerWidth - rect.right,
        startBottom: window.innerHeight - rect.bottom
      };
    });

    chatDragHandle.addEventListener("pointermove", function (e) {
      if (!dockDrag || e.pointerId !== dockDrag.id) return;
      const dx = e.clientX - dockDrag.startX;
      const dy = e.clientY - dockDrag.startY;
      let right = dockDrag.startRight - dx;
      let bottom = dockDrag.startBottom - dy;
      const rect = chatDock.getBoundingClientRect();
      const pad = 8;
      const maxR = Math.max(pad, window.innerWidth - rect.width - pad);
      const maxB = Math.max(pad, window.innerHeight - rect.height - pad);
      right = Math.max(pad, Math.min(right, maxR));
      bottom = Math.max(pad, Math.min(bottom, maxB));
      chatDock.style.right = right + "px";
      chatDock.style.bottom = bottom + "px";
      chatDock.style.left = "auto";
      chatDock.style.top = "auto";
    });

    function endDockDrag(e) {
      if (!dockDrag || e.pointerId !== dockDrag.id) return;
      try {
        chatDragHandle.releasePointerCapture(e.pointerId);
      } catch (err) {
        /* ignore */
      }
      const rect = chatDock.getBoundingClientRect();
      const pos = {
        right: Math.round(window.innerWidth - rect.right),
        bottom: Math.round(window.innerHeight - rect.bottom)
      };
      try {
        localStorage.setItem(DOCK_POS_KEY, JSON.stringify(pos));
      } catch (err2) {
        /* ignore */
      }
      dockDrag = null;
    }

    chatDragHandle.addEventListener("pointerup", endDockDrag);
    chatDragHandle.addEventListener("pointercancel", endDockDrag);
  }

  window.addEventListener("hashchange", syncChatFromHash);
  document.querySelectorAll('a[href="#ayuda-chat"]').forEach(function (link) {
    link.addEventListener("click", function () {
      window.requestAnimationFrame(function () {
        if (window.location.hash === "#ayuda-chat") {
          openChatFromNavigation();
        }
      });
    });
  });

  if (chatDock) {
    chatDock.addEventListener("focusin", function (e) {
      if (e.target === chatDock) {
        openChatFromNavigation();
      }
    });
  }

  syncChatFromHash();

  function addUserBubble(text) {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble user";
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function createAssistantTurnLoading() {
    const turn = document.createElement("div");
    turn.className = "chat-turn";
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble assistant";
    bubble.textContent = "Un segundo, ya te respondo...";
    turn.appendChild(bubble);
    chatMessages.appendChild(turn);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return turn;
  }

  function renderAssistantTurn(turn, data) {
    const orch = data.orchestration || {};
    turn.innerHTML = "";

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble assistant";
    bubble.textContent = data.reply || "";
    turn.appendChild(bubble);

    if (orch.cta) {
      const cta = document.createElement("p");
      cta.className = "chat-cta-line";
      cta.textContent = orch.cta;
      turn.appendChild(cta);
    }

    if (orch.handoff) {
      const wa = document.createElement("a");
      wa.className = "btn chat-handoff-btn";
      wa.href = buildWhatsAppUrl(orch.wa_prefill || data.reply || "");
      wa.target = "_blank";
      wa.rel = "noopener noreferrer";
      wa.textContent = "Continuar por WhatsApp";
      turn.appendChild(wa);
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
    updateLeadPanel(orch);
  }

  function updateLeadPanel(orch) {
    if (!chatLeadPanel || !chatLeadForm) return;
    if (orch.collect_lead) {
      chatLeadPanel.hidden = false;
      const emailRow = chatLeadForm.querySelector("#chat-lead-email");
      const emailLabel = chatLeadForm.querySelector('label[for="chat-lead-email"]');
      const fields = Array.isArray(orch.lead_fields) ? orch.lead_fields : [];
      const wantEmail = fields.some(function (f) {
        return String(f).toLowerCase().indexOf("mail") !== -1;
      });
      if (emailRow && emailLabel) {
        emailRow.required = wantEmail;
        emailLabel.textContent = wantEmail ? "Correo" : "Correo (opcional)";
      }
    } else {
      chatLeadPanel.hidden = true;
    }
  }

  function addAssistantWelcome() {
    const msg =
      "Hola, soy Fernanda, responsable por la atención al consumidor de Gabaon Store. " +
      "Estoy disponible 24 horas para ayudarte con precios, entrega, uso del producto y tu compra.";
    history.push({ role: "assistant", content: msg });
    const turn = document.createElement("div");
    turn.className = "chat-turn";
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble assistant";
    bubble.textContent = msg;
    turn.appendChild(bubble);
    chatMessages.appendChild(turn);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function askAssistant(message) {
    const body = {
      messages: history.concat([{ role: "user", content: message }]).slice(-12),
      variant: getVariant(),
      pageLang: getPageLang()
    };

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error("chat_http_" + res.status);
    }

    const data = await res.json();
    if (!data || typeof data.reply !== "string" || !data.reply.trim()) {
      throw new Error("invalid_payload");
    }
    return data;
  }

  if (chatDock) {
    chatDock.addEventListener("click", function (ev) {
      if (ev.target.closest && ev.target.closest("#chat-drag-handle")) {
        return;
      }
      if (!ev.target.closest || !ev.target.closest("#chat-toggle")) {
        return;
      }
      ev.preventDefault();
      toggleChatPanel();
    });
  } else {
    chatToggle.addEventListener("click", function (ev) {
      ev.preventDefault();
      toggleChatPanel();
    });
  }

  if (chatLeadForm) {
    chatLeadForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const submitBtn = chatLeadForm.querySelector(".chat-lead-submit");
      const nombre = (document.getElementById("chat-lead-nombre") || {}).value;
      const telefono = (document.getElementById("chat-lead-telefono") || {}).value;
      const ciudad = (document.getElementById("chat-lead-ciudad") || {}).value;
      const email = (document.getElementById("chat-lead-email") || {}).value;
      const consent = document.getElementById("chat-lead-consent");
      if (submitBtn) submitBtn.disabled = true;
      try {
        const leadRes = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: (nombre || "").trim(),
            telefono: (telefono || "").trim(),
            ciudad: (ciudad || "").trim() || "Paraguay",
            email: (email || "").trim(),
            producto: "Garbaon — seguimiento desde chat Fernanda",
            variante_ab: getVariant(),
            url: window.location.href,
            consentimiento_privacidad: consent && consent.checked
          })
        });
        const leadData = await leadRes.json().catch(function () {
          return {};
        });
        if (!leadRes.ok) {
          const hint = leadData.error || "No se pudo registrar.";
          addUserBubble("[Formulario] " + hint);
          const wa = buildWhatsAppUrl(
            "Hola Gabaon Store, dejé mis datos en el chat pero hubo un error. Quiero seguir la conversación."
          );
          const turn = document.createElement("div");
          turn.className = "chat-turn";
          const a = document.createElement("a");
          a.className = "btn chat-handoff-btn";
          a.href = wa;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = "Abrir WhatsApp";
          turn.appendChild(a);
          chatMessages.appendChild(turn);
          return;
        }
        chatLeadPanel.hidden = true;
        chatLeadForm.reset();
        const okMsg =
          "Listo, recibimos tus datos. El equipo te va a contactar por el canal que indicaste. " +
          "Si querés acelerar, también podés escribir por WhatsApp.";
        history.push({ role: "assistant", content: okMsg });
        const turn = document.createElement("div");
        turn.className = "chat-turn";
        const bubble = document.createElement("div");
        bubble.className = "chat-bubble assistant";
        bubble.textContent = okMsg;
        turn.appendChild(bubble);
        const wa = document.createElement("a");
        wa.className = "btn chat-handoff-btn";
        wa.href = buildWhatsAppUrl("Hola Gabaon Store, acabo de enviar mis datos desde el chat web.");
        wa.target = "_blank";
        wa.rel = "noopener noreferrer";
        wa.textContent = "WhatsApp Gabaon Store";
        turn.appendChild(wa);
        chatMessages.appendChild(turn);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  chatForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    addUserBubble(message);
    history.push({ role: "user", content: message });
    chatInput.value = "";
    chatInput.disabled = true;

    if (chatLeadPanel) chatLeadPanel.hidden = true;

    const turn = createAssistantTurnLoading();

    try {
      const data = await askAssistant(message);
      renderAssistantTurn(turn, data);
      history.push({ role: "assistant", content: data.reply });
    } catch (error) {
      turn.innerHTML = "";
      const bubble = document.createElement("div");
      bubble.className = "chat-bubble assistant";
      bubble.textContent =
        "Ahora mismo estoy con alta demanda. Podés abrir WhatsApp y te atienden enseguida.";
      turn.appendChild(bubble);
      const wa = document.createElement("a");
      wa.className = "btn chat-handoff-btn";
      wa.href = buildWhatsAppUrl(
        "Hola Gabaon Store, te escribo desde el chat de la web. Necesito ayuda con Garbaon."
      );
      wa.target = "_blank";
      wa.rel = "noopener noreferrer";
      wa.textContent = "Abrir WhatsApp";
      turn.appendChild(wa);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    } finally {
      chatInput.disabled = false;
      chatInput.focus();
    }
  });

  addAssistantWelcome();
}
