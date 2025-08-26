# 🔫 guns-lol-View-bot

An automatic **Puppeteer** bot for boosting views on [guns.lol](https://guns.lol).  
The bot uses **proxies (Webshare API or local list)** and simulates human-like behavior: mouse movements, clicks, and scrolling.  

---

## 🚀 Features
- 📡 Supports **Webshare API** for automatic proxy fetching.  
- 📂 Backup mode with a local `proxies.txt` file.  
- 🖱️ Human-like behavior emulation (mouse moves, random clicks, scrolling).  
- 🔄 Runs multiple browsers simultaneously (**MAX_CONCURRENT**).  
- 🔒 Built-in anti-detection tricks (disable `webdriver`, emulate plugins and devices).  
- 📊 Final statistics of successful/failed sessions.  

---

## 📋 Requirements
- [Node.js](https://nodejs.org/) **v18+**  
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)  
- Account on [Webshare.io](https://www.webshare.io/) (for API key and proxy list)  
- Linux / Windows / macOS server or local machine  

---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/username/guns-lol-View-bot.git
cd guns-lol-View-bot
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure (`index.js`)
Open `index.js` and set your data:
```js
const API_KEY = 'your_webshare_api_key';        // API key
const DOWNLOAD_URL = 'your_webshare_url';       // proxy list link
const MAX_CONCURRENT = 3;                       // number of concurrent browsers
const TARGET_URL = 'https://guns.lol/guns';     // target URL
```

### 4️⃣ Add local proxies (if not using Webshare API)
Create a `proxies.txt` file in the project root:  
```
192.168.1...:8080
123.45.67...:3128
45.76.23...:1080
```

---

## ▶️ Run

### 🔹 Normal run
```bash
node index.js
```

### 🔹 Run on server with pm2 (recommended)
```bash
npm install -g pm2
pm2 start index.js --name guns-lol-bot
pm2 logs guns-lol-bot
```

---

## 🛠️ Settings

| Parameter        | Description |
|------------------|-------------|
| **API_KEY**      | Webshare token (if using API) |
| **DOWNLOAD_URL** | Proxy list download URL (Webshare) |
| **MAX_CONCURRENT** | Number of parallel browsers (1–10) |
| **TARGET_URL**   | guns.lol link to boost views for |

---

## 📂 Project Structure
```
guns-lol-View-bot/
├── index.js        # main script
├── package.json    # project dependencies
├── proxies.txt     # proxy list (if no Webshare API)
└── README.md       # documentation
```

---

## ❓ FAQ

### ❌ Proxies are not loading
- Check `API_KEY` and `DOWNLOAD_URL`.  
- If API is unavailable → use `proxies.txt`.  

### ❌ Site blocks the bot
- Increase delays in the `delay` function.  
- Use **residential proxies**.  
- Lower `MAX_CONCURRENT`.  

### ❌ Not working on VPS (Linux)
Install Chromium manually:
```bash
sudo apt-get update
sudo apt-get install -y chromium-browser
```
And add flags in `args` (already included in code):
```js
args: ['--no-sandbox', '--disable-setuid-sandbox']
```

---

## ⚠️ Disclaimer
> Project created for **educational purposes only**.  
> The author is not responsible for any misuse of the code that violates site rules or laws.  

---

## ⭐ Support
If you find this project useful — give it a ⭐ on GitHub and share with friends 😉
