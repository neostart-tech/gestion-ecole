import{$ as e,C as t,I as n,J as r,O as i,S as a,T as o,Vt as s,a as c,dt as l,et as u,g as d,k as f,nt as p,on as m,rt as h,t as g,tn as _,tt as v,ut as y,w as b,z as x}from"./B75DpUry.js";import{B as S,D as C,F as w,P as T,Q as E,St as D,et as O,l as k,t as A}from"./DtbrKeYJ.js";import{t as j}from"./CRHlWn3X.js";import{t as M}from"./cO8iUN-n.js";import{t as N}from"./BI3ReDF8.js";import{t as P}from"./GEDtbPuf.js";import{t as F}from"./CZy7fYBs.js";import{t as I}from"./CyjWb4qr2.js";import{t as L}from"./EyglM-mK2.js";var R=A.extend({name:`menu`,style:`
    .p-menu {
        background: dt('menu.background');
        color: dt('menu.color');
        border: 1px solid dt('menu.border.color');
        border-radius: dt('menu.border.radius');
        min-width: 12.5rem;
    }

    .p-menu-list {
        margin: 0;
        padding: dt('menu.list.padding');
        outline: 0 none;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: dt('menu.list.gap');
    }

    .p-menu-item-content {
        transition:
            background dt('menu.transition.duration'),
            color dt('menu.transition.duration');
        border-radius: dt('menu.item.border.radius');
        color: dt('menu.item.color');
        overflow: hidden;
    }

    .p-menu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('menu.item.padding');
        gap: dt('menu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .p-menu-item-label {
        line-height: 1;
    }

    .p-menu-item-icon {
        color: dt('menu.item.icon.color');
    }

    .p-menu-item.p-focus .p-menu-item-content {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .p-menu-item.p-focus .p-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover .p-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .p-menu-overlay {
        box-shadow: dt('menu.shadow');
    }

    .p-menu-submenu-label {
        background: dt('menu.submenu.label.background');
        padding: dt('menu.submenu.label.padding');
        color: dt('menu.submenu.label.color');
        font-weight: dt('menu.submenu.label.font.weight');
    }

    .p-menu-separator {
        border-block-start: 1px solid dt('menu.separator.border.color');
    }
`,classes:{root:function(e){return[`p-menu p-component`,{"p-menu-overlay":e.props.popup}]},start:`p-menu-start`,list:`p-menu-list`,submenuLabel:`p-menu-submenu-label`,separator:`p-menu-separator`,end:`p-menu-end`,item:function(e){var t=e.instance;return[`p-menu-item`,{"p-focus":t.id===t.focusedOptionId,"p-disabled":t.disabled()}]},itemContent:`p-menu-item-content`,itemLink:`p-menu-item-link`,itemIcon:`p-menu-item-icon`,itemLabel:`p-menu-item-label`}});n(),s(),c();var z={name:`BaseMenu`,extends:P,props:{popup:{type:Boolean,default:!1},model:{type:Array,default:null},appendTo:{type:[String,Object],default:`body`},autoZIndex:{type:Boolean,default:!0},baseZIndex:{type:Number,default:0},tabindex:{type:Number,default:0},ariaLabel:{type:String,default:null},ariaLabelledby:{type:String,default:null}},style:R,provide:function(){return{$pcMenu:this,$parentInstance:this}}},B={name:`Menuitem`,hostName:`Menu`,extends:P,inheritAttrs:!1,emits:[`item-click`,`item-mousemove`],props:{item:null,templates:null,id:null,focusedOptionId:null,index:null},methods:{getItemProp:function(e,t){return e&&e.item?D(e.item[t]):void 0},getPTOptions:function(e){return this.ptm(e,{context:{item:this.item,index:this.index,focused:this.isItemFocused(),disabled:this.disabled()}})},isItemFocused:function(){return this.focusedOptionId===this.id},onItemClick:function(e){var t=this.getItemProp(this.item,`command`);t&&t({originalEvent:e,item:this.item.item}),this.$emit(`item-click`,{originalEvent:e,item:this.item,id:this.id})},onItemMouseMove:function(e){this.$emit(`item-mousemove`,{originalEvent:e,item:this.item,id:this.id})},visible:function(){return typeof this.item.visible==`function`?this.item.visible():this.item.visible!==!1},disabled:function(){return typeof this.item.disabled==`function`?this.item.disabled():this.item.disabled},label:function(){return typeof this.item.label==`function`?this.item.label():this.item.label},getMenuItemProps:function(e){return{action:x({class:this.cx(`itemLink`),tabindex:`-1`},this.getPTOptions(`itemLink`)),icon:x({class:[this.cx(`itemIcon`),e.icon]},this.getPTOptions(`itemIcon`)),label:x({class:this.cx(`itemLabel`)},this.getPTOptions(`itemLabel`))}}},computed:{dataP:function(){return j({focus:this.isItemFocused(),disabled:this.disabled()})}},directives:{ripple:F}},V=[`id`,`aria-label`,`aria-disabled`,`data-p-focused`,`data-p-disabled`,`data-p`],H=[`data-p`],U=[`href`,`target`],W=[`data-p`],G=[`data-p`];function K(e,n,i,s,c,u){var d=p(`ripple`);return u.visible()?(r(),o(`li`,x({key:0,id:i.id,class:[e.cx(`item`),i.item.class],role:`menuitem`,style:i.item.style,"aria-label":u.label(),"aria-disabled":u.disabled(),"data-p-focused":u.isItemFocused(),"data-p-disabled":u.disabled()||!1,"data-p":u.dataP},u.getPTOptions(`item`)),[a(`div`,x({class:e.cx(`itemContent`),onClick:n[0]||=function(e){return u.onItemClick(e)},onMousemove:n[1]||=function(e){return u.onItemMouseMove(e)},"data-p":u.dataP},u.getPTOptions(`itemContent`)),[i.templates.item?i.templates.item?(r(),t(h(i.templates.item),{key:1,item:i.item,label:u.label(),props:u.getMenuItemProps(i.item)},null,8,[`item`,`label`,`props`])):b(``,!0):l((r(),o(`a`,x({key:0,href:i.item.url,class:e.cx(`itemLink`),target:i.item.target,tabindex:`-1`},u.getPTOptions(`itemLink`)),[i.templates.itemicon?(r(),t(h(i.templates.itemicon),{key:0,item:i.item,class:_(e.cx(`itemIcon`))},null,8,[`item`,`class`])):i.item.icon?(r(),o(`span`,x({key:1,class:[e.cx(`itemIcon`),i.item.icon],"data-p":u.dataP},u.getPTOptions(`itemIcon`)),null,16,W)):b(``,!0),a(`span`,x({class:e.cx(`itemLabel`),"data-p":u.dataP},u.getPTOptions(`itemLabel`)),m(u.label()),17,G)],16,U)),[[d]])],16,H)],16,V)):b(``,!0)}B.render=K;function q(e){return Z(e)||X(e)||Y(e)||J()}function J(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Y(e,t){if(e){if(typeof e==`string`)return Q(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Q(e,t):void 0}}function X(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function Z(e){if(Array.isArray(e))return Q(e)}function Q(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var $={name:`Menu`,extends:z,inheritAttrs:!1,emits:[`show`,`hide`,`focus`,`blur`],data:function(){return{overlayVisible:!1,focused:!1,focusedOptionIndex:-1,selectedOptionIndex:-1}},target:null,outsideClickListener:null,scrollHandler:null,resizeListener:null,container:null,list:null,mounted:function(){this.popup||(this.bindResizeListener(),this.bindOutsideClickListener())},beforeUnmount:function(){this.unbindResizeListener(),this.unbindOutsideClickListener(),this.scrollHandler&&=(this.scrollHandler.destroy(),null),this.target=null,this.container&&this.autoZIndex&&M.clear(this.container),this.container=null},methods:{itemClick:function(e){var t=e.item;this.disabled(t)||(t.command&&t.command(e),this.overlayVisible&&this.hide(),!this.popup&&this.focusedOptionIndex!==e.id&&(this.focusedOptionIndex=e.id))},itemMouseMove:function(e){this.focused&&(this.focusedOptionIndex=e.id)},onListFocus:function(e){this.focused=!0,!this.popup&&this.changeFocusedOptionIndex(0),this.$emit(`focus`,e)},onListBlur:function(e){this.focused=!1,this.focusedOptionIndex=-1,this.$emit(`blur`,e)},onListKeyDown:function(e){switch(e.code){case`ArrowDown`:this.onArrowDownKey(e);break;case`ArrowUp`:this.onArrowUpKey(e);break;case`Home`:this.onHomeKey(e);break;case`End`:this.onEndKey(e);break;case`Enter`:case`NumpadEnter`:this.onEnterKey(e);break;case`Space`:this.onSpaceKey(e);break;case`Escape`:this.popup&&(S(this.target),this.hide());case`Tab`:this.overlayVisible&&this.hide()}},onArrowDownKey:function(e){var t=this.findNextOptionIndex(this.focusedOptionIndex);this.changeFocusedOptionIndex(t),e.preventDefault()},onArrowUpKey:function(e){if(e.altKey&&this.popup)S(this.target),this.hide(),e.preventDefault();else{var t=this.findPrevOptionIndex(this.focusedOptionIndex);this.changeFocusedOptionIndex(t),e.preventDefault()}},onHomeKey:function(e){this.changeFocusedOptionIndex(0),e.preventDefault()},onEndKey:function(e){this.changeFocusedOptionIndex(T(this.container,`li[data-pc-section="item"][data-p-disabled="false"]`).length-1),e.preventDefault()},onEnterKey:function(e){var t=O(this.list,`li[id="${`${this.focusedOptionIndex}`}"]`),n=t&&O(t,`a[data-pc-section="itemlink"]`);this.popup&&S(this.target),n?n.click():t&&t.click(),e.preventDefault()},onSpaceKey:function(e){this.onEnterKey(e)},findNextOptionIndex:function(e){var t=q(T(this.container,`li[data-pc-section="item"][data-p-disabled="false"]`)).findIndex(function(t){return t.id===e});return t>-1?t+1:0},findPrevOptionIndex:function(e){var t=q(T(this.container,`li[data-pc-section="item"][data-p-disabled="false"]`)).findIndex(function(t){return t.id===e});return t>-1?t-1:0},changeFocusedOptionIndex:function(e){var t=T(this.container,`li[data-pc-section="item"][data-p-disabled="false"]`),n=e>=t.length?t.length-1:e<0?0:e;n>-1&&(this.focusedOptionIndex=t[n].getAttribute(`id`))},toggle:function(e,t){this.overlayVisible?this.hide():this.show(e,t)},show:function(e,t){this.overlayVisible=!0,this.target=t??e.currentTarget},hide:function(){this.overlayVisible=!1,this.target=null},onEnter:function(e){C(e,{position:`absolute`,top:`0`}),this.alignOverlay(),this.bindOutsideClickListener(),this.bindResizeListener(),this.bindScrollListener(),this.autoZIndex&&M.set(`menu`,e,this.baseZIndex+this.$primevue.config.zIndex.menu),this.popup&&S(this.list),this.$emit(`show`)},onLeave:function(){this.unbindOutsideClickListener(),this.unbindResizeListener(),this.unbindScrollListener(),this.$emit(`hide`)},onAfterLeave:function(e){this.autoZIndex&&M.clear(e)},alignOverlay:function(){k(this.container,this.target),E(this.target)>E(this.container)&&(this.container.style.minWidth=E(this.target)+`px`)},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(t){var n=e.container&&!e.container.contains(t.target),r=!(e.target&&(e.target===t.target||e.target.contains(t.target)));e.overlayVisible&&n&&r?e.hide():!e.popup&&n&&r&&(e.focusedOptionIndex=-1)},document.addEventListener(`click`,this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&=(document.removeEventListener(`click`,this.outsideClickListener,!0),null)},bindScrollListener:function(){var e=this;this.scrollHandler||=new I(this.target,function(){e.overlayVisible&&e.hide()}),this.scrollHandler.bindScrollListener()},unbindScrollListener:function(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(){e.overlayVisible&&!w()&&e.hide()},window.addEventListener(`resize`,this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&=(window.removeEventListener(`resize`,this.resizeListener),null)},visible:function(e){return typeof e.visible==`function`?e.visible():e.visible!==!1},disabled:function(e){return typeof e.disabled==`function`?e.disabled():e.disabled},label:function(e){return typeof e.label==`function`?e.label():e.label},onOverlayClick:function(e){L.emit(`overlay-click`,{originalEvent:e,target:this.target})},containerRef:function(e){this.container=e},listRef:function(e){this.list=e}},computed:{focusedOptionId:function(){return this.focusedOptionIndex===-1?null:this.focusedOptionIndex},dataP:function(){return j({popup:this.popup})}},components:{PVMenuitem:B,Portal:N}},ee=[`id`,`data-p`],te=[`id`,`tabindex`,`aria-activedescendant`,`aria-label`,`aria-labelledby`],ne=[`id`];function re(n,s,c,l,p,h){var _=v(`PVMenuitem`),S=v(`Portal`);return r(),t(S,{appendTo:n.appendTo,disabled:!n.popup},{default:y(function(){return[f(g,x({name:`p-anchored-overlay`,onEnter:h.onEnter,onLeave:h.onLeave,onAfterLeave:h.onAfterLeave},n.ptm(`transition`)),{default:y(function(){return[!n.popup||p.overlayVisible?(r(),o(`div`,x({key:0,ref:h.containerRef,id:n.$id,class:n.cx(`root`),onClick:s[3]||=function(){return h.onOverlayClick&&h.onOverlayClick.apply(h,arguments)},"data-p":h.dataP},n.ptmi(`root`)),[n.$slots.start?(r(),o(`div`,x({key:0,class:n.cx(`start`)},n.ptm(`start`)),[u(n.$slots,`start`)],16)):b(``,!0),a(`ul`,x({ref:h.listRef,id:n.$id+`_list`,class:n.cx(`list`),role:`menu`,tabindex:n.tabindex,"aria-activedescendant":p.focused?h.focusedOptionId:void 0,"aria-label":n.ariaLabel,"aria-labelledby":n.ariaLabelledby,onFocus:s[0]||=function(){return h.onListFocus&&h.onListFocus.apply(h,arguments)},onBlur:s[1]||=function(){return h.onListBlur&&h.onListBlur.apply(h,arguments)},onKeydown:s[2]||=function(){return h.onListKeyDown&&h.onListKeyDown.apply(h,arguments)}},n.ptm(`list`)),[(r(!0),o(d,null,e(n.model,function(a,s){return r(),o(d,{key:h.label(a)+s.toString()},[a.items&&h.visible(a)&&!a.separator?(r(),o(d,{key:0},[a.items?(r(),o(`li`,x({key:0,id:n.$id+`_`+s,class:[n.cx(`submenuLabel`),a.class],role:`none`},{ref_for:!0},n.ptm(`submenuLabel`)),[u(n.$slots,n.$slots.submenulabel?`submenulabel`:`submenuheader`,{item:a},function(){return[i(m(h.label(a)),1)]})],16,ne)):b(``,!0),(r(!0),o(d,null,e(a.items,function(e,i){return r(),o(d,{key:e.label+s+`_`+i},[h.visible(e)&&!e.separator?(r(),t(_,{key:0,id:n.$id+`_`+s+`_`+i,item:e,templates:n.$slots,focusedOptionId:h.focusedOptionId,unstyled:n.unstyled,onItemClick:h.itemClick,onItemMousemove:h.itemMouseMove,pt:n.pt},null,8,[`id`,`item`,`templates`,`focusedOptionId`,`unstyled`,`onItemClick`,`onItemMousemove`,`pt`])):h.visible(e)&&e.separator?(r(),o(`li`,x({key:`separator`+s+i,class:[n.cx(`separator`),a.class],style:e.style,role:`separator`},{ref_for:!0},n.ptm(`separator`)),null,16)):b(``,!0)],64)}),128))],64)):h.visible(a)&&a.separator?(r(),o(`li`,x({key:`separator`+s.toString(),class:[n.cx(`separator`),a.class],style:a.style,role:`separator`},{ref_for:!0},n.ptm(`separator`)),null,16)):(r(),t(_,{key:h.label(a)+s.toString(),id:n.$id+`_`+s,item:a,index:s,templates:n.$slots,focusedOptionId:h.focusedOptionId,unstyled:n.unstyled,onItemClick:h.itemClick,onItemMousemove:h.itemMouseMove,pt:n.pt},null,8,[`id`,`item`,`index`,`templates`,`focusedOptionId`,`unstyled`,`onItemClick`,`onItemMousemove`,`pt`]))],64)}),128))],16,te),n.$slots.end?(r(),o(`div`,x({key:1,class:n.cx(`end`)},n.ptm(`end`)),[u(n.$slots,`end`)],16)):b(``,!0)],16,ee)):b(``,!0)]}),_:3},16,[`onEnter`,`onLeave`,`onAfterLeave`])]}),_:3},8,[`appendTo`,`disabled`])}$.render=re;export{$ as default};