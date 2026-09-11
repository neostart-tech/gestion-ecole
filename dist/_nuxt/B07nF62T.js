import{C as e,E as t,I as n,J as r,S as i,T as a,Vt as o,a as s,dt as c,et as l,g as u,k as d,nt as f,on as p,rt as m,t as h,tn as g,tt as _,ut as v,w as y,z as b}from"./B75DpUry.js";import{B as x,F as S,M as C,_ as w,i as T,l as E,t as D}from"./DtbrKeYJ.js";import{t as O}from"./cO8iUN-n.js";import{l as k}from"#entry";import{t as A}from"./BI3ReDF8.js";import{t as j}from"./GEDtbPuf.js";import{n as M}from"./CnGMLPOM2.js";import{t as N}from"./Vl_BInP82.js";import{t as P}from"./CyjWb4qr2.js";import{t as F}from"./EyglM-mK2.js";var I=D.extend({name:`confirmpopup`,style:`
    .p-confirmpopup {
        position: absolute;
        margin-top: dt('confirmpopup.gutter');
        top: 0;
        left: 0;
        background: dt('confirmpopup.background');
        color: dt('confirmpopup.color');
        border: 1px solid dt('confirmpopup.border.color');
        border-radius: dt('confirmpopup.border.radius');
        box-shadow: dt('confirmpopup.shadow');
        will-change: transform;
    }

    .p-confirmpopup-content {
        display: flex;
        align-items: center;
        padding: dt('confirmpopup.content.padding');
        gap: dt('confirmpopup.content.gap');
    }

    .p-confirmpopup-icon {
        font-size: dt('confirmpopup.icon.size');
        width: dt('confirmpopup.icon.size');
        height: dt('confirmpopup.icon.size');
        color: dt('confirmpopup.icon.color');
    }

    .p-confirmpopup-footer {
        display: flex;
        justify-content: flex-end;
        gap: dt('confirmpopup.footer.gap');
        padding: dt('confirmpopup.footer.padding');
    }

    .p-confirmpopup-footer button {
        width: auto;
    }

    .p-confirmpopup-footer button:last-child {
        margin: 0;
    }

    .p-confirmpopup-flipped {
        margin-block-start: calc(dt('confirmpopup.gutter') * -1);
        margin-block-end: dt('confirmpopup.gutter');
    }

    .p-confirmpopup:after,
    .p-confirmpopup:before {
        bottom: 100%;
        left: calc(dt('confirmpopup.arrow.offset') + dt('confirmpopup.arrow.left'));
        content: ' ';
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }

    .p-confirmpopup:after {
        border-width: calc(dt('confirmpopup.gutter') - 2px);
        margin-left: calc(-1 * (dt('confirmpopup.gutter') - 2px));
        border-style: solid;
        border-color: transparent;
        border-bottom-color: dt('confirmpopup.background');
    }

    .p-confirmpopup:before {
        border-width: dt('confirmpopup.gutter');
        margin-left: calc(-1 * dt('confirmpopup.gutter'));
        border-style: solid;
        border-color: transparent;
        border-bottom-color: dt('confirmpopup.border.color');
    }

    .p-confirmpopup-flipped:after,
    .p-confirmpopup-flipped:before {
        bottom: auto;
        top: 100%;
    }

    .p-confirmpopup-flipped:after {
        border-bottom-color: transparent;
        border-top-color: dt('confirmpopup.background');
    }

    .p-confirmpopup-flipped:before {
        border-bottom-color: transparent;
        border-top-color: dt('confirmpopup.border.color');
    }
`,classes:{root:`p-confirmpopup p-component`,content:`p-confirmpopup-content`,icon:`p-confirmpopup-icon`,message:`p-confirmpopup-message`,footer:`p-confirmpopup-footer`,pcRejectButton:`p-confirmpopup-reject-button`,pcAcceptButton:`p-confirmpopup-accept-button`}});n(),s(),o();var L={name:`ConfirmPopup`,extends:{name:`BaseConfirmPopup`,extends:j,props:{group:String},style:I,provide:function(){return{$pcConfirmPopup:this,$parentInstance:this}}},inheritAttrs:!1,data:function(){return{visible:!1,confirmation:null,autoFocusAccept:null,autoFocusReject:null,target:null}},target:null,outsideClickListener:null,scrollHandler:null,resizeListener:null,container:null,confirmListener:null,closeListener:null,mounted:function(){var e=this;this.confirmListener=function(t){t&&t.group===e.group&&(e.confirmation=t,e.target=t.target,e.confirmation.onShow&&e.confirmation.onShow(),e.visible=!0)},this.closeListener=function(){e.visible=!1,e.confirmation=null},k.on(`confirm`,this.confirmListener),k.on(`close`,this.closeListener)},beforeUnmount:function(){k.off(`confirm`,this.confirmListener),k.off(`close`,this.closeListener),this.unbindOutsideClickListener(),this.scrollHandler&&=(this.scrollHandler.destroy(),null),this.unbindResizeListener(),this.container&&=(O.clear(this.container),null),this.target=null,this.confirmation=null},methods:{accept:function(){this.confirmation.accept&&this.confirmation.accept(),this.visible=!1},reject:function(){this.confirmation.reject&&this.confirmation.reject(),this.visible=!1},onHide:function(){this.confirmation.onHide&&this.confirmation.onHide(),this.visible=!1},onAcceptKeydown:function(e){(e.code===`Space`||e.code===`Enter`||e.code===`NumpadEnter`)&&(this.accept(),x(this.target),e.preventDefault())},onRejectKeydown:function(e){(e.code===`Space`||e.code===`Enter`||e.code===`NumpadEnter`)&&(this.reject(),x(this.target),e.preventDefault())},onEnter:function(e){this.autoFocusAccept=this.confirmation.defaultFocus===void 0||this.confirmation.defaultFocus===`accept`,this.autoFocusReject=this.confirmation.defaultFocus===`reject`,this.target=this.target||document.activeElement,this.bindOutsideClickListener(),this.bindScrollListener(),this.bindResizeListener(),O.set(`overlay`,e,this.$primevue.config.zIndex.overlay)},onAfterEnter:function(){this.focus()},onLeave:function(){this.autoFocusAccept=null,this.autoFocusReject=null,x(this.target),this.target=null,this.unbindOutsideClickListener(),this.unbindScrollListener(),this.unbindResizeListener()},onAfterLeave:function(e){O.clear(e)},alignOverlay:function(){E(this.container,this.target,!1);var e=w(this.container),t=w(this.target),n=0;e.left<t.left&&(n=t.left-e.left),this.container.style.setProperty(T(`confirmpopup.arrow.left`).name,`${n}px`),e.top<t.top&&(this.container.setAttribute(`data-p-confirmpopup-flipped`,`true`),!this.isUnstyled&&C(this.container,`p-confirmpopup-flipped`))},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(t){e.visible&&e.container&&!e.container.contains(t.target)&&!e.isTargetClicked(t)?(e.confirmation.onHide&&e.confirmation.onHide(),e.visible=!1):e.alignOverlay()},document.addEventListener(`click`,this.outsideClickListener))},unbindOutsideClickListener:function(){this.outsideClickListener&&=(document.removeEventListener(`click`,this.outsideClickListener),null)},bindScrollListener:function(){var e=this;this.scrollHandler||=new P(this.target,function(){e.visible&&=!1}),this.scrollHandler.bindScrollListener()},unbindScrollListener:function(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(){e.visible&&!S()&&(e.visible=!1)},window.addEventListener(`resize`,this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&=(window.removeEventListener(`resize`,this.resizeListener),null)},focus:function(){var e=this.container.querySelector(`[autofocus]`);e&&e.focus({preventScroll:!0})},isTargetClicked:function(e){return this.target&&(this.target===e.target||this.target.contains(e.target))},containerRef:function(e){this.container=e},onOverlayClick:function(e){F.emit(`overlay-click`,{originalEvent:e,target:this.target})},onOverlayKeydown:function(e){e.code===`Escape`&&(k.emit(`close`,this.closeListener),x(this.target))}},computed:{message:function(){return this.confirmation?this.confirmation.message:null},acceptLabel:function(){if(this.confirmation){var e=this.confirmation;return e.acceptLabel||e.acceptProps?.label||this.$primevue.config.locale.accept}return this.$primevue.config.locale.accept},rejectLabel:function(){if(this.confirmation){var e=this.confirmation;return e.rejectLabel||e.rejectProps?.label||this.$primevue.config.locale.reject}return this.$primevue.config.locale.reject},acceptIcon:function(){var e;return this.confirmation?this.confirmation.acceptIcon:(e=this.confirmation)!=null&&e.acceptProps?this.confirmation.acceptProps.icon:null},rejectIcon:function(){var e;return this.confirmation?this.confirmation.rejectIcon:(e=this.confirmation)!=null&&e.rejectProps?this.confirmation.rejectProps.icon:null}},components:{Button:M,Portal:A},directives:{focustrap:N}},R=[`aria-modal`];function z(n,o,s,x,S,C){var w=_(`Button`),T=_(`Portal`),E=f(`focustrap`);return r(),e(T,null,{default:v(function(){return[d(h,b({name:`p-anchored-overlay`,onEnter:C.onEnter,onAfterEnter:C.onAfterEnter,onLeave:C.onLeave,onAfterLeave:C.onAfterLeave},n.ptm(`transition`)),{default:v(function(){return[S.visible?c((r(),a(`div`,b({key:0,ref:C.containerRef,role:`alertdialog`,class:n.cx(`root`),"aria-modal":S.visible,onClick:o[2]||=function(){return C.onOverlayClick&&C.onOverlayClick.apply(C,arguments)},onKeydown:o[3]||=function(){return C.onOverlayKeydown&&C.onOverlayKeydown.apply(C,arguments)}},n.ptmi(`root`)),[n.$slots.container?l(n.$slots,`container`,{key:0,message:S.confirmation,acceptCallback:C.accept,rejectCallback:C.reject}):(r(),a(u,{key:1},[n.$slots.message?(r(),e(m(n.$slots.message),{key:1,message:S.confirmation},null,8,[`message`])):(r(),a(`div`,b({key:0,class:n.cx(`content`)},n.ptm(`content`)),[l(n.$slots,`icon`,{},function(){return[n.$slots.icon?(r(),e(m(n.$slots.icon),{key:0,class:g(n.cx(`icon`))},null,8,[`class`])):S.confirmation.icon?(r(),a(`span`,b({key:1,class:[S.confirmation.icon,n.cx(`icon`)]},n.ptm(`icon`)),null,16)):y(``,!0)]}),i(`span`,b({class:n.cx(`message`)},n.ptm(`message`)),p(S.confirmation.message),17)],16)),i(`div`,b({class:n.cx(`footer`)},n.ptm(`footer`)),[d(w,b({class:[n.cx(`pcRejectButton`),S.confirmation.rejectClass],autofocus:S.autoFocusReject,unstyled:n.unstyled,size:S.confirmation.rejectProps?.size||`small`,text:S.confirmation.rejectProps?.text||!1,onClick:o[0]||=function(e){return C.reject()},onKeydown:C.onRejectKeydown},S.confirmation.rejectProps,{label:C.rejectLabel,pt:n.ptm(`pcRejectButton`)}),t({_:2},[C.rejectIcon||n.$slots.rejecticon?{name:`icon`,fn:v(function(e){return[l(n.$slots,`rejecticon`,{},function(){return[i(`span`,b({class:[C.rejectIcon,e.class]},n.ptm(`pcRejectButton`).icon,{"data-pc-section":`rejectbuttonicon`}),null,16)]})]}),key:`0`}:void 0]),1040,[`class`,`autofocus`,`unstyled`,`size`,`text`,`onKeydown`,`label`,`pt`]),d(w,b({class:[n.cx(`pcAcceptButton`),S.confirmation.acceptClass],autofocus:S.autoFocusAccept,unstyled:n.unstyled,size:S.confirmation.acceptProps?.size||`small`,onClick:o[1]||=function(e){return C.accept()},onKeydown:C.onAcceptKeydown},S.confirmation.acceptProps,{label:C.acceptLabel,pt:n.ptm(`pcAcceptButton`)}),t({_:2},[C.acceptIcon||n.$slots.accepticon?{name:`icon`,fn:v(function(e){return[l(n.$slots,`accepticon`,{},function(){return[i(`span`,b({class:[C.acceptIcon,e.class]},n.ptm(`pcAcceptButton`).icon,{"data-pc-section":`acceptbuttonicon`}),null,16)]})]}),key:`0`}:void 0]),1040,[`class`,`autofocus`,`unstyled`,`size`,`onKeydown`,`label`,`pt`])],16)],64))],16,R)),[[E]]):y(``,!0)]}),_:3},16,[`onEnter`,`onAfterEnter`,`onLeave`,`onAfterLeave`])]}),_:3})}L.render=z;export{L as default};