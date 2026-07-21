document.addEventListener("DOMContentLoaded", () => {
  const steps = Array.from(document.querySelectorAll(".step"));
  const dots = Array.from(document.querySelectorAll(".progress-track span"));
  const counterEl = document.getElementById("step-counter");
  const totalRealSteps = dots.length; // steps the user actually fills in
  let current = 0;

  const OWNER_WHATSAPP = "972547701899";

  const INDUSTRY_TIPS = {
    retail: "בתחום הקמעונאות/מסחר, אוטומציה של מענה ראשוני ומעקב הזמנות היא לרוב הניצחון הכי מהיר.",
    ecommerce: "בחנות אונליין, מענה אוטומטי לשאלות על הזמנות ומשלוחים חוסך המון פניות שירות חוזרות.",
    realestate: 'בנדל"ן, מיון וניקוד לידים אוטומטי חוסך הכי הרבה זמן לסוכנים.',
    professional: 'בשירותים מקצועיים (עו"ד, רו"ח, ייעוץ), אוטומציה של תזכורות, טפסים וסיכומי פגישות משפרת דרמטית את הזמינות.',
    marketing: "בסוכנות שיווק/פרסום, AI לטיוטות תוכן ראשוניות ולדוחות ללקוחות מקצר משמעותית את זמן ההפקה.",
    food: "במסעדנות ומזון, מענה אוטומטי להזמנות ולשאלות נפוצות משחרר את הצוות בשעות העומס.",
    health: "בבריאות ורפואה, תיאום תורים ותזכורות אוטומטיות מפחיתים משמעותית איחורים וביטולים.",
    education: "בחינוך והדרכה, תוכן לומדה ומענה אוטומטי לשאלות נפוצות חוסכים המון זמן הוראה.",
    logistics: "בלוגיסטיקה והובלות, מעקב הזמנות ועדכוני סטטוס אוטומטיים מפחיתים משמעותית פניות טלפוניות.",
    construction: "בענף הבנייה והקבלנות, תיאום לוחות זמנים ותזכורות אוטומטיות לספקים ולקוחות מפחית עיכובים.",
    nonprofit: "בעמותה/ארגון ללא מטרות רווח, אוטומציה של תקשורת עם תורמים ומתנדבים חוסכת זמן יקר לצוות הקטן.",
    other: "כמעט בכל עסק יש תהליכים אדמיניסטרטיביים שאפשר לקצר משמעותית עם AI."
  };

  const GOAL_TIPS = {
    time: "המטרה המרכזית שלכם היא לחסוך זמן - כדאי להתחיל בתהליך אחד קטן וברור שחוזר על עצמו הרבה, ולתת לו אוטומציה ראשונה.",
    sales: "כדי להגדיל מכירות ולידים, הכי משתלם להתחיל במיון וניקוד לידים אוטומטי כדי שאף פנייה חמה לא תלך לאיבוד.",
    service: "לשיפור שירות הלקוחות, סוכן AI שעונה מיידית על השאלות הנפוצות משחרר את הצוות למקרים שבאמת דורשים תשומת לב.",
    cost: "להורדת עלויות תפעול, הכי משתלם למפות תהליך ידני שחוזר על עצמו הרבה ולתרגם אותו לאוטומציה שרצה לבד."
  };

  const PAIN_WEIGHTS = { service: 15, leads: 15, content: 10, repetitive: 15, inventory: 12, reports: 10, presence: 8, noai: 10 };

  const PAIN_TIPS = {
    service: "כדאי להתחיל בסוכן AI/צ'אטבוט שעונה על השאלות החוזרות, ומעביר לנציג רק מה שבאמת דורש שיקול דעת.",
    leads: "מערכת פשוטה לניקוד וסינון לידים אוטומטי תבטיח שהלידים החמים לא ייפלו בין הכיסאות.",
    content: "AI יכול לייצר לכם טיוטות ראשונות לתוכן שיווקי, ולחסוך את שלב 'הדף הריק'.",
    repetitive: "שווה למפות תהליך צר וברור אחד ולהתחיל ממנו, לפני שמרחיבים לתהליכים נוספים.",
    inventory: "אוטומציה בסיסית למעקב מלאי והתראות על מלאי נמוך יכולה לחסוך הרבה כאבי ראש ואי-הבנות.",
    reports: "AI יכול לרכז נתונים ולבנות דוח תמציתי אוטומטית, במקום לעבור על גיליונות ידנית כל שבוע.",
    presence: "עמוד נחיתה או אתר בסיסי עם מענה אוטומטי ליצירת קשר יכול לשפר משמעותית את הרושם הראשוני מול לקוחות פוטנציאליים.",
    noai: "אפילו שימוש בסיסי בכלים כמו Claude או ChatGPT בעבודה היומיומית כבר יכול לחסוך שעות בשבוע."
  };

  const SOLUTION_LABELS = {
    service: "צ'אטבוט / סוכן AI לשירות לקוחות",
    leads: "מערכת CRM לניהול וניקוד לידים",
    content: "מערכת אוטומציה לתוכן שיווקי",
    repetitive: "אוטומציה לתהליך העבודה החוזר",
    inventory: "מערכת חכמה לניהול מלאי",
    reports: "דוחות ו-BI אוטומטיים",
    presence: "אתר / נוכחות דיגיטלית עם מענה אוטומטי",
    noai: "ליווי להטמעת AI בעבודה היומיומית"
  };

  const SOLUTION_EXAMPLES = {
    service: "לדוגמה: לקוח שולח הודעה בוואטסאפ בשעה 23:00 ומקבל מיד תשובה על מדיניות ההחזרות - ורק אם צריך, זה עובר לנציג אנושי בבוקר.",
    leads: "לדוגמה: כל פנייה חדשה מדף הנחיתה מקבלת ציון אוטומטי לפי תקציב ודחיפות, כך שהצוות יודע במי לטפל קודם.",
    content: "לדוגמה: במקום לשבת מול דף ריק, מקבלים טיוטה ראשונה לפוסט או למייל שיווקי תוך דקה, ורק מלטשים אותה.",
    repetitive: "לדוגמה: תהליך שלוקח 20 דקות ידניות בכל פעם (כמו עדכון טבלה או שליחת אישור) רץ לבד ברקע.",
    inventory: "לדוגמה: כשפריט מסוים יורד מתחת לכמות מסוימת, נשלחת התראה אוטומטית לפני שנגמר המלאי בפועל.",
    reports: "לדוגמה: במקום לרכז נתונים ידנית כל שבוע ב-Excel, מקבלים דוח מסודר שנבנה אוטומטית מהמידע הקיים.",
    presence: "לדוגמה: עמוד נחיתה פשוט עם טופס/צ'אט שעונה מיידית - כך פנייה לא הולכת לאיבוד רק כי אין מי שיענה עכשיו.",
    noai: "לדוגמה: לפני שבונים מערכת שלמה, לומדים להשתמש נכון ב-Claude או ChatGPT למשימות היומיומיות - הרבה פעמים זה כבר חוסך שעות."
  };

  const GOAL_FALLBACK_SOLUTION = {
    time: "אוטומציה לתהליך העבודה החוזר",
    sales: "מערכת CRM לניהול וניקוד לידים",
    service: "צ'אטבוט / סוכן AI לשירות לקוחות",
    cost: "אוטומציה לתהליך העבודה החוזר"
  };

  const GOAL_FALLBACK_EXAMPLE = {
    time: SOLUTION_EXAMPLES.repetitive,
    sales: SOLUTION_EXAMPLES.leads,
    service: SOLUTION_EXAMPLES.service,
    cost: SOLUTION_EXAMPLES.repetitive
  };

  function updateCounter() {
    if (!counterEl) return;
    if (current < totalRealSteps) {
      counterEl.textContent = `שלב ${current + 1} מתוך ${totalRealSteps}`;
      counterEl.style.display = "";
    } else {
      counterEl.style.display = "none";
    }
  }

  function showStep(i) {
    steps.forEach((s, idx) => s.classList.toggle("active", idx === i));
    dots.forEach((d, idx) => d.classList.toggle("done", idx <= i));
    current = i;
    updateCounter();
  }

  function clearErrors(stepEl) {
    stepEl.querySelectorAll(".invalid").forEach((f) => f.classList.remove("invalid"));
    stepEl.querySelectorAll(".field-error").forEach((e) => { e.style.display = "none"; });
  }

  function validateStep(i) {
    const stepEl = steps[i];
    clearErrors(stepEl);
    let ok = true;
    let firstInvalid = null;

    stepEl.querySelectorAll("input[required]:not([type=radio]), select[required]").forEach((field) => {
      const isValid = field.value && field.value.trim() &&
        !(field.type === "email" && !/^\S+@\S+\.\S+$/.test(field.value));
      if (!isValid) {
        ok = false;
        field.classList.add("invalid");
        if (!firstInvalid) firstInvalid = field;
      }
    });

    const radioGroups = new Set(
      Array.from(stepEl.querySelectorAll("input[type=radio][required]")).map((r) => r.name)
    );
    radioGroups.forEach((name) => {
      const checked = stepEl.querySelector(`input[name="${name}"]:checked`);
      if (!checked) {
        ok = false;
        const err = stepEl.querySelector(`#err-${name}`);
        if (err) err.style.display = "block";
      }
    });

    if (firstInvalid) firstInvalid.focus();
    return ok;
  }

  document.querySelectorAll(".js-next").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!validateStep(current)) return;
      if (current < steps.length - 2) showStep(current + 1);
    });
  });

  document.querySelectorAll(".js-back").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (current > 0) showStep(current - 1);
    });
  });

  const form = document.getElementById("assessment-form");

  form.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const lastStep = steps.length - 3;
    if (current < lastStep) {
      e.preventDefault();
      const nextBtn = steps[current].querySelector(".js-next");
      if (nextBtn) nextBtn.click();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateStep(current)) return;

    const scanStepIndex = steps.length - 2;
    const resultStepIndex = steps.length - 1;
    showStep(scanStepIndex);

    setTimeout(() => {
      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const phone = (data.get("phone") || "").toString().trim();
      const industry = data.get("industry");
      const teamSize = data.get("team_size");
      const goal = data.get("goal");
      const pains = data.getAll("pain");

      let score = 15;
      pains.forEach((p) => { score += PAIN_WEIGHTS[p] || 0; });
      score = Math.min(score, 95);

      let level;
      if (score < 30) level = "כבר די מסודרים - יש עידון קל לעשות";
      else if (score < 55) level = "יש הזדמנות ברורה לשיפור";
      else if (score < 80) level = "פוטנציאל אוטומציה גבוה";
      else level = "פוטנציאל אוטומציה גבוה מאוד";

      const painsByWeight = pains.slice().sort((a, b) => (PAIN_WEIGHTS[b] || 0) - (PAIN_WEIGHTS[a] || 0));

      const topKey = painsByWeight[0] && SOLUTION_LABELS[painsByWeight[0]] ? painsByWeight[0] : null;
      const topSolution = (topKey && SOLUTION_LABELS[topKey]) || GOAL_FALLBACK_SOLUTION[goal] || "ליווי להטמעת AI מותאם לעסק שלכם";
      const topExample = (topKey && SOLUTION_EXAMPLES[topKey]) || GOAL_FALLBACK_EXAMPLE[goal] || "";

      const recs = [];
      if (GOAL_TIPS[goal]) recs.push(GOAL_TIPS[goal]);
      if (INDUSTRY_TIPS[industry]) recs.push(INDUSTRY_TIPS[industry]);
      painsByWeight
        .filter((p) => PAIN_TIPS[p])
        .slice(0, 2)
        .forEach((p) => recs.push(PAIN_TIPS[p]));
      if (recs.length < 2) recs.push("אתם כבר משתמשים בכלים חכמים - יש עדיין מקום לייעל תהליכים ספציפיים. בואו נדבר על זה.");

      document.getElementById("res-score").textContent = score;
      document.getElementById("res-level").textContent = level;
      document.getElementById("top-solution-name").textContent = topSolution;
      document.getElementById("top-solution-example").textContent = topExample;
      const list = document.getElementById("res-list");
      list.innerHTML = "";
      recs.forEach((r) => {
        const li = document.createElement("li");
        li.textContent = r;
        list.appendChild(li);
      });

      const waText = encodeURIComponent(
        `היי, מילאתי את בדיקת ההתאמה ל-AI באתר.\nשם: ${name}\nעסק/תחום: ${industry || "-"}\nגודל צוות: ${teamSize || "-"}\nמטרה מרכזית: ${goal || "-"}\nציון התאמה: ${score}\nההמלצה המרכזית: ${topSolution}\nאשמח לשיחה קצרה.`
      );
      document.getElementById("res-whatsapp").href = `https://wa.me/${OWNER_WHATSAPP}?text=${waText}`;

      const mailSubject = encodeURIComponent("בקשת שיחה - בדיקת התאמה ל-AI");
      const mailBody = encodeURIComponent(
        `שם: ${name}\nאימייל: ${email}\nטלפון: ${phone || "-"}\nעסק/תחום: ${industry || "-"}\nגודל צוות: ${teamSize || "-"}\nמטרה מרכזית: ${goal || "-"}\nציון התאמה: ${score}\nההמלצה המרכזית: ${topSolution}`
      );
      document.getElementById("res-mail").href = `mailto:bd12123@gmail.com?subject=${mailSubject}&body=${mailBody}`;

      showStep(resultStepIndex);
    }, 1600);
  });

  showStep(0);
});
