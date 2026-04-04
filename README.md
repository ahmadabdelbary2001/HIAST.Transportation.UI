# 🚌 **نظام تتبع النقل (HIAST Transportation Tracker)**
> _لوحة تحكم إدارية شاملة لإدارة السائقين، الحافلات، المسارات، والاشتراكات، مبنية لتوفير تفاعل حي ونظام صلاحيات متقدم._

<div align="center">
  <img src="https://img.shields.io/badge/Language-English-blue?style=flat-square" alt="English">
  <a href="locales/README.en.md">English Version</a> |
  <img src="https://img.shields.io/badge/Language-Arabic-green?style=flat-square" alt="Arabic">
  <a href="#">النسخة العربية</a>
</div>

---

## 📖 **نظرة عامة**
> _يهدف هذا المشروع إلى رقمنة وأتمتة إدارة النقل للمؤسسات عبر تحكم كامل بالأسطول والمسارات. يتميز التطبيق باتصالات حقيقية الوقت (Real-time) وحماية متقدمة استناداً إلى أدوار الصلاحيات (RBAC)._

---

## 📋 **قائمة المحتويات** <a id="toc"></a>
1. [✨ المميزات الرئيسية](#features)
2. [💻 التقنيات المستخدمة](#tech-stack)
3. [🚀 ابدأ الآن](#getting-started)
4. [📁 هيكلية المشروع](#project-structure)
5. [📜 التراخيص](#license)

---

## ✨ **المميزات الرئيسية** <a id="features"></a>
- **📡 إشعارات فورية**: تكامل مع SignalR لتحديث البيانات فورياً دون إعادة تحميل الصفحة.
- **🔐 أمان وصلاحيات متقدمة**: نظام Role-Based Access لضمان حماية الصفحات وتأمين تعديل البيانات.
- **🛣️ إدارة ذكية للأساطيل**: تحكم كامل بالسائقين، المسارات، المحطات والاشتراكات بواجهة مرنة وسلسة.
- **🛠️ معالجة الأخطاء الديناميكية**: وسيط برمجي (apiHelper) لمعالجة أخطاء الخادم والتحققية تلقائياً.

<div align="center">
  <a href="#toc">🔝 العودة للأعلى</a>
</div>

---

## 💻 **التقنيات المستخدمة** <a id="tech-stack"></a>
- **React.js & TypeScript**: لتطوير واجهة مستخدم قوية ومتجاوبة.
- **ReactQuery**: لإدارة جلب البيانات والتخزين المؤقت وتعديلها.
- **SignalR (WebSockets)**: لتحقيق التواصل المباشر والإشعارات الحية.
- **TailwindCSS & Shadcn**: لتصميم واجهة مستخدم احترافية وحديثة.
- **Vite**: لبناء وخدمة المشروع بأقصى سرعة ممكنة.

<div align="center">
  <a href="#toc">🔝 العودة للأعلى</a>
</div>

---

## 🚀 **ابدأ الآن** <a id="getting-started"></a>

### المتطلبات الأساسية
- [x] **Node.js (v18+)**
- [x] **pnpm** (مثبت عالمياً)

### خطوات التثبيت
1. استنساخ المستودع:
   ```bash
   git clone https://github.com/Ahmad-J-Bary/hiast-transportation-ui.git
   cd HIAST.Transportation.UI
   ```

2. تثبيت الحزم:
   ```bash
   pnpm install
   ```

3. تشغيل التطبيق في وضع التطوير:
   ```bash
   pnpm dev
   ```

<div align="center">
  <a href="#toc">🔝 العودة للأعلى</a>
</div>

---

## 📁 **هيكلية المشروع** <a id="project-structure"></a>
 ```bash
 HIAST.Transportation.UI/
 ├── src/
 │   ├── components/       # المكونات الرسومية القابلة لإعادة الاستخدام
 │   ├── contexts/         # إدارة الحالات وصلاحيات الدخول (AuthContext)
 │   ├── hooks/            # الـ Custom Hooks للتواصل مع APIs
 │   ├── locales/          # التوثيق والترجمة لمختلف اللغات
 │   ├── pages/            # واجهات لوحات التحكم (Drivers, Buses, etc)
 │   ├── services/         # خدمات التخاطب الخارجي (signalRService, apiHelper)
 │   └── store/            # إدارة الحالة المحلية
 └── locales/              # التوثيق الإنجليزي لملف المشروع
 ```

<div align="center">
  <a href="#toc">🔝 العودة للأعلى</a>
</div>

---

## 📜 **التراخيص** <a id="license"></a>
هذا المشروع مرخص بموجب رخصة MIT. راجع ملف `LICENSE` لمزيد من المعلومات.

<div align="center">
  <a href="#toc">🔝 العودة للأعلى</a>
</div>

<p align="center"> تم التطوير بكل ❤️ بواسطة <a href="https://github.com/Ahmad-J-Bary">@Ahmad Abdelbary</a> </p>
