async function searchUnsplash(query) {
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=5`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  if (!res.ok) {
    console.error('NAPI error:', res.status);
    return [];
  }
  const data = await res.json();
  return (data.results || []).map(r => ({
    id: r.id,
    description: r.alt_description || r.description,
    regular: r.urls.regular,
    small: r.urls.small,
    raw: r.urls.raw,
  }));
}

async function run() {
  const queries = [
    'raw chicken breast',
    'challah bread',
    'cherry tomatoes',
    'pita bread',
    'medjool dates',
    'ground black pepper',
    'tomato paste',
    'croissant',
    'raw chicken pieces',
    'shredded cheese',
    'cottage cheese',
    'goat cheese',
    'dried chickpeas',
    'walnuts',
    'red lentils',
    'paprika powder'
  ];

  for (const q of queries) {
    console.log(`\n=== Query: "${q}" ===`);
    const results = await searchUnsplash(q);
    for (const r of results.slice(0, 3)) {
      console.log(`- [${r.id}] ${r.description}`);
      console.log(`  ${r.small}`);
    }
  }
}

run();
