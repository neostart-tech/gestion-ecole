import{$ as e,C as t,I as n,J as r,S as i,T as a,Vt as o,et as s,g as c,k as l,on as u,rt as d,tn as f,tt as p,w as m,z as h}from"./B75DpUry.js";import{t as g}from"./DtbrKeYJ.js";import{t as _}from"./GEDtbPuf.js";import{t as v}from"./zGuDV7kb.js";var y=g.extend({name:`breadcrumb`,style:`
    .p-breadcrumb {
        background: dt('breadcrumb.background');
        padding: dt('breadcrumb.padding');
        overflow-x: auto;
    }

    .p-breadcrumb-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        gap: dt('breadcrumb.gap');
    }

    .p-breadcrumb-separator {
        display: flex;
        align-items: center;
        color: dt('breadcrumb.separator.color');
    }

    .p-breadcrumb-separator-icon:dir(rtl) {
        transform: rotate(180deg);
    }

    .p-breadcrumb::-webkit-scrollbar {
        display: none;
    }

    .p-breadcrumb-item-link {
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: dt('breadcrumb.item.gap');
        transition:
            background dt('breadcrumb.transition.duration'),
            color dt('breadcrumb.transition.duration'),
            outline-color dt('breadcrumb.transition.duration'),
            box-shadow dt('breadcrumb.transition.duration');
        border-radius: dt('breadcrumb.item.border.radius');
        outline-color: transparent;
        color: dt('breadcrumb.item.color');
    }

    .p-breadcrumb-item-link:focus-visible {
        box-shadow: dt('breadcrumb.item.focus.ring.shadow');
        outline: dt('breadcrumb.item.focus.ring.width') dt('breadcrumb.item.focus.ring.style') dt('breadcrumb.item.focus.ring.color');
        outline-offset: dt('breadcrumb.item.focus.ring.offset');
    }

    .p-breadcrumb-item-link:hover .p-breadcrumb-item-label {
        color: dt('breadcrumb.item.hover.color');
    }

    .p-breadcrumb-item-label {
        transition: inherit;
    }

    .p-breadcrumb-item-icon {
        color: dt('breadcrumb.item.icon.color');
        transition: inherit;
    }

    .p-breadcrumb-item-link:hover .p-breadcrumb-item-icon {
        color: dt('breadcrumb.item.icon.hover.color');
    }
`,classes:{root:`p-breadcrumb p-component`,list:`p-breadcrumb-list`,homeItem:`p-breadcrumb-home-item`,separator:`p-breadcrumb-separator`,separatorIcon:`p-breadcrumb-separator-icon`,item:function(e){return[`p-breadcrumb-item`,{"p-disabled":e.instance.disabled()}]},itemLink:`p-breadcrumb-item-link`,itemIcon:`p-breadcrumb-item-icon`,itemLabel:`p-breadcrumb-item-label`}});n(),o();var b={name:`BaseBreadcrumb`,extends:_,props:{model:{type:Array,default:null},home:{type:null,default:null}},style:y,provide:function(){return{$pcBreadcrumb:this,$parentInstance:this}}},x={name:`BreadcrumbItem`,hostName:`Breadcrumb`,extends:_,props:{item:null,templates:null,index:null},methods:{onClick:function(e){this.item.command&&this.item.command({originalEvent:e,item:this.item})},visible:function(){return typeof this.item.visible==`function`?this.item.visible():this.item.visible!==!1},disabled:function(){return typeof this.item.disabled==`function`?this.item.disabled():this.item.disabled},label:function(){return typeof this.item.label==`function`?this.item.label():this.item.label},isCurrentUrl:function(){var e=this.item,t=e.to,n=e.url,r=typeof window<`u`?window.location.pathname:``;return t===r||n===r?`page`:void 0}},computed:{ptmOptions:function(){return{context:{item:this.item,index:this.index}}},getMenuItemProps:function(){var e=this;return{action:h({class:this.cx(`itemLink`),"aria-current":this.isCurrentUrl(),onClick:function(t){return e.onClick(t)}},this.ptm(`itemLink`,this.ptmOptions)),icon:h({class:[this.cx(`icon`),this.item.icon]},this.ptm(`icon`,this.ptmOptions)),label:h({class:this.cx(`label`)},this.ptm(`label`,this.ptmOptions))}}}},S=[`href`,`target`,`aria-current`];function C(e,n,i,o,s,c){return c.visible()?(r(),a(`li`,h({key:0,class:[e.cx(`item`),i.item.class]},e.ptm(`item`,c.ptmOptions)),[i.templates.item?(r(),t(d(i.templates.item),{key:1,item:i.item,label:c.label(),props:c.getMenuItemProps},null,8,[`item`,`label`,`props`])):(r(),a(`a`,h({key:0,href:i.item.url||`#`,class:e.cx(`itemLink`),target:i.item.target,"aria-current":c.isCurrentUrl(),onClick:n[0]||=function(){return c.onClick&&c.onClick.apply(c,arguments)}},e.ptm(`itemLink`,c.ptmOptions)),[i.templates&&i.templates.itemicon?(r(),t(d(i.templates.itemicon),{key:0,item:i.item,class:f(e.cx(`itemIcon`,c.ptmOptions))},null,8,[`item`,`class`])):i.item.icon?(r(),a(`span`,h({key:1,class:[e.cx(`itemIcon`),i.item.icon]},e.ptm(`itemIcon`,c.ptmOptions)),null,16)):m(``,!0),i.item.label?(r(),a(`span`,h({key:2,class:e.cx(`itemLabel`)},e.ptm(`itemLabel`,c.ptmOptions)),u(c.label()),17)):m(``,!0)],16,S))],16)):m(``,!0)}x.render=C;var w={name:`Breadcrumb`,extends:b,inheritAttrs:!1,components:{BreadcrumbItem:x,ChevronRightIcon:v}};function T(n,o,u,d,f,g){var _=p(`BreadcrumbItem`),v=p(`ChevronRightIcon`);return r(),a(`nav`,h({class:n.cx(`root`)},n.ptmi(`root`)),[i(`ol`,h({class:n.cx(`list`)},n.ptm(`list`)),[n.home?(r(),t(_,h({key:0,item:n.home,class:n.cx(`homeItem`),templates:n.$slots,pt:n.pt,unstyled:n.unstyled},n.ptm(`homeItem`)),null,16,[`item`,`class`,`templates`,`pt`,`unstyled`])):m(``,!0),(r(!0),a(c,null,e(n.model,function(e,t){return r(),a(c,{key:e.label+`_`+t},[n.home||t!==0?(r(),a(`li`,h({key:0,class:n.cx(`separator`)},{ref_for:!0},n.ptm(`separator`)),[s(n.$slots,`separator`,{},function(){return[l(v,h({"aria-hidden":`true`,class:n.cx(`separatorIcon`)},{ref_for:!0},n.ptm(`separatorIcon`)),null,16,[`class`])]})],16)):m(``,!0),l(_,{item:e,index:t,templates:n.$slots,pt:n.pt,unstyled:n.unstyled},null,8,[`item`,`index`,`templates`,`pt`,`unstyled`])],64)}),128))],16)],16)}w.render=T;export{w as t};