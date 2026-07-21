document.addEventListener("DOMContentLoaded", () => {
  const messagesEl = document.getElementById("chat-messages");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const quickReplies = document.getElementById("quick-replies");

  const RULES = [
    { keywords: ["שעות", "פתוח", "פתיחה"], reply: "אנחנו פתוחים א'-ה' 9:00-19:00, ו' 9:00-14:00. בשבת ובחגים סגור." },
    { keywords: ["החזר", "החלפה", "להחזיר", "להחליף"], reply: "אפשר להחזיר או להחליף פריט תוך 14 יום מהרכישה, באריזה מקורית ועם החשבונית. הכסף חוזר תוך 5-7 ימי עסקים." },
    { keywords: ["הזמנה", "מעקב", "משלוח", "שילוח"], reply: "שלחו לי את מספר ההזמנה ואבדוק את הסטטוס. בדרך כלל המשלוח מגיע תוך 3-5 ימי עסקים." },
    { keywords: ["נציג", "בן אדם", "אדם אמיתי", "מישהו"], reply: "בטח, מעביר אתכם לנציג אנושי. בינתיים אפשר להשאיר כאן את השאלה ונחזור אליכם בהקדם." },
    { keywords: ["תודה", "מעולה", "סבבה"], reply: "בשמחה! יש עוד משהו שאפשר לעזור בו?" },
    { keywords: ["שלום", "היי", "הי "], reply: "היי! איך אפשר לעזור? אפשר לשאול על שעות פתיחה, מדיניות החזרות, או מעקב הזמנה." }
  ];

  const FALLBACK = "זה דמו פשוט מבוסס מילות מפתח, אז לא תמיד אבין כל שאלה 🙂 נסו לשאול על שעות פתיחה, מדיניות החזרות, מעקב הזמנה, או בקשו לדבר עם נציג.";

  function addMessage(text, who) {
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function botReply(userText) {
    const normalized = userText.trim();
    const match = RULES.find((r) => r.keywords.some((k) => normalized.includes(k)));
    return match ? match.reply : FALLBACK;
  }

  function handleUserMessage(text) {
    if (!text.trim()) return;
    addMessage(text.trim(), "user");
    input.value = "";

    const typing = document.createElement("div");
    typing.className = "msg bot typing-dots";
    typing.innerHTML = "<span></span><span></span><span></span>";
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    setTimeout(() => {
      typing.remove();
      addMessage(botReply(text), "bot");
    }, 500 + Math.random() * 400);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleUserMessage(input.value);
  });

  quickReplies.addEventListener("click", (e) => {
    const btn = e.target.closest(".quick-reply-btn");
    if (!btn) return;
    handleUserMessage(btn.dataset.q);
  });

  addMessage("היי! אני הבוט של \"סטייל\" (דמו). שאלו אותי על שעות פתיחה, החזרות או מעקב הזמנה.", "bot");
});
