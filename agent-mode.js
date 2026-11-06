
/* =========================================
   GN PORTFOLIO - AI AGENT SIMULATION
========================================= */

(() => {
  const container = document.getElementById("agent-cursors");
  const logs = document.getElementById("agent-logs");
  const toggle = document.getElementById("agent-toggle");

  if (!container || !logs || !toggle) return;

  const agents = [
    {
      name: "Agent_Frontend",
      color: "#ff4d6d",
      x: 0.15,
      y: 0.35,
      speed: 0.8,
      phase: 0
    },
    {
      name: "Agent_Design",
      color: "#00d9ff",
      x: 0.75,
      y: 0.25,
      speed: 0.65,
      phase: 1.4
    },
    {
      name: "User_482",
      color: "#b78cff",
      x: 0.45,
      y: 0.65,
      speed: 0.9,
      phase: 2.8
    },
    {
      name: "Reviewer_Bot",
      color: "#a3ff72",
      x: 0.8,
      y: 0.7,
      speed: 0.7,
      phase: 4.2
    },
    {
      name: "Agent_Creative",
      color: "#ffbd59",
      x: 0.25,
      y: 0.8,
      speed: 0.75,
      phase: 5.4
    }
  ];

  const messages = [
    ["Agent_Frontend", "Optimized responsive layout"],
    ["Agent_Design", "Adjusted visual composition"],
    ["User_482", "Exploring portfolio sections"],
    ["Reviewer_Bot", "Checking project information"],
    ["Agent_Creative", "Reviewing color combinations"],
    ["Agent_Frontend", "Improved image presentation"],
    ["Agent_Design", "Testing interactive elements"],
    ["Reviewer_Bot", "Checking navigation links"],
    ["Agent_Creative", "Adding creative touches"],
    ["User_482", "Exploring VIJIBANK project"],
    ["Agent_Frontend", "Reviewing mobile experience"],
    ["Agent_Design", "Analyzing interface spacing"]
  ];

  const cursors = [];

  let active = true;
  let animationFrame;
  let logIndex = 0;
  let highlightIndex = 0;
  let lastInteraction = 0;

  const reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* CREATE CURSORS */

  agents.forEach((agent, index) => {
    const cursor = document.createElement("div");

    cursor.className = "agent-cursor";

    cursor.innerHTML = `
      <div class="agent-pointer"></div>
      <div class="agent-name">${agent.name}</div>
    `;

    cursor.style.setProperty("--cursor-color", agent.color);

    container.appendChild(cursor);

    cursors.push({
      element: cursor,
      agent,
      x: window.innerWidth * agent.x,
      y: window.innerHeight * agent.y,
      targetX: window.innerWidth * agent.x,
      targetY: window.innerHeight * agent.y
    });
  });

  /* CURSOR MOVEMENT */

  function updateTargets(time) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    cursors.forEach((cursor, index) => {
      const a = cursor.agent;

      const t = time * 0.00035 * a.speed + a.phase;

      const targetX =
        width * (0.5 + 0.36 * Math.sin(t) +
        0.06 * Math.sin(t * 2.3));

      const targetY =
        height * (0.5 + 0.32 * Math.cos(t * 0.83) +
        0.08 * Math.sin(t * 1.7));

      cursor.targetX = Math.max(12, Math.min(width - 100, targetX));
      cursor.targetY = Math.max(20, Math.min(height - 50, targetY));
    });
  }

  function animate(time) {
    if (!active) return;

    updateTargets(time);

    cursors.forEach(cursor => {
      const smoothing = reducedMotion ? 0.08 : 0.055;

      cursor.x += (cursor.targetX - cursor.x) * smoothing;
      cursor.y += (cursor.targetY - cursor.y) * smoothing;

      cursor.element.style.transform =
        `translate3d(${cursor.x}px, ${cursor.y}px, 0)`;
    });

    animationFrame = requestAnimationFrame(animate);
  }

  /* LIVE ACTIVITY TERMINAL */

  function addLog(name, message, color) {
    const line = document.createElement("p");
    const nameSpan = document.createElement("span");

    nameSpan.style.color = color;
    nameSpan.textContent = `[${name}] `;

    line.appendChild(nameSpan);
    line.appendChild(document.createTextNode(message));

    logs.appendChild(line);

    while (logs.children.length > 5) {
      logs.removeChild(logs.firstChild);
    }
  }

  function streamLogs() {
    if (!active) return;

    const [name, message] = messages[logIndex];

    const agent = agents.find(a => a.name === name);

    addLog(name, message, agent.color);

    logIndex = (logIndex + 1) % messages.length;
  }

  /* SIMULATED CLICK EFFECT */

  function simulateClick(agentIndex) {
    if (!active) return;

    const cursor = cursors[agentIndex];

    cursor.element.classList.add("clicking");

    const pulse = document.createElement("div");

    pulse.className = "agent-click-pulse";
    pulse.style.left = cursor.x + "px";
    pulse.style.top = cursor.y + "px";
    pulse.style.setProperty(
      "--pulse-color",
      cursor.agent.color
    );

    document.body.appendChild(pulse);

    setTimeout(() => {
      cursor.element.classList.remove("clicking");
      pulse.remove();
    }, 700);

    const targets = document.querySelectorAll(
      ".skill-card, .project-card, .button-primary"
    );

    const target = targets[
      Math.floor(Math.random() * targets.length)
    ];

    if (target) {
      target.classList.remove("agent-interaction");

      void target.offsetWidth;

      target.classList.add("agent-interaction");

      setTimeout(() => {
        target.classList.remove("agent-interaction");
      }, 700);
    }
  }

  /* SIMULATED TEXT HIGHLIGHT */

  const highlightTargets = document.querySelectorAll(
    ".hero-description, .about-content p, .project-card p"
  );

  function simulateHighlight() {
    if (!active || !window.CSS?.highlights || !window.Highlight) {
      return;
    }

    const target =
      highlightTargets[highlightIndex % highlightTargets.length];

    highlightIndex++;

    if (!target || !target.firstChild) return;

    const textNode = target.firstChild;

    if (textNode.nodeType !== Node.TEXT_NODE) return;

    const length = textNode.textContent.length;

    if (length < 5) return;

    const start = Math.min(5, length - 2);
    const end = Math.min(start + 20, length);

    const range = document.createRange();

    range.setStart(textNode, start);
    range.setEnd(textNode, end);

    const highlightNames = [
      "agent-highlight-frontend",
      "agent-highlight-design",
      "agent-highlight-review"
    ];

    const highlight = new Highlight(range);

    CSS.highlights.set(
      highlightNames[highlightIndex % 3],
      highlight
    );

    setTimeout(() => {
      CSS.highlights.delete(
        highlightNames[highlightIndex % 3]
      );
    }, 1800);
  }

  /* SIMULATED TYPING */

  function simulateTyping() {
    if (!active) return;

    const target = document.querySelector(".hero-description");

    if (!target) return;

    const original = target.textContent.trim();

    const versions = [
      "B.Tech Information Technology student. Building ideas, exploring technology and turning creative concepts into digital experiences.",
      "Exploring technology. Creating digital experiences. Learning something new every day."
    ];

    const next = versions[Math.random() > 0.5 ? 0 : 1];

    let position = 0;
    let deleting = false;

    const type = () => {
      if (!active || !target.isConnected) return;

      if (!deleting) {
        target.textContent = next.slice(0, position++);
        if (position > next.length) {
          deleting = true;
          setTimeout(type, 1400);
          return;
        }
      } else {
        target.textContent = original.slice(
          0,
          Math.max(0, original.length - position)
        );

        position++;

        if (position > original.length) {
          target.textContent = original;
          return;
        }
      }

      setTimeout(type, deleting ? 18 : 32);
    };

    type();
  }

  /* AGENT INTERACTION SCHEDULE */

  function scheduleInteractions() {
    if (!active) return;

    const now = Date.now();

    if (now - lastInteraction > 4500) {
      const index = Math.floor(Math.random() * agents.length);

      simulateClick(index);

      lastInteraction = now;
    }
  }

  /* START SYSTEM */

  function startAgents() {
    if (reducedMotion) {
      cursors.forEach(cursor => {
        cursor.element.style.opacity = "0.8";
      });
    }

    active = true;

    toggle.classList.remove("off");
    toggle.setAttribute("aria-pressed", "true");
    toggle.innerHTML =
      '<span class="toggle-dot"></span> AGENT MODE: ON';

    if (!reducedMotion) {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(animate);
    }

    streamLogs();

    window.agentLogTimer = setInterval(streamLogs, 2300);
    window.agentClickTimer = setInterval(scheduleInteractions, 1000);
    window.agentHighlightTimer = setInterval(simulateHighlight, 5000);
    window.agentTypingTimer = setInterval(simulateTyping, 18000);

    addLog(
      "SYSTEM",
      "All collaboration agents connected",
      "#65f5a1"
    );
  }

  /* STOP SYSTEM */

  function stopAgents() {
    active = false;

    cancelAnimationFrame(animationFrame);

    clearInterval(window.agentLogTimer);
    clearInterval(window.agentClickTimer);
    clearInterval(window.agentHighlightTimer);
    clearInterval(window.agentTypingTimer);

    cursors.forEach(cursor => {
      cursor.element.style.opacity = "0";
      cursor.element.classList.remove("clicking");
    });

    document.querySelectorAll(".agent-click-pulse").forEach(
      pulse => pulse.remove()
    );

    document.querySelectorAll(".agent-interaction").forEach(
      element => element.classList.remove("agent-interaction")
    );

    if (window.CSS?.highlights) {
      CSS.highlights.delete("agent-highlight-frontend");
      CSS.highlights.delete("agent-highlight-design");
      CSS.highlights.delete("agent-highlight-review");
    }

    toggle.classList.add("off");
    toggle.setAttribute("aria-pressed", "false");
    toggle.innerHTML =
      '<span class="toggle-dot"></span> AGENT MODE: OFF';

    addLog(
      "SYSTEM",
      "Agent simulation paused",
      "#9295a0"
    );
  }

  /* TOGGLE BUTTON */

  toggle.addEventListener("click", () => {
    if (active) {
      stopAgents();
    } else {
      startAgents();
    }
  });

  /* INITIALIZE */

  startAgents();

})();
