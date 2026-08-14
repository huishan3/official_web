import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { collection, doc, getFirestore, onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { firebaseConfig, melodyAppId } from './firebase-config.js';

const app = initializeApp(firebaseConfig, 'melody-public');
const db = getFirestore(app);
const dataRoot = `artifacts/${melodyAppId}/public/data`;
const productsRef = collection(db, `${dataRoot}/coffeeProducts`);
const settingsRef = doc(db, `${dataRoot}/siteSettings/commerce`);
const reviewsRef = collection(db, `${dataRoot}/customerReviews`);
const editorialRef = doc(db, `${dataRoot}/siteContent/editorial`);
const quizQuestionsRef = collection(db, `${dataRoot}/quiz_questions`);
const quizOptionsRef = collection(db, `${dataRoot}/quiz_options`);
const quizRulesRef = collection(db, `${dataRoot}/quiz_recommendations`);

const fallbackProduct = {
  id: 'ethiopia-yirgacheffe',
  name: '衣索比亞 耶加雪菲',
  flavor: '茉莉花｜檸檬｜佛手柑',
  acidity: 4,
  bitterness: 1,
  brewMethod: '手沖',
  weight: '227g',
  country: '衣索比亞',
  roast: '淺焙',
  roastDate: '依包裝標示',
  price: 380,
  stock: 24,
  featured: true,
  enabled: true,
  imageUrl: 'image/image_1.jpg',
  productIntro: '明亮柑橘酸質與細緻花香，尾韻乾淨，適合喜歡清爽手沖風味的你。',
  isLocalFallback: true
};

const defaultQuiz = {
  questions: [
    { id: 'flavor_preference', questionText: '你偏好哪種風味？', questionOrder: 1 },
    { id: 'brew_method', questionText: '你使用哪種沖煮方式？', questionOrder: 2 },
    { id: 'desired_feeling', questionText: '你希望咖啡帶來什麼感受？', questionOrder: 3 }
  ],
  options: [
    { id: 'floral_fruity', questionId: 'flavor_preference', optionText: '花果香', optionOrder: 1, flavorTags: ['floral', 'fruity'] },
    { id: 'chocolate_nutty', questionId: 'flavor_preference', optionText: '巧克力堅果', optionOrder: 2, flavorTags: ['chocolate', 'nutty'] },
    { id: 'rich_low_acid', questionId: 'flavor_preference', optionText: '濃郁低酸', optionOrder: 3, flavorTags: ['rich', 'low-acid'] },
    { id: 'pour_over', questionId: 'brew_method', optionText: '手沖', optionOrder: 1, flavorTags: ['pour-over'] },
    { id: 'espresso_machine', questionId: 'brew_method', optionText: '義式咖啡機', optionOrder: 2, flavorTags: ['espresso'] },
    { id: 'french_press', questionId: 'brew_method', optionText: '法式濾壓', optionOrder: 3, flavorTags: ['french-press'] },
    { id: 'refreshing', questionId: 'desired_feeling', optionText: '清爽', optionOrder: 1, flavorTags: ['refreshing'] },
    { id: 'balanced', questionId: 'desired_feeling', optionText: '平衡', optionOrder: 2, flavorTags: ['balanced'] },
    { id: 'full_bodied', questionId: 'desired_feeling', optionText: '厚重', optionOrder: 3, flavorTags: ['full-bodied'] }
  ]
};

const defaultSettings = {
  roasterName: 'TODO：請由後台填寫烘豆師姓名',
  roasterExperience: 'TODO：請由後台填寫烘豆師經歷',
  roastDateCopy: 'TODO：請由後台填寫新鮮烘焙方式與日期說明',
  returnsPolicy: 'TODO：請由後台填寫正式退換貨規則',
  deliveryTime: 'TODO：請由後台填寫配送時間',
  shippingFee: 60,
  freeShippingThreshold: 1200,
  paymentMethods: '貨到付款；其他付款方式 TODO：請由後台確認',
  contactPhone: 'TODO：請由後台填寫聯絡電話',
  responseHours: 'TODO：請由後台填寫客服回覆時間',
  orderEmail: 'melodybean33427@gmail.com',
  isSample: true
};

const defaultReviews = [];

const defaultEditorial = {
  story: {
    title: '我們的故事',
    headline: '從樂音到咖啡香，始於一份純粹的熱愛',
    body: '23 年前的今天，樂海樂器正式開幕，那是我們對聲音藝術的初心。一路走來，我們陪伴無數樂友選琴、修琴，更一起分享著對美好樂音的熱愛與執著。\n\n2021 年，一場突如其來的疫情三級警戒，讓我心中湧現了不安。就在那段幾乎與世隔絕的日子裡，我卻意外地一頭栽進了咖啡烘焙的奇妙世界。咖啡的醇厚香氣，彷彿成了另一種心靈的安定劑與創意的泉源。\n\n2024 年，我榮幸地參加烘豆比賽並獲得獎項，這份肯定更加堅定了我走上「雙品牌職人之路」的決心。從揚琴工坊的精湛細膩手工，到精品咖啡豆的精準火候掌控，我始終堅信，聲音與風味都是值得我們傾注心血、用心雕琢的藝術。',
    videoTitle: '我們的品牌故事影片',
    videoUrl: 'video/video_1.mp4'
  },
  artisan: {
    title: '幕後職人',
    role: '創辦人 / 首席烘豆師',
    name: '陳師傅',
    imageUrl: 'image/image_3.jpg',
    bio: '擁有超過20年的樂器製作工藝背景，將對精準與和諧的追求，完美轉化為對咖啡烘焙的熱情。對他而言，每一條烘焙曲線，都像是在譜寫一首動人的樂曲。\n\n由陳師傅親自烘培，確保每一顆豆子都能展現其最佳風味。'
  },
  academy: {
    title: '線上咖啡小學堂',
    intro: '一些關於咖啡的趣聞與知識，希望能豐富您的咖啡生活。',
    articles: [
      { title: '手沖咖啡新手入門', summary: '想在家享受一杯完美的手沖咖啡嗎？從磨豆、水溫到注水技巧，我們為您整理了幾個關鍵步驟，讓您輕鬆上手。', detail: '手沖咖啡是一門藝術，也是一種享受。準備手沖壺、濾杯、濾紙、磨豆機、電子秤與計時器；水溫可從 88°C 至 92°C 開始，咖啡粉與水的比例約為 1:15 至 1:18。\n\n第一次注水先均勻潤濕咖啡粉，等待 20 至 30 秒完成悶蒸，再分 2 至 3 次穩定注水，總沖泡時間可控制在 2 至 3 分鐘。' },
      { title: '如何保存咖啡豆？', summary: '咖啡豆是嬌貴的農產品。避免光線、空氣、濕氣和高溫，是保持新鮮風味的重要原則。', detail: '咖啡豆最大的敵人是光線、空氣、濕氣與高溫。建議使用不透光、密封性良好的容器，存放在陰涼乾燥處，避免陽光直射。\n\n研磨後風味流失速度會加快，因此建議喝多少磨多少。若需要長期冷凍保存，應使用真空密封包裝並避免反覆解凍。' },
      { title: '音樂與咖啡的完美結合', summary: '聆聽不同類型的音樂，可能會影響您對咖啡風味的感受。下次品嚐時，不妨搭配古典樂或爵士樂。', detail: '音樂可能透過情緒、節奏、音高與音色，影響我們對咖啡風味的感受。輕柔的古典樂或爵士樂能營造放鬆氛圍，高音調可能讓酸質顯得更明亮，低沉音符則可能加強醇厚感。\n\n濃郁型咖啡可嘗試搭配藍調或爵士，清新明亮型咖啡可搭配古典小品或輕快音樂，讓品飲成為更完整的感官體驗。' }
    ]
  },
  faq: {
    title: '常見問題',
    items: [
      { question: 'Melody Bean 的咖啡豆來源為何？', answer: '我們的咖啡豆均來自全球知名的咖啡產區，並與當地優質莊園直接合作，確保每一顆豆子的品質與風味都達到最佳水準。' },
      { question: '如何確保咖啡豆的新鮮度？', answer: 'Melody Bean 採小批量新鮮烘焙，並在烘焙完成後立即使用單向排氣閥包裝，最大限度地保留咖啡豆的香氣與新鮮度。我們建議您在收到咖啡豆後的兩週內享用，以體驗最佳風味。' },
      { question: '咖啡渣還有什麼其他用途？', answer: '咖啡渣是天然的除臭材料，也可視情況作為植物肥料或手作材料。使用前請充分乾燥，並依實際用途注意衛生與適用性。' },
      { question: '是否提供客製化烘焙服務？', answer: '目前我們主要提供精選烘焙度的咖啡豆。若您有特殊需求或大宗採購，歡迎透過聯絡方式與我們聯繫，我們將樂意提供客製化諮詢服務。' }
    ]
  }
};

const state = {
  products: new Map([[fallbackProduct.id, fallbackProduct]]),
  quiz: structuredClone(defaultQuiz),
  quizStep: 0,
  cart: loadCart(),
  recommendation: null,
  settings: { ...defaultSettings },
  editorial: structuredClone(defaultEditorial),
  reviews: [...defaultReviews],
  unsubscribeProducts: null,
  unsubscribeSettings: null,
  unsubscribeReviews: null,
  unsubscribeEditorial: null,
  unsubscribeQuiz: [],
  quizCloud: { questions: null, options: null, rules: null }
};

const byId = (id) => document.getElementById(id);
const elements = {
  networkStatus: byId('network-status'), menuButton: byId('menu-button'), mainNav: byId('main-nav'),
  productsMessage: byId('products-message'), productGrid: byId('product-grid'), productsReload: byId('products-reload'), productTemplate: byId('product-card-template'), featuredProduct: byId('featured-product'),
  quizMessage: byId('quiz-message'), quizForm: byId('quiz-form'), quizQuestions: byId('quiz-questions'), quizSubmit: byId('quiz-submit'), quizReload: byId('quiz-reload'), quizResult: byId('quiz-result'), quizBack: byId('quiz-back'), quizNext: byId('quiz-next'), quizStepLabel: byId('quiz-step-label'), quizProgressLabel: byId('quiz-progress-label'), quizProgressBar: byId('quiz-progress-bar'),
  cartItems: byId('cart-items'), cartCount: byId('cart-count'), cartSubtotal: byId('cart-subtotal'), cartShipping: byId('cart-shipping'), cartTotal: byId('cart-total'), headerCartCount: byId('header-cart-count'), mobileCartCount: byId('mobile-cart-count'), freeShippingCopy: byId('free-shipping-copy'), checkoutButton: byId('checkout-button'),
  trustGrid: byId('trust-grid'), reviewsGrid: byId('reviews-grid'), reviewSummary: byId('review-summary'),
  storyTitle: byId('story-title'), storyHeadline: byId('story-headline'), storyBody: byId('story-body'), storyVideoWrap: byId('story-video-wrap'), storyVideoTitle: byId('story-video-title'), storyVideoContent: byId('story-video-content'),
  artisanTitle: byId('artisan-title'), artisanRole: byId('artisan-role'), artisanName: byId('artisan-name'), artisanBio: byId('artisan-bio'), artisanImage: byId('artisan-image'),
  knowledgeTitle: byId('knowledge-title'), knowledgeIntro: byId('knowledge-intro'), knowledgeGrid: byId('knowledge-grid'), faqTitle: byId('faq-title'), faqList: byId('faq-list'),
  brewVisual: byId('brew-visual'), brewStatus: byId('brew-status'), brewAdd: byId('brew-add'), brewGrind: byId('brew-grind'), brewPour: byId('brew-pour'), brewReset: byId('brew-reset'),
  productDialog: byId('product-dialog'), productDialogContent: byId('product-dialog-content'), checkoutDialog: byId('checkout-dialog'), checkoutForm: byId('checkout-form')
};

function loadCart() {
  try {
    const parsed = JSON.parse(localStorage.getItem('melodyBeanCartV3') || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch { return {}; }
}
function saveCart() { localStorage.setItem('melodyBeanCartV3', JSON.stringify(state.cart)); }
function money(value) { return `NT$${Math.max(0, Number(value) || 0).toLocaleString('zh-TW')}`; }
function stars(value) { return `${'★'.repeat(Math.max(0, Math.min(5, Number(value) || 0)))}${'☆'.repeat(Math.max(0, 5 - (Number(value) || 0)))}`; }
function productImage(product) {
  const source = String(product?.imageUrl || product?.image_url || product?.image || '').trim();
  return /^(https?:\/\/|data:image\/|image\/)/i.test(source) ? source : 'image/image_1.jpg';
}
function safeContentUrl(source, kind = 'image') {
  const value = String(source || '').trim();
  const localPattern = kind === 'video' ? /^video\/[\w./-]+$/i : /^image\/[\w./-]+$/i;
  const remotePattern = kind === 'image' ? /^https:\/\//i : /^https:\/\//i;
  const dataImage = kind === 'image' && /^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(value);
  return localPattern.test(value) || remotePattern.test(value) || dataImage ? value : '';
}
function appendParagraphs(container, value) {
  container.replaceChildren();
  String(value || '').split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean).forEach((text) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    container.appendChild(paragraph);
  });
}
function editorialWithDefaults(source = state.editorial) {
  return {
    story: { ...defaultEditorial.story, ...(source?.story || {}) },
    artisan: { ...defaultEditorial.artisan, ...(source?.artisan || {}) },
    academy: {
      ...defaultEditorial.academy,
      ...(source?.academy || {}),
      articles: defaultEditorial.academy.articles.map((article, index) => ({ ...article, ...(source?.academy?.articles?.[index] || {}) }))
    },
    faq: {
      ...defaultEditorial.faq,
      ...(source?.faq || {}),
      items: defaultEditorial.faq.items.map((item, index) => ({ ...item, ...(source?.faq?.items?.[index] || {}) }))
    }
  };
}
function productDescription(product) { return String(product?.flavor || product?.productIntro || product?.intro || product?.description || '風味資訊更新中'); }
function setMessage(element, message, type = '') {
  element.textContent = message;
  element.className = `message${type ? ` ${type}` : ''}`;
  element.hidden = !message;
}
function fivePointScore(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number) || number <= 0) return 0;
  return Math.min(5, Math.round((number > 5 ? number / 20 : number) * 10) / 10);
}
function normalizeProduct(id, data) {
  const profile = Array.isArray(data.profile) ? data.profile : [];
  return {
    id, ...data,
    acidity: fivePointScore(data.acidity ?? data.profileAcid ?? profile[1] ?? 0),
    bitterness: fivePointScore(data.bitterness ?? data.profileBitter ?? profile[0] ?? 0),
    brewMethod: String(data.brewMethod || data.brew || ''),
    price: Number(data.price || 0),
    stock: Math.max(0, Math.floor(Number(data.stock || 0)))
  };
}
function ensureFeaturedProduct(products) {
  const list = [...products];
  return list.length ? list : [fallbackProduct];
}
function productList() { return ensureFeaturedProduct([...state.products.values()]); }
function featuredProduct() {
  return productList().find((product) => product.featured === true)
    || productList().find((product) => /耶加雪菲|yirgacheffe/i.test(String(product.name || '')))
    || productList()[0]
    || fallbackProduct;
}

function listenToProducts() {
  if (state.unsubscribeProducts) state.unsubscribeProducts();
  setMessage(elements.productsMessage, '正在同步最新商品資料…');
  state.unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
    const serverProducts = snapshot.docs
      .map((document) => normalizeProduct(document.id, document.data()))
      .filter((product) => product.enabled !== false);
    state.products = new Map(ensureFeaturedProduct(serverProducts).map((product) => [product.id, product]));
    synchronizeCart();
    renderProducts(); renderFeatured(); renderCart();
    if (state.recommendation?.product?.id && state.products.has(state.recommendation.product.id)) {
      state.recommendation.product = state.products.get(state.recommendation.product.id);
      renderRecommendation(state.recommendation, false);
    }
    setMessage(elements.productsMessage, '');
  }, (error) => {
    console.error(error);
    if (!state.products.size) state.products.set(fallbackProduct.id, fallbackProduct);
    renderProducts(); renderFeatured(); renderCart();
    setMessage(elements.productsMessage, '目前使用示範商品資料；連線恢復後會自動同步最新庫存。', 'error');
  });
}

function renderProducts() {
  elements.productGrid.replaceChildren();
  const products = productList().sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || String(a.name || '').localeCompare(String(b.name || ''), 'zh-Hant'));
  products.forEach((product) => {
    const fragment = elements.productTemplate.content.cloneNode(true);
    const card = fragment.querySelector('.product-card');
    card.id = `product-${product.id}`;
    const image = fragment.querySelector('.product-image');
    image.src = productImage(product); image.alt = `${product.name || '咖啡商品'} 商品圖片`; image.loading = 'lazy'; image.decoding = 'async';
    image.addEventListener('error', () => { image.src = 'image/image_1.jpg'; }, { once: true });
    const badge = fragment.querySelector('.featured-badge'); badge.hidden = product !== featuredProduct(); badge.textContent = product.isLocalFallback ? '示範資料' : '熱門';
    fragment.querySelector('.product-meta').textContent = [product.country, product.roast, product.weight].filter(Boolean).join(' · ') || 'MELODY BEAN';
    fragment.querySelector('.product-name').textContent = product.name || '未命名商品';
    fragment.querySelector('.product-flavor').textContent = productDescription(product);
    fragment.querySelector('.acidity').textContent = product.acidity ? `酸度 ${product.acidity}／5` : '';
    fragment.querySelector('.bitterness').textContent = product.bitterness ? `苦味 ${product.bitterness}／5` : '';
    fragment.querySelector('.brew-method').textContent = product.brewMethod ? `適合 ${product.brewMethod}` : '';
    fragment.querySelector('.product-price').textContent = money(product.price);
    fragment.querySelector('.product-stock').textContent = product.stock > 0 ? '可下單' : '暫停供應';
    const addButton = fragment.querySelector('.product-add');
    addButton.dataset.productId = product.id; addButton.disabled = product.stock <= 0; addButton.textContent = product.stock > 0 ? '加入購物車' : '暫無庫存';
    const detailButton = fragment.querySelector('.product-detail'); detailButton.dataset.productDetail = product.id;
    elements.productGrid.appendChild(fragment);
  });
}

function renderFeatured() {
  const product = featuredProduct();
  elements.featuredProduct.replaceChildren();
  const card = document.createElement('article'); card.className = 'featured-card'; card.id = `featured-${product.id}`;
  const image = document.createElement('img'); image.className = 'featured-image'; image.src = productImage(product); image.alt = `${product.name} 商品圖片`;
  image.addEventListener('error', () => { image.src = 'image/image_1.jpg'; }, { once: true });
  const copy = document.createElement('div'); copy.className = 'featured-copy';
  const eyebrow = document.createElement('p'); eyebrow.className = 'eyebrow'; eyebrow.textContent = 'FEATURED COFFEE';
  const title = document.createElement('h3'); title.textContent = product.name;
  const flavor = document.createElement('p'); flavor.className = 'featured-flavor'; flavor.textContent = product.flavor || '茉莉花｜檸檬｜佛手柑';
  const intro = document.createElement('p'); intro.className = 'featured-intro'; intro.textContent = product.productIntro || product.intro || product.description || '';
  const tasteList = document.createElement('div'); tasteList.className = 'taste-list';
  [
    ['酸度', `${product.acidity || 4}／5`],
    ['苦味', `${product.bitterness || 1}／5`],
    ['適合', product.brewMethod || '手沖']
  ].forEach(([label, value]) => {
    const item = document.createElement('div'); const small = document.createElement('span'); const strong = document.createElement('strong');
    small.textContent = label; strong.textContent = value; item.append(small, strong); tasteList.appendChild(item);
  });
  const price = document.createElement('div'); price.className = 'featured-price';
  const amount = document.createElement('strong'); amount.textContent = money(product.price || 380);
  const weight = document.createElement('span'); weight.textContent = `${product.weight || '227g'}｜${product.stock > 0 ? '可下單' : '暫停供應'}`; price.append(amount, weight);
  const actions = document.createElement('div'); actions.className = 'featured-actions';
  const add = document.createElement('button'); add.type = 'button'; add.className = 'button button-primary'; add.dataset.productId = product.id; add.textContent = product.stock > 0 ? '加入購物車' : '暫無庫存'; add.disabled = product.stock <= 0;
  const detail = document.createElement('a'); detail.className = 'button button-ghost'; detail.href = `#product-${encodeURIComponent(product.id)}`; detail.textContent = '查看商品詳情';
  actions.append(add, detail);
  const videoUrl = safeContentUrl(product.videoUrl || product.video || product.productVideoUrl, 'video');
  if (videoUrl) { const video = document.createElement('a'); video.className = 'button button-ghost'; video.href = videoUrl; video.target = '_blank'; video.rel = 'noopener noreferrer'; video.textContent = product.videoTitle || '觀看商品影片'; actions.appendChild(video); }
  copy.append(eyebrow, title, flavor); if (intro.textContent) copy.appendChild(intro); copy.append(tasteList, price, actions); card.append(image, copy); elements.featuredProduct.appendChild(card);
}

function synchronizeCart() {
  Object.keys(state.cart).forEach((productId) => {
    const product = state.products.get(productId) || (productId === fallbackProduct.id ? fallbackProduct : null);
    if (!product || product.stock <= 0) { delete state.cart[productId]; return; }
    state.cart[productId] = { id: product.id, name: product.name || '未命名商品', price: Number(product.price || 0), stock: Number(product.stock || 0), quantity: Math.min(Math.max(1, Number(state.cart[productId].quantity || 1)), product.stock) };
  });
  saveCart();
}
function addToCart(productId, shouldScroll = false) {
  const product = state.products.get(productId) || (productId === fallbackProduct.id ? fallbackProduct : state.recommendation?.product);
  if (!product || product.id !== productId) { setMessage(elements.productsMessage, '商品資料已更新，請重新載入後再試。', 'error'); return; }
  const current = Number(state.cart[productId]?.quantity || 0);
  if (Number(product.stock || 0) <= current) { setMessage(elements.productsMessage, '此商品已達目前可購買數量。', 'error'); return; }
  state.cart[productId] = { id: productId, name: product.name || '未命名商品', price: Number(product.price || 0), stock: Number(product.stock || 0), quantity: current + 1 };
  saveCart(); renderCart(); setMessage(elements.productsMessage, `已將「${state.cart[productId].name}」加入購物車。`, 'success');
  if (shouldScroll) byId('cart').scrollIntoView({ behavior: 'smooth' });
}
function changeQuantity(productId, delta) {
  const item = state.cart[productId]; if (!item) return;
  const next = item.quantity + delta;
  if (next <= 0) delete state.cart[productId]; else item.quantity = Math.min(next, item.stock);
  saveCart(); renderCart();
}
function cartTotals() {
  const items = Object.values(state.cart);
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const fee = Math.max(0, Number(state.settings.shippingFee ?? 60));
  const threshold = Math.max(0, Number(state.settings.freeShippingThreshold ?? 1200));
  const shipping = count && (!threshold || subtotal < threshold) ? fee : 0;
  return { items, count, subtotal, shipping, total: subtotal + shipping, threshold };
}
function renderCart() {
  elements.cartItems.replaceChildren();
  const { items, count, subtotal, shipping, total, threshold } = cartTotals();
  elements.cartCount.textContent = `${count} 件`; elements.headerCartCount.textContent = count; elements.mobileCartCount.textContent = count;
  elements.cartSubtotal.textContent = money(subtotal); elements.cartShipping.textContent = count && !shipping ? '免運' : money(shipping); elements.cartTotal.textContent = money(total); elements.checkoutButton.disabled = count === 0;
  if (state.settings.isSample || threshold <= 0) elements.freeShippingCopy.textContent = '運費與免運門檻尚待後台確認。';
  else elements.freeShippingCopy.textContent = !count ? `單筆滿 ${money(threshold)} 免運。` : shipping ? `再購買 ${money(Math.max(0, threshold - subtotal))} 即享免運。` : '本筆訂單已達免運門檻。';
  if (!items.length) { const empty = document.createElement('div'); empty.className = 'message'; empty.textContent = '購物車目前是空的。完成測驗或從商品區加入喜歡的咖啡吧。'; elements.cartItems.appendChild(empty); return; }
  items.forEach((item) => {
    const row = document.createElement('article'); row.className = 'cart-row';
    const copy = document.createElement('div'); const title = document.createElement('h3'); title.textContent = item.name; const price = document.createElement('p'); price.textContent = `${money(item.price)}／件 · 小計 ${money(item.price * item.quantity)}`; copy.append(title, price);
    const quantity = document.createElement('div'); quantity.className = 'quantity';
    [-1, 1].forEach((delta, index) => { if (index === 1) { const value = document.createElement('span'); value.textContent = item.quantity; quantity.appendChild(value); } const button = document.createElement('button'); button.type = 'button'; button.dataset.cartDelta = delta; button.dataset.productId = item.id; button.setAttribute('aria-label', delta < 0 ? '減少數量' : '增加數量'); button.textContent = delta < 0 ? '−' : '＋'; quantity.appendChild(button); });
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'remove-button'; remove.dataset.removeProduct = item.id; remove.textContent = '移除';
    row.append(copy, quantity, remove); elements.cartItems.appendChild(row);
  });
}

function applyQuizCloudData() {
  const { questions, options, rules } = state.quizCloud;
  if (!Array.isArray(questions) || !Array.isArray(options) || !Array.isArray(rules)) return;
  if (questions.length && options.length) {
    state.quiz = { questions, options, rules };
    setMessage(elements.quizMessage, '');
    elements.quizReload.hidden = true;
  } else {
    state.quiz = { ...structuredClone(defaultQuiz), rules: [] };
    setMessage(elements.quizMessage, '目前使用內建三題測驗；可由後台建立並即時調整題目、選項與推薦規則。');
    elements.quizReload.hidden = false;
  }
  state.quizStep = 0;
  elements.quizResult.hidden = true;
  renderQuiz();
}

function useQuizFallback(error) {
  if (error) console.error(error);
  state.quiz = { ...structuredClone(defaultQuiz), rules: [] };
  state.quizStep = 0;
  elements.quizResult.hidden = true;
  elements.quizReload.hidden = false;
  setMessage(elements.quizMessage, '測驗資料暫時無法同步，目前使用內建三題測驗。', 'error');
  renderQuiz();
}

function listenToQuiz() {
  state.unsubscribeQuiz.forEach((unsubscribe) => unsubscribe());
  state.unsubscribeQuiz = [];
  state.quizCloud = { questions: null, options: null, rules: null };
  setMessage(elements.quizMessage, '正在同步風味測驗…');
  const sources = [
    ['questions', query(quizQuestionsRef, where('enabled', '==', true))],
    ['options', query(quizOptionsRef, where('enabled', '==', true))],
    ['rules', query(quizRulesRef, where('enabled', '==', true))]
  ];
  sources.forEach(([key, source]) => {
    const unsubscribe = onSnapshot(source, (snapshot) => {
      state.quizCloud[key] = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      applyQuizCloudData();
    }, useQuizFallback);
    state.unsubscribeQuiz.push(unsubscribe);
  });
}
function renderQuiz() {
  elements.quizQuestions.replaceChildren();
  state.quiz.questions.sort((a, b) => a.questionOrder - b.questionOrder).forEach((question, index) => {
    const fieldset = document.createElement('fieldset'); fieldset.className = 'quiz-question'; fieldset.dataset.step = index; fieldset.hidden = index !== state.quizStep;
    const legend = document.createElement('legend'); legend.textContent = `${index + 1}. ${question.questionText}`; fieldset.appendChild(legend);
    const optionGrid = document.createElement('div'); optionGrid.className = 'option-grid';
    state.quiz.options.filter((option) => option.questionId === question.id).sort((a, b) => a.optionOrder - b.optionOrder).forEach((option) => {
      const label = document.createElement('label'); label.className = 'quiz-option'; const input = document.createElement('input'); input.type = 'radio'; input.name = `question-${question.id}`; input.value = option.id; input.dataset.questionId = question.id; const text = document.createElement('span'); text.textContent = option.optionText; label.append(input, text); optionGrid.appendChild(label);
    });
    fieldset.appendChild(optionGrid); elements.quizQuestions.appendChild(fieldset);
  });
  elements.quizForm.hidden = false; updateQuizStep();
}
function currentQuestion() { return state.quiz.questions[state.quizStep]; }
function selectedAnswer(question = currentQuestion()) { return question ? elements.quizForm.querySelector(`input[name="question-${CSS.escape(question.id)}"]:checked`) : null; }
function updateQuizStep(announce = false) {
  const total = state.quiz.questions.length || 1; const step = Math.min(state.quizStep, total - 1); const percent = Math.round(((step + 1) / total) * 100);
  elements.quizQuestions.querySelectorAll('.quiz-question').forEach((fieldset, index) => { fieldset.hidden = index !== step; });
  elements.quizStepLabel.textContent = `第 ${step + 1} 題，共 ${total} 題`; elements.quizProgressLabel.textContent = `${percent}%`; elements.quizProgressBar.style.width = `${percent}%`;
  elements.quizBack.disabled = step === 0; elements.quizNext.hidden = step === total - 1; elements.quizSubmit.hidden = step !== total - 1;
  if (announce) setMessage(elements.quizMessage, '請選擇一個答案後繼續。', 'error');
}
function goToQuizStep(delta) {
  if (delta > 0 && !selectedAnswer()) { updateQuizStep(true); return; }
  state.quizStep = Math.max(0, Math.min(state.quiz.questions.length - 1, state.quizStep + delta)); setMessage(elements.quizMessage, ''); updateQuizStep();
  elements.quizQuestions.querySelector('.quiz-question:not([hidden]) legend')?.focus?.();
}
function localRecommendation(answers) {
  const selectedOptions = answers.map((answer) => state.quiz.options.find((option) => option.id === answer.optionId)).filter(Boolean);
  const tags = new Set(selectedOptions.flatMap((option) => Array.isArray(option.flavorTags) ? option.flavorTags : []));
  const products = productList();
  const availableProducts = products.filter((product) => Number(product.stock || 0) > 0);
  const selectableProducts = availableProducts.length ? availableProducts : products;
  const productById = (id) => selectableProducts.find((product) => product.id === id);

  const rules = Array.isArray(state.quiz.rules) ? state.quiz.rules : [];
  const matchingRules = rules.filter((rule) => {
    const required = Array.isArray(rule.requiredTags) ? rule.requiredTags : [];
    return !rule.isDefault && required.every((tag) => tags.has(tag)) && productById(rule.productId);
  }).sort((a, b) => (b.requiredTags?.length || 0) - (a.requiredTags?.length || 0) || Number(b.priority || 0) - Number(a.priority || 0));
  const matchedRule = matchingRules[0];
  if (matchedRule) {
    return {
      product: productById(matchedRule.productId),
      recommendationTitle: matchedRule.recommendationTitle || '你的推薦',
      recommendationReason: matchedRule.recommendationReason || '這款咖啡符合你選擇的風味條件。',
      ruleId: matchedRule.id
    };
  }

  const directOption = selectedOptions.filter((option) => productById(option.recommendedProductId)).sort((a, b) => Number(b.recommendationPriority || 0) - Number(a.recommendationPriority || 0))[0];
  if (directOption) {
    return {
      product: productById(directOption.recommendedProductId),
      recommendationTitle: '你的推薦',
      recommendationReason: directOption.recommendationReason || '這款咖啡與你選擇的答案最接近。',
      optionId: directOption.id
    };
  }

  const defaultRule = rules.filter((rule) => rule.isDefault && productById(rule.productId)).sort((a, b) => Number(b.priority || 0) - Number(a.priority || 0))[0];
  if (defaultRule) {
    return {
      product: productById(defaultRule.productId),
      recommendationTitle: defaultRule.recommendationTitle || '你的推薦',
      recommendationReason: defaultRule.recommendationReason || '這款咖啡風味平衡，適合日常飲用。',
      ruleId: defaultRule.id,
      isDefault: true
    };
  }

  const scoreProduct = (product) => {
    const copy = `${product.name || ''} ${product.flavor || ''} ${product.productIntro || ''} ${product.brewMethod || ''}`.toLowerCase();
    let score = product.featured ? 1 : 0;
    if (tags.has('floral')) score += Number(product.acidity || 0) + (/花|果|柑橘|floral|fruit/.test(copy) ? 5 : 0);
    if (tags.has('fruity')) score += /果|莓|柑橘|fruit|berry/.test(copy) ? 5 : 0;
    if (tags.has('chocolate')) score += /巧克力|可可|chocolate|cocoa/.test(copy) ? 6 : 0;
    if (tags.has('nutty')) score += /堅果|核桃|nut/.test(copy) ? 6 : 0;
    if (tags.has('low-acid')) score += Math.max(0, 6 - Number(product.acidity || 3));
    if (tags.has('rich') || tags.has('full-bodied')) score += Number(product.bitterness || 0) + (/中深|深焙|濃郁|厚實/.test(copy) ? 4 : 0);
    if (tags.has('pour-over') && /手沖/.test(copy)) score += 7;
    if (tags.has('espresso') && /義式|espresso/.test(copy)) score += 7;
    if (tags.has('french-press') && /法式|濾壓|french/.test(copy)) score += 7;
    if (tags.has('refreshing')) score += Number(product.acidity || 0);
    if (tags.has('balanced')) score += 5 - Math.abs(Number(product.acidity || 3) - Number(product.bitterness || 3));
    return score;
  };
  const preferred = [...selectableProducts].sort((a, b) => scoreProduct(b) - scoreProduct(a))[0] || fallbackProduct;
  let reason = '風味平衡、容易沖煮，適合作為每天都能享受的一杯。';
  if (tags.has('floral') || tags.has('pour-over') || tags.has('refreshing')) reason = '花香與明亮風味較突出，適合手沖，也符合你偏好的清爽感受。';
  else if (tags.has('chocolate') || tags.has('espresso')) reason = '甜感與醇厚度較平衡，能在濃縮或奶咖中保留清楚風味。';
  else if (tags.has('rich') || tags.has('full-bodied') || tags.has('low-acid')) reason = '口感較厚實、酸感較柔和，符合你想要的濃郁感受。';
  return { product: preferred, recommendationTitle: '你的推薦', recommendationReason: reason, localFallback: true };
}
function submitQuiz(event) {
  event.preventDefault();
  const answers = state.quiz.questions.map((question) => { const selected = selectedAnswer(question); return selected ? { questionId: question.id, optionId: selected.value } : null; });
  const missingIndex = answers.findIndex((answer) => !answer);
  if (missingIndex >= 0) { state.quizStep = missingIndex; updateQuizStep(true); return; }
  elements.quizSubmit.disabled = true; elements.quizSubmit.textContent = '正在比對風味…';
  state.recommendation = localRecommendation(answers);
  setMessage(elements.quizMessage, '推薦完成；本次答案只在目前頁面使用，不會保存姓名、電話或地址。', 'success');
  renderRecommendation(state.recommendation);
  elements.quizSubmit.disabled = false; elements.quizSubmit.textContent = '查看推薦結果';
}
function renderRecommendation(recommendation, shouldScroll = true) {
  const product = recommendation.product; elements.quizResult.replaceChildren();
  const image = document.createElement('img'); image.src = productImage(product); image.alt = `${product.name || '推薦咖啡'} 商品圖片`;
  const copy = document.createElement('div'); const eyebrow = document.createElement('p'); eyebrow.className = 'eyebrow'; eyebrow.textContent = 'YOUR MATCH';
  const title = document.createElement('h3'); title.textContent = recommendation.recommendationTitle || '你的推薦'; const productName = document.createElement('h4'); productName.textContent = product.name || '未命名商品';
  const reason = document.createElement('p'); reason.className = 'reason'; reason.textContent = `推薦原因：${recommendation.recommendationReason || '這款咖啡符合你的風味偏好。'}`;
  const flavor = document.createElement('p'); flavor.className = 'flavor-copy'; flavor.textContent = productDescription(product); const price = document.createElement('strong'); price.className = 'price'; price.textContent = `${product.weight || '227g'}｜${money(product.price)}`;
  const actions = document.createElement('div'); actions.className = 'result-actions';
  const buy = document.createElement('button'); buy.type = 'button'; buy.className = 'button button-primary'; buy.dataset.recommendBuy = product.id; buy.textContent = '立即購買';
  const add = document.createElement('button'); add.type = 'button'; add.className = 'button button-ghost'; add.dataset.recommendAdd = product.id; add.textContent = '加入購物車';
  const unavailable = Number(product.stock || 0) <= 0; buy.disabled = unavailable; add.disabled = unavailable; actions.append(buy, add); copy.append(eyebrow, title, productName, reason, flavor, price, actions); elements.quizResult.append(image, copy); elements.quizResult.hidden = false;
  if (shouldScroll) elements.quizResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function listenToSettings() {
  if (state.unsubscribeSettings) state.unsubscribeSettings();
  state.unsubscribeSettings = onSnapshot(settingsRef, (snapshot) => {
    state.settings = snapshot.exists() ? { ...defaultSettings, ...snapshot.data(), isSample: snapshot.data().isSample === true } : { ...defaultSettings };
    renderTrust(); renderCart();
  }, () => { state.settings = { ...defaultSettings }; renderTrust(); renderCart(); });
}
function listenToReviews() {
  if (state.unsubscribeReviews) state.unsubscribeReviews();
  state.unsubscribeReviews = onSnapshot(query(reviewsRef, where('enabled', '==', true)), (snapshot) => {
    const reviews = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })); state.reviews = reviews.length ? reviews : [...defaultReviews]; renderReviews();
  }, () => { state.reviews = [...defaultReviews]; renderReviews(); });
}
function renderTrust() {
  const settings = state.settings; elements.trustGrid.replaceChildren();
  const featured = featuredProduct();
  const cards = [
    ['烘', '烘豆師', `${settings.roasterName || '資料更新中'}｜${settings.roasterExperience || '經歷更新中'}`],
    ['日', '烘焙日期', featured.roastDate ? `${featured.name}：${featured.roastDate}` : settings.roastDateCopy],
    ['退', '退換貨規則', settings.returnsPolicy], ['配', '配送時間', settings.deliveryTime],
    ['運', '運費與免運', settings.isSample && Number(settings.shippingFee || 0) === 0 && Number(settings.freeShippingThreshold || 0) === 0 ? 'TODO：請由後台填寫運費與免運門檻' : `基本運費 ${money(settings.shippingFee)}；單筆滿 ${money(settings.freeShippingThreshold)} 免運。`],
    ['付', '付款方式', settings.paymentMethods], ['電', '聯絡電話', settings.contactPhone], ['回', '客服回覆時間', settings.responseHours]
  ];
  cards.forEach(([icon, title, content]) => {
    const card = document.createElement('article'); card.className = 'trust-card'; const badge = document.createElement('span'); badge.className = 'trust-icon'; badge.textContent = icon; const heading = document.createElement('h3'); heading.textContent = title; const copy = document.createElement('p'); copy.textContent = content || '資料更新中'; card.append(badge, heading, copy);
    if (settings.isSample) { const sample = document.createElement('span'); sample.className = 'sample-label'; sample.textContent = '示範資料・請由後台替換'; card.appendChild(sample); }
    elements.trustGrid.appendChild(card);
  });
}
function renderReviews() {
  elements.reviewsGrid.replaceChildren(); const reviews = state.reviews.slice(0, 6); const average = reviews.length ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length : 0;
  elements.reviewSummary.textContent = reviews.length ? `${average.toFixed(1)}／5 · ${reviews.length} 則評價${reviews.some((review) => review.isSample) ? '（含示範）' : ''}` : '尚無評價';
  if (!reviews.length) { const empty = document.createElement('div'); empty.className = 'message'; empty.textContent = 'TODO：尚無已確認的顧客評價，請由後台新增真實評價。'; elements.reviewsGrid.appendChild(empty); return; }
  reviews.forEach((review) => { const card = document.createElement('article'); card.className = 'review-card'; const rating = document.createElement('div'); rating.className = 'review-stars'; rating.setAttribute('aria-label', `${review.rating || 0} 顆星`); rating.textContent = stars(review.rating); const quote = document.createElement('blockquote'); quote.textContent = review.content || ''; const cite = document.createElement('cite'); cite.textContent = `${review.customerName || '匿名顧客'}｜${review.productName || 'Melody Bean'}${review.isSample ? '（示範評價）' : ''}`; card.append(rating, quote, cite); elements.reviewsGrid.appendChild(card); });
}

function listenToEditorial() {
  if (state.unsubscribeEditorial) state.unsubscribeEditorial();
  state.unsubscribeEditorial = onSnapshot(editorialRef, (snapshot) => {
    state.editorial = snapshot.exists() ? snapshot.data() : structuredClone(defaultEditorial);
    renderEditorial();
  }, (error) => {
    console.error(error);
    state.editorial = structuredClone(defaultEditorial);
    renderEditorial();
  });
}

function renderEditorial() {
  const content = editorialWithDefaults();
  elements.storyTitle.textContent = content.story.title;
  elements.storyHeadline.textContent = content.story.headline;
  appendParagraphs(elements.storyBody, content.story.body);

  const storyVideoUrl = safeContentUrl(content.story.videoUrl, 'video');
  elements.storyVideoTitle.textContent = content.story.videoTitle || '品牌故事影片';
  elements.storyVideoContent.replaceChildren();
  elements.storyVideoWrap.hidden = !storyVideoUrl;
  if (storyVideoUrl) {
    if (/^video\//i.test(storyVideoUrl) || /\.(?:mp4|webm|ogg)(?:[?#].*)?$/i.test(storyVideoUrl)) {
      const video = document.createElement('video');
      video.controls = true; video.preload = 'metadata'; video.src = storyVideoUrl;
      video.setAttribute('aria-label', elements.storyVideoTitle.textContent);
      elements.storyVideoContent.appendChild(video);
    } else {
      const link = document.createElement('a');
      link.className = 'button button-ghost'; link.href = storyVideoUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = '開啟品牌影片';
      elements.storyVideoContent.appendChild(link);
    }
  }

  elements.artisanTitle.textContent = content.artisan.title;
  elements.artisanRole.textContent = content.artisan.role;
  elements.artisanName.textContent = content.artisan.name;
  appendParagraphs(elements.artisanBio, content.artisan.bio);
  elements.artisanImage.src = safeContentUrl(content.artisan.imageUrl, 'image') || 'image/image_3.jpg';
  elements.artisanImage.alt = `${content.artisan.name || 'Melody Bean'} 幕後職人`;
  elements.artisanImage.onerror = () => { elements.artisanImage.onerror = null; elements.artisanImage.src = 'image/image_3.jpg'; };

  elements.knowledgeTitle.textContent = content.academy.title;
  elements.knowledgeIntro.textContent = content.academy.intro;
  elements.knowledgeGrid.replaceChildren();
  content.academy.articles.filter((article) => article.title || article.summary || article.detail).forEach((article, index) => {
    const card = document.createElement('article');
    const number = document.createElement('span'); number.textContent = String(index + 1).padStart(2, '0');
    const title = document.createElement('h3'); title.textContent = article.title || `咖啡知識 ${index + 1}`;
    const summary = document.createElement('p'); summary.textContent = article.summary || '';
    card.append(number, title, summary);
    if (article.detail) {
      const details = document.createElement('details');
      const detailsTitle = document.createElement('summary'); detailsTitle.textContent = '閱讀完整內容';
      const body = document.createElement('div'); body.className = 'prose-stack'; appendParagraphs(body, article.detail);
      details.append(detailsTitle, body); card.appendChild(details);
    }
    elements.knowledgeGrid.appendChild(card);
  });

  elements.faqTitle.textContent = content.faq.title;
  elements.faqList.replaceChildren();
  content.faq.items.filter((item) => item.question || item.answer).forEach((item) => {
    const details = document.createElement('details');
    const question = document.createElement('summary'); question.textContent = item.question || '常見問題';
    const answer = document.createElement('p'); answer.textContent = item.answer || '';
    details.append(question, answer); elements.faqList.appendChild(details);
  });
}

function openCheckout() {
  if (!cartTotals().count) return;
  elements.checkoutDialog.showModal();
}
function submitCheckout(event) {
  event.preventDefault();
  const totals = cartTotals(); if (!totals.count) return;
  const orderId = `MB-${Date.now()}`;
  const form = new FormData(elements.checkoutForm);
  const itemBlocks = totals.items.map((item, index) => ['ITEM ' + (index + 1), `ProductID: ${item.id}`, `ProductName: ${item.name}`, `QtySold: ${item.quantity}`, `StockAtOrder: ${item.stock}`, `UnitPrice: ${item.price}`, `LineTotal: ${item.price * item.quantity}`].join('\n')).join('\n\n');
  const body = ['Melody Bean Order', `OrderID: ${orderId}`, `CreatedAt: ${new Date().toISOString()}`, `CustomerName: ${form.get('customerName')}`, `CustomerPhone: ${form.get('customerPhone')}`, `CustomerAddress: ${form.get('customerAddress')}`, 'PaymentMethod: COD', `ShippingFee: ${totals.shipping}`, `Subtotal: ${totals.subtotal}`, `Total: ${totals.total}`, `Note: ${form.get('customerNote') || ''}`, '', 'ITEMS', itemBlocks, '', '此信件為貨到付款訂單草稿，寄出前請再次確認內容。'].join('\n');
  const email = String(state.settings.orderEmail || defaultSettings.orderEmail).trim();
  const params = new URLSearchParams({ view: 'cm', fs: '1', to: email, su: `[Melody Bean 訂單] ${orderId}`, body });
  elements.checkoutDialog.close();
  const gmailUrl = `https://mail.google.com/mail/?${params.toString()}`;
  const gmailWindow = window.open(gmailUrl, '_blank');
  if (gmailWindow) gmailWindow.opener = null;
  else window.location.assign(gmailUrl);
}

function openProductDetail(productId) {
  const product = state.products.get(productId) || (productId === fallbackProduct.id ? fallbackProduct : null); if (!product) return;
  const wrap = document.createElement('div'); wrap.className = 'product-detail-content';
  const image = document.createElement('img'); image.src = productImage(product); image.alt = `${product.name} 商品圖片`;
  const copy = document.createElement('div'); const title = document.createElement('h2'); title.id = 'product-dialog-title'; title.textContent = product.name;
  const flavor = document.createElement('p'); flavor.className = 'detail-flavor'; flavor.textContent = product.flavor || '風味資訊更新中';
  const intro = document.createElement('p'); intro.textContent = product.productIntro || product.intro || product.description || '商品介紹更新中';
  const facts = document.createElement('dl'); [['產地',product.country],['焙度',product.roast],['烘焙日期',product.roastDate],['重量',product.weight],['適合',product.brewMethod],['酸度',product.acidity ? `${product.acidity}／5` : ''],['苦味',product.bitterness ? `${product.bitterness}／5` : '']].forEach(([label,value])=>{if(!value)return;const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=value;facts.append(dt,dd);});
  const price = document.createElement('strong'); price.className = 'detail-price'; price.textContent = money(product.price);
  const add = document.createElement('button'); add.type='button'; add.className='button button-primary'; add.textContent=product.stock>0?'加入購物車':'暫停供應'; add.disabled=product.stock<=0; add.addEventListener('click',()=>{addToCart(product.id);elements.productDialog.close();});
  copy.append(title,flavor,intro,facts,price,add);
  const productVideoUrl = safeContentUrl(product.videoUrl || product.video || product.productVideoUrl, 'video');
  if (productVideoUrl) {
    const videoWrap = document.createElement('div'); videoWrap.className = 'product-video';
    const videoTitle = document.createElement('h3'); videoTitle.textContent = product.videoTitle || '商品影片介紹'; videoWrap.appendChild(videoTitle);
    if (/^video\//i.test(productVideoUrl) || /\.(?:mp4|webm|ogg)(?:[?#].*)?$/i.test(productVideoUrl)) {
      const video = document.createElement('video'); video.controls = true; video.preload = 'metadata'; video.src = productVideoUrl; videoWrap.appendChild(video);
    } else {
      const link = document.createElement('a'); link.className = 'text-link'; link.href = productVideoUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = '開啟商品影片'; videoWrap.appendChild(link);
    }
    if (product.videoDescription) { const description = document.createElement('p'); description.textContent = product.videoDescription; videoWrap.appendChild(description); }
    copy.appendChild(videoWrap);
  }
  wrap.append(image,copy); elements.productDialogContent.replaceChildren(wrap); elements.productDialog.showModal();
}

function setBrewStage(stage) {
  elements.brewVisual.dataset.stage = String(stage);
  elements.brewGrind.disabled = stage !== 1;
  elements.brewPour.disabled = stage !== 2;
  const messages = ['咖啡機已準備好。', '咖啡豆已投入，接著進行研磨。', '研磨完成，可以開始沖泡。', '沖泡完成，請享用這杯 Melody Bean。'];
  elements.brewStatus.textContent = messages[stage] || messages[0];
}

elements.menuButton.addEventListener('click', () => {
  const open = elements.menuButton.getAttribute('aria-expanded') !== 'true'; elements.menuButton.setAttribute('aria-expanded', String(open)); elements.mainNav.classList.toggle('open', open); document.body.classList.toggle('menu-open', open); elements.menuButton.querySelector('.sr-only').textContent = open ? '關閉主選單' : '開啟主選單';
});
elements.mainNav.addEventListener('click', (event) => { if (!event.target.closest('a')) return; elements.menuButton.setAttribute('aria-expanded', 'false'); elements.mainNav.classList.remove('open'); document.body.classList.remove('menu-open'); });
elements.productGrid.addEventListener('click', (event) => { const detail = event.target.closest('[data-product-detail]'); if (detail) { openProductDetail(detail.dataset.productDetail); return; } const button = event.target.closest('[data-product-id]'); if (button) addToCart(button.dataset.productId); });
elements.featuredProduct.addEventListener('click', (event) => { const button = event.target.closest('[data-product-id]'); if (button) addToCart(button.dataset.productId, true); });
elements.cartItems.addEventListener('click', (event) => { const delta = event.target.closest('[data-cart-delta]'); if (delta) changeQuantity(delta.dataset.productId, Number(delta.dataset.cartDelta)); const remove = event.target.closest('[data-remove-product]'); if (remove) { delete state.cart[remove.dataset.removeProduct]; saveCart(); renderCart(); } });
elements.quizResult.addEventListener('click', (event) => { const add = event.target.closest('[data-recommend-add]'); const buy = event.target.closest('[data-recommend-buy]'); if (add) addToCart(add.dataset.recommendAdd); if (buy) addToCart(buy.dataset.recommendBuy, true); });
elements.quizNext.addEventListener('click', () => goToQuizStep(1)); elements.quizBack.addEventListener('click', () => goToQuizStep(-1)); elements.quizForm.addEventListener('submit', submitQuiz);
elements.quizForm.addEventListener('reset', () => setTimeout(() => { state.quizStep = 0; state.recommendation = null; elements.quizResult.hidden = true; setMessage(elements.quizMessage, '已清除答案，請重新選擇。'); updateQuizStep(); }, 0));
elements.quizQuestions.addEventListener('change', () => setMessage(elements.quizMessage, ''));
elements.quizReload.addEventListener('click', listenToQuiz); elements.productsReload.addEventListener('click', listenToProducts); elements.checkoutButton.addEventListener('click', openCheckout);
elements.checkoutForm.addEventListener('submit', submitCheckout);
elements.brewAdd.addEventListener('click', () => setBrewStage(1));
elements.brewGrind.addEventListener('click', () => setBrewStage(2));
elements.brewPour.addEventListener('click', () => setBrewStage(3));
elements.brewReset.addEventListener('click', () => setBrewStage(0));
document.addEventListener('click', (event) => { const close = event.target.closest('[data-close-dialog]'); if (close) close.closest('dialog')?.close(); });
window.addEventListener('offline', () => { elements.networkStatus.hidden = false; elements.networkStatus.textContent = '網路已中斷；商品與測驗會暫時使用目前資料。'; });
window.addEventListener('online', () => { elements.networkStatus.hidden = true; listenToProducts(); listenToSettings(); listenToReviews(); listenToEditorial(); listenToQuiz(); });

byId('current-year').textContent = new Date().getFullYear();
renderProducts(); renderFeatured(); renderCart(); renderTrust(); renderReviews(); renderEditorial(); renderQuiz(); setBrewStage(0);
listenToProducts(); listenToSettings(); listenToReviews(); listenToEditorial(); listenToQuiz();
