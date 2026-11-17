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

/* ===== Đọc biểu thức số: 1/2, -3/4, √2, 2√3, √(5-2), 2π/3, (1+√5)/2, 1,5 ... (NaN nếu sai) ===== */
window.xev=function(s){s=String(s).trim().replace(/,/g,'.').replace(/\s+/g,'').replace(/π/g,'pi').replace(/√|căn/gi,'sqrt').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/[−–]/g,'-');
 if(!s||!/^[0-9a-z+\-*/^().]*$/i.test(s))return NaN;
 var i=0,bad=function(){i=1e9;return NaN},E,T,U,P,A;
 E=function(){var v=T();while(s[i]=='+'||s[i]=='-'){var o=s[i++],r=T();v=o=='+'?v+r:v-r}return v};
 T=function(){var v=U();for(;;){var c=s[i];if(c=='*'||c=='/'){i++;var r=U();v=c=='*'?v*r:v/r}else if(c=='('||s.indexOf('sqrt',i)==i||s.indexOf('pi',i)==i)v*=U();else break}return v};
 U=function(){if(s[i]=='-'){i++;return-U()}if(s[i]=='+'){i++;return U()}var b=P();if(s[i]=='^'){i++;return Math.pow(b,U())}return b};
 P=function(){if(s[i]=='('){i++;var v=E();if(s[i]!=')')return bad();i++;return v}
  if(s.indexOf('sqrt',i)==i){i+=4;return Math.sqrt(s[i]=='('?P():A())}
  return A()};
 A=function(){if(s[i]=='(')return P();if(s.indexOf('pi',i)==i){i+=2;return Math.PI}if(s.indexOf('sqrt',i)==i)return P();
  var m=/^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(s.slice(i));if(!m)return bad();i+=m[0].length;return+m[0]};
 var v=E();return i==s.length&&isFinite(v)?v:NaN};
/* ===== Ô nhập số có class "xn": thanh chèn √ π / ( ) ^, phím ↑↓ đổi giá trị, viền đỏ khi nhập sai ===== */
(function(){
 var st=document.createElement('style');st.textContent='.xn.bad{outline:2px solid #dc2626;border-color:#dc2626}#xk{position:fixed;z-index:9999;display:flex;gap:4px;padding:4px;background:#fff;border:1px solid #cfdcf3;border-radius:10px;box-shadow:0 6px 18px rgba(15,31,61,.2)}#xk[hidden]{display:none}#xk button{min-width:2.1em;padding:.25em .55em;border:1px solid #cfdcf3;background:#eef4ff;color:#0f1f3d;border-radius:8px;font:600 14px system-ui,sans-serif;cursor:pointer}#xk button:hover{background:#dbeafe}';
 document.head.appendChild(st);
 var bar=null,cur=null;
 function mk(){if(bar)return bar;if(document.getElementById('xk'))return null;
  bar=document.createElement('div');bar.id='xk';bar.hidden=true;bar.setAttribute('aria-label','Chèn nhanh ký hiệu');
  bar.innerHTML=['√(','π','/','(',')','^'].map(function(t){return'<button type="button">'+t+'</button>'}).join('');
  document.body.appendChild(bar);
  bar.addEventListener('pointerdown',function(e){e.preventDefault()});
  bar.onclick=function(e){var b=e.target.closest('button');if(!b||!cur)return;var t=b.textContent,a=cur.selectionStart,z=cur.selectionEnd,v=cur.value;
   cur.value=v.slice(0,a)+t+v.slice(z);cur.setSelectionRange(a+t.length,a+t.length);cur.dispatchEvent(new Event('input',{bubbles:true}));cur.focus()};
  return bar}
 document.addEventListener('focusin',function(e){var t=e.target;
  if(t.matches&&t.matches('input.xn')){var b=mk();if(!b)return;cur=t;b.hidden=false;var r=t.getBoundingClientRect();
   b.style.left=Math.max(4,Math.min(innerWidth-b.offsetWidth-4,r.left))+'px';b.style.top=Math.min(innerHeight-b.offsetHeight-4,r.bottom+4)+'px'}
  else if(bar&&!bar.contains(t)){bar.hidden=true;cur=null}});
 document.addEventListener('input',function(e){var t=e.target;if(t.matches&&t.matches('input.xn')){var v=xev(t.value);t.classList.toggle('bad',t.value.trim()!==''&&!isFinite(v))}});
 document.addEventListener('keydown',function(e){var t=e.target;if(!(t.matches&&t.matches('input.xn'))||(e.key!=='ArrowUp'&&e.key!=='ArrowDown'))return;
  var v=xev(t.value);if(!isFinite(v))return;var s=parseFloat(t.getAttribute('step'));if(!(s>0))s=1;
  t.value=String(+(v+(e.key==='ArrowUp'?s:-s)).toFixed(10));t.dispatchEvent(new Event('input',{bubbles:true}));e.preventDefault()});
})();

/* Esc trong tool đang nhúng: báo cho trang mẹ để thoát chế độ trình chiếu */
(function(){var emb=false;try{emb=self!==top}catch(e){emb=true}
 if(emb)addEventListener('keydown',function(e){if(e.key==='Escape'){try{parent.postMessage({bct:'esc'},'*')}catch(x){}}});})();
