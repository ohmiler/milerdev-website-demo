// ===== Navbar: shadow on scroll + active link + back-to-top =====
const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");
const navAnchors = document.querySelectorAll(".nav-links a:not(.btn)");
const sections = [...navAnchors].map((a) => document.querySelector(a.getAttribute("href")));

function onScroll() {
  const y = window.scrollY;
  navbar.classList.toggle("scrolled", y > 20);
  backToTop.classList.toggle("show", y > 600);

  let current = null;
  sections.forEach((sec, i) => {
    if (sec && sec.offsetTop - 120 <= y) current = navAnchors[i];
  });
  navAnchors.forEach((a) => a.classList.toggle("active", a === current));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

backToTop.addEventListener("click", () => window.scrollTo({ top: 0 }));

// ===== Mobile menu =====
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

function setMenu(open) {
  navLinks.classList.toggle("open", open);
  menuToggle.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
}
menuToggle.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// ===== Typing code animation =====
const codeLines = [
  ['<span class="cm">// MilerDev AI Agent ✨</span>'],
  ['<span class="kw">import</span> { Agent } <span class="kw">from</span> <span class="str">"@milerdev/ai"</span>;'],
  [""],
  ['<span class="kw">const</span> agent = <span class="kw">new</span> <span class="fn">Agent</span>({'],
  ['  model: <span class="str">"claude-opus-5-5"</span>,'],
  ['  tools: [<span class="str">"code"</span>, <span class="str">"test"</span>, <span class="str">"deploy"</span>],'],
  ["});"],
  [""],
  ['<span class="kw">await</span> agent.<span class="fn">build</span>(<span class="str">"ระบบจองคิวออนไลน์"</span>);'],
  ['<span class="cm">// ✅ เสร็จใน 12 นาที แทน 3 สัปดาห์</span>'],
];

const typedCode = document.getElementById("typedCode");

// Split HTML into tokens so tags appear instantly while text is typed char by char
function tokenize(html) {
  return html.match(/<[^>]+>|&[a-z]+;|[\s\S]/gu) || [];
}

async function typeCode() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const full = codeLines.map((l) => l[0]).join("\n");
  if (reduceMotion) { typedCode.innerHTML = full; return; }

  while (true) {
    let out = "";
    for (const token of tokenize(full)) {
      out += token;
      if (token.startsWith("<")) continue;
      typedCode.innerHTML = out;
      await new Promise((r) => setTimeout(r, token === "\n" ? 180 : 28));
    }
    typedCode.innerHTML = out;
    await new Promise((r) => setTimeout(r, 4000));
  }
}
typeCode();

// ===== Reveal on scroll + count-up stats =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  revealObserver.observe(el);
});

function countUp(el) {
  const target = Number(el.dataset.count);
  const duration = 1600;
  const start = performance.now();
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    countUp(entry.target);
    statObserver.unobserve(entry.target);
  });
});
document.querySelectorAll("[data-count]").forEach((el) => statObserver.observe(el));

// ===== Pricing toggle =====
const billingSwitch = document.getElementById("billingSwitch");
const billingLabels = document.querySelectorAll("[data-billing]");
const priceEls = document.querySelectorAll("[data-monthly]");

billingSwitch.addEventListener("click", () => {
  const yearly = billingSwitch.classList.toggle("on");
  billingLabels.forEach((l) => l.classList.toggle("active", (l.dataset.billing === "yearly") === yearly));
  priceEls.forEach((el) => { el.textContent = yearly ? el.dataset.yearly : el.dataset.monthly; });
});

// ===== FAQ: open one at a time =====
const faqItems = document.querySelectorAll(".faq details");
faqItems.forEach((d) => d.addEventListener("toggle", () => {
  if (d.open) faqItems.forEach((o) => { if (o !== d) o.open = false; });
}));

// ===== Contact form (front-end only demo) =====
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll("input, textarea").forEach((field) => {
    const ok = field.checkValidity() && field.value.trim() !== "";
    field.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    formStatus.textContent = "กรุณากรอกข้อมูลให้ครบและถูกต้อง";
    formStatus.className = "form-status err";
    return;
  }

  const btn = form.querySelector("button");
  btn.disabled = true;
  btn.textContent = "กำลังส่ง...";
  setTimeout(() => {
    formStatus.textContent = "ขอบคุณครับ! ทีมงานจะติดต่อกลับโดยเร็วที่สุด";
    formStatus.className = "form-status ok";
    btn.disabled = false;
    btn.textContent = "ส่งข้อความ";
    form.reset();
  }, 900);
});

document.getElementById("year").textContent = new Date().getFullYear();
