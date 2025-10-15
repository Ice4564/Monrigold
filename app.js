// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "https://selling-clothes-7724b-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MSG_SENDER",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM refs
const logoImg = document.getElementById('logo-img');
const siteNameEl = document.getElementById('site-name');
const siteSubEl = document.getElementById('site-sub');
const siteTagsEl = document.getElementById('site-tags');
const heroTitleEl = document.getElementById('hero-title');
const heroSubEl = document.getElementById('hero-sub');
const heroTagsEl = document.getElementById('hero-tags');
const grid = document.getElementById('product-grid');

const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalName = document.getElementById('modal-name');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const closeModalBtn = document.getElementById('close-modal');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let productsData = [];
let currentProduct = 0;
let currentImgIndex = 0;

// ดึง Site Info
db.ref('siteInfo').on('value', snap=>{
  const data = snap.val()||{};
  logoImg.src = data.logo || '';
  siteNameEl.textContent = data.name || 'Monrigold';
  siteSubEl.textContent = data.sub || '';
  siteTagsEl.textContent = (data.tags||[]).join(' · ');
});

// ดึง Hero
db.ref('hero').on('value', snap=>{
  const data = snap.val()||{};
  heroTitleEl.textContent = data.title || '';
  heroSubEl.textContent = data.sub || '';
  heroTagsEl.innerHTML = (data.tags||[]).map(t=>`<span class="chip">${t}</span>`).join('');
});

// ดึง Products
db.ref('products').on('value', snap=>{
  const data = snap.val()||{};
  productsData = Object.values(data).map(p=>({
    name: p.name || '',
    price: p.price || 0,
    desc: p.desc || '',
    img: (p.img && p.img.length>0) ? p.img : ['https://via.placeholder.com/300']
  }));
  renderProducts();
});

// Render Products Grid
function renderProducts(){
  grid.innerHTML='';
  productsData.forEach((p,i)=>{
    const div = document.createElement('div');
    div.className='product';
    div.onclick=()=>showDetail(i);
    div.innerHTML=`
      <img src="${p.img[0]}" alt="${p.name}">
      <h3>${p.name}</h3>
      <span class="price">฿${p.price}</span>
    `;
    grid.appendChild(div);
  });
}

// Modal
function showDetail(index){
  currentProduct=index;
  currentImgIndex=0;
  updateModal();
  modal.classList.add('open');
}

function updateModal(){
  const p = productsData[currentProduct];
  modalImg.src = p.img[currentImgIndex];
  modalName.textContent = p.name;
  modalDesc.textContent = p.desc;
  modalPrice.textContent = 'ราคา: ฿'+p.price;
  prevBtn.style.display = p.img.length>1 ? 'flex' : 'none';
  nextBtn.style.display = p.img.length>1 ? 'flex' : 'none';
}

// Modal controls
modalImg.addEventListener('click', ()=> modalImg.classList.toggle('zoomed'));
prevBtn.addEventListener('click', e=>{
  e.stopPropagation();
  const p = productsData[currentProduct];
  currentImgIndex = (currentImgIndex - 1 + p.img.length) % p.img.length;
  updateModal();
});
nextBtn.addEventListener('click', e=>{
  e.stopPropagation();
  const p = productsData[currentProduct];
  currentImgIndex = (currentImgIndex + 1) % p.img.length;
  updateModal();
});
closeModalBtn.addEventListener('click', ()=> modal.classList.remove('open'));
modal.addEventListener('click', e=>{if(e.target===modal) modal.classList.remove('open');});

document.getElementById('year').textContent = new Date().getFullYear();
