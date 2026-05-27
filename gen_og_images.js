const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const TYPES = ['ENFJ','ENFP','ENTJ','ENTP','ESFJ','ESFP','ESTJ','ESTP','INFJ','INFP','INTJ','INTP','ISFJ','ISFP','ISTJ','ISTP'];

(async () => {
  const ogDir = path.resolve(__dirname, 'og');
  if (!fs.existsSync(ogDir)) fs.mkdirSync(ogDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

  const templatePath = path.resolve(__dirname, 'og_template.html');

  // 16종 유형별
  for (const t of TYPES) {
    const url = 'file://' + templatePath + '?type=' + t;
    await page.goto(url, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 700));
    await page.screenshot({
      path: path.resolve(ogDir, `${t}.png`),
      type: 'png',
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    });
    console.log(`og/${t}.png`);
  }

  // 기본 (테스트 공유용)
  await page.goto('file://' + templatePath, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 700));
  await page.screenshot({
    path: path.resolve(__dirname, 'og-image.png'),
    type: 'png',
    clip: { x: 0, y: 0, width: 1200, height: 630 },
  });
  console.log('og-image.png');

  await browser.close();
  console.log('done');
})().catch(e => { console.error(e); process.exit(1); });
