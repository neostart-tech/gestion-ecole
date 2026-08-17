import{I as e,J as t,S as n,T as r,et as i,w as a,z as o}from"./B75DpUry.js";import{t as s}from"./DtbrKeYJ.js";import{t as c}from"./GEDtbPuf.js";var l=s.extend({name:`card`,style:`
    .p-card {
        background: dt('card.background');
        color: dt('card.color');
        box-shadow: dt('card.shadow');
        border-radius: dt('card.border.radius');
        display: flex;
        flex-direction: column;
    }

    .p-card-caption {
        display: flex;
        flex-direction: column;
        gap: dt('card.caption.gap');
    }

    .p-card-body {
        padding: dt('card.body.padding');
        display: flex;
        flex-direction: column;
        gap: dt('card.body.gap');
    }

    .p-card-title {
        font-size: dt('card.title.font.size');
        font-weight: dt('card.title.font.weight');
    }

    .p-card-subtitle {
        color: dt('card.subtitle.color');
    }
`,classes:{root:`p-card p-component`,header:`p-card-header`,body:`p-card-body`,caption:`p-card-caption`,title:`p-card-title`,subtitle:`p-card-subtitle`,content:`p-card-content`,footer:`p-card-footer`}});e();var u={name:`Card`,extends:{name:`BaseCard`,extends:c,style:l,provide:function(){return{$pcCard:this,$parentInstance:this}}},inheritAttrs:!1};function d(e,s,c,l,u,d){return t(),r(`div`,o({class:e.cx(`root`)},e.ptmi(`root`)),[e.$slots.header?(t(),r(`div`,o({key:0,class:e.cx(`header`)},e.ptm(`header`)),[i(e.$slots,`header`)],16)):a(``,!0),n(`div`,o({class:e.cx(`body`)},e.ptm(`body`)),[e.$slots.title||e.$slots.subtitle?(t(),r(`div`,o({key:0,class:e.cx(`caption`)},e.ptm(`caption`)),[e.$slots.title?(t(),r(`div`,o({key:0,class:e.cx(`title`)},e.ptm(`title`)),[i(e.$slots,`title`)],16)):a(``,!0),e.$slots.subtitle?(t(),r(`div`,o({key:1,class:e.cx(`subtitle`)},e.ptm(`subtitle`)),[i(e.$slots,`subtitle`)],16)):a(``,!0)],16)):a(``,!0),n(`div`,o({class:e.cx(`content`)},e.ptm(`content`)),[i(e.$slots,`content`)],16),e.$slots.footer?(t(),r(`div`,o({key:1,class:e.cx(`footer`)},e.ptm(`footer`)),[i(e.$slots,`footer`)],16)):a(``,!0)],16)],16)}u.render=d;export{u as default};