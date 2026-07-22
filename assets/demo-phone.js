document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("phone-form");
  const input = document.getElementById("phone-input");
  const messages = document.getElementById("phone-messages");
  const quickReplies = document.getElementById("phone-quick-replies");
  if (!form || !input || !messages) return;

  let conversation = "";

  const BOT_RULES = [
    { keywords: ["דירה", "בית", "נדל\"ן", "נדלן"], reply: "מעולה! יש לנו כמה אפשרויות בתחום הזה. איזה אזור הכי מעניין אתכם?" },
    { keywords: ["רכב", "אוטו"], reply: "בטח, איזה סוג רכב אתם מחפשים, ומה טווח התקציב?" },
    { keywords: ["כמה עולה", "מחיר", "עלות"], reply: "זה תלוי בפרטים המדויקים - תוכלו לספר לי קצת יותר על מה שאתם מחפשים ומה התקציב המשוער?" },
    { keywords: ["תקציב"], reply: "תודה על השיתוף! זה עוזר לי להבין מה הכי מתאים לכם." },
    { keywords: ["050", "052", "053", "054", "058", "מייל", "אימייל", "@"], reply: "מעולה, שמרתי את הפרטים - ניצור איתכם קשר בהקדם!" },
    { keywords: ["תודה", "מעולה", "סבבה"], reply: "בשמחה! יש עוד משהו שאפשר לעזור בו?" },
    { keywords: ["שלום", "היי", "הי "], reply: "היי! איך אפשר לעזור היום?" }
  ];

  const FALLBACK = "תודה על ההודעה! אשמח לפרטים נוספים כדי לעזור בצורה הכי טובה.";

  function addMessage(text, who) {
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function botReplyFor(text) {
    const match = BOT_RULES.find((r) => r.keywords.some((k) => text.includes(k)));
    return match ? match.reply : FALLBACK;
  }

  function extractBudget(text) {
    const specific = text.match(/(\d[\d,.']*)\s*(מיליון|אלף)\s*(₪|שקל|ש"ח)?/);
    if (specific) return `${specific[1]} ${specific[2]} ₪`;
    const currency = text.match(/(\d[\d,.']*)\s*(₪|שקל|ש"ח)/);
    if (currency) return `${currency[1]} ₪`;
    return null;
  }

  function extractName(text) {
    const m = text.match(/שמי\s+([א-ת]{2,12})/);
    return m ? m[1] : null;
  }

  function extractInterest(text) {
    if (/דירה|בית|נדל"?ן|נדלן/.test(text)) return 'נדל"ן';
    if (/רכב|אוטו/.test(text)) return "רכב";
    if (/ניקיון|נקיון/.test(text)) return "שירותי ניקיון";
    if (/הצעת מחיר|מחיר|כמה עולה/.test(text)) return "בקשת הצעת מחיר";
    if (/ייעוץ|יעוץ|פגישה/.test(text)) return "ייעוץ / פגישה";
    return null;
  }

  function extractContact(text) {
    const phone = text.match(/0\d{1,2}-?\d{7}/);
    if (phone) return phone[0];
    const email = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    if (email) return email[0];
    return null;
  }

  function scoreLead(text, budget, contact) {
    let score = 35;
    if (/דחוף|היום|מיידי|עכשיו|בהקדם/.test(text)) score += 25;
    if (/רק בודק|אולי|לא בטוח|בעתיד|בהמשך|סתם/.test(text)) score -= 20;
    if (budget) score += 20;
    if (contact) score += 20;
    if (score >= 75) return "hot";
    if (score >= 45) return "warm";
    return "cold";
  }

  const LEVEL_LABEL = { hot: "🔥 חם", warm: "🌤 פושר", cold: "❄️ קר" };

  function updateLeadCard() {
    const name = extractName(conversation);
    const interest = extractInterest(conversation);
    const budget = extractBudget(conversation);
    const contact = extractContact(conversation);
    const level = scoreLead(conversation, budget, contact);

    document.getElementById("lead-name").textContent = name || "ליד אנונימי";
    document.getElementById("lead-interest").textContent = interest || "ממתין למידע...";
    document.getElementById("lead-budget").textContent = budget || "לא צוין";
    document.getElementById("lead-contact").textContent = contact || "לא זוהו";

    const badge = document.getElementById("lead-badge");
    badge.className = `crm-badge ${level}`;
    badge.textContent = LEVEL_LABEL[level];
  }

  function handleUserMessage(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    addMessage(trimmed, "user");
    conversation += " " + trimmed;
    input.value = "";
    updateLeadCard();

    const typing = document.createElement("div");
    typing.className = "msg bot typing-dots";
    typing.innerHTML = "<span></span><span></span><span></span>";
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      typing.remove();
      addMessage(botReplyFor(trimmed), "bot");
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

  addMessage("היי! תודה שפניתם אלינו 🙂 איך אפשר לעזור?", "bot");
});
