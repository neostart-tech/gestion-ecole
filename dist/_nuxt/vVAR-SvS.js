import{I as e,J as t,S as n,T as r,et as i,z as a}from"./B75DpUry.js";import{t as o}from"./DtbrKeYJ.js";import{t as s}from"./GEDtbPuf.js";var c=o.extend({name:`toolbar`,style:`
    .p-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: dt('toolbar.padding');
        background: dt('toolbar.background');
        border: 1px solid dt('toolbar.border.color');
        color: dt('toolbar.color');
        border-radius: dt('toolbar.border.radius');
        gap: dt('toolbar.gap');
    }

    .p-toolbar-start,
    .p-toolbar-center,
    .p-toolbar-end {
        display: flex;
        align-items: center;
    }
`,classes:{root:`p-toolbar p-component`,start:`p-toolbar-start`,center:`p-toolbar-center`,end:`p-toolbar-end`}});e();var l={name:`Toolbar`,extends:{name:`BaseToolbar`,extends:s,props:{ariaLabelledby:{type:String,default:null}},style:c,provide:function(){return{$pcToolbar:this,$parentInstance:this}}},inheritAttrs:!1},u=[`aria-labelledby`];function d(e,o,s,c,l,d){return t(),r(`div`,a({class:e.cx(`root`),role:`toolbar`,"aria-labelledby":e.ariaLabelledby},e.ptmi(`root`)),[n(`div`,a({class:e.cx(`start`)},e.ptm(`start`)),[i(e.$slots,`start`)],16),n(`div`,a({class:e.cx(`center`)},e.ptm(`center`)),[i(e.$slots,`center`)],16),n(`div`,a({class:e.cx(`end`)},e.ptm(`end`)),[i(e.$slots,`end`)],16)],16,u)}l.render=d;export{l as default};