const STORAGE_KEY = "eng_courses";
const USERS_KEY = "eng_users";
const SESSION_KEY = "eng_session";
const FAVORITES_KEY = "eng_favorites";

const seedCourses = [
  { id: 1, title: "English for Beginners", level: "A1", lessons: 12, description: "Start your English journey from zero. Learn basic greetings, numbers, and everyday phrases that you will use every day.", author: "Admin", authorId: 1, category: "Speaking", rating: 4.8, createdAt: "2024-01-10" },
  { id: 2, title: "Business English", level: "B2", lessons: 20, description: "Master professional communication, emails, negotiations, and presentations. Perfect for career growth.", author: "Admin", authorId: 1, category: "Business", rating: 4.6, createdAt: "2024-02-15" },
  { id: 3, title: "IELTS Preparation", level: "C1", lessons: 30, description: "Complete preparation for IELTS exam with practice tests, tips, and proven strategies to boost your score.", author: "Admin", authorId: 1, category: "Exam Prep", rating: 4.9, createdAt: "2024-03-01" },
  { id: 4, title: "Everyday Conversations", level: "A2", lessons: 15, description: "Practice real-life dialogues for travel, shopping, dining, and making friends with native speakers.", author: "Admin", authorId: 1, category: "Speaking", rating: 4.7, createdAt: "2024-03-20" },
  { id: 5, title: "Grammar Mastery", level: "B1", lessons: 25, description: "Deep dive into English grammar rules, tenses, conditionals, and more with clear explanations and exercises.", author: "Admin", authorId: 1, category: "Grammar", rating: 4.5, createdAt: "2024-04-05" },
  { id: 6, title: "Advanced Writing", level: "C2", lessons: 18, description: "Craft compelling essays, reports, and creative writing pieces. Develop a sophisticated academic and professional style.", author: "Admin", authorId: 1, category: "Writing", rating: 4.7, createdAt: "2024-04-18" },
];

const seedUsers = [
  { id: 1, name: "Admin", email: "admin@test.com", password: "admin123", role: "admin", createdAt: "2024-01-01" },
  { id: 2, name: "John Doe", email: "user@test.com", password: "user123", role: "user", createdAt: "2024-02-10" },
];

const api = {
  init() {
    if (!localStorage.getItem(STORAGE_KEY)) localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCourses));
    const existing = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    if (!existing.length || !existing[0].role) localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
  },
  delay: (ms = 400) => new Promise((r) => setTimeout(r, ms)),
  async getCourses() { await this.delay(); return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); },
  async getCourse(id) { await this.delay(); const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); return all.find((c) => c.id === Number(id)) || null; },
  async createCourse(data) { await this.delay(); const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); const n = { ...data, id: Date.now(), rating: 0, createdAt: new Date().toISOString().slice(0,10) }; localStorage.setItem(STORAGE_KEY, JSON.stringify([...all, n])); return n; },
  async updateCourse(id, data) { await this.delay(); const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); const u = all.map((c) => c.id === Number(id) ? { ...c, ...data } : c); localStorage.setItem(STORAGE_KEY, JSON.stringify(u)); return u.find((c) => c.id === Number(id)); },
  async deleteCourse(id) { await this.delay(); const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); localStorage.setItem(STORAGE_KEY, JSON.stringify(all.filter((c) => c.id !== Number(id)))); },
  async getUsers() { await this.delay(); return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); },
  async deleteUser(id) { await this.delay(); const u = JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); localStorage.setItem(USERS_KEY, JSON.stringify(u.filter((u) => u.id !== Number(id)))); },
  async updateUserRole(id, role) { await this.delay(); const u = JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); localStorage.setItem(USERS_KEY, JSON.stringify(u.map((u) => u.id === Number(id) ? { ...u, role } : u))); },
  async login(email, password) { await this.delay(); const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); const user = users.find((u) => u.email === email && u.password === password); if (!user) throw new Error("Неверный email или пароль"); const s = { id: user.id, name: user.name, email: user.email, role: user.role }; localStorage.setItem(SESSION_KEY, JSON.stringify(s)); return s; },
  async register(name, email, password) { await this.delay(); const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); if (users.find((u) => u.email === email)) throw new Error("Email уже зарегистрирован"); const n = { id: Date.now(), name, email, password, role: "user", createdAt: new Date().toISOString().slice(0,10) }; localStorage.setItem(USERS_KEY, JSON.stringify([...users, n])); const s = { id: n.id, name: n.name, email: n.email, role: n.role }; localStorage.setItem(SESSION_KEY, JSON.stringify(s)); return s; },
  async updateProfile(userId, { name, email, password }) { await this.delay(); const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); const updated = users.map((u) => u.id !== userId ? u : { ...u, name: name||u.name, email: email||u.email, password: password||u.password }); localStorage.setItem(USERS_KEY, JSON.stringify(updated)); const u = updated.find((u) => u.id === userId); const s = { id: u.id, name: u.name, email: u.email, role: u.role }; localStorage.setItem(SESSION_KEY, JSON.stringify(s)); return s; },
  logout() { localStorage.removeItem(SESSION_KEY); },
  getSession() { const s = localStorage.getItem(SESSION_KEY); return s ? JSON.parse(s) : null; },
  getFavorites(userId) { const all = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "{}"); return all[userId] || []; },
  toggleFavorite(userId, courseId) { const all = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "{}"); const favs = all[userId] || []; const exists = favs.includes(courseId); all[userId] = exists ? favs.filter((id) => id !== courseId) : [...favs, courseId]; localStorage.setItem(FAVORITES_KEY, JSON.stringify(all)); return !exists; },
  isFavorite(userId, courseId) { return this.getFavorites(userId).includes(courseId); },
};

api.init();
export default api;
