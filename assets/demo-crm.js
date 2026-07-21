document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("crm-form");
  const input = document.getElementById("crm-input");
  const scanning = document.getElementById("crm-scanning");
  const colNew = document.getElementById("col-new");
  const colProgress = document.getElementById("col-progress");
  const colDone = document.getElementById("col-done");

  const PRESETS = {
    "preset-1": 'היי, ראיתי את המודעה על הדירה 3 חדרים בתל אביב, מאוד מתעניין. התקציב שלי בערך 2 מיליון, אפשר לחזור אליי היום? שמי דני, 050-1234567',
    "preset-2": 'מעוניין בהצעת מחיר לשירות הניקיון השבועי, רק בודק אפשרויות בינתיים ואולי אחליט בהמשך',
    "preset-3": 'אני צריך רכב חדש, תקציב עד 150 אלף שקל, די דחוף כי הרכב הנוכחי התקלקל. אפשר לחזור אליי בהקדם?',
    "preset-4": 'אפשר מידע כללי על השירותים שלכם?'
  };

  Object.keys(PRESETS).forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", () => { input.value = PRESETS[id]; });
  });

  function extractBudget(text) {
    const specific = text.match(/(\d[\d,.']*)\s*(מיליון|אלף)\s*(₪|שקל|ש"ח)?/);
    if (specific) {
      return `${specific[1]} ${specific[2]} ₪`;
    }
    const currency = text.match(/(\d[\d,.']*)\s*(₪|שקל|ש"ח)/);
    if (currency) return `${currency[1]} ₪`;
    return null;
  }

  function extractName(text) {
    const m = text.match(/שמי\s+([א-ת]{2,12})/);
    return m ? m[1] : "ליד אנונימי";
  }

  function extractInterest(text) {
    if (/דירה|בית|נדל"?ן|נדלן/.test(text)) return 'נדל"ן';
    if (/רכב|אוטו/.test(text)) return "רכב";
    if (/ניקיון|נקיון/.test(text)) return "שירותי ניקיון";
    if (/הצעת מחיר|מחיר/.test(text)) return "בקשת הצעת מחיר";
    if (/ייעוץ|יעוץ|פגישה/.test(text)) return "ייעוץ / פגישה";
    return "פנייה כללית";
  }

  function extractContact(text) {
    const phone = text.match(/0\d{1,2}-?\d{7}/);
    if (phone) return phone[0];
    const email = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    if (email) return email[0];
    return null;
  }

  function scoreLead(text, budget, contact) {
    let score = 45;
    if (/דחוף|היום|מיידי|עכשיו|בהקדם/.test(text)) score += 30;
    if (/רק בודק|אולי|לא בטוח|בעתיד|בהמשך|סתם/.test(text)) score -= 30;
    if (budget) score += 15;
    if (contact) score += 15;
    if (score >= 75) return "hot";
    if (score >= 45) return "warm";
    return "cold";
  }

  const LEVEL_LABEL = { hot: "🔥 חם", warm: "🌤 פושר", cold: "❄️ קר" };

  function buildCard(text) {
    const budget = extractBudget(text);
    const contact = extractContact(text);
    const name = extractName(text);
    const interest = extractInterest(text);
    const level = scoreLead(text, budget, contact);

    const card = document.createElement("div");
    card.className = "crm-card";
    card.dataset.stage = "new";
    card.innerHTML = `
      <div class="crm-card-head">
        <span class="crm-card-name">${name}</span>
        <span class="crm-badge ${level}">${LEVEL_LABEL[level]}</span>
      </div>
      <div class="crm-card-row"><b>תחום:</b> ${interest}</div>
      <div class="crm-card-row"><b>תקציב:</b> ${budget || "לא צוין"}</div>
      <div class="crm-card-row"><b>פרטי קשר:</b> ${contact || "לא זוהו"}</div>
      <div class="crm-card-row"><b>מקור:</b> אתר (דמו) · עכשיו</div>
      <button type="button" class="crm-card-advance">העבר לטיפול →</button>
    `;
    return card;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    scanning.style.display = "block";
    form.querySelector("button[type=submit]").disabled = true;

    setTimeout(() => {
      const card = buildCard(text);
      colNew.prepend(card);
      scanning.style.display = "none";
      form.querySelector("button[type=submit]").disabled = false;
      input.value = "";
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 900);
  });

  document.getElementById("crm-board").addEventListener("click", (e) => {
    const btn = e.target.closest(".crm-card-advance");
    if (!btn) return;
    const card = btn.closest(".crm-card");
    const stage = card.dataset.stage;
    if (stage === "new") {
      card.dataset.stage = "progress";
      btn.textContent = "סגרו עסקה ✓";
      colProgress.prepend(card);
    } else if (stage === "progress") {
      card.dataset.stage = "done";
      btn.remove();
      colDone.prepend(card);
    }
  });
});
