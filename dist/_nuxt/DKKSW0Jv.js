const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./CTIYYgSw.js","./CtAU1ONZ.js","./entry.DusLzrOu.css"])))=>i.map(i=>d[i]);
import{_ as v,m as c,r as _,f as m,i as k,by as x,c as w,o as u,C as E,D as V}from"./CtAU1ONZ.js";import{E as B}from"./Dhm4s-2b.js";import{u as S}from"./BGuNctXq.js";const T={class:"tinymce-editor"},p="2i64hds9y2pudvppatub5l7yvbpfncjva29myumeyneiqnzl",C={__name:"EditorTinyMCE",props:{modelValue:{type:String,default:""},disabled:{type:Boolean,default:!1},placeholder:{type:String,default:"Saisissez votre texte ici..."}},emits:["update:modelValue"],setup(r,{emit:f}){const h=S(),o=c(()=>h.shouldBeDark()),i=r,g=f,a=_(i.modelValue);m(()=>i.modelValue,e=>{a.value=e}),m(a,e=>{g("update:modelValue",e)});const b=c(()=>({apiKey:p,height:300,menubar:!0,plugins:["advlist","autolink","lists","link","image","charmap","preview","anchor","searchreplace","visualblocks","code","fullscreen","insertdatetime","media","table","help","wordcount","emoticons"],toolbar:"undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat | emoticons | help",content_style:`
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: ${o.value?"#e5e7eb":"#374151"};
      background-color: ${o.value?"#1f2937":"#ffffff"};
    }
    p { margin: 0 0 1rem 0; }
    h1, h2, h3, h4, h5, h6 {
      font-weight: 600;
      margin: 1.5rem 0 0.75rem 0;
    }
    ul, ol { padding-left: 1.5rem; }
    blockquote {
      border-left: 4px solid rgb(var(--color-primary-300));
      padding-left: 1rem;
      font-style: italic;
      color: ${o.value?"#9ca3af":"#6b7280"};
    }
  `,language:"fr_FR",branding:!1,skin:o.value?"oxide-dark":"oxide",content_css:o.value?"dark":"default",placeholder:i.placeholder,images_upload_handler:async(e,l)=>new Promise((n,s)=>{const d=new FormData;d.append("file",e.blob(),e.filename()),fetch("/api/upload",{method:"POST",body:d}).then(t=>t.json()).then(t=>{t.location?n(t.location):s("Upload failed")}).catch(()=>{s("Upload failed")})}),font_family_formats:"Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times; Courier New=courier new,courier; Georgia=georgia,palatino; Verdana=verdana,geneva",font_size_formats:"8px 9px 10px 11px 12px 14px 16px 18px 24px 30px 36px 48px",emoticons_database:"emojis",color_map:["#000000","Noir","#ffffff","Blanc","#ef4444","Rouge","#f59e0b","Orange","#10b981","Vert","#3b82f6","Bleu","#8b5cf6","Violet","rgb(var(--color-primary-500))","Primaire"]})),y=e=>{console.log("TinyMCE initialisé avec succès")};return k(()=>{typeof window<"u"&&!window.tinymce&&x(()=>import("./CTIYYgSw.js").then(e=>e.t),__vite__mapDeps([0,1,2]),import.meta.url).then(e=>{})}),(e,l)=>(u(),w("div",T,[(u(),E(V(B),{key:o.value?"dark":"light","api-key":p,modelValue:a.value,"onUpdate:modelValue":l[0]||(l[0]=n=>a.value=n),init:b.value,disabled:r.disabled,onOnInit:y},null,8,["modelValue","init","disabled"]))]))}},P=v(C,[["__scopeId","data-v-136ccdd0"]]);export{P as E};
