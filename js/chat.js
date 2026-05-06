const chatToggle = document.getElementById("chat-toggle");
const chatWidget = document.getElementById("chat-widget");
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

if (chatToggle && chatWidget && chatMessages && chatForm && chatInput) {
  const history = [];

  function addMessage(role, content) {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble " + (role === "assistant" ? "assistant" : "user");
    bubble.textContent = content;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addAssistantWelcome() {
    const msg =
      "Hola, soy Fernanda de Gabaon Store. " +
      "Te oriento sobre la marca, los productos y tu rutina. " +
      "Cuando tengas definido qué querés y la zona de entrega, te acompaño al cierre por WhatsApp.";
    history.push({ role: "assistant", content: msg });
    addMessage("assistant", msg);
  }

  async function askAssistant(message) {
    const body = {
      messages: history.concat([{ role: "user", content: message }]).slice(-12)
    };

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error("No fue posible responder en este momento.");
    }

    const data = await res.json();
    if (!data || typeof data.reply !== "string" || !data.reply.trim()) {
      throw new Error("Respuesta inválida del asistente.");
    }
    return data.reply.trim();
  }

  function setChatOpen(wantOpen) {
    if (wantOpen) {
      chatWidget.removeAttribute("hidden");
      chatToggle.setAttribute("aria-expanded", "true");
      chatInput.focus();
      return;
    }
    chatWidget.setAttribute("hidden", "");
    chatToggle.setAttribute("aria-expanded", "false");
  }

  chatToggle.addEventListener("click", (event) => {
    event.preventDefault();
    const isOpen = !chatWidget.hasAttribute("hidden");
    setChatOpen(!isOpen);
  });

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    addMessage("user", message);
    history.push({ role: "user", content: message });
    chatInput.value = "";
    chatInput.disabled = true;

    const loadingText = "Un segundo, ya te respondo...";
    addMessage("assistant", loadingText);

    try {
      const reply = await askAssistant(message);
      chatMessages.lastChild.textContent = reply;
      history.push({ role: "assistant", content: reply });
    } catch (error) {
      chatMessages.lastChild.textContent =
        "Ahora mismo no puedo responder. Intentá de nuevo en unos segundos. " +
        "Si ya definiste producto y ciudad, podés usar el botón verde de reserva de la página.";
    } finally {
      chatInput.disabled = false;
      chatInput.focus();
    }
  });

  document.querySelectorAll('a[href="#ayuda-chat"]').forEach((link) => {
    link.addEventListener("click", () => {
      window.requestAnimationFrame(() => setChatOpen(true));
    });
  });

  if (window.location.hash === "#ayuda-chat") {
    setChatOpen(true);
  }

  addAssistantWelcome();
}
