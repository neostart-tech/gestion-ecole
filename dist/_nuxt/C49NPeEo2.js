import{C as e,I as t,J as n,S as r,T as i,Vt as a,a as o,dt as s,et as c,k as l,on as u,p as d,rt as f,t as p,tn as m,tt as h,ut as g,w as _,z as v}from"./B75DpUry.js";import{t as y}from"./DtbrKeYJ.js";import{t as b}from"./CRHlWn3X.js";import{t as x}from"./GEDtbPuf.js";import{t as S}from"./CZy7fYBs.js";import{n as C}from"./CnGMLPOM2.js";import{t as w}from"./CW3-zClz2.js";import{t as T}from"./DwKl87cm2.js";var E=y.extend({name:`panel`,style:`
    .p-panel {
        display: block;
        border: 1px solid dt('panel.border.color');
        border-radius: dt('panel.border.radius');
        background: dt('panel.background');
        color: dt('panel.color');
    }

    .p-panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: dt('panel.header.padding');
        background: dt('panel.header.background');
        color: dt('panel.header.color');
        border-style: solid;
        border-width: dt('panel.header.border.width');
        border-color: dt('panel.header.border.color');
        border-radius: dt('panel.header.border.radius');
    }

    .p-panel-toggleable .p-panel-header {
        padding: dt('panel.toggleable.header.padding');
    }

    .p-panel-title {
        line-height: 1;
        font-weight: dt('panel.title.font.weight');
    }

    .p-panel-content-container {
        display: grid;
        grid-template-rows: 1fr;
    }

    .p-panel-content-wrapper {
        min-height: 0;
    }

    .p-panel-content {
        padding: dt('panel.content.padding');
    }

    .p-panel-footer {
        padding: dt('panel.footer.padding');
    }
`,classes:{root:function(e){return[`p-panel p-component`,{"p-panel-toggleable":e.props.toggleable}]},header:`p-panel-header`,title:`p-panel-title`,headerActions:`p-panel-header-actions`,pcToggleButton:`p-panel-toggle-button`,contentContainer:`p-panel-content-container`,contentWrapper:`p-panel-content-wrapper`,content:`p-panel-content`,footer:`p-panel-footer`}});t(),a(),o();var D={name:`Panel`,extends:{name:`BasePanel`,extends:x,props:{header:String,toggleable:Boolean,collapsed:Boolean,toggleButtonProps:{type:Object,default:function(){return{severity:`secondary`,text:!0,rounded:!0}}}},style:E,provide:function(){return{$pcPanel:this,$parentInstance:this}}},inheritAttrs:!1,emits:[`update:collapsed`,`toggle`],data:function(){return{d_collapsed:this.collapsed}},watch:{collapsed:function(e){this.d_collapsed=e}},methods:{toggle:function(e){this.d_collapsed=!this.d_collapsed,this.$emit(`update:collapsed`,this.d_collapsed),this.$emit(`toggle`,{originalEvent:e,value:this.d_collapsed})},onKeyDown:function(e){(e.code===`Enter`||e.code===`NumpadEnter`||e.code===`Space`)&&(this.toggle(e),e.preventDefault())}},computed:{buttonAriaLabel:function(){return this.toggleButtonProps&&this.toggleButtonProps.ariaLabel?this.toggleButtonProps.ariaLabel:this.header},dataP:function(){return b({toggleable:this.toggleable})}},components:{PlusIcon:T,MinusIcon:w,Button:C},directives:{ripple:S}},O=[`data-p`],k=[`data-p`],A=[`id`],j=[`id`,`aria-labelledby`];function M(t,a,o,y,b,x){var S=h(`Button`);return n(),i(`div`,v({class:t.cx(`root`),"data-p":x.dataP},t.ptmi(`root`)),[r(`div`,v({class:t.cx(`header`),"data-p":x.dataP},t.ptm(`header`)),[c(t.$slots,`header`,{id:t.$id+`_header`,class:m(t.cx(`title`)),collapsed:b.d_collapsed},function(){return[t.header?(n(),i(`span`,v({key:0,id:t.$id+`_header`,class:t.cx(`title`)},t.ptm(`title`)),u(t.header),17,A)):_(``,!0)]}),r(`div`,v({class:t.cx(`headerActions`)},t.ptm(`headerActions`)),[c(t.$slots,`icons`),t.toggleable?c(t.$slots,`togglebutton`,{key:0,collapsed:b.d_collapsed,toggleCallback:function(e){return x.toggle(e)},keydownCallback:function(e){return x.onKeyDown(e)}},function(){return[l(S,v({id:t.$id+`_header`,class:t.cx(`pcToggleButton`),"aria-label":x.buttonAriaLabel,"aria-controls":t.$id+`_content`,"aria-expanded":!b.d_collapsed,unstyled:t.unstyled,onClick:a[0]||=function(e){return x.toggle(e)},onKeydown:a[1]||=function(e){return x.onKeyDown(e)}},t.toggleButtonProps,{pt:t.ptm(`pcToggleButton`)}),{icon:g(function(r){return[c(t.$slots,t.$slots.toggleicon?`toggleicon`:`togglericon`,{collapsed:b.d_collapsed},function(){return[(n(),e(f(b.d_collapsed?`PlusIcon`:`MinusIcon`),v({class:r.class},t.ptm(`pcToggleButton`).icon),null,16,[`class`]))]})]}),_:3},16,[`id`,`class`,`aria-label`,`aria-controls`,`aria-expanded`,`unstyled`,`pt`])]}):_(``,!0)],16)],16,k),l(p,v({name:`p-collapsible`},t.ptm(`transition`)),{default:g(function(){return[s(r(`div`,v({id:t.$id+`_content`,class:t.cx(`contentContainer`),role:`region`,"aria-labelledby":t.$id+`_header`},t.ptm(`contentContainer`)),[r(`div`,v({class:t.cx(`contentWrapper`)},t.ptm(`contentWrapper`)),[r(`div`,v({class:t.cx(`content`)},t.ptm(`content`)),[c(t.$slots,`default`)],16),t.$slots.footer?(n(),i(`div`,v({key:0,class:t.cx(`footer`)},t.ptm(`footer`)),[c(t.$slots,`footer`)],16)):_(``,!0)],16)],16,j),[[d,!b.d_collapsed]])]}),_:3},16)],16,O)}D.render=M;export{D as default};