import{I as e,J as t,T as n,et as r,k as i,tt as a,z as o}from"./B75DpUry.js";import{t as s}from"./DtbrKeYJ.js";import{n as c}from"./Bt42SIBV.js";var l=s.extend({name:`overlaybadge`,style:`
    .p-overlaybadge {
        position: relative;
    }

    .p-overlaybadge .p-badge {
        position: absolute;
        inset-block-start: 0;
        inset-inline-end: 0;
        transform: translate(50%, -50%);
        transform-origin: 100% 0;
        margin: 0;
        outline-width: dt('overlaybadge.outline.width');
        outline-style: solid;
        outline-color: dt('overlaybadge.outline.color');
    }

    .p-overlaybadge .p-badge:dir(rtl) {
        transform: translate(-50%, -50%);
    }
`,classes:{root:`p-overlaybadge`}});e();var u={name:`OverlayBadge`,extends:{name:`OverlayBadge`,extends:c,style:l,provide:function(){return{$pcOverlayBadge:this,$parentInstance:this}}},inheritAttrs:!1,components:{Badge:c}};function d(e,s,c,l,u,d){var f=a(`Badge`);return t(),n(`div`,o({class:e.cx(`root`)},e.ptmi(`root`)),[r(e.$slots,`default`),i(f,o(e.$props,{pt:e.ptm(`pcBadge`)}),null,16,[`pt`])],16)}u.render=d;export{u as default};