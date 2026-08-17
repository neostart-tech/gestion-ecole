const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./Bc_ZIQ5b.js","./B0Z9INg1.js"])))=>i.map(i=>d[i]);
import{a as e}from"./B0Z9INg1.js";import{C as t,I as n,J as r,K as i,Nt as a,T as o,Tt as s,ct as c,gt as l,x as u}from"./B75DpUry.js";import{t as d}from"./HclGiUj8.js";import{t as f}from"#entry";import{t as p}from"./0zMvMy6q.js";import{t as m}from"./UA9fOs052.js";l(),n();var h={class:`tinymce-editor`},g=`2i64hds9y2pudvppatub5l7yvbpfncjva29myumeyneiqnzl`,_=f({__name:`EditorTinyMCE`,props:{modelValue:{type:String,default:``},disabled:{type:Boolean,default:!1},placeholder:{type:String,default:`Saisissez votre texte ici...`}},emits:[`update:modelValue`],setup(n,{emit:l}){let f=p(),_=u(()=>f.shouldBeDark()),v=n,y=l,b=s(v.modelValue);c(()=>v.modelValue,e=>{b.value=e}),c(b,e=>{y(`update:modelValue`,e)});let x=u(()=>({apiKey:g,height:300,menubar:!0,plugins:[`advlist`,`autolink`,`lists`,`link`,`image`,`charmap`,`preview`,`anchor`,`searchreplace`,`visualblocks`,`code`,`fullscreen`,`insertdatetime`,`media`,`table`,`help`,`wordcount`,`emoticons`],toolbar:`undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat | emoticons | help`,content_style:`
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: ${_.value?`#e5e7eb`:`#374151`};
      background-color: ${_.value?`#1f2937`:`#ffffff`};
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
      color: ${_.value?`#9ca3af`:`#6b7280`};
    }
  `,language:`fr_FR`,branding:!1,skin:_.value?`oxide-dark`:`oxide`,content_css:_.value?`dark`:`default`,placeholder:v.placeholder,images_upload_handler:async(e,t)=>new Promise((t,n)=>{let r=new FormData;r.append(`file`,e.blob(),e.filename()),fetch(`/api/upload`,{method:`POST`,body:r}).then(e=>e.json()).then(e=>{e.location?t(e.location):n(`Upload failed`)}).catch(()=>{n(`Upload failed`)})}),font_family_formats:`Arial=arial,helvetica,sans-serif; Times New Roman=times new roman,times; Courier New=courier new,courier; Georgia=georgia,palatino; Verdana=verdana,geneva`,font_size_formats:`8px 9px 10px 11px 12px 14px 16px 18px 24px 30px 36px 48px`,emoticons_database:`emojis`,color_map:[`#000000`,`Noir`,`#ffffff`,`Blanc`,`#ef4444`,`Rouge`,`#f59e0b`,`Orange`,`#10b981`,`Vert`,`#3b82f6`,`Bleu`,`#8b5cf6`,`Violet`,`rgb(var(--color-primary-500))`,`Primaire`]})),S=e=>{console.log(`TinyMCE initialisé avec succès`)};return i(()=>{typeof window<`u`&&!window.tinymce&&d(()=>import(`./Bc_ZIQ5b.js`).then(t=>e(t.default)).then(e=>{}),__vite__mapDeps([0,1]),import.meta.url)}),(e,i)=>(r(),o(`div`,h,[(r(),t(a(m),{key:_.value?`dark`:`light`,"api-key":g,modelValue:b.value,"onUpdate:modelValue":i[0]||=e=>b.value=e,init:x.value,disabled:n.disabled,onOnInit:S},null,8,[`modelValue`,`init`,`disabled`]))]))}},[[`__scopeId`,`data-v-136ccdd0`]]);export{_ as t};