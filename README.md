# 🛒 Multi-Mart E-Commerce Platform

A **feature-rich, multi-store e-commerce platform** built with modern React.  
This application allows users to **browse products, manage their cart, and securely checkout using PayPal**, wrapped in a polished UI with smooth animations and dynamic routing.

This project demonstrates **modern frontend architecture using React, Vite, Tailwind CSS, and PayPal integration**.

---

# ✨ Features

## 🖥 Modern UI/UX
Built with **Tailwind CSS** and **Framer Motion** to deliver a responsive and animated user experience.

## 💳 Secure Payments
Integrated **PayPal SDK** using `@paypal/react-paypal-js` for seamless and secure checkout.

## 🔀 Dynamic Routing
Powered by **React Router DOM v7** enabling fast and efficient page navigation.

## 📱 QR Code Generation
Users can generate **QR codes** for products or stores using `react-qr-code`.

## 🔔 Toast Notifications
Real-time feedback using **react-toastify**.

## 🎨 Icon System
Clean and scalable icons powered by **lucide-react**.

---

# 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | Frontend framework |
| Vite | Lightning-fast build tool |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Animations |
| Axios | HTTP client |
| React Router DOM v7 | Routing |
| PayPal React SDK | Payments |
| React Toastify | Notifications |
| React QR Code | QR generation |
| Lucide React | Icons |

---

# 📂 Project Structure

```
multi-mart-react-project
│
├── public/
│
├── src/
│   ├── assets/            # Images and static assets
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages
│   ├── context/           # Global state management
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API integrations
│   ├── utils/             # Helper functions
│   ├── App.jsx            # Main application component
│   └── main.jsx           # React entry point
│
├── .env                   # Environment variables
├── package.json
└── vite.config.js
```

---

# ⚙️ Getting Started

Follow these steps to run the project locally.

---

# 📋 Prerequisites

Ensure you have the following installed:

- **Node.js (v18 or later)**
- **npm or yarn**

Download Node.js:

https://nodejs.org/

---

# 🚀 Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/multi-mart-react-project.git
```

## 2️⃣ Navigate to the Project Directory

```bash
cd multi-mart-react-project
```

## 3️⃣ Install Dependencies

```bash
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file in the **root directory**.

```
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id_here
VITE_API_BASE_URL=your_backend_api_url_here
```

Example:

```
VITE_PAYPAL_CLIENT_ID=AbcdEFGh1234567890
VITE_API_BASE_URL=http://localhost:5000/api
```

---

# ▶️ Running the Development Server

Start the application:

```bash
npm run dev
```

Open in browser:

```
http://localhost:5173
```

---

# 📦 Production Build

Generate a production-ready build:

```bash
npm run build
```

The compiled files will be located inside the **dist/** folder.

---

# 🧪 Preview Production Build

Run the production preview locally:

```bash
npm run preview
```

---

# 🔒 Security Notes

- Keep **PayPal Client ID** in environment variables.
- Never expose backend secrets in frontend code.
- In production, payment verification must happen on the **server side**.

---

# 📈 Future Improvements

Planned enhancements:

- 🏬 Multi-vendor dashboards
- 📦 Order management system
- 📊 Admin analytics dashboard
- 🧠 AI-based product recommendations
- 📱 Progressive Web App (PWA)
- 🔔 Real-time order notifications

---

# 🤝 Contributing

Contributions are welcome.

### Steps

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push changes

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Aditya**

If you found this project helpful, consider giving it a ⭐ on GitHub.
