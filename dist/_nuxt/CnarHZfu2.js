import{C as e,I as t,J as n,T as r,et as i,rt as a,w as o,z as s}from"./B75DpUry.js";import{t as c}from"./DtbrKeYJ.js";import{t as l}from"./GEDtbPuf.js";import{t as u}from"./ydhGBVgX.js";import{n as d,t as f}from"./eStVaEWj.js";import{t as p}from"./CWR6DvZE.js";var m=c.extend({name:`inlinemessage`,style:`
    .p-inlinemessage {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: dt('inlinemessage.padding');
        border-radius: dt('inlinemessage.border.radius');
        gap: dt('inlinemessage.gap');
    }

    .p-inlinemessage-text {
        font-weight: dt('inlinemessage.text.font.weight');
    }

    .p-inlinemessage-icon {
        flex-shrink: 0;
        font-size: dt('inlinemessage.icon.size');
        width: dt('inlinemessage.icon.size');
        height: dt('inlinemessage.icon.size');
    }

    .p-inlinemessage-icon-only .p-inlinemessage-text {
        visibility: hidden;
        width: 0;
    }

    .p-inlinemessage-info {
        background: dt('inlinemessage.info.background');
        border: 1px solid dt('inlinemessage.info.border.color');
        color: dt('inlinemessage.info.color');
        box-shadow: dt('inlinemessage.info.shadow');
    }

    .p-inlinemessage-info .p-inlinemessage-icon {
        color: dt('inlinemessage.info.color');
    }

    .p-inlinemessage-success {
        background: dt('inlinemessage.success.background');
        border: 1px solid dt('inlinemessage.success.border.color');
        color: dt('inlinemessage.success.color');
        box-shadow: dt('inlinemessage.success.shadow');
    }

    .p-inlinemessage-success .p-inlinemessage-icon {
        color: dt('inlinemessage.success.color');
    }

    .p-inlinemessage-warn {
        background: dt('inlinemessage.warn.background');
        border: 1px solid dt('inlinemessage.warn.border.color');
        color: dt('inlinemessage.warn.color');
        box-shadow: dt('inlinemessage.warn.shadow');
    }

    .p-inlinemessage-warn .p-inlinemessage-icon {
        color: dt('inlinemessage.warn.color');
    }

    .p-inlinemessage-error {
        background: dt('inlinemessage.error.background');
        border: 1px solid dt('inlinemessage.error.border.color');
        color: dt('inlinemessage.error.color');
        box-shadow: dt('inlinemessage.error.shadow');
    }

    .p-inlinemessage-error .p-inlinemessage-icon {
        color: dt('inlinemessage.error.color');
    }

    .p-inlinemessage-secondary {
        background: dt('inlinemessage.secondary.background');
        border: 1px solid dt('inlinemessage.secondary.border.color');
        color: dt('inlinemessage.secondary.color');
        box-shadow: dt('inlinemessage.secondary.shadow');
    }

    .p-inlinemessage-secondary .p-inlinemessage-icon {
        color: dt('inlinemessage.secondary.color');
    }

    .p-inlinemessage-contrast {
        background: dt('inlinemessage.contrast.background');
        border: 1px solid dt('inlinemessage.contrast.border.color');
        color: dt('inlinemessage.contrast.color');
        box-shadow: dt('inlinemessage.contrast.shadow');
    }

    .p-inlinemessage-contrast .p-inlinemessage-icon {
        color: dt('inlinemessage.contrast.color');
    }
`,classes:{root:function(e){var t=e.props,n=e.instance;return[`p-inlinemessage p-component p-inlinemessage-`+t.severity,{"p-inlinemessage-icon-only":!n.$slots.default}]},icon:function(e){return[`p-inlinemessage-icon`,e.props.icon]},text:`p-inlinemessage-text`}});t();var h={name:`InlineMessage`,extends:{name:`BaseInlineMessage`,extends:l,props:{severity:{type:String,default:`error`},icon:{type:String,default:void 0}},style:m,provide:function(){return{$pcInlineMessage:this,$parentInstance:this}}},inheritAttrs:!1,timeout:null,data:function(){return{visible:!0}},mounted:function(){var e=this;this.sticky||setTimeout(function(){e.visible=!1},this.life)},computed:{iconComponent:function(){return{info:f,success:u,warn:d,error:p}[this.severity]}}};function g(t,c,l,u,d,f){return n(),r(`div`,s({role:`alert`,"aria-live":`assertive`,"aria-atomic":`true`,class:t.cx(`root`)},t.ptmi(`root`)),[i(t.$slots,`icon`,{},function(){return[(n(),e(a(t.icon?`span`:f.iconComponent),s({class:t.cx(`icon`)},t.ptm(`icon`)),null,16,[`class`]))]}),t.$slots.default?(n(),r(`div`,s({key:0,class:t.cx(`text`)},t.ptm(`text`)),[i(t.$slots,`default`)],16)):o(``,!0)],16)}h.render=g;export{h as default};