const $ = s => document.querySelector(s);
const money = n => "₹" + n.toLocaleString("en-IN");
let cart = JSON.parse(localStorage.getItem("styleAuraCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("styleAuraWish") || "[]");
let activeFilter = "All";
let query = "";

function renderProducts(){
 const list = PRODUCTS.filter(p => (activeFilter==="All" || p.category===activeFilter || (activeFilter==="Women" && p.category==="Casual")) && p.name.toLowerCase().includes(query));
 $("#productGrid").innerHTML = list.length ? list.map(p=>`
 <article class="product-card">
  <span class="discount">${Math.round((1-p.price/p.old)*100)}% OFF</span>
  <button class="heart ${wishlist.includes(p.id)?"selected":""}" data-wish="${p.id}" aria-label="Add to wishlist">${wishlist.includes(p.id)?"♥":"♡"}</button>
  <img class="product-image" src="assets/images/${p.image}" alt="${p.name}">
  <div class="product-info"><h3>${p.name}</h3><div class="rating">★ ${p.rating} <span style="color:#aaa">· Customer favourite</span></div>
  <div><span class="price">${money(p.price)}</span><span class="old-price">${money(p.old)}</span></div>
  <button class="add-btn" data-add="${p.id}">＋ Add to bag</button></div>
 </article>`).join("") : '<p>No styles found. Try another search.</p>';
}
function save(){localStorage.setItem("styleAuraCart",JSON.stringify(cart));localStorage.setItem("styleAuraWish",JSON.stringify(wishlist));updateCounts();}
function updateCounts(){const count=cart.reduce((s,x)=>s+x.qty,0);$("#cartCount").textContent=count;$("#drawerCount").textContent=`(${count})`;$("#wishCount").textContent=wishlist.length;$("#subtotal").textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));}
function renderCart(){
 $("#cartItems").innerHTML=cart.length?cart.map(x=>{const p=PRODUCTS.find(p=>p.id===x.id);return `<div class="cart-row"><img src="assets/images/${p.image}" alt="${p.name}"><div style="flex:1"><h4>${p.name}</h4><p>${money(p.price)}</p><div class="qty"><button data-qty="${p.id}" data-change="-1">−</button>${x.qty}<button data-qty="${p.id}" data-change="1">+</button><button class="remove" data-remove="${p.id}">Remove</button></div></div></div>`}).join(""):'<p class="empty">Your bag is waiting for something lovely.</p>';
 updateCounts();
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2100);}
function openCart(){renderCart();$("#overlay").classList.add("show");$("#cartDrawer").classList.add("open");}
function closeCart(){$("#overlay").classList.remove("show");$("#cartDrawer").classList.remove("open");}
$("#productGrid").addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");const wish=e.target.closest("[data-wish]");
 if(add){const id=Number(add.dataset.add),line=cart.find(x=>x.id===id);if(line)line.qty++;else{const p=PRODUCTS.find(x=>x.id===id);cart.push({id,price:p.price,qty:1});}save();toast("Added to your bag ♡");}
 if(wish){const id=Number(wish.dataset.wish);wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];save();renderProducts();toast(wishlist.includes(id)?"Saved to wishlist":"Removed from wishlist");}
});
$("#cartItems").addEventListener("click",e=>{
 const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");
 if(q){const id=Number(q.dataset.qty),line=cart.find(x=>x.id===id);line.qty+=Number(q.dataset.change);if(line.qty<=0)cart=cart.filter(x=>x.id!==id);}
 if(r)cart=cart.filter(x=>x.id!==Number(r.dataset.remove));save();renderCart();
});
$("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
document.querySelectorAll("[data-filter-link]").forEach(a=>a.addEventListener("click",()=>{activeFilter=a.dataset.filterLink;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter));renderProducts();}));
$("#searchInput").addEventListener("input",e=>{query=e.target.value.trim().toLowerCase();renderProducts();});
$("#cartBtn").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#overlay").addEventListener("click",closeCart);
$("#wishlistBtn").addEventListener("click",()=>{activeFilter="All";query="";$("#searchInput").value="";renderProducts();toast(wishlist.length?`You have ${wishlist.length} saved favourite(s) ♡`:"Your wishlist is empty");document.querySelector("#shop").scrollIntoView();});
$("#checkoutBtn").addEventListener("click",()=>toast(cart.length?"Checkout demo: connect a payment provider to accept real orders.":"Your bag is empty."));
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();toast("Thanks for subscribing! ♡");e.target.reset();});
$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
renderProducts();updateCounts();