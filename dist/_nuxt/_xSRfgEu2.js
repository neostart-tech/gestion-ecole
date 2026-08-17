import{r as e}from"./B0Z9INg1.js";import{C as t,I as n,J as r,T as i,Vt as a,et as o,on as s,rt as c,w as l,z as u}from"./B75DpUry.js";import{t as d}from"./DtbrKeYJ.js";import{t as f}from"./CRHlWn3X.js";import{t as p}from"./GEDtbPuf.js";import{t as m}from"./CWR6DvZE.js";var h=d.extend({name:`chip`,style:`
    .p-chip {
        display: inline-flex;
        align-items: center;
        background: dt('chip.background');
        color: dt('chip.color');
        border-radius: dt('chip.border.radius');
        padding-block: dt('chip.padding.y');
        padding-inline: dt('chip.padding.x');
        gap: dt('chip.gap');
    }

    .p-chip-icon {
        color: dt('chip.icon.color');
        font-size: dt('chip.icon.size');
        width: dt('chip.icon.size');
        height: dt('chip.icon.size');
    }

    .p-chip-image {
        border-radius: 50%;
        width: dt('chip.image.width');
        height: dt('chip.image.height');
        margin-inline-start: calc(-1 * dt('chip.padding.y'));
    }

    .p-chip:has(.p-chip-remove-icon) {
        padding-inline-end: dt('chip.padding.y');
    }

    .p-chip:has(.p-chip-image) {
        padding-block-start: calc(dt('chip.padding.y') / 2);
        padding-block-end: calc(dt('chip.padding.y') / 2);
    }

    .p-chip-remove-icon {
        cursor: pointer;
        font-size: dt('chip.remove.icon.size');
        width: dt('chip.remove.icon.size');
        height: dt('chip.remove.icon.size');
        color: dt('chip.remove.icon.color');
        border-radius: 50%;
        transition:
            outline-color dt('chip.transition.duration'),
            box-shadow dt('chip.transition.duration');
        outline-color: transparent;
    }

    .p-chip-remove-icon:focus-visible {
        box-shadow: dt('chip.remove.icon.focus.ring.shadow');
        outline: dt('chip.remove.icon.focus.ring.width') dt('chip.remove.icon.focus.ring.style') dt('chip.remove.icon.focus.ring.color');
        outline-offset: dt('chip.remove.icon.focus.ring.offset');
    }
`,classes:{root:`p-chip p-component`,image:`p-chip-image`,icon:`p-chip-icon`,label:`p-chip-label`,removeIcon:`p-chip-remove-icon`}}),g=e({default:()=>_});n(),a();var _={name:`Chip`,extends:{name:`BaseChip`,extends:p,props:{label:{type:[String,Number],default:null},icon:{type:String,default:null},image:{type:String,default:null},removable:{type:Boolean,default:!1},removeIcon:{type:String,default:void 0}},style:h,provide:function(){return{$pcChip:this,$parentInstance:this}}},inheritAttrs:!1,emits:[`remove`],data:function(){return{visible:!0}},methods:{onKeydown:function(e){(e.key===`Enter`||e.key===`Backspace`)&&this.close(e)},close:function(e){this.visible=!1,this.$emit(`remove`,e)}},computed:{dataP:function(){return f({removable:this.removable})}},components:{TimesCircleIcon:m}},v=[`aria-label`,`data-p`],y=[`src`];function b(e,n,a,d,f,p){return f.visible?(r(),i(`div`,u({key:0,class:e.cx(`root`),"aria-label":e.label},e.ptmi(`root`),{"data-p":p.dataP}),[o(e.$slots,`default`,{},function(){return[e.image?(r(),i(`img`,u({key:0,src:e.image},e.ptm(`image`),{class:e.cx(`image`)}),null,16,y)):e.$slots.icon?(r(),t(c(e.$slots.icon),u({key:1,class:e.cx(`icon`)},e.ptm(`icon`)),null,16,[`class`])):e.icon?(r(),i(`span`,u({key:2,class:[e.cx(`icon`),e.icon]},e.ptm(`icon`)),null,16)):l(``,!0),e.label===null?l(``,!0):(r(),i(`div`,u({key:3,class:e.cx(`label`)},e.ptm(`label`)),s(e.label),17))]}),e.removable?o(e.$slots,`removeicon`,{key:0,removeCallback:p.close,keydownCallback:p.onKeydown},function(){return[(r(),t(c(e.removeIcon?`span`:`TimesCircleIcon`),u({class:[e.cx(`removeIcon`),e.removeIcon],onClick:p.close,onKeydown:p.onKeydown},e.ptm(`removeIcon`)),null,16,[`class`,`onClick`,`onKeydown`]))]}):l(``,!0)],16,v)):l(``,!0)}_.render=b;export{_ as n,g as t};