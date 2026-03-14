# SkillLink — Local Skill Exchange Platform

> ⚠️ **This is a UI/concept draft.** No backend, no real authentication, no database. All interactions are frontend-only.

---

## 💡 Concept

SkillLink is a concept for a **local, in-person skill exchange platform**. The idea: instead of paying for courses, people teach what they know and learn what they need — from their own community, face to face, using a credit system.

You teach → you earn credits. You spend credits → you learn.

No money changes hands. No one-way Zoom calls. Just people meeting in person and exchanging real skills.

---

## 🖥️ Pages

The draft includes three pages:

- **`index.html`** — Landing page with hero section, how it works, features, pricing, and community stats
- **`browse-users.html`** — Browse local skill exchange partners
- **`profile.html`** — User profile page

---

## ✨ Features (UI Only)

- **Credit system** — Teach to earn, spend to learn
- **Geolocation matching** — Find partners nearby
- **Profile verification** — Trust and safety concept
- **Secure chat** — Pre-meeting communication
- **Review system** — Post-exchange feedback
- **Login / Sign-up modals** — Frontend forms (no auth)
- **Pricing tiers** — Free (Basic) and $9.99/month (Premium)
- **Responsive design** — Works on mobile and desktop
- [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts + [Font Awesome 6](https://fontawesome.com/) icons

---

## 🛠️ Tech Stack

- Pure **HTML / CSS / JavaScript** — no frameworks, no dependencies
- Hosted via **GitHub Pages**

---

## 🚀 Run Locally

```bash
git clone https://github.com/aisensivtsev/skilllink.git
cd skilllink
open index.html
```

No build step needed.

---

## 🗺️ Concept Context

The draft is imagined for **Vancouver, BC** — referencing UBC, SFU, Vancouver Community Centres, and local neighbourhoods as the initial community. The concept positions itself against platforms like Skillshare, Udemy, and TaskRabbit by emphasising mutual, in-person, non-monetary exchange.

---

## 🔮 If This Were Built For Real

To turn this into a working product it would need:

- Backend (user auth, session management)
- Database (user profiles, skills, credits, reviews)
- Real geolocation API
- Messaging/chat infrastructure
- Payment processing for the Premium tier

---

## 📄 License

MIT © 2025 SkillLink
