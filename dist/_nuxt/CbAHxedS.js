import{C as e,I as t,J as n,S as r,T as i,Vt as a,a as o,dt as s,et as c,g as l,k as u,nt as d,on as f,rt as p,t as m,tn as h,tt as g,ut as _,w as v,z as y}from"./B75DpUry.js";import{B as b,M as x,t as S}from"./DtbrKeYJ.js";import{t as C}from"./CRHlWn3X.js";import{t as w}from"./cO8iUN-n.js";import{t as T}from"./BI3ReDF8.js";import{t as E}from"./GEDtbPuf.js";import{t as D}from"./B1ufwUcI.js";import{n as O}from"./CnGMLPOM2.js";import{t as k}from"./Vl_BInP82.js";import{n as A,t as j}from"./CGLP-fTI2.js";var M=S.extend({name:`drawer`,style:`
    .p-drawer {
        display: flex;
        flex-direction: column;
        transform: translate3d(0px, 0px, 0px);
        position: relative;
        transition: transform 0.3s;
        background: dt('drawer.background');
        color: dt('drawer.color');
        border-style: solid;
        border-color: dt('drawer.border.color');
        box-shadow: dt('drawer.shadow');
    }

    .p-drawer-content {
        overflow-y: auto;
        flex-grow: 1;
        padding: dt('drawer.content.padding');
    }

    .p-drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        padding: dt('drawer.header.padding');
    }

    .p-drawer-footer {
        padding: dt('drawer.footer.padding');
    }

    .p-drawer-title {
        font-weight: dt('drawer.title.font.weight');
        font-size: dt('drawer.title.font.size');
    }

    .p-drawer-full .p-drawer {
        transition: none;
        transform: none;
        width: 100vw !important;
        height: 100vh !important;
        max-height: 100%;
        top: 0px !important;
        left: 0px !important;
        border-width: 1px;
    }

    .p-drawer-left .p-drawer-enter-active {
        animation: p-animate-drawer-enter-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-left .p-drawer-leave-active {
        animation: p-animate-drawer-leave-left 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .p-drawer-right .p-drawer-enter-active {
        animation: p-animate-drawer-enter-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-right .p-drawer-leave-active {
        animation: p-animate-drawer-leave-right 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .p-drawer-top .p-drawer-enter-active {
        animation: p-animate-drawer-enter-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-top .p-drawer-leave-active {
        animation: p-animate-drawer-leave-top 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .p-drawer-bottom .p-drawer-enter-active {
        animation: p-animate-drawer-enter-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-bottom .p-drawer-leave-active {
        animation: p-animate-drawer-leave-bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }

    .p-drawer-full .p-drawer-enter-active {
        animation: p-animate-drawer-enter-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    .p-drawer-full .p-drawer-leave-active {
        animation: p-animate-drawer-leave-full 0.5s cubic-bezier(0.32, 0.72, 0, 1);
    }
    
    .p-drawer-left .p-drawer {
        width: 20rem;
        height: 100%;
        border-inline-end-width: 1px;
    }

    .p-drawer-right .p-drawer {
        width: 20rem;
        height: 100%;
        border-inline-start-width: 1px;
    }

    .p-drawer-top .p-drawer {
        height: 10rem;
        width: 100%;
        border-block-end-width: 1px;
    }

    .p-drawer-bottom .p-drawer {
        height: 10rem;
        width: 100%;
        border-block-start-width: 1px;
    }

    .p-drawer-left .p-drawer-content,
    .p-drawer-right .p-drawer-content,
    .p-drawer-top .p-drawer-content,
    .p-drawer-bottom .p-drawer-content {
        width: 100%;
        height: 100%;
    }

    .p-drawer-open {
        display: flex;
    }

    .p-drawer-mask:dir(rtl) {
        flex-direction: row-reverse;
    }

    @keyframes p-animate-drawer-enter-left {
        from {
            transform: translate3d(-100%, 0px, 0px);
        }
    }

    @keyframes p-animate-drawer-leave-left {
        to {
            transform: translate3d(-100%, 0px, 0px);
        }
    }

    @keyframes p-animate-drawer-enter-right {
        from {
            transform: translate3d(100%, 0px, 0px);
        }
    }

    @keyframes p-animate-drawer-leave-right {
        to {
            transform: translate3d(100%, 0px, 0px);
        }
    }

    @keyframes p-animate-drawer-enter-top {
        from {
            transform: translate3d(0px, -100%, 0px);
        }
    }

    @keyframes p-animate-drawer-leave-top {
        to {
            transform: translate3d(0px, -100%, 0px);
        }
    }

    @keyframes p-animate-drawer-enter-bottom {
        from {
            transform: translate3d(0px, 100%, 0px);
        }
    }

    @keyframes p-animate-drawer-leave-bottom {
        to {
            transform: translate3d(0px, 100%, 0px);
        }
    }

    @keyframes p-animate-drawer-enter-full {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes p-animate-drawer-leave-full {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`,classes:{mask:function(e){var t=e.instance,n=e.props,r=[`left`,`right`,`top`,`bottom`].find(function(e){return e===n.position});return[`p-drawer-mask`,{"p-overlay-mask p-overlay-mask-enter-active":n.modal,"p-drawer-open":t.containerVisible,"p-drawer-full":t.fullScreen},r?`p-drawer-${r}`:``]},root:function(e){return[`p-drawer p-component`,{"p-drawer-full":e.instance.fullScreen}]},header:`p-drawer-header`,title:`p-drawer-title`,pcCloseButton:`p-drawer-close-button`,content:`p-drawer-content`,footer:`p-drawer-footer`},inlineStyles:{mask:function(e){var t=e.position,n=e.modal;return{position:`fixed`,height:`100%`,width:`100%`,left:0,top:0,display:`flex`,justifyContent:t===`left`?`flex-start`:t===`right`?`flex-end`:`center`,alignItems:t===`top`?`flex-start`:t===`bottom`?`flex-end`:`center`,pointerEvents:n?`auto`:`none`}},root:{pointerEvents:`auto`}}});t(),o(),a();var N={name:`BaseDrawer`,extends:E,props:{visible:{type:Boolean,default:!1},position:{type:String,default:`left`},header:{type:null,default:null},baseZIndex:{type:Number,default:0},autoZIndex:{type:Boolean,default:!0},dismissable:{type:Boolean,default:!0},showCloseIcon:{type:Boolean,default:!0},closeButtonProps:{type:Object,default:function(){return{severity:`secondary`,text:!0,rounded:!0}}},closeIcon:{type:String,default:void 0},modal:{type:Boolean,default:!0},blockScroll:{type:Boolean,default:!1},closeOnEscape:{type:Boolean,default:!0}},style:M,provide:function(){return{$pcDrawer:this,$parentInstance:this}}};function P(e){"@babel/helpers - typeof";return P=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},P(e)}function F(e,t,n){return(t=I(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function I(e){var t=L(e,`string`);return P(t)==`symbol`?t:t+``}function L(e,t){if(P(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(P(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var R={name:`Drawer`,extends:N,inheritAttrs:!1,emits:[`update:visible`,`show`,`after-show`,`hide`,`after-hide`,`before-hide`],data:function(){return{containerVisible:this.visible}},container:null,mask:null,content:null,headerContainer:null,footerContainer:null,closeButton:null,outsideClickListener:null,documentKeydownListener:null,watch:{dismissable:function(e){e&&!this.modal?this.bindOutsideClickListener():this.unbindOutsideClickListener()}},updated:function(){this.visible&&(this.containerVisible=this.visible)},beforeUnmount:function(){this.disableDocumentSettings(),this.mask&&this.autoZIndex&&w.clear(this.mask),this.container=null,this.mask=null},methods:{hide:function(){this.$emit(`update:visible`,!1)},onEnter:function(){this.$emit(`show`),this.focus(),this.bindDocumentKeyDownListener(),this.autoZIndex&&w.set(`modal`,this.mask,this.baseZIndex||this.$primevue.config.zIndex.modal)},onAfterEnter:function(){this.enableDocumentSettings(),this.$emit(`after-show`)},onBeforeLeave:function(){this.modal&&!this.isUnstyled&&x(this.mask,`p-overlay-mask-leave-active`),this.$emit(`before-hide`)},onLeave:function(){this.$emit(`hide`)},onAfterLeave:function(){this.autoZIndex&&w.clear(this.mask),this.unbindDocumentKeyDownListener(),this.containerVisible=!1,this.disableDocumentSettings(),this.$emit(`after-hide`)},onMaskClick:function(e){this.dismissable&&this.modal&&this.mask===e.target&&this.hide()},focus:function(){var e=function(e){return e&&e.querySelector(`[autofocus]`)},t=this.$slots.header&&e(this.headerContainer);t||(t=this.$slots.default&&e(this.container),t||(t=this.$slots.footer&&e(this.footerContainer),t||=this.closeButton)),t&&b(t)},enableDocumentSettings:function(){this.dismissable&&!this.modal&&this.bindOutsideClickListener(),this.blockScroll&&j()},disableDocumentSettings:function(){this.unbindOutsideClickListener(),this.blockScroll&&A()},onKeydown:function(e){e.code===`Escape`&&this.closeOnEscape&&this.hide()},containerRef:function(e){this.container=e},maskRef:function(e){this.mask=e},contentRef:function(e){this.content=e},headerContainerRef:function(e){this.headerContainer=e},footerContainerRef:function(e){this.footerContainer=e},closeButtonRef:function(e){this.closeButton=e?e.$el:void 0},bindDocumentKeyDownListener:function(){this.documentKeydownListener||(this.documentKeydownListener=this.onKeydown,document.addEventListener(`keydown`,this.documentKeydownListener))},unbindDocumentKeyDownListener:function(){this.documentKeydownListener&&=(document.removeEventListener(`keydown`,this.documentKeydownListener),null)},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(t){e.isOutsideClicked(t)&&e.hide()},document.addEventListener(`click`,this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&=(document.removeEventListener(`click`,this.outsideClickListener,!0),null)},isOutsideClicked:function(e){return this.container&&!this.container.contains(e.target)}},computed:{fullScreen:function(){return this.position===`full`},closeAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.close:void 0},dataP:function(){return C(F(F(F({"full-screen":this.position===`full`},this.position,this.position),`open`,this.containerVisible),`modal`,this.modal))}},directives:{focustrap:k},components:{Button:O,Portal:T,TimesIcon:D}},z=[`data-p`],B=[`role`,`aria-modal`,`data-p`];function V(t,a,o,b,x,S){var C=g(`Button`),w=g(`Portal`),T=d(`focustrap`);return n(),e(w,null,{default:_(function(){return[x.containerVisible?(n(),i(`div`,y({key:0,ref:S.maskRef,onMousedown:a[0]||=function(){return S.onMaskClick&&S.onMaskClick.apply(S,arguments)},class:t.cx(`mask`),style:t.sx(`mask`,!0,{position:t.position,modal:t.modal}),"data-p":S.dataP},t.ptm(`mask`)),[u(m,y({name:`p-drawer`,onEnter:S.onEnter,onAfterEnter:S.onAfterEnter,onBeforeLeave:S.onBeforeLeave,onLeave:S.onLeave,onAfterLeave:S.onAfterLeave,appear:``},t.ptm(`transition`)),{default:_(function(){return[t.visible?s((n(),i(`div`,y({key:0,ref:S.containerRef,class:t.cx(`root`),style:t.sx(`root`),role:t.modal?`dialog`:`complementary`,"aria-modal":t.modal?!0:void 0,"data-p":S.dataP},t.ptmi(`root`)),[t.$slots.container?c(t.$slots,`container`,{key:0,closeCallback:S.hide}):(n(),i(l,{key:1},[r(`div`,y({ref:S.headerContainerRef,class:t.cx(`header`)},t.ptm(`header`)),[c(t.$slots,`header`,{class:h(t.cx(`title`))},function(){return[t.header?(n(),i(`div`,y({key:0,class:t.cx(`title`)},t.ptm(`title`)),f(t.header),17)):v(``,!0)]}),t.showCloseIcon?c(t.$slots,`closebutton`,{key:0,closeCallback:S.hide},function(){return[u(C,y({ref:S.closeButtonRef,type:`button`,class:t.cx(`pcCloseButton`),"aria-label":S.closeAriaLabel,unstyled:t.unstyled,onClick:S.hide},t.closeButtonProps,{pt:t.ptm(`pcCloseButton`),"data-pc-group-section":`iconcontainer`}),{icon:_(function(r){return[c(t.$slots,`closeicon`,{},function(){return[(n(),e(p(t.closeIcon?`span`:`TimesIcon`),y({class:[t.closeIcon,r.class]},t.ptm(`pcCloseButton`).icon),null,16,[`class`]))]})]}),_:3},16,[`class`,`aria-label`,`unstyled`,`onClick`,`pt`])]}):v(``,!0)],16),r(`div`,y({ref:S.contentRef,class:t.cx(`content`)},t.ptm(`content`)),[c(t.$slots,`default`)],16),t.$slots.footer?(n(),i(`div`,y({key:0,ref:S.footerContainerRef,class:t.cx(`footer`)},t.ptm(`footer`)),[c(t.$slots,`footer`)],16)):v(``,!0)],64))],16,B)),[[T]]):v(``,!0)]}),_:3},16,[`onEnter`,`onAfterEnter`,`onBeforeLeave`,`onLeave`,`onAfterLeave`])],16,z)):v(``,!0)]}),_:3})}R.render=V;export{R as default};