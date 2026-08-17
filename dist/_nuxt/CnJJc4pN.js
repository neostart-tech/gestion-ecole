import{$ as e,C as t,I as n,J as r,S as i,T as a,Vt as o,a as s,dt as c,et as l,g as u,k as d,nt as f,on as p,rt as m,t as h,tn as g,tt as _,ut as v,w as y,z as b}from"./B75DpUry.js";import{B as x,D as S,Et as C,F as w,Q as T,St as E,ct as D,et as O,l as k,st as A,t as j,tt as M,xt as N}from"./DtbrKeYJ.js";import{t as P}from"./cO8iUN-n.js";import{t as F}from"./BI3ReDF8.js";import{t as I}from"./GEDtbPuf.js";import{t as L}from"./CZy7fYBs.js";import{t as R}from"./CyjWb4qr2.js";import{t as z}from"./EyglM-mK2.js";import{t as B}from"./DgqQkpCZ.js";var V=j.extend({name:`tieredmenu`,style:`
    .p-tieredmenu {
        background: dt('tieredmenu.background');
        color: dt('tieredmenu.color');
        border: 1px solid dt('tieredmenu.border.color');
        border-radius: dt('tieredmenu.border.radius');
        min-width: 12.5rem;
    }
    

    .p-tieredmenu-root-list,
    .p-tieredmenu-submenu {
        margin: 0;
        padding: dt('tieredmenu.list.padding');
        list-style: none;
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('tieredmenu.list.gap');
    }

    .p-tieredmenu-submenu {
        position: absolute;
        min-width: 100%;
        z-index: 1;
        background: dt('tieredmenu.background');
        color: dt('tieredmenu.color');
        border: 1px solid dt('tieredmenu.border.color');
        border-radius: dt('tieredmenu.border.radius');
        box-shadow: dt('tieredmenu.shadow');
    }

    .p-tieredmenu-item {
        position: relative;
    }

    .p-tieredmenu-item-content {
        transition:
            background dt('tieredmenu.transition.duration'),
            color dt('tieredmenu.transition.duration');
        border-radius: dt('tieredmenu.item.border.radius');
        color: dt('tieredmenu.item.color');
    }

    .p-tieredmenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('tieredmenu.item.padding');
        gap: dt('tieredmenu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .p-tieredmenu-item-label {
        line-height: 1;
    }

    .p-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.color');
    }

    .p-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.color');
        margin-left: auto;
        font-size: dt('tieredmenu.submenu.icon.size');
        width: dt('tieredmenu.submenu.icon.size');
        height: dt('tieredmenu.submenu.icon.size');
    }

    .p-tieredmenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .p-tieredmenu-item.p-focus > .p-tieredmenu-item-content {
        color: dt('tieredmenu.item.focus.color');
        background: dt('tieredmenu.item.focus.background');
    }

    .p-tieredmenu-item.p-focus > .p-tieredmenu-item-content .p-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.focus.color');
    }

    .p-tieredmenu-item.p-focus > .p-tieredmenu-item-content .p-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.focus.color');
    }

    .p-tieredmenu-item:not(.p-disabled) > .p-tieredmenu-item-content:hover {
        color: dt('tieredmenu.item.focus.color');
        background: dt('tieredmenu.item.focus.background');
    }

    .p-tieredmenu-item:not(.p-disabled) > .p-tieredmenu-item-content:hover .p-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.focus.color');
    }

    .p-tieredmenu-item:not(.p-disabled) > .p-tieredmenu-item-content:hover .p-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.focus.color');
    }

    .p-tieredmenu-item-active > .p-tieredmenu-item-content {
        color: dt('tieredmenu.item.active.color');
        background: dt('tieredmenu.item.active.background');
    }

    .p-tieredmenu-item-active > .p-tieredmenu-item-content .p-tieredmenu-item-icon {
        color: dt('tieredmenu.item.icon.active.color');
    }

    .p-tieredmenu-item-active > .p-tieredmenu-item-content .p-tieredmenu-submenu-icon {
        color: dt('tieredmenu.submenu.icon.active.color');
    }

    .p-tieredmenu-separator {
        border-block-start: 1px solid dt('tieredmenu.separator.border.color');
    }

    .p-tieredmenu-overlay {
        box-shadow: dt('tieredmenu.shadow');
        will-change: transform;
    }

    .p-tieredmenu-mobile .p-tieredmenu-submenu {
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('tieredmenu.submenu.mobile.indent');
        padding-inline-end: 0;
    }

    .p-tieredmenu-mobile .p-tieredmenu-submenu:dir(rtl) {
        padding-inline-start: 0;
        padding-inline-end: dt('tieredmenu.submenu.mobile.indent');
    }

    .p-tieredmenu-mobile .p-tieredmenu-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .p-tieredmenu-mobile .p-tieredmenu-item-active > .p-tieredmenu-item-content .p-tieredmenu-submenu-icon {
        transform: rotate(-90deg);
    }
`,classes:{root:function(e){var t=e.props,n=e.instance;return[`p-tieredmenu p-component`,{"p-tieredmenu-overlay":t.popup,"p-tieredmenu-mobile":n.queryMatches}]},start:`p-tieredmenu-start`,rootList:`p-tieredmenu-root-list`,item:function(e){var t=e.instance,n=e.processedItem;return[`p-tieredmenu-item`,{"p-tieredmenu-item-active":t.isItemActive(n),"p-focus":t.isItemFocused(n),"p-disabled":t.isItemDisabled(n)}]},itemContent:`p-tieredmenu-item-content`,itemLink:`p-tieredmenu-item-link`,itemIcon:`p-tieredmenu-item-icon`,itemLabel:`p-tieredmenu-item-label`,submenuIcon:`p-tieredmenu-submenu-icon`,submenu:`p-tieredmenu-submenu`,separator:`p-tieredmenu-separator`,end:`p-tieredmenu-end`},inlineStyles:{submenu:function(e){var t=e.instance,n=e.processedItem;return{display:t.isItemActive(n)?`flex`:`none`}}}});n(),s(),o();var H={name:`BaseTieredMenu`,extends:I,props:{popup:{type:Boolean,default:!1},model:{type:Array,default:null},appendTo:{type:[String,Object],default:`body`},breakpoint:{type:String,default:`960px`},autoZIndex:{type:Boolean,default:!0},baseZIndex:{type:Number,default:0},disabled:{type:Boolean,default:!1},tabindex:{type:Number,default:0},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:V,provide:function(){return{$pcTieredMenu:this,$parentInstance:this}}},U={name:`TieredMenuSub`,hostName:`TieredMenu`,extends:I,emits:[`item-click`,`item-mouseenter`,`item-mousemove`],container:null,props:{menuId:{type:String,default:null},focusedItemId:{type:String,default:null},items:{type:Array,default:null},visible:{type:Boolean,default:!1},level:{type:Number,default:0},templates:{type:Object,default:null},activeItemPath:{type:Object,default:null},tabindex:{type:Number,default:0}},methods:{getItemId:function(e){return`${this.menuId}_${e.key}`},getItemKey:function(e){return this.getItemId(e)},getItemProp:function(e,t,n){return e&&e.item?E(e.item[t],n):void 0},getItemLabel:function(e){return this.getItemProp(e,`label`)},getItemLabelId:function(e){return`${this.menuId}_${e.key}_label`},getPTOptions:function(e,t,n){return this.ptm(n,{context:{item:e.item,index:t,active:this.isItemActive(e),focused:this.isItemFocused(e),disabled:this.isItemDisabled(e)}})},isItemActive:function(e){return this.activeItemPath.some(function(t){return t.key===e.key})},isItemVisible:function(e){return this.getItemProp(e,`visible`)!==!1},isItemDisabled:function(e){return this.getItemProp(e,`disabled`)},isItemFocused:function(e){return this.focusedItemId===this.getItemId(e)},isItemGroup:function(e){return C(e.items)},onEnter:function(){M(this.container,this.level)},onItemClick:function(e,t){this.getItemProp(t,`command`,{originalEvent:e,item:t.item}),this.$emit(`item-click`,{originalEvent:e,processedItem:t,isFocus:!0})},onItemMouseEnter:function(e,t){this.$emit(`item-mouseenter`,{originalEvent:e,processedItem:t})},onItemMouseMove:function(e,t){this.$emit(`item-mousemove`,{originalEvent:e,processedItem:t})},getAriaSetSize:function(){var e=this;return this.items.filter(function(t){return e.isItemVisible(t)&&!e.getItemProp(t,`separator`)}).length},getAriaPosInset:function(e){var t=this;return e-this.items.slice(0,e).filter(function(e){return t.isItemVisible(e)&&t.getItemProp(e,`separator`)}).length+1},getMenuItemProps:function(e,t){return{action:b({class:this.cx(`itemLink`),tabindex:-1},this.getPTOptions(e,t,`itemLink`)),icon:b({class:[this.cx(`itemIcon`),this.getItemProp(e,`icon`)]},this.getPTOptions(e,t,`itemIcon`)),label:b({class:this.cx(`itemLabel`)},this.getPTOptions(e,t,`itemLabel`)),submenuicon:b({class:this.cx(`submenuIcon`)},this.getPTOptions(e,t,`submenuIcon`))}},containerRef:function(e){this.container=e}},components:{AngleRightIcon:B},directives:{ripple:L}},W=[`tabindex`],G=[`id`,`aria-label`,`aria-disabled`,`aria-expanded`,`aria-haspopup`,`aria-level`,`aria-setsize`,`aria-posinset`,`data-p-active`,`data-p-focused`,`data-p-disabled`],K=[`onClick`,`onMouseenter`,`onMousemove`],q=[`href`,`target`],J=[`id`],Y=[`id`];function X(n,o,s,l,d,x){var S=_(`AngleRightIcon`),C=_(`TieredMenuSub`,!0),w=f(`ripple`);return r(),t(h,b({name:`p-anchored-overlay`,onEnter:x.onEnter},n.ptm(`menu.transition`)),{default:v(function(){return[s.level===0||s.visible?(r(),a(`ul`,{key:0,ref:x.containerRef,tabindex:s.tabindex},[(r(!0),a(u,null,e(s.items,function(e,l){return r(),a(u,{key:x.getItemKey(e)},[x.isItemVisible(e)&&!x.getItemProp(e,`separator`)?(r(),a(`li`,b({key:0,id:x.getItemId(e),style:x.getItemProp(e,`style`),class:[n.cx(`item`,{processedItem:e}),x.getItemProp(e,`class`)],role:`menuitem`,"aria-label":x.getItemLabel(e),"aria-disabled":x.isItemDisabled(e)||void 0,"aria-expanded":x.isItemGroup(e)?x.isItemActive(e):void 0,"aria-haspopup":x.isItemGroup(e)&&!x.getItemProp(e,`to`)?`menu`:void 0,"aria-level":s.level+1,"aria-setsize":x.getAriaSetSize(),"aria-posinset":x.getAriaPosInset(l)},{ref_for:!0},x.getPTOptions(e,l,`item`),{"data-p-active":x.isItemActive(e),"data-p-focused":x.isItemFocused(e),"data-p-disabled":x.isItemDisabled(e)}),[i(`div`,b({class:n.cx(`itemContent`),onClick:function(t){return x.onItemClick(t,e)},onMouseenter:function(t){return x.onItemMouseEnter(t,e)},onMousemove:function(t){return x.onItemMouseMove(t,e)}},{ref_for:!0},x.getPTOptions(e,l,`itemContent`)),[s.templates.item?(r(),t(m(s.templates.item),{key:1,item:e.item,hasSubmenu:x.getItemProp(e,`items`),label:x.getItemLabel(e),props:x.getMenuItemProps(e,l)},null,8,[`item`,`hasSubmenu`,`label`,`props`])):c((r(),a(`a`,b({key:0,href:x.getItemProp(e,`url`),class:n.cx(`itemLink`),target:x.getItemProp(e,`target`),tabindex:`-1`},{ref_for:!0},x.getPTOptions(e,l,`itemLink`)),[s.templates.itemicon?(r(),t(m(s.templates.itemicon),{key:0,item:e.item,class:g(n.cx(`itemIcon`))},null,8,[`item`,`class`])):x.getItemProp(e,`icon`)?(r(),a(`span`,b({key:1,class:[n.cx(`itemIcon`),x.getItemProp(e,`icon`)]},{ref_for:!0},x.getPTOptions(e,l,`itemIcon`)),null,16)):y(``,!0),i(`span`,b({id:x.getItemLabelId(e),class:n.cx(`itemLabel`)},{ref_for:!0},x.getPTOptions(e,l,`itemLabel`)),p(x.getItemLabel(e)),17,J),x.getItemProp(e,`items`)?(r(),a(u,{key:2},[s.templates.submenuicon?(r(),t(m(s.templates.submenuicon),b({key:0,class:n.cx(`submenuIcon`),active:x.isItemActive(e)},{ref_for:!0},x.getPTOptions(e,l,`submenuIcon`)),null,16,[`class`,`active`])):(r(),t(S,b({key:1,class:n.cx(`submenuIcon`)},{ref_for:!0},x.getPTOptions(e,l,`submenuIcon`)),null,16,[`class`]))],64)):y(``,!0)],16,q)),[[w]])],16,K),x.isItemVisible(e)&&x.isItemGroup(e)?(r(),t(C,b({key:0,id:x.getItemId(e)+`_list`,class:n.cx(`submenu`),style:n.sx(`submenu`,!0,{processedItem:e}),"aria-labelledby":x.getItemLabelId(e),role:`menu`,menuId:s.menuId,focusedItemId:s.focusedItemId,items:e.items,templates:s.templates,activeItemPath:s.activeItemPath,level:s.level+1,visible:x.isItemActive(e)&&x.isItemGroup(e),pt:n.pt,unstyled:n.unstyled,onItemClick:o[0]||=function(e){return n.$emit(`item-click`,e)},onItemMouseenter:o[1]||=function(e){return n.$emit(`item-mouseenter`,e)},onItemMousemove:o[2]||=function(e){return n.$emit(`item-mousemove`,e)}},{ref_for:!0},n.ptm(`submenu`)),null,16,[`id`,`class`,`style`,`aria-labelledby`,`menuId`,`focusedItemId`,`items`,`templates`,`activeItemPath`,`level`,`visible`,`pt`,`unstyled`])):y(``,!0)],16,G)):y(``,!0),x.isItemVisible(e)&&x.getItemProp(e,`separator`)?(r(),a(`li`,b({key:1,id:x.getItemId(e),style:x.getItemProp(e,`style`),class:[n.cx(`separator`),x.getItemProp(e,`class`)],role:`separator`},{ref_for:!0},n.ptm(`separator`)),null,16,Y)):y(``,!0)],64)}),128))],8,W)):y(``,!0)]}),_:1},16,[`onEnter`])}U.render=X;var Z={name:`TieredMenu`,extends:H,inheritAttrs:!1,emits:[`focus`,`blur`,`before-show`,`before-hide`,`hide`,`show`],outsideClickListener:null,matchMediaListener:null,scrollHandler:null,resizeListener:null,target:null,container:null,menubar:null,searchTimeout:null,searchValue:null,data:function(){return{focused:!1,focusedItemInfo:{index:-1,level:0,parentKey:``},activeItemPath:[],visible:!this.popup,submenuVisible:!1,dirty:!1,query:null,queryMatches:!1}},watch:{activeItemPath:function(e){this.popup||(C(e)?(this.bindOutsideClickListener(),this.bindResizeListener()):(this.unbindOutsideClickListener(),this.unbindResizeListener()))}},mounted:function(){this.bindMatchMediaListener()},beforeUnmount:function(){this.unbindOutsideClickListener(),this.unbindResizeListener(),this.unbindMatchMediaListener(),this.scrollHandler&&=(this.scrollHandler.destroy(),null),this.container&&this.autoZIndex&&P.clear(this.container),this.target=null,this.container=null},methods:{getItemProp:function(e,t){return e?E(e[t]):void 0},getItemLabel:function(e){return this.getItemProp(e,`label`)},isItemDisabled:function(e){return this.getItemProp(e,`disabled`)},isItemVisible:function(e){return this.getItemProp(e,`visible`)!==!1},isItemGroup:function(e){return C(this.getItemProp(e,`items`))},isItemSeparator:function(e){return this.getItemProp(e,`separator`)},getProccessedItemLabel:function(e){return e?this.getItemLabel(e.item):void 0},isProccessedItemGroup:function(e){return e&&C(e.items)},toggle:function(e){this.visible?this.hide(e,!0):this.show(e)},show:function(e,t){this.popup&&(this.$emit(`before-show`),this.visible=!0,this.target=this.target||e.currentTarget,this.relatedTarget=e.relatedTarget||null),t&&x(this.menubar)},hide:function(e,t){this.popup&&(this.$emit(`before-hide`),this.visible=!1),this.activeItemPath=[],this.focusedItemInfo={index:-1,level:0,parentKey:``},t&&x(this.relatedTarget||this.target||this.menubar),this.dirty=!1},onFocus:function(e){this.focused=!0,this.popup||(this.focusedItemInfo=this.focusedItemInfo.index===-1?{index:this.findFirstFocusedItemIndex(),level:0,parentKey:``}:this.focusedItemInfo),this.$emit(`focus`,e)},onBlur:function(e){this.focused=!1,this.focusedItemInfo={index:-1,level:0,parentKey:``},this.searchValue=``,this.dirty=!1,this.$emit(`blur`,e)},onKeyDown:function(e){if(this.disabled){e.preventDefault();return}var t=e.metaKey||e.ctrlKey;switch(e.code){case`ArrowDown`:this.onArrowDownKey(e);break;case`ArrowUp`:this.onArrowUpKey(e);break;case`ArrowLeft`:this.onArrowLeftKey(e);break;case`ArrowRight`:this.onArrowRightKey(e);break;case`Home`:this.onHomeKey(e);break;case`End`:this.onEndKey(e);break;case`Space`:this.onSpaceKey(e);break;case`Enter`:case`NumpadEnter`:this.onEnterKey(e);break;case`Escape`:this.onEscapeKey(e);break;case`Tab`:this.onTabKey(e);break;case`PageDown`:case`PageUp`:case`Backspace`:case`ShiftLeft`:case`ShiftRight`:break;default:!t&&A(e.key)&&this.searchItems(e,e.key)}},onItemChange:function(e,t){var n=e.processedItem,r=e.isFocus;if(!N(n)){var i=n.index,a=n.key,o=n.level,s=n.parentKey,c=n.items,l=C(c),u=this.activeItemPath.filter(function(e){return e.parentKey!==s&&e.parentKey!==a});l&&(u.push(n),this.submenuVisible=!0),this.focusedItemInfo={index:i,level:o,parentKey:s},l&&(this.dirty=!0),r&&x(this.menubar),!(t===`hover`&&this.queryMatches)&&(this.activeItemPath=u)}},onOverlayClick:function(e){z.emit(`overlay-click`,{originalEvent:e,target:this.target})},onItemClick:function(e){var t=e.originalEvent,n=e.processedItem,r=this.isProccessedItemGroup(n),i=N(n.parent);if(this.isSelected(n)){var a=n.index,o=n.key,s=n.level,c=n.parentKey;this.activeItemPath=this.activeItemPath.filter(function(e){return o!==e.key&&o.startsWith(e.key)}),this.focusedItemInfo={index:a,level:s,parentKey:c},this.dirty=!i,x(this.menubar)}else if(r)this.onItemChange(e);else{var l=i?n:this.activeItemPath.find(function(e){return e.parentKey===``});this.hide(t),this.changeFocusedItemIndex(t,l?l.index:-1),x(this.menubar)}},onItemMouseEnter:function(e){this.dirty&&this.onItemChange(e,`hover`)},onItemMouseMove:function(e){this.focused&&this.changeFocusedItemIndex(e,e.processedItem.index)},onArrowDownKey:function(e){var t=this.focusedItemInfo.index===-1?this.findFirstFocusedItemIndex():this.findNextItemIndex(this.focusedItemInfo.index);this.changeFocusedItemIndex(e,t),e.preventDefault()},onArrowUpKey:function(e){if(e.altKey){if(this.focusedItemInfo.index!==-1){var t=this.visibleItems[this.focusedItemInfo.index];!this.isProccessedItemGroup(t)&&this.onItemChange({originalEvent:e,processedItem:t})}this.popup&&this.hide(e,!0),e.preventDefault()}else{var n=this.focusedItemInfo.index===-1?this.findLastFocusedItemIndex():this.findPrevItemIndex(this.focusedItemInfo.index);this.changeFocusedItemIndex(e,n),e.preventDefault()}},onArrowLeftKey:function(e){var t=this,n=this.visibleItems[this.focusedItemInfo.index],r=this.activeItemPath.find(function(e){return e.key===n.parentKey});N(n.parent)||(this.focusedItemInfo={index:-1,parentKey:r?r.parentKey:``},this.searchValue=``,this.onArrowDownKey(e)),this.activeItemPath=this.activeItemPath.filter(function(e){return e.parentKey!==t.focusedItemInfo.parentKey}),e.preventDefault()},onArrowRightKey:function(e){var t=this.visibleItems[this.focusedItemInfo.index];this.isProccessedItemGroup(t)&&(this.onItemChange({originalEvent:e,processedItem:t}),this.focusedItemInfo={index:-1,parentKey:t.key},this.searchValue=``,this.onArrowDownKey(e)),e.preventDefault()},onHomeKey:function(e){this.changeFocusedItemIndex(e,this.findFirstItemIndex()),e.preventDefault()},onEndKey:function(e){this.changeFocusedItemIndex(e,this.findLastItemIndex()),e.preventDefault()},onEnterKey:function(e){if(this.focusedItemInfo.index!==-1){var t=O(this.menubar,`li[id="${`${this.focusedItemId}`}"]`),n=t&&O(t,`[data-pc-section="itemlink"]`);if(n?n.click():t&&t.click(),!this.popup){var r=this.visibleItems[this.focusedItemInfo.index];!this.isProccessedItemGroup(r)&&(this.focusedItemInfo.index=this.findFirstFocusedItemIndex())}}e.preventDefault()},onSpaceKey:function(e){this.onEnterKey(e)},onEscapeKey:function(e){if(this.popup||this.focusedItemInfo.level!==0){var t=this.focusedItemInfo;this.hide(e,!1),this.focusedItemInfo={index:Number(t.parentKey.split(`_`)[0]),level:0,parentKey:``},this.popup&&x(this.target)}e.preventDefault()},onTabKey:function(e){if(this.focusedItemInfo.index!==-1){var t=this.visibleItems[this.focusedItemInfo.index];!this.isProccessedItemGroup(t)&&this.onItemChange({originalEvent:e,processedItem:t})}this.hide()},onEnter:function(e){this.autoZIndex&&P.set(`menu`,e,this.baseZIndex+this.$primevue.config.zIndex.menu),S(e,{position:`absolute`,top:`0`}),this.alignOverlay(),x(this.menubar),this.scrollInView()},onAfterEnter:function(){this.bindOutsideClickListener(),this.bindScrollListener(),this.bindResizeListener(),this.$emit(`show`)},onLeave:function(){this.unbindOutsideClickListener(),this.unbindScrollListener(),this.unbindResizeListener(),this.$emit(`hide`),this.container=null,this.dirty=!1},onAfterLeave:function(e){this.autoZIndex&&P.clear(e)},alignOverlay:function(){k(this.container,this.target),T(this.target)>T(this.container)&&(this.container.style.minWidth=T(this.target)+`px`)},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(t){var n=e.container&&!e.container.contains(t.target),r=!e.popup||!(e.target&&(e.target===t.target||e.target.contains(t.target)));n&&r&&e.hide()},document.addEventListener(`click`,this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&=(document.removeEventListener(`click`,this.outsideClickListener,!0),null)},bindScrollListener:function(){var e=this;this.scrollHandler||=new R(this.target,function(t){e.hide(t,!0)}),this.scrollHandler.bindScrollListener()},unbindScrollListener:function(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(t){w()||e.hide(t,!0)},window.addEventListener(`resize`,this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&=(window.removeEventListener(`resize`,this.resizeListener),null)},bindMatchMediaListener:function(){var e=this;if(!this.matchMediaListener){var t=matchMedia(`(max-width: ${this.breakpoint})`);this.query=t,this.queryMatches=t.matches,this.matchMediaListener=function(){e.queryMatches=t.matches},this.query.addEventListener(`change`,this.matchMediaListener)}},unbindMatchMediaListener:function(){this.matchMediaListener&&=(this.query.removeEventListener(`change`,this.matchMediaListener),null)},isItemMatched:function(e){return this.isValidItem(e)&&this.getProccessedItemLabel(e)?.toLocaleLowerCase().startsWith(this.searchValue.toLocaleLowerCase())},isValidItem:function(e){return!!e&&!this.isItemDisabled(e.item)&&!this.isItemSeparator(e.item)&&this.isItemVisible(e.item)},isValidSelectedItem:function(e){return this.isValidItem(e)&&this.isSelected(e)},isSelected:function(e){return this.activeItemPath.some(function(t){return t.key===e.key})},findFirstItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(t){return e.isValidItem(t)})},findLastItemIndex:function(){var e=this;return D(this.visibleItems,function(t){return e.isValidItem(t)})},findNextItemIndex:function(e){var t=this,n=e<this.visibleItems.length-1?this.visibleItems.slice(e+1).findIndex(function(e){return t.isValidItem(e)}):-1;return n>-1?n+e+1:e},findPrevItemIndex:function(e){var t=this,n=e>0?D(this.visibleItems.slice(0,e),function(e){return t.isValidItem(e)}):-1;return n>-1?n:e},findSelectedItemIndex:function(){var e=this;return this.visibleItems.findIndex(function(t){return e.isValidSelectedItem(t)})},findFirstFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findFirstItemIndex():e},findLastFocusedItemIndex:function(){var e=this.findSelectedItemIndex();return e<0?this.findLastItemIndex():e},searchItems:function(e,t){var n=this;this.searchValue=(this.searchValue||``)+t;var r=-1,i=!1;return this.focusedItemInfo.index===-1?r=this.visibleItems.findIndex(function(e){return n.isItemMatched(e)}):(r=this.visibleItems.slice(this.focusedItemInfo.index).findIndex(function(e){return n.isItemMatched(e)}),r=r===-1?this.visibleItems.slice(0,this.focusedItemInfo.index).findIndex(function(e){return n.isItemMatched(e)}):r+this.focusedItemInfo.index),r!==-1&&(i=!0),r===-1&&this.focusedItemInfo.index===-1&&(r=this.findFirstFocusedItemIndex()),r!==-1&&this.changeFocusedItemIndex(e,r),this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(function(){n.searchValue=``,n.searchTimeout=null},500),i},changeFocusedItemIndex:function(e,t){this.focusedItemInfo.index!==t&&(this.focusedItemInfo.index=t,this.scrollInView())},scrollInView:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:-1,t=e===-1?this.focusedItemId:`${this.$id}_${e}`,n=O(this.menubar,`li[id="${t}"]`);n&&n.scrollIntoView&&n.scrollIntoView({block:`nearest`,inline:`start`})},createProcessedItems:function(e){var t=this,n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0,r=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:``,a=[];return e&&e.forEach(function(e,o){var s=(i===``?``:i+`_`)+o,c={item:e,index:o,level:n,key:s,parent:r,parentKey:i};c.items=t.createProcessedItems(e.items,n+1,c,s),a.push(c)}),a},containerRef:function(e){this.container=e},menubarRef:function(e){this.menubar=e?e.$el:void 0}},computed:{processedItems:function(){return this.createProcessedItems(this.model||[])},visibleItems:function(){var e=this,t=this.activeItemPath.find(function(t){return t.key===e.focusedItemInfo.parentKey});return t?t.items:this.processedItems},focusedItemId:function(){return this.focusedItemInfo.index===-1?null:`${this.$id}${C(this.focusedItemInfo.parentKey)?`_`+this.focusedItemInfo.parentKey:``}_${this.focusedItemInfo.index}`}},components:{TieredMenuSub:U,Portal:F}},Q=[`id`];function $(e,n,i,o,s,c){var u=_(`TieredMenuSub`),f=_(`Portal`);return r(),t(f,{appendTo:e.appendTo,disabled:!e.popup},{default:v(function(){return[d(h,b({name:`p-anchored-overlay`,onEnter:c.onEnter,onAfterEnter:c.onAfterEnter,onLeave:c.onLeave,onAfterLeave:c.onAfterLeave},e.ptm(`transition`)),{default:v(function(){return[s.visible?(r(),a(`div`,b({key:0,ref:c.containerRef,id:e.$id,class:e.cx(`root`),onClick:n[0]||=function(){return c.onOverlayClick&&c.onOverlayClick.apply(c,arguments)}},e.ptmi(`root`)),[e.$slots.start?(r(),a(`div`,b({key:0,class:e.cx(`start`)},e.ptm(`start`)),[l(e.$slots,`start`)],16)):y(``,!0),d(u,b({ref:c.menubarRef,id:e.$id+`_list`,class:e.cx(`rootList`),tabindex:e.disabled?-1:e.tabindex,role:`menubar`,"aria-label":e.ariaLabel,"aria-labelledby":e.ariaLabelledby,"aria-disabled":e.disabled||void 0,"aria-orientation":`vertical`,"aria-activedescendant":s.focused?c.focusedItemId:void 0,menuId:e.$id,focusedItemId:s.focused?c.focusedItemId:void 0,items:c.processedItems,templates:e.$slots,activeItemPath:s.activeItemPath,level:0,visible:s.submenuVisible,pt:e.pt,unstyled:e.unstyled,onFocus:c.onFocus,onBlur:c.onBlur,onKeydown:c.onKeyDown,onItemClick:c.onItemClick,onItemMouseenter:c.onItemMouseEnter,onItemMousemove:c.onItemMouseMove},e.ptm(`rootList`)),null,16,[`id`,`class`,`tabindex`,`aria-label`,`aria-labelledby`,`aria-disabled`,`aria-activedescendant`,`menuId`,`focusedItemId`,`items`,`templates`,`activeItemPath`,`visible`,`pt`,`unstyled`,`onFocus`,`onBlur`,`onKeydown`,`onItemClick`,`onItemMouseenter`,`onItemMousemove`]),e.$slots.end?(r(),a(`div`,b({key:1,class:e.cx(`end`)},e.ptm(`end`)),[l(e.$slots,`end`)],16)):y(``,!0)],16,Q)):y(``,!0)]}),_:3},16,[`onEnter`,`onAfterEnter`,`onLeave`,`onAfterLeave`])]}),_:3},8,[`appendTo`,`disabled`])}Z.render=$;export{Z as default};