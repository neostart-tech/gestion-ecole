import{I as e,J as t,T as n,et as r,z as i}from"./B75DpUry.js";import{t as a}from"./DtbrKeYJ.js";import{t as o}from"./GEDtbPuf.js";var s=a.extend({name:`buttongroup`,style:`
    .p-buttongroup {
        display: inline-flex;
    }

    .p-buttongroup .p-button {
        margin: 0;
    }

    .p-buttongroup .p-button:not(:last-child),
    .p-buttongroup .p-button:not(:last-child):hover {
        border-inline-end: 0 none;
    }

    .p-buttongroup .p-button:not(:first-of-type):not(:last-of-type) {
        border-radius: 0;
    }

    .p-buttongroup .p-button:first-of-type:not(:only-of-type) {
        border-start-end-radius: 0;
        border-end-end-radius: 0;
    }

    .p-buttongroup .p-button:last-of-type:not(:only-of-type) {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
    }

    .p-buttongroup .p-button:focus {
        position: relative;
        z-index: 1;
    }
`,classes:{root:`p-buttongroup p-component`}});e();var c={name:`ButtonGroup`,extends:{name:`BaseButtonGroup`,extends:o,style:s,provide:function(){return{$pcButtonGroup:this,$parentInstance:this}}},inheritAttrs:!1};function l(e,a,o,s,c,l){return t(),n(`span`,i({class:e.cx(`root`),role:`group`},e.ptmi(`root`)),[r(e.$slots,`default`)],16)}c.render=l;export{c as default};