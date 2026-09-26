const fs = require('fs');

async function resolvePhotoPage(pageUrl) {
  try {
    const res = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await res.text();
    // Look for images.unsplash.com
    const regex = /https:\/\/images\.unsplash\.com\/photo-[0-9a-zA-Z_-]+/g;
    const matches = html.match(regex);
    if (matches && matches.length > 0) {
      // Find the main photo
      const unique = [...new Set(matches)];
      for (const m of unique) {
        if (!m.includes('profile')) {
          return m + '?auto=format&fit=crop&w=600&q=80';
        }
      }
    }
  } catch (e) {
    console.error(`Error resolving ${pageUrl}:`, e.message);
  }
  return null;
}

async function verifyAndDownload(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`❌ Failed (${res.status}): ${url}`);
      return false;
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      console.log(`❌ Not image (${contentType}): ${url}`);
      return false;
    }
    const buf = await res.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buf));
    console.log(`✅ OK (${buf.byteLength} bytes) -> ${dest}`);
    return true;
  } catch (e) {
    console.log(`❌ Error: ${e.message}`);
    return false;
  }
}

module.exports = { resolvePhotoPage, verifyAndDownload };
