# 🚀 TypeScript HTTP Server

A lightweight and modular **TypeScript HTTP Server** with support for **routing, middleware, static file serving, and query handling**. This server is built using **Node.js** and the native `http` module, ensuring efficiency and scalability.

## 🌟 Features

✅ **Modular Architecture** – Separate files for request handling, responses, routing, and middleware.  
✅ **Custom Routing** – Define GET and POST routes easily.  
✅ **Middleware Support** – Implement request logging, authentication, and data parsing.  
✅ **Static File Serving** – Serve HTML, CSS, and JS files from a `public` directory.  
✅ **Query Processing** – API endpoint to handle user queries dynamically.  
✅ **Error Handling** – Custom error classes for structured responses.

---

## 📦 Installation

1️⃣ **Clone the repository:**
```sh
git clone https://github.com/Nipunchugh10/typescript-http-server.git
cd typescript-http-server
```

2️⃣ **Install dependencies:**
```sh
npm install
```

3️⃣ **Compile TypeScript:**
```sh
tsc
```

4️⃣ **Start the server:**
```sh
node dist/app.js
```

---

## 🚀 Usage

Once the server is running, you can access it at:
```sh
http://localhost:3000
```

### Available API Endpoints

| Method | Endpoint        | Description |
|--------|----------------|-------------|
| GET    | `/api/hello`    | Returns a friendly greeting. |
| GET    | `/api/query?q=` | Responds to user queries dynamically. |
| POST   | `/api/query`    | Accepts JSON queries and responds. |
| GET    | `/api/data`     | Returns a sample message from the server. |

### Static File Hosting
- Place your static files (HTML, CSS, JS) inside the **`public/`** folder.
- The server will automatically serve `index.html` for root requests.

---

## ⚙️ Project Structure

```
📂 typescript-http-server/
├── 📁 src/
│   ├── config.ts          # Server configuration settings
│   ├── request.ts         # Handles incoming requests
│   ├── response.ts        # Manages HTTP responses
│   ├── router.ts          # API routing system
│   ├── middleware.ts      # Middleware implementation
│   ├── static.ts          # Static file handling
│   ├── queryHandler.ts    # Query processing logic
│   ├── server.ts          # Core server implementation
│   ├── error.ts           # Custom error handling
│   ├── app.ts             # Server entry point
├── 📁 public/              # Static files (index.html, styles, etc.)
|   ├── index.html            # Server Index page
├── tsconfig.json           # TypeScript configuration
├── package.json           # Dependencies & scripts
└── README.md              # Documentation
```

---

## 🛠️ Customization

### Add New Routes
To add a new API route, modify `app.ts`:
```ts
server.get('/api/custom', (req, res) => {
    res.json({ message: 'This is a custom route!' });
});
```

### Adding Middleware
To add custom middleware for **authentication, logging, or processing**, modify `app.ts`:
```ts
server.use(async (req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    await next();
});
```

---

## 🏆 Contributing
Pull requests are welcome! Feel free to **fork** this repository and submit improvements.

---

## 📜 License
This project is licensed under the **MIT License**.

