import{C as e,I as t,J as n,Vt as r,a as i,et as a,rt as o,t as s,tn as c,tt as l,ut as u,w as d,z as f}from"./B75DpUry.js";import{a as p,t as m}from"./DtbrKeYJ.js";import{t as h}from"./cO8iUN-n.js";import{t as g}from"./GEDtbPuf.js";import{n as _}from"./CnGMLPOM2.js";import{t as v}from"./BGsfAMZu.js";var y=m.extend({name:`scrolltop`,style:`
    .p-scrolltop.p-button {
        position: fixed !important;
        inset-block-end: 20px;
        inset-inline-end: 20px;
    }

    .p-scrolltop-sticky.p-button {
        position: sticky !important;
        display: flex;
        margin-inline-start: auto;
    }

    .p-scrolltop-enter-from {
        opacity: 0;
    }

    .p-scrolltop-enter-active {
        transition: opacity 300ms;
    }

    .p-scrolltop-leave-to {
        opacity: 0;
    }

    .p-scrolltop-leave-active {
        transition: opacity 300ms;
    }
`,classes:{root:function(e){return[`p-scrolltop`,{"p-scrolltop-sticky":e.props.target!==`window`}]},icon:`p-scrolltop-icon`}});t(),i(),r();var b={name:`ScrollTop`,extends:{name:`BaseScrollTop`,extends:g,props:{target:{type:String,default:`window`},threshold:{type:Number,default:400},icon:{type:String,default:void 0},behavior:{type:String,default:`smooth`},buttonProps:{type:Object,default:function(){return{rounded:!0}}}},style:y,provide:function(){return{$pcScrollTop:this,$parentInstance:this}}},inheritAttrs:!1,scrollListener:null,container:null,data:function(){return{visible:!1}},mounted:function(){this.target===`window`?this.bindDocumentScrollListener():this.target===`parent`&&this.bindParentScrollListener()},beforeUnmount:function(){this.target===`window`?this.unbindDocumentScrollListener():this.target===`parent`&&this.unbindParentScrollListener(),this.container&&(h.clear(this.container),this.overlay=null)},methods:{onClick:function(){(this.target===`window`?window:this.$el.parentElement).scroll({top:0,behavior:this.behavior})},checkVisibility:function(e){this.visible=e>this.threshold},bindParentScrollListener:function(){var e=this;this.scrollListener=function(){e.checkVisibility(e.$el.parentElement.scrollTop)},this.$el.parentElement.addEventListener(`scroll`,this.scrollListener)},bindDocumentScrollListener:function(){var e=this;this.scrollListener=function(){e.checkVisibility(p())},window.addEventListener(`scroll`,this.scrollListener)},unbindParentScrollListener:function(){this.scrollListener&&=(this.$el.parentElement.removeEventListener(`scroll`,this.scrollListener),null)},unbindDocumentScrollListener:function(){this.scrollListener&&=(window.removeEventListener(`scroll`,this.scrollListener),null)},onEnter:function(e){h.set(`overlay`,e,this.$primevue.config.zIndex.overlay)},onAfterLeave:function(e){h.clear(e)},containerRef:function(e){this.container=e?e.$el:void 0}},computed:{scrollTopAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.scrollTop:void 0}},components:{ChevronUpIcon:v,Button:_}};function x(t,r,i,p,m,h){var g=l(`Button`);return n(),e(s,f({name:`p-scrolltop`,appear:``,onEnter:h.onEnter,onAfterLeave:h.onAfterLeave},t.ptm(`transition`)),{default:u(function(){return[m.visible?(n(),e(g,f({key:0,ref:h.containerRef,class:t.cx(`root`),onClick:h.onClick,"aria-label":h.scrollTopAriaLabel,unstyled:t.unstyled},t.buttonProps,{pt:t.ptm(`root`)}),{icon:u(function(r){return[a(t.$slots,`icon`,{class:c(t.cx(`icon`))},function(){return[(n(),e(o(t.icon?`span`:`ChevronUpIcon`),f({class:[t.cx(`icon`),t.icon,r.class]},t.ptm(`root`).icon,{"data-pc-section":`icon`}),null,16,[`class`]))]})]}),_:3},16,[`class`,`onClick`,`aria-label`,`unstyled`,`pt`])):d(``,!0)]}),_:3},16,[`onEnter`,`onAfterLeave`])}b.render=x;export{b as default};