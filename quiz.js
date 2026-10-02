(function () {
  const QUESTIONS = [
    {
      domain: "Algebra",
      q: "If 5x + 3 = 2x + 18, what is the value of x?",
      choices: ["3", "5", "7", "15"], answer: 1,
      why: "Subtract 2x from both sides to get 3x + 3 = 18. Subtract 3 to get 3x = 15, so x = 5.",
      tip: "Desmos tip: graph y = 5x + 3 and y = 2x + 18 and click where they cross."
    },
    {
      domain: "Algebra",
      q: "A gym charges $25 to join plus $15 per month. Which expression gives the total cost, in dollars, for m months?",
      choices: ["15m + 25", "25m + 15", "40m", "15(m + 25)"], answer: 0,
      why: "The $15 happens every month, so it goes with m. The $25 happens once, so it's added at the end.",
      tip: "Check it: 3 months should cost 25 + 15 × 3 = $70, and 15(3) + 25 = 70."
    },
    {
      domain: "Algebra",
      q: "A line passes through the points (1, 3) and (4, 12). What is the slope of the line?",
      gridin: 3,
      why: "Slope is rise over run: (12 − 3) ÷ (4 − 1) = 9 ÷ 3 = 3.",
      tip: "Watch the order. Subtract the y values and the x values in the same order."
    },
    {
      domain: "Algebra",
      q: "y = 2x + 1 and y = −x + 7. What is the value of x where these two lines meet?",
      choices: ["1", "2", "3", "5"], answer: 1,
      why: "Set them equal: 2x + 1 = −x + 7, so 3x = 6 and x = 2. (5 is the y value, which is a common trap.)",
      tip: "Desmos tip: type both lines in and click the intersection point."
    },
    {
      domain: "Advanced Math",
      q: "What is the sum of the solutions to x² − 9x + 20 = 0?",
      gridin: 9,
      why: "It factors to (x − 4)(x − 5) = 0, so x = 4 or 5, and 4 + 5 = 9.",
      tip: "Shortcut: the sum of the solutions of ax² + bx + c = 0 is −b/a, which is 9/1 = 9."
    },
    {
      domain: "Advanced Math",
      q: "f(x) = 3x² − 2. What is f(−2)?",
      choices: ["−14", "4", "10", "34"], answer: 2,
      why: "Square first: (−2)² = 4. Then 3 × 4 − 2 = 10.",
      tip: "34 comes from squaring 3 × (−2), and −14 comes from forgetting the square makes it positive."
    },
    {
      domain: "Advanced Math",
      q: "A town of 200 rabbits triples every 5 years. How many rabbits are there after 15 years?",
      choices: ["600", "1,800", "5,400", "9,000"], answer: 2,
      why: "15 years is 3 tripling periods, so 200 × 3³ = 200 × 27 = 5,400.",
      tip: "Exponential growth: starting amount × (growth factor)^(number of periods)."
    },
    {
      domain: "Problem Solving and Data Analysis",
      q: "A $60 jacket goes up in price by 15%. What is the new price, in dollars?",
      gridin: 69,
      why: "Going up 15% means multiplying by 1.15: 60 × 1.15 = 69.",
      tip: "Up x% = multiply by (1 + x/100). Down x% = multiply by (1 − x/100)."
    },
    {
      domain: "Problem Solving and Data Analysis",
      q: "What is the median of the data set 3, 5, 8, 8, 11?",
      choices: ["5", "7", "8", "11"], answer: 2,
      why: "The numbers are already in order, and the middle one is 8. (7 is the mean, which is the trap.)",
      tip: "Median = middle value in order. Mean = add them up and divide."
    },
    {
      domain: "Geometry and Trig",
      q: "A right triangle has legs of length 5 and 12. What is the length of the hypotenuse?",
      gridin: 13,
      why: "5² + 12² = 25 + 144 = 169, and √169 = 13.",
      tip: "5, 12, 13 is a common right triangle on the SAT, along with 3, 4, 5."
    }
  ];

  const DOMAINS = [
    { name: "Algebra", onTest: "13 to 15" },
    { name: "Advanced Math", onTest: "13 to 15" },
    { name: "Problem Solving and Data Analysis", onTest: "5 to 7" },
    { name: "Geometry and Trig", onTest: "5 to 7" }
  ];

  const root = document.getElementById("quiz");
  if (!root) return;
  const intro = document.getElementById("quiz-intro");
  const startBtn = document.getElementById("quiz-start");
  const bookUrl = root.getAttribute("data-book");

  let i = 0;
  let results = [];
  let checked = false;
  let picked = null;

  function parseNum(s) {
    s = String(s).trim().replace(/,/g, "").replace(/−/g, "-").replace(/\$/g, "");
    if (!s) return NaN;
    if (/^-?\d+(\.\d+)?\/-?\d+(\.\d+)?$/.test(s)) {
      const p = s.split("/");
      return parseFloat(p[0]) / parseFloat(p[1]);
    }
    return /^-?\d*\.?\d+$/.test(s) ? parseFloat(s) : NaN;
  }

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function render() {
    root.innerHTML = "";
    checked = false;
    picked = null;
    const item = QUESTIONS[i];

    const meta = el("div", "qmeta");
    meta.appendChild(el("span", null, "Question " + (i + 1) + " of " + QUESTIONS.length));
    const correctSoFar = results.filter(function (r) { return r.ok; }).length;
    meta.appendChild(el("span", null, correctSoFar + " correct so far"));
    root.appendChild(meta);

    const prog = el("div", "progress");
    const bar = el("div");
    bar.style.width = (i / QUESTIONS.length * 100) + "%";
    prog.appendChild(bar);
    root.appendChild(prog);

    const card = el("div", "qcard");
    card.appendChild(el("span", "tag domain", item.domain));
    const qt = el("p", "qtext", item.q);
    qt.id = "qtext";
    card.appendChild(qt);

    const fb = el("div", "feedback");
    fb.hidden = true;
    fb.setAttribute("aria-live", "polite");

    const nav = el("div", "qnav");
    const check = el("button", "btn", "Check answer");
    check.type = "button";
    check.disabled = true;
    check.setAttribute("aria-disabled", "true");

    let input = null;
    let buttons = [];

    function enable() {
      check.disabled = false;
      check.removeAttribute("aria-disabled");
    }

    if (item.choices) {
      const list = el("div", "choices");
      list.setAttribute("role", "group");
      list.setAttribute("aria-labelledby", "qtext");
      item.choices.forEach(function (c, idx) {
        const b = el("button", "choice");
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.appendChild(el("span", "key", "ABCD"[idx]));
        b.appendChild(el("span", null, c));
        b.addEventListener("click", function () {
          if (checked) return;
          picked = idx;
          buttons.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
          enable();
        });
        buttons.push(b);
        list.appendChild(b);
      });
      card.appendChild(list);
    } else {
      const g = el("div", "gridin");
      const label = el("label", "fine", "Type your answer");
      label.setAttribute("for", "gridin-" + i);
      input = el("input");
      input.id = "gridin-" + i;
      input.type = "text";
      input.inputMode = "decimal";
      input.autocomplete = "off";
      input.addEventListener("input", function () {
        if (input.value.trim()) enable(); else { check.disabled = true; check.setAttribute("aria-disabled", "true"); }
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !check.disabled) check.click();
      });
      g.appendChild(label);
      g.appendChild(input);
      card.appendChild(g);
    }

    card.appendChild(fb);
    nav.appendChild(check);
    card.appendChild(nav);
    root.appendChild(card);

    check.addEventListener("click", function () {
      if (!checked) {
        let ok;
        let given;
        if (item.choices) {
          ok = picked === item.answer;
          given = item.choices[picked];
          buttons.forEach(function (b, idx) {
            if (idx === item.answer) b.classList.add("correct");
            else if (idx === picked) b.classList.add("wrong");
            b.disabled = true;
          });
        } else {
          given = input.value.trim();
          const n = parseNum(given);
          ok = !isNaN(n) && Math.abs(n - item.gridin) < 1e-6;
          input.classList.add(ok ? "correct" : "wrong");
          input.readOnly = true;
        }
        results.push({ ok: ok, domain: item.domain, q: item.q, given: given,
          right: item.choices ? item.choices[item.answer] : String(item.gridin) });
        checked = true;
        fb.hidden = false;
        fb.className = "feedback " + (ok ? "good" : "bad");
        fb.innerHTML = "";
        fb.appendChild(el("b", null, ok ? "Correct" : "Not quite. The answer is " + (item.choices ? item.choices[item.answer] : item.gridin) + "."));
        fb.appendChild(el("p", null, item.why));
        fb.appendChild(el("p", "tip", item.tip));
        check.textContent = i === QUESTIONS.length - 1 ? "See my results" : "Next question";
        check.focus();
      } else {
        i += 1;
        if (i < QUESTIONS.length) { render(); root.querySelector(".qcard").scrollIntoView({ block: "nearest" }); }
        else showResults();
      }
    });
  }

  function showResults() {
    root.innerHTML = "";
    const right = results.filter(function (r) { return r.ok; }).length;
    const box = el("div", "result");

    const score = el("div", "score");
    score.appendChild(el("b", null, right + "/" + QUESTIONS.length));
    let msg;
    if (right === 10) msg = "Perfect. You're in great shape. A few sessions on the hardest SAT questions could push you even higher.";
    else if (right >= 8) msg = "Really solid. You're close, and the ones you missed are the kind of points a couple of sessions can lock in.";
    else if (right >= 5) msg = "A good base with some gaps. These are very fixable with practice on the right question types.";
    else msg = "This is where tutoring helps the most. A few focused sessions on the basics will make a big difference.";
    score.appendChild(el("span", "lead", msg));
    box.appendChild(score);

    const dh = el("h2", null, "How you did by section");
    box.appendChild(dh);
    const doms = el("div", "domains");
    DOMAINS.forEach(function (d) {
      const rs = results.filter(function (r) { return r.domain === d.name; });
      const c = rs.filter(function (r) { return r.ok; }).length;
      const row = el("div", "dom");
      const name = el("span", null, d.name);
      const bar = el("div", "bar");
      const fill = el("div");
      fill.style.width = (rs.length ? c / rs.length * 100 : 0) + "%";
      bar.appendChild(fill);
      row.appendChild(name);
      row.appendChild(bar);
      row.appendChild(el("span", "n", c + "/" + rs.length));
      doms.appendChild(row);
    });
    box.appendChild(doms);

    const missed = results.filter(function (r) { return !r.ok; });
    if (missed.length) {
      const counts = {};
      missed.forEach(function (r) { counts[r.domain] = (counts[r.domain] || 0) + 1; });
      const worst = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
      const d = DOMAINS.filter(function (x) { return x.name === worst; })[0];
      box.appendChild(el("p", "muted", "Your biggest gap was " + worst + ". The real SAT has " + d.onTest + " of those questions, so it's worth fixing first."));
    }

    const lh = el("h2", null, "Your answers");
    box.appendChild(lh);
    const ul = el("ul", "review-list");
    results.forEach(function (r, idx) {
      const li = el("li");
      li.appendChild(el("span", r.ok ? "ok" : "no", (idx + 1) + ". " + (r.ok ? "Correct" : "Missed")));
      li.appendChild(el("span", null, r.q));
      if (!r.ok) li.appendChild(el("span", "fine", "You said " + (r.given || "nothing") + ". Answer: " + r.right + "."));
      ul.appendChild(li);
    });
    box.appendChild(ul);

    const cta = el("div", "book");
    cta.appendChild(el("h2", null, missed.length ? "Want to fix the ones you missed?" : "Want to keep that score up?"));
    cta.appendChild(el("p", null, "Book a session and we'll start with the question types you missed. The first 15 minutes are free."));
    const acts = el("div", "actions");
    const a = el("a", "btn", "Book a session");
    a.href = bookUrl;
    a.target = "_blank";
    a.rel = "noopener";
    const again = el("button", "copy", "Retake the quiz");
    again.type = "button";
    again.addEventListener("click", function () { i = 0; results = []; render(); root.scrollIntoView({ block: "start" }); });
    acts.appendChild(a);
    acts.appendChild(again);
    cta.appendChild(acts);
    box.appendChild(cta);

    root.appendChild(box);
    root.scrollIntoView({ block: "start" });
  }

  startBtn.addEventListener("click", function () {
    intro.hidden = true;
    root.hidden = false;
    render();
    root.scrollIntoView({ block: "start" });
  });
})();
