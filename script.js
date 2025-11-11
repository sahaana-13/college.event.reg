/*
  Frontend script for College Event Management System
  Features:
  - Admin login (username + password)
  - Add, remove events
  - Student registration (with full details)
  - Duplicate registration prevention
  - PDF generation of participants per event
*/

const STORAGE_KEY = "events";

// ====== LOCAL STORAGE HELPERS ======
function getEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedEvents();
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading events from storage", e);
    return seedEvents();
  }
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function seedEvents() {
  const initial = [
    {
      id: "E001",
      name: "Tech Talk",
      category: "Technical",
      date: "2025-11-01",
      venue: "Auditorium A",
      time: "10:00",
    },
    {
      id: "E002",
      name: "Cultural Fest",
      category: "Cultural",
      date: "2025-11-10",
      venue: "Open Ground",
      time: "16:00",
    },
  ];
  saveEvents(initial);
  return initial;
}

// ====== ADMIN LOGIN ======
function loginAdmin() {
  const user = document.getElementById("adminUser").value.trim();
  const pass = document.getElementById("adminPass").value.trim();

  if (user === "admin" && pass === "1234") {
    localStorage.setItem("adminLoggedIn", "true");
    document.getElementById("login-section").style.display = "none";
    document.getElementById("admin-section").style.display = "block";
    renderEvents();
  } else {
    alert("Invalid username or password!");
  }
}

function togglePassword() {
  const passField = document.getElementById("adminPass");
  passField.type = passField.type === "password" ? "text" : "password";
}

// ====== RENDER EVENTS ======
function renderEvents() {
  const events = getEvents();

  // Admin panel list
  const adminList = document.getElementById("eventList");
  if (adminList) {
    adminList.innerHTML = "";
    events.forEach((ev) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${ev.name} <small style="font-size:0.8rem;color:#555">(${ev.id})</small></h3>
        <p><strong>Category:</strong> ${ev.category}</p>
        <p><strong>Date:</strong> ${ev.date}</p>
        <p><strong>Venue:</strong> ${ev.venue}</p>
        <p><strong>Time:</strong> ${ev.time}</p>
        <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn alt" onclick="removeEvent('${ev.id}')">Remove</button>
          <button class="btn" onclick="toggleRegistrations('${ev.id}')">View Participants</button>
          <button class="btn outline" onclick="downloadPDF('${ev.id}')">Download PDF</button>
        </div>
        <div id="regs-${ev.id}" class="registrations" style="margin-top:12px; display:none"></div>
      `;
      adminList.appendChild(card);
    });
  }

  // Public event list
  const publicList = document.getElementById("events-list");
  if (publicList) {
    publicList.innerHTML = "";
    events.forEach((ev) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${ev.name}</h3>
        <p><strong>Date:</strong> ${ev.date}</p>
        <p><strong>Venue:</strong> ${ev.venue}</p>
        <p><strong>Time:</strong> ${ev.time}</p>
        <p><strong>Category:</strong> ${ev.category}</p>
        <div style="margin-top:8px">
          <button class="btn" onclick="registerEvent('${ev.id}', '${ev.name}')">Register</button>
        </div>
      `;
      publicList.appendChild(card);
    });
  }

  renderStats();
}

// ====== ADD & REMOVE EVENTS ======
function addEvent() {
  const id = document.getElementById("eid").value.trim();
  const name = document.getElementById("ename").value.trim();
  const category = document.getElementById("category").value.trim();
  const date = document.getElementById("date").value.trim();
  const venue = document.getElementById("venue").value.trim();
  const time = document.getElementById("time").value.trim();

  if (!id || !name || !category || !date || !venue || !time) {
    alert("Please fill in all event details!");
    return;
  }

  const events = getEvents();
  if (events.find((e) => e.id === id)) {
    alert("An event with that ID already exists.");
    return;
  }

  events.push({ id, name, category, date, venue, time });
  saveEvents(events);
  renderEvents();

  document.getElementById("eventForm").reset();
  alert("Event added successfully!");
}

function removeEvent(eventId) {
  if (!confirm("Remove this event?")) return;
  let events = getEvents();
  events = events.filter((e) => e.id !== eventId);
  saveEvents(events);
  renderEvents();
}

// ====== STUDENT REGISTRATION ======
function registerEvent(eventId, eventName) {
  const studentId = prompt(`Enter your Student ID to register for ${eventName}:`);
  if (!studentId) return alert("Registration cancelled.");

  const name = prompt("Enter your Full Name:");
  const className = prompt("Enter your Class:");
  const section = prompt("Enter your Section:");
  const dept = prompt("Enter your Department:");
  const college = prompt("Enter your College Name:");

  if (!name || !className || !section || !dept || !college) {
    alert("All fields are required!");
    return;
  }

  try {
    const regKey = "registrations";
    const raw = localStorage.getItem(regKey);
    const regs = raw ? JSON.parse(raw) : [];

    // Prevent duplicate registration
    const already = regs.some((r) => r.eventId === eventId && r.studentId === studentId);
    if (already) {
      alert("You have already registered for this event!");
      return;
    }

    regs.push({
      eventId,
      studentId,
      name,
      className,
      section,
      dept,
      college,
      when: new Date().toISOString(),
    });

    localStorage.setItem(regKey, JSON.stringify(regs));
    alert(`✅ Registered successfully for ${eventName}!`);
    renderStats();
  } catch (e) {
    console.error("Error during registration", e);
  }
}

// ====== PARTICIPANT MANAGEMENT ======
function getRegistrations() {
  const raw = localStorage.getItem("registrations");
  return raw ? JSON.parse(raw) : [];
}

function getRegistrationsForEvent(eventId) {
  const regs = getRegistrations();
  return regs.filter((r) => r.eventId === eventId);
}

function renderRegistrationsFor(eventId) {
  const container = document.getElementById(`regs-${eventId}`);
  const regs = getRegistrationsForEvent(eventId);
  if (!container) return;

  if (regs.length === 0) {
    container.innerHTML = "<em>No participants yet.</em>";
    return;
  }

  const list = document.createElement("ul");
  regs.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = `${r.name} (${r.studentId}) - ${r.className} ${r.section}, ${r.dept}, ${r.college}`;
    list.appendChild(li);
  });

  container.innerHTML = "";
  container.appendChild(list);
}

function toggleRegistrations(eventId) {
  const div = document.getElementById(`regs-${eventId}`);
  if (div.style.display === "none" || div.style.display === "") {
    renderRegistrationsFor(eventId);
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
}

// ====== PDF DOWNLOAD ======
function downloadPDF(eventId) {
  const regs = getRegistrationsForEvent(eventId);
  const event = getEvents().find((e) => e.id === eventId);

  if (!regs.length) {
    alert("No participants to download.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(`Event Participants - ${event.name}`, 10, 15);
  doc.setFontSize(12);
  doc.text(`Date: ${event.date} | Venue: ${event.venue} | Time: ${event.time}`, 10, 25);

  let y = 40;
  regs.forEach((r, i) => {
    const line = `${i + 1}. ${r.name} (${r.studentId}) - ${r.className} ${r.section}, ${r.dept}, ${r.college}`;
    doc.text(line, 10, y);
    y += 8;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`${event.name}_participants.pdf`);
}

// ====== DASHBOARD STATS ======
function renderStats() {
  const events = getEvents();
  const totalEventsEl = document.getElementById("total-events");
  const totalStudentsEl = document.getElementById("total-students");
  const upcomingEl = document.getElementById("upcoming-events");

  if (totalEventsEl) totalEventsEl.textContent = events.length;

  const regs = getRegistrations();
  if (totalStudentsEl) totalStudentsEl.textContent = regs.length;

  if (upcomingEl) {
    const now = new Date();
    const upcoming = events.filter((ev) => new Date(ev.date) >= now).length;
    upcomingEl.textContent = upcoming;
  }
}

// ====== INIT ======
window.addEventListener("DOMContentLoaded", () => {
  const isAdmin = localStorage.getItem("adminLoggedIn") === "true";
  if (isAdmin) {
    const loginSec = document.getElementById("login-section");
    const adminSec = document.getElementById("admin-section");
    if (loginSec && adminSec) {
      loginSec.style.display = "none";
      adminSec.style.display = "block";
    }
  }
  renderEvents();
});
