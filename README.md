# 📊 Order Book Visualizer

An interactive order book visualization tool built with **Angular 19**, **D3.js**, and **GSAP**. This application loads order book snapshots from a JSON file and displays bid/ask levels in a visually compelling bar chart. It includes animated replay functionality, tooltips, and localized UI using `ngx-translate`.

---

## 🚀 Quick Start

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/order-book-visualizer.git
cd order-book-visualizer
npm install
npm start
```

The app will be available at: [http://localhost:4200](http://localhost:4200)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── components/order-book/
│   │   ├── order-book-chart/         # D3 chart with bid/ask bars and tooltips
│   │   ├── order-book-page/          # Main view with slider, replay, metrics
│   │   ├── order-book.service.ts     # Service to load and parse JSON data
│   │   └── order-book.utils.ts       # Snapshot transformation utilities
│   ├── core/                         # Core modules: i18n, HTTP, NgRx setup
│   └── shared/components/button/     # Reusable button component with icons
├── assets/
│   ├── i18Local/                     # Translation files
│   └── scss/                         # Global SCSS: variables, reset, layout
```

---

## 📦 Main Libraries

This project uses the following core libraries:

- **Angular 19** – Framework for building the application
- **D3.js** – For rendering the order book chart
- **GSAP** – For timeline-based animations and countdown effects
- **@ngrx/store** – Application-wide state management
- **@ngx-translate/core** – Translation and i18n handling
- **ng-zorro-antd** – UI components (icons, tooltips)
- **Jest + jest-preset-angular** – Testing framework

---

## ✨ Features

- 📉 **Order Book Chart** – Visualizes 10 levels of bid and ask prices
- ⏱ **Animated Replay** – Automatically replays snapshots with a 30s interval
- 📊 **Metrics** – Displays spread and volume totals for both sides of the book
- 🧪 **Unit Tests** – Configured with Jest
- 🌍 **Internationalization** – Language support using `ngx-translate`
- 💎 **Modern UI** – Clean, responsive, and styled with SCSS variables

---

## 🧪 Running Tests

```bash
npm test
```

Runs unit tests using Jest.

---

## ⚙️ Tooling

The project includes:

- ESLint + Prettier + Stylelint for consistent code style
- `husky` + `lint-staged` for pre-commit formatting
- Strict TypeScript setup via `tsconfig`
- Structured environments and proxy configuration
- Zone-less Angular configuration with `provideZoneChangeDetection`

---

## 🗂 Environments

| File                    | Purpose                                  |
|-------------------------|------------------------------------------|
| `environment.ts`        | Development environment config           |
| `build-environment.ts`  | Build version and timestamp metadata     |
| `proxy.conf.json`       | Proxy setup for local API development    |

---

## 🔗 Example Snapshot Data

The visualizer expects JSON lines like this:

```json
{
  "Time": "10:15:00.000",
  "Bid1": 100.5,
  "Bid1Size": 150,
  "Ask1": 100.7,
  "Ask1Size": 120
}
```

Each line is parsed into a snapshot object and rendered on the chart.

---

## 📌 TODO

- [ ] Export to PNG or CSV
- [ ] Live WebSocket data stream
- [ ] Enhanced mobile layout
- [ ] Advanced metrics (e.g. VWAP)

---

## 👨‍💻 Author

Made with ❤️ by **Your Name**  
Feel free to contribute, open issues, or fork this project!

---

## 🛡 License

This project is licensed under the **MIT License**.
