const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');

// === Settings ===
const API_KEY = ''; // Your api key from Webshare (leave empty to skip)
const DOWNLOAD_URL = ''; // Download url from Webshare (leave empty to skip)
const MAX_CONCURRENT = 3; // Maximum 3 browsers simultaneously (load and stability)
const TARGET_URL = 'https://guns.lol/guns'.trim(); // Trim whitespace

// Load proxies via Webshare API (only if credentials are provided)
async function loadProxiesFromWebshare() {
  // Skip API if credentials are missing
  if (!API_KEY || !DOWNLOAD_URL) {
    console.log('⚠️  Webshare API credentials missing. Skipping API.');
    return null;
  }

  return new Promise((resolve) => {
    console.log('📡 Attempting to load proxies via Webshare API...');

    // Validate URL format
    try {
      new URL(DOWNLOAD_URL); // Will throw if invalid
    } catch (err) {
      console.log('❌ Invalid DOWNLOAD_URL format');
      return resolve(null);
    }

    const req = https.get(DOWNLOAD_URL, {
      headers: { 'Authorization': `Token ${API_KEY}` }
    }, (res) => {
      let data = '';

      if (res.statusCode !== 200) {
        console.log(`❌ API returned status ${res.statusCode}`);
        return resolve(null);
      }

      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const proxies = data
          .split('\n')
          .map(line => line.trim())
          .filter(line => /^(\d{1,3}\.){3}\d{1,3}:\d+$/.test(line));

        if (proxies.length === 0) {
          console.log('❌ No proxies retrieved from API');
          return resolve(null);
        }

        console.log(`✅ Loaded ${proxies.length} proxies from Webshare`);
        resolve(proxies);
      });
    });

    req.on('error', (err) => {
      console.log('❌ API request failed:', err.message);
      resolve(null);
    });

    req.setTimeout(10000, () => {
      console.log('❌ Request to Webshare timed out');
      req.destroy();
      resolve(null);
    });
  });
}

// Load proxies from file
function loadProxiesFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const proxies = data
      .split('\n')
      .map(line => line.trim())
      .filter(line => /^(\d{1,3}\.){3}\d{1,3}:\d+$/.test(line));

    if (proxies.length === 0) {
      console.log('❌ proxies.txt is empty or has no valid proxies');
      return [];
    }

    console.log(`✅ Loaded ${proxies.length} proxies from file`);
    return proxies;
  } catch (e) {
    console.error('❌ File read error (proxies.txt):', e.message);
    return [];
  }
}

// Random delay
function delay(min, max) {
  return new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1)) + min));
}

// Human-like mouse movement
async function humanMouseMove(page, fromX, fromY, toX, toY) {
  const steps = 5 + Math.floor(Math.random() * 5);
  const dx = (toX - fromX) / steps;
  const dy = (toY - fromY) / steps;

  for (let i = 0; i <= steps; i++) {
    const x = fromX + dx * i + (Math.random() - 0.5) * 20;
    const y = fromY + dy * i + (Math.random() - 0.5) * 20;
    await page.mouse.move(x, y);
    await delay(30, 100);
  }
}

// Sloppy click
async function humanClick(page, x, y) {
  const jitterX = x + (Math.random() - 0.5) * 15;
  const jitterY = y + (Math.random() - 0.5) * 15;
  await page.mouse.click(jitterX, jitterY, { delay: 50 + Math.random() * 100 });
}

// Run one session
async function runSession(proxy) {
  let browser;
  try {
    console.log(`🌍 [${proxy}] Starting session...`);

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--window-position=0,0',
        `--proxy-server=${proxy}`
      ],
      defaultViewport: { width: 1366, height: 768 },
      timeout: 60000
    });

    const page = await browser.newPage();

    // Random User-Agent
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    ];
    await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);

    // Anti-detection
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      window.chrome = { runtime: {} };
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
      Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });
    });

    // Touch API
    await page.addScriptTag({
      content: `
        ['ontouchstart', 'ontouchmove', 'ontouchend'].forEach(event => {
          Object.defineProperty(HTMLElement.prototype, event, { value: null });
        });
      `
    });

    // Navigate
    await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await delay(2000, 4000);

    // 1. First click
    await humanClick(page, 600, 400);
    await delay(1500, 3000);

    // 2. Scroll
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 120 + Math.random() * 80));
      await delay(300, 600);
    }
    await delay(1000, 2000);

    // 3. Mouse movement
    await humanMouseMove(page, 600, 400, 400, 300);
    await delay(800, 1500);
    await humanMouseMove(page, 400, 300, 800, 500);
    await delay(1000, 2000);

    // 4. Second click
    await humanClick(page, 500 + Math.random() * 200, 300 + Math.random() * 100);
    await delay(2000, 4000);

    // 5. Final scroll
    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(1000, 2000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await delay(3000, 5000);

    console.log(`✅ [${proxy}] Session completed`);
    await browser.close();
    return true;
  } catch (error) {
    console.error(`❌ [${proxy}] Error:`, error.message.split('\n')[0]);
    if (browser) await browser.close().catch(() => {});
    return false;
  }
}

// === START ===
(async () => {
  let proxies = [];

  // Try Webshare API only if both API_KEY and DOWNLOAD_URL are set
  if (API_KEY && DOWNLOAD_URL) {
    proxies = await loadProxiesFromWebshare();
  } else {
    console.log('⚠️  API_KEY or DOWNLOAD_URL is empty. Skipping Webshare API.');
  }

  // Fallback to file if API failed or was skipped
  if (!proxies || proxies.length === 0) {
    console.log('🔁 Using fallback: proxies.txt');
    proxies = loadProxiesFromFile('proxies.txt');
  }

  // Final check
  if (proxies.length === 0) {
    console.error('❌ No proxies available. Please add proxies via API or in proxies.txt');
    return;
  }

  console.log(`✅ Starting with ${proxies.length} proxies (max ${MAX_CONCURRENT} concurrent)`);

  const results = [];
  const inProgress = [];

  for (const proxy of proxies) {
    const promise = runSession(proxy).then(success => {
      results.push({ proxy, success });
    });

    inProgress.push(promise);

    // Limit concurrent sessions
    if (inProgress.length >= MAX_CONCURRENT) {
      await Promise.race(inProgress);
      inProgress.shift();
    }
  }

  // Wait for remaining
  await Promise.allSettled(inProgress);

  const successCount = results.filter(r => r.success).length;
  console.log(`🎉 Done: ${successCount} out of ${results.length} sessions successful.`);
})();