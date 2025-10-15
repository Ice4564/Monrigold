const products = [
  { name:'เสื้อดอกดาว', price:350, desc:'เสื้อผ้าธรรมชาติย้อมจากดอกดาวเรือง', img:['https://picsum.photos/400/400?random=2','https://picsum.photos/400/400?random=3'] },
  { name:'ผ้าพันคอดอกดาว', price:250, desc:'ผ้าพันคอนุ่ม ระบายอากาศดี', img:['https://picsum.photos/400/400?random=4'] },
  { name:'กระโปรงดอกดาว', price:400, desc:'กระโปรงงานแฮนด์เมด สีสดใส', img:['https://picsum.photos/400/400?random=5','https://picsum.photos/400/400?random=6'] }
];

const grid = document.getElementById('product-grid');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalName = document.getElementById('modal-name');
const modalDesc = document.getElementById('modal-desc');
const modalPrice = document.getElementById('modal-price');
const closeModalBtn = document.getElementById('close-modal');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentProduct = 0;
let currentImgIndex = 0;

function renderProducts(){
  grid.innerHTML='';
  products.forEach((p,i)=>{
    const div=document.createElement('div');
    div.className='product';
    div.onclick=()=>showDetail(i);
    const img=document.createElement('img');
    img.src=p.img[0];
    img.alt=p.name;
    const h3=document.createElement('h3');
    h3.textContent=p.name;
    const price=document.createElement('span');
    price.className='price';
    price.textContent='฿'+p.price;
    div.appendChild(img);
    div.appendChild(h3);
    div.appendChild(price);
    grid.appendChild(div);
  });
}

function showDetail(i){
  currentProduct=i;
  currentImgIndex=0;
  updateModal();
  modal.classList.add('open');
}

function updateModal(){
  const p = products[currentProduct];
  modalImg.src = p.img[currentImgIndex];
  modalName.textContent = p.name;
  modalDesc.textContent = p.desc;
  modalPrice.textContent = 'ราคา: ฿'+p.price;
  prevBtn.style.display = p.img.length>1?'flex':'none';
  nextBtn.style.display = p.img.length>1?'flex':'none';
}

modalImg.addEventListener('click',()=>modalImg.classList.toggle('zoomed'));

prevBtn.addEventListener('click',e=>{
  e.stopPropagation();
  const p = products[currentProduct];
  currentImgIndex=(currentImgIndex-1+p.img.length)%p.img.length;
  updateModal();
});
nextBtn.addEventListener('click',e=>{
  e.stopPropagation();
  const p = products[currentProduct];
  currentImgIndex=(currentImgIndex+1)%p.img.length;
  updateModal();
});

closeModalBtn.addEventListener('click',()=>modal.classList.remove('open'));
modal.addEventListener('click',e=>{if(e.target===modal) modal.classList.remove('open');});

document.getElementById('year').textContent = new Date().getFullYear();
renderProducts();
