import{C as e,E as t,I as n,J as r,S as i,T as a,Vt as o,et as s,k as c,rt as l,tn as u,tt as d,ut as f,z as p}from"./B75DpUry.js";import{t as m,xt as h}from"./DtbrKeYJ.js";import{t as g}from"./GEDtbPuf.js";import{n as _}from"./CnGMLPOM2.js";import{t as v}from"./DIUR7bRq2.js";import y from"./CnJJc4pN.js";var b=m.extend({name:`splitbutton`,style:`
    .p-splitbutton {
        display: inline-flex;
        position: relative;
        border-radius: dt('splitbutton.border.radius');
    }

    .p-splitbutton-button.p-button {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
        border-inline-end: 0 none;
    }

    .p-splitbutton-button.p-button:focus-visible,
    .p-splitbutton-dropdown.p-button:focus-visible {
        z-index: 1;
    }

    .p-splitbutton-button.p-button:not(:disabled):hover,
    .p-splitbutton-button.p-button:not(:disabled):active {
        border-inline-end: 0 none;
    }

    .p-splitbutton-dropdown.p-button {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }

    .p-splitbutton .p-menu {
        min-width: 100%;
    }

    .p-splitbutton-fluid {
        display: flex;
    }

    .p-splitbutton-rounded .p-splitbutton-dropdown.p-button {
        border-start-end-radius: dt('splitbutton.rounded.border.radius');
        border-end-end-radius: dt('splitbutton.rounded.border.radius');
    }

    .p-splitbutton-rounded .p-splitbutton-button.p-button {
        border-start-start-radius: dt('splitbutton.rounded.border.radius');
        border-end-start-radius: dt('splitbutton.rounded.border.radius');
    }

    .p-splitbutton-raised {
        box-shadow: dt('splitbutton.raised.shadow');
    }
`,classes:{root:function(e){var t=e.instance,n=e.props;return[`p-splitbutton p-component`,{"p-splitbutton-raised":n.raised,"p-splitbutton-rounded":n.rounded,"p-splitbutton-fluid":t.hasFluid}]},pcButton:`p-splitbutton-button`,pcDropdown:`p-splitbutton-dropdown`}});n(),o();var x={name:`SplitButton`,extends:{name:`BaseSplitButton`,extends:g,props:{label:{type:String,default:null},icon:{type:String,default:null},model:{type:Array,default:null},autoZIndex:{type:Boolean,default:!0},baseZIndex:{type:Number,default:0},appendTo:{type:[String,Object],default:`body`},disabled:{type:Boolean,default:!1},fluid:{type:Boolean,default:null},class:{type:null,default:null},style:{type:null,default:null},buttonProps:{type:null,default:null},menuButtonProps:{type:null,default:null},menuButtonIcon:{type:String,default:void 0},dropdownIcon:{type:String,default:void 0},severity:{type:String,default:null},raised:{type:Boolean,default:!1},rounded:{type:Boolean,default:!1},text:{type:Boolean,default:!1},outlined:{type:Boolean,default:!1},size:{type:String,default:null},plain:{type:Boolean,default:!1}},style:b,provide:function(){return{$pcSplitButton:this,$parentInstance:this}}},inheritAttrs:!1,emits:[`click`],inject:{$pcFluid:{default:null}},data:function(){return{isExpanded:!1}},mounted:function(){var e=this;this.$watch(`$refs.menu.visible`,function(t){e.isExpanded=t})},methods:{onDropdownButtonClick:function(e){e&&e.preventDefault(),this.$refs.menu.toggle({currentTarget:this.$el,relatedTarget:this.$refs.button.$el}),this.isExpanded=this.$refs.menu.visible},onDropdownKeydown:function(e){(e.code===`ArrowDown`||e.code===`ArrowUp`)&&(this.onDropdownButtonClick(),e.preventDefault())},onDefaultButtonClick:function(e){this.isExpanded&&this.$refs.menu.hide(e),this.$emit(`click`,e)}},computed:{containerClass:function(){return[this.cx(`root`),this.class]},hasFluid:function(){return h(this.fluid)?!!this.$pcFluid:this.fluid}},components:{PVSButton:_,PVSMenu:y,ChevronDownIcon:v}},S=[`data-p-severity`];function C(n,o,m,h,g,_){var v=d(`PVSButton`),y=d(`PVSMenu`);return r(),a(`div`,p({class:_.containerClass,style:n.style},n.ptmi(`root`),{"data-p-severity":n.severity}),[c(v,p({type:`button`,class:n.cx(`pcButton`),label:n.label,disabled:n.disabled,severity:n.severity,text:n.text,icon:n.icon,outlined:n.outlined,size:n.size,fluid:n.fluid,"aria-label":n.label,onClick:_.onDefaultButtonClick},n.buttonProps,{pt:n.ptm(`pcButton`),unstyled:n.unstyled}),t({default:f(function(){return[s(n.$slots,`default`)]}),_:2},[n.$slots.icon?{name:`icon`,fn:f(function(e){return[s(n.$slots,`icon`,{class:u(e.class)},function(){return[i(`span`,p({class:[n.icon,e.class]},n.ptm(`pcButton`).icon,{"data-pc-section":`buttonicon`}),null,16)]})]}),key:`0`}:void 0]),1040,[`class`,`label`,`disabled`,`severity`,`text`,`icon`,`outlined`,`size`,`fluid`,`aria-label`,`onClick`,`pt`,`unstyled`]),c(v,p({ref:`button`,type:`button`,class:n.cx(`pcDropdown`),disabled:n.disabled,"aria-haspopup":`true`,"aria-expanded":g.isExpanded,"aria-controls":g.isExpanded?n.$id+`_overlay`:void 0,onClick:_.onDropdownButtonClick,onKeydown:_.onDropdownKeydown,severity:n.severity,text:n.text,outlined:n.outlined,size:n.size,unstyled:n.unstyled},n.menuButtonProps,{pt:n.ptm(`pcDropdown`)}),{icon:f(function(t){return[s(n.$slots,n.$slots.dropdownicon?`dropdownicon`:`menubuttonicon`,{class:u(t.class)},function(){return[(r(),e(l(n.menuButtonIcon||n.dropdownIcon?`span`:`ChevronDownIcon`),p({class:[n.dropdownIcon||n.menuButtonIcon,t.class]},n.ptm(`pcDropdown`).icon,{"data-pc-section":`menubuttonicon`}),null,16,[`class`]))]})]}),_:3},16,[`class`,`disabled`,`aria-expanded`,`aria-controls`,`onClick`,`onKeydown`,`severity`,`text`,`outlined`,`size`,`unstyled`,`pt`]),c(y,{ref:`menu`,id:n.$id+`_overlay`,model:n.model,popup:!0,autoZIndex:n.autoZIndex,baseZIndex:n.baseZIndex,appendTo:n.appendTo,unstyled:n.unstyled,pt:n.ptm(`pcMenu`)},t({_:2},[n.$slots.menuitemicon?{name:`itemicon`,fn:f(function(e){return[s(n.$slots,`menuitemicon`,{item:e.item,class:u(e.class)})]}),key:`0`}:void 0,n.$slots.item?{name:`item`,fn:f(function(e){return[s(n.$slots,`item`,{item:e.item,hasSubmenu:e.hasSubmenu,label:e.label,props:e.props})]}),key:`1`}:void 0]),1032,[`id`,`model`,`autoZIndex`,`baseZIndex`,`appendTo`,`unstyled`,`pt`])],16,S)}x.render=C;export{x as default};