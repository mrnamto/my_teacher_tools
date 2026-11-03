/* common.js – dùng chung cho các tool. Chỉ chỉnh giao diện, không đụng logic tính toán. */
(function(){
  var emb=false;try{emb=self!==top}catch(e){emb=true}
  if(emb)document.documentElement.classList.add("embedded");
  var css="html.embedded .top .brand{display:none}"+
   "html.embedded .top:not(:has(.seg,.tabs,.tools,.acts)){display:none}"+
   ".exs{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:0 0 10px;font-size:.85rem;color:#5b6b8a}"+
   ".exs b{font-weight:600}"+
   ".exs button{border:1px solid #cfdcf3;background:#fff;color:#1d4ed8;border-radius:999px;padding:4px 11px;cursor:pointer;font:inherit}"+
   ".exs button:hover{background:#dbeafe}";
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
  /* Hàng "Ví dụ mẫu": exampleChips(phần_tử_chứa, [[nhãn, hàm], ...]) */
  window.exampleChips=function(host,items){
    if(!host)return;var d=document.createElement("div");d.className="exs";
    var l=document.createElement("b");l.textContent="Ví dụ mẫu:";d.appendChild(l);
    items.forEach(function(it){var b=document.createElement("button");b.type="button";b.textContent=it[0];b.onclick=it[1];d.appendChild(b)});
    host.insertBefore(d,host.firstChild);
  };
})();
