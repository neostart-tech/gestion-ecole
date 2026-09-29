import{$ as e,C as t,E as n,I as r,J as i,O as a,S as o,T as s,Vt as c,a as ee,et as l,g as u,h as te,k as d,on as f,rt as p,t as m,tn as h,tt as g,ut as _,w as v,z as y}from"./B75DpUry.js";import{$ as b,B as x,D as S,Et as C,F as w,P as T,Q as E,et as D,l as ne,m as re,t as ie,xt as ae,y as oe,z as O}from"./DtbrKeYJ.js";import{t as k}from"./cO8iUN-n.js";import{t as A}from"./BI3ReDF8.js";import{t as j}from"./B1ufwUcI.js";import{t as M}from"./CZy7fYBs.js";import{t as N}from"./CyjWb4qr2.js";import{t as P}from"./DIUR7bRq2.js";import{t as F}from"./B-JeTHRs2.js";import{t as I}from"./EyglM-mK2.js";import{n as L}from"./_xSRfgEu2.js";import R from"./DMCAXfwE.js";var z=ie.extend({name:`treeselect`,style:`
    .p-treeselect {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('treeselect.background');
        border: 1px solid dt('treeselect.border.color');
        transition:
            background dt('treeselect.transition.duration'),
            color dt('treeselect.transition.duration'),
            border-color dt('treeselect.transition.duration'),
            outline-color dt('treeselect.transition.duration'),
            box-shadow dt('treeselect.transition.duration');
        border-radius: dt('treeselect.border.radius');
        outline-color: transparent;
        box-shadow: dt('treeselect.shadow');
    }

    .p-treeselect:not(.p-disabled):hover {
        border-color: dt('treeselect.hover.border.color');
    }

    .p-treeselect:not(.p-disabled).p-focus {
        border-color: dt('treeselect.focus.border.color');
        box-shadow: dt('treeselect.focus.ring.shadow');
        outline: dt('treeselect.focus.ring.width') dt('treeselect.focus.ring.style') dt('treeselect.focus.ring.color');
        outline-offset: dt('treeselect.focus.ring.offset');
    }

    .p-treeselect.p-variant-filled {
        background: dt('treeselect.filled.background');
    }

    .p-treeselect.p-variant-filled:not(.p-disabled):hover {
        background: dt('treeselect.filled.hover.background');
    }

    .p-treeselect.p-variant-filled.p-focus {
        background: dt('treeselect.filled.focus.background');
    }

    .p-treeselect.p-invalid {
        border-color: dt('treeselect.invalid.border.color');
    }

    .p-treeselect.p-disabled {
        opacity: 1;
        background: dt('treeselect.disabled.background');
    }

    .p-treeselect-clear-icon {
        align-self: center;
        color: dt('treeselect.clear.icon.color');
        inset-inline-end: dt('treeselect.dropdown.width');
    }

    .p-treeselect-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('treeselect.dropdown.color');
        width: dt('treeselect.dropdown.width');
        border-start-end-radius: dt('border.radius.md');
        border-end-end-radius: dt('border.radius.md');
    }

    .p-treeselect-label-container {
        overflow: hidden;
        flex: 1 1 auto;
        cursor: pointer;
    }

    .p-treeselect-label {
        display: flex;
        align-items: center;
        gap: calc(dt('treeselect.padding.y') / 2);
        white-space: nowrap;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: dt('treeselect.padding.y') dt('treeselect.padding.x');
        color: dt('treeselect.color');
    }

    .p-treeselect-label.p-placeholder {
        color: dt('treeselect.placeholder.color');
    }

    .p-treeselect.p-invalid .p-treeselect-label.p-placeholder {
        color: dt('treeselect.invalid.placeholder.color');
    }

    .p-treeselect:has(.p-select-clear-icon) .p-treeselect-label {
        padding-inline-end: dt('treeselect.padding.x');
    }

    .p-treeselect.p-disabled .p-treeselect-label {
        color: dt('treeselect.disabled.color');
    }

    .p-treeselect-label-empty {
        overflow: hidden;
        visibility: hidden;
    }

    .p-treeselect-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('treeselect.overlay.background');
        color: dt('treeselect.overlay.color');
        border: 1px solid dt('treeselect.overlay.border.color');
        border-radius: dt('treeselect.overlay.border.radius');
        box-shadow: dt('treeselect.overlay.shadow');
        overflow: hidden;
        min-width: 100%;
        will-change: transform;
    }

    .p-treeselect-tree-container {
        overflow: auto;
    }

    .p-treeselect-empty-message {
        padding: dt('treeselect.empty.message.padding');
        background: transparent;
    }

    .p-treeselect-fluid {
        display: flex;
    }

    .p-treeselect-overlay .p-tree {
        padding: dt('treeselect.tree.padding');
    }

    .p-treeselect-overlay .p-tree-loading {
        min-height: 3rem;
    }

    .p-treeselect-label .p-chip {
        padding-block-start: calc(dt('treeselect.padding.y') / 2);
        padding-block-end: calc(dt('treeselect.padding.y') / 2);
        border-radius: dt('treeselect.chip.border.radius');
    }

    .p-treeselect-label:has(.p-chip) {
        padding: calc(dt('treeselect.padding.y') / 2) calc(dt('treeselect.padding.x') / 2);
    }

    .p-treeselect-sm .p-treeselect-label {
        font-size: dt('treeselect.sm.font.size');
        padding-block: dt('treeselect.sm.padding.y');
        padding-inline: dt('treeselect.sm.padding.x');
    }

    .p-treeselect-sm .p-treeselect-dropdown .p-icon {
        font-size: dt('treeselect.sm.font.size');
        width: dt('treeselect.sm.font.size');
        height: dt('treeselect.sm.font.size');
    }

    .p-treeselect-lg .p-treeselect-label {
        font-size: dt('treeselect.lg.font.size');
        padding-block: dt('treeselect.lg.padding.y');
        padding-inline: dt('treeselect.lg.padding.x');
    }

    .p-treeselect-lg .p-treeselect-dropdown .p-icon {
        font-size: dt('treeselect.lg.font.size');
        width: dt('treeselect.lg.font.size');
        height: dt('treeselect.lg.font.size');
    }
`,classes:{root:function(e){var t=e.instance,n=e.props;return[`p-treeselect p-component p-inputwrapper`,{"p-treeselect-display-chip":n.display===`chip`,"p-disabled":n.disabled,"p-invalid":t.$invalid,"p-focus":t.focused,"p-variant-filled":t.$variant===`filled`,"p-inputwrapper-filled":t.$filled,"p-inputwrapper-focus":t.focused||t.overlayVisible,"p-treeselect-open":t.overlayVisible,"p-treeselect-fluid":t.$fluid,"p-treeselect-sm p-inputfield-sm":n.size===`small`,"p-treeselect-lg p-inputfield-lg":n.size===`large`}]},labelContainer:`p-treeselect-label-container`,label:function(e){var t=e.instance,n=e.props;return[`p-treeselect-label`,{"p-placeholder":t.label===n.placeholder,"p-treeselect-label-empty":!n.placeholder&&t.emptyValue}]},clearIcon:`p-treeselect-clear-icon`,chip:`p-treeselect-chip-item`,pcChip:`p-treeselect-chip`,dropdown:`p-treeselect-dropdown`,dropdownIcon:`p-treeselect-dropdown-icon`,panel:`p-treeselect-overlay p-component`,treeContainer:`p-treeselect-tree-container`,emptyMessage:`p-treeselect-empty-message`},inlineStyles:{root:function(e){return{position:e.props.appendTo===`self`?`relative`:void 0}}}});r(),c(),ee();var B={name:`BaseTreeSelect`,extends:F,props:{options:Array,scrollHeight:{type:String,default:`20rem`},placeholder:{type:String,default:null},tabindex:{type:Number,default:null},selectionMode:{type:String,default:`single`},selectedItemsLabel:{type:String,default:null},maxSelectedLabels:{type:Number,default:null},appendTo:{type:[String,Object],default:`body`},emptyMessage:{type:String,default:null},display:{type:String,default:`comma`},metaKeySelection:{type:Boolean,default:!1},loading:{type:Boolean,default:!1},loadingIcon:{type:String,default:void 0},loadingMode:{type:String,default:`mask`},showClear:{type:Boolean,default:!1},clearIcon:{type:String,default:void 0},filter:{type:Boolean,default:!1},filterBy:{type:[String,Function],default:`label`},filterMode:{type:String,default:`lenient`},filterPlaceholder:{type:String,default:null},filterLocale:{type:String,default:void 0},inputId:{type:String,default:null},inputClass:{type:[String,Object],default:null},inputStyle:{type:Object,default:null},inputProps:{type:null,default:null},panelClass:{type:[String,Object],default:null},panelProps:{type:null,default:null},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null},expandedKeys:{type:null,default:null}},style:z,provide:function(){return{$pcTreeSelect:this,$parentInstance:this}}};function V(e){"@babel/helpers - typeof";return V=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},V(e)}function H(e,t){var n=typeof Symbol<`u`&&e[Symbol.iterator]||e[`@@iterator`];if(!n){if(Array.isArray(e)||(n=q(e))||t){n&&(e=n);var r=0,i=function(){};return{s:i,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:i}}throw TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var a,o=!0,s=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return o=e.done,e},e:function(e){s=!0,a=e},f:function(){try{o||n.return==null||n.return()}finally{if(s)throw a}}}}function U(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function W(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?U(Object(n),!0).forEach(function(t){G(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):U(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function G(e,t,n){return(t=se(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function se(e){var t=K(e,`string`);return V(t)==`symbol`?t:t+``}function K(e,t){if(V(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(V(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function ce(e){return de(e)||ue(e)||q(e)||le()}function le(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function q(e,t){if(e){if(typeof e==`string`)return J(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?J(e,t):void 0}}function ue(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function de(e){if(Array.isArray(e))return J(e)}function J(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var Y={name:`TreeSelect`,extends:B,inheritAttrs:!1,emits:[`before-show`,`before-hide`,`change`,`show`,`hide`,`node-select`,`node-unselect`,`node-expand`,`node-collapse`,`focus`,`blur`,`update:expandedKeys`],inject:{$pcFluid:{default:null}},data:function(){return{focused:!1,overlayVisible:!1,d_expandedKeys:this.expandedKeys||{}}},watch:{modelValue:{handler:function(){this.selfChange||this.updateTreeState(),this.selfChange=!1},immediate:!0},options:function(){this.updateTreeState()},expandedKeys:function(e){this.d_expandedKeys=e}},outsideClickListener:null,resizeListener:null,scrollHandler:null,overlay:null,selfChange:!1,selfClick:!1,beforeUnmount:function(){this.unbindOutsideClickListener(),this.unbindResizeListener(),this.scrollHandler&&=(this.scrollHandler.destroy(),null),this.overlay&&=(k.clear(this.overlay),null)},mounted:function(){this.updateTreeState()},methods:{show:function(){this.$emit(`before-show`),this.overlayVisible=!0},hide:function(){this.$emit(`before-hide`),this.overlayVisible=!1,this.$refs.focusInput.focus()},onFocus:function(e){this.focused=!0,this.$emit(`focus`,e)},onBlur:function(e){var t,n;this.focused=!1,this.$emit(`blur`,e),(t=(n=this.formField).onBlur)==null||t.call(n)},onClick:function(e){this.disabled||e.target.tagName===`INPUT`||e.target.getAttribute(`data-pc-section`)===`clearicon`||e.target.closest(`[data-pc-section="clearicon"]`)||(!this.overlay||!this.overlay.contains(e.target))&&(this.overlayVisible?this.hide():this.show(),x(this.$refs.focusInput))},onClearClick:function(){this.onSelectionChange(null)},onSelectionChange:function(e){this.selfChange=!0,this.writeValue(e),this.$emit(`change`,e)},onNodeSelect:function(e){this.$emit(`node-select`,e),this.selectionMode===`single`&&this.hide()},onNodeUnselect:function(e){this.$emit(`node-unselect`,e)},onNodeToggle:function(e){this.d_expandedKeys=e,this.$emit(`update:expandedKeys`,this.d_expandedKeys)},getSelectedItemsLabel:function(){var e=/{(.*?)}/,t=this.selectedItemsLabel||this.$primevue.config.locale.selectionMessage;return e.test(t)?t.replace(t.match(e)[0],Object.keys(this.d_value).length+``):t},onFirstHiddenFocus:function(e){var t=e.relatedTarget===this.$refs.focusInput?b(this.overlay,`:not([data-p-hidden-focusable="true"])`):this.$refs.focusInput;x(t)},onLastHiddenFocus:function(e){var t=e.relatedTarget===this.$refs.focusInput?oe(this.overlay,`:not([data-p-hidden-focusable="true"])`):this.$refs.focusInput;x(t)},onKeyDown:function(e){switch(e.code){case`ArrowDown`:this.onArrowDownKey(e);break;case`Space`:case`Enter`:case`NumpadEnter`:this.onEnterKey(e);break;case`Escape`:this.onEscapeKey(e);break;case`Tab`:this.onTabKey(e)}},onArrowDownKey:function(e){var t=this;this.overlayVisible||(this.show(),this.$nextTick(function(){var e=ce(T(t.$refs.tree.$el,`[data-pc-section="treeitem"]`)).find(function(e){return e.getAttribute(`tabindex`)===`0`});x(e)}),e.preventDefault())},onEnterKey:function(e){this.overlayVisible?this.hide():this.onArrowDownKey(e),e.preventDefault()},onEscapeKey:function(e){this.overlayVisible&&(this.hide(),e.preventDefault())},onTabKey:function(e){arguments.length>1&&arguments[1]!==void 0&&arguments[1]||this.overlayVisible&&this.hasFocusableElements()&&(x(this.$refs.firstHiddenFocusableElementOnOverlay),e.preventDefault())},hasFocusableElements:function(){return O(this.overlay,`:not([data-p-hidden-focusable="true"])`).length>0},onOverlayEnter:function(e){k.set(`overlay`,e,this.$primevue.config.zIndex.overlay),S(e,{position:`absolute`,top:`0`}),this.alignOverlay(),this.focus(),this.$attrSelector&&e.setAttribute(this.$attrSelector,``)},onOverlayAfterEnter:function(){this.bindOutsideClickListener(),this.bindScrollListener(),this.bindResizeListener(),this.scrollValueInView(),this.$emit(`show`)},onOverlayLeave:function(){this.unbindOutsideClickListener(),this.unbindScrollListener(),this.unbindResizeListener(),this.$emit(`hide`),this.overlay=null},onOverlayAfterLeave:function(e){k.clear(e)},focus:function(){var e=O(this.overlay);e&&e.length>0&&e[0].focus()},alignOverlay:function(){this.appendTo===`self`?re(this.overlay,this.$el):(this.overlay.style.minWidth=E(this.$el)+`px`,ne(this.overlay,this.$el))},bindOutsideClickListener:function(){var e=this;this.outsideClickListener||(this.outsideClickListener=function(t){e.overlayVisible&&!e.selfClick&&e.isOutsideClicked(t)&&e.hide(),e.selfClick=!1},document.addEventListener(`click`,this.outsideClickListener,!0))},unbindOutsideClickListener:function(){this.outsideClickListener&&=(document.removeEventListener(`click`,this.outsideClickListener,!0),null)},bindScrollListener:function(){var e=this;this.scrollHandler||=new N(this.$refs.container,function(){e.overlayVisible&&e.hide()}),this.scrollHandler.bindScrollListener()},unbindScrollListener:function(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()},bindResizeListener:function(){var e=this;this.resizeListener||(this.resizeListener=function(){e.overlayVisible&&!w()&&e.hide()},window.addEventListener(`resize`,this.resizeListener))},unbindResizeListener:function(){this.resizeListener&&=(window.removeEventListener(`resize`,this.resizeListener),null)},isOutsideClicked:function(e){return!(this.$el.isSameNode(e.target)||this.$el.contains(e.target)||this.overlay&&this.overlay.contains(e.target))},overlayRef:function(e){this.overlay=e},onOverlayClick:function(e){I.emit(`overlay-click`,{originalEvent:e,target:this.$el}),this.selfClick=!0},onOverlayKeydown:function(e){e.code===`Escape`&&this.hide()},fillNodeMap:function(e,t){var n=this;t[e.key]=e,e.children&&e.children.length>0&&e.children.forEach(function(e){return n.fillNodeMap(e,t)})},isSelected:function(e,t){return this.selectionMode===`checkbox`?t[e?.key]&&t[e?.key].checked:t[e?.key]},updateTreeState:function(){var e=W({},this.d_value);e&&this.options&&this.options.length>0&&this.updateTreeBranchState(null,null,e)},updateTreeBranchState:function(e,t,n){if(e){if(this.isSelected(e,n)&&(this.expandPath(t),delete n[e.key]),Object.keys(n).length&&e.children){var r=H(e.children),i;try{for(r.s();!(i=r.n()).done;){var a=i.value;t.push(e.key),this.updateTreeBranchState(a,t,n)}}catch(e){r.e(e)}finally{r.f()}}}else{var o=H(this.options),s;try{for(o.s();!(s=o.n()).done;){var c=s.value;this.updateTreeBranchState(c,[],n)}}catch(e){o.e(e)}finally{o.f()}}},expandPath:function(e){if(e.length>0){var t=H(e),n;try{for(t.s();!(n=t.n()).done;){var r=n.value;this.d_expandedKeys[r]=!0}}catch(e){t.e(e)}finally{t.f()}this.d_expandedKeys=W({},this.d_expandedKeys),this.$emit(`update:expandedKeys`,this.d_expandedKeys)}},scrollValueInView:function(){if(this.overlay){var e=D(this.overlay,`[data-p-selected="true"]`);e&&e.scrollIntoView({block:`nearest`,inline:`start`})}}},computed:{nodeMap:function(){var e,t=this,n={};return(e=this.options)==null||e.forEach(function(e){return t.fillNodeMap(e,n)}),n},selectedNodes:function(){var e=this,t=[];return this.d_value&&this.options&&this.options.length>0&&Object.keys(this.d_value).forEach(function(n){var r=e.nodeMap[n];e.isSelected(r,e.d_value)&&t.push(r)}),t},label:function(){var e=this.selectedNodes;return e.length?C(this.maxSelectedLabels)&&e.length>this.maxSelectedLabels?this.getSelectedItemsLabel():e.map(function(e){return e.label}).join(`, `):this.placeholder},chipSelectedItems:function(){return C(this.maxSelectedLabels)&&this.d_value&&Object.keys(this.d_value).length>this.maxSelectedLabels},emptyMessageText:function(){return this.emptyMessage||this.$primevue.config.locale.emptyMessage},emptyValue:function(){return!this.$filled},emptyOptions:function(){return!this.options||this.options.length===0},listId:function(){return this.$id+`_list`},hasFluid:function(){return ae(this.fluid)?!!this.$pcFluid:this.fluid},isClearIconVisible:function(){return this.showClear&&this.d_value!=null&&C(this.options)&&!this.disabled&&!this.loading}},components:{TSTree:R,Chip:L,Portal:A,ChevronDownIcon:P,TimesIcon:j},directives:{ripple:M}};function X(e){"@babel/helpers - typeof";return X=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},X(e)}function Z(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function Q(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Z(Object(n),!0).forEach(function(t){fe(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Z(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function fe(e,t,n){return(t=pe(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function pe(e){var t=me(e,`string`);return X(t)==`symbol`?t:t+``}function me(e,t){if(X(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(X(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var he=[`id`,`disabled`,`tabindex`,`aria-labelledby`,`aria-label`,`aria-expanded`,`aria-controls`],ge={key:0},$=[`aria-expanded`];function _e(r,c,ee,b,x,S){var C=g(`Chip`),w=g(`TSTree`),T=g(`Portal`);return i(),s(`div`,y({ref:`container`,class:r.cx(`root`),style:r.sx(`root`),onClick:c[10]||=function(){return S.onClick&&S.onClick.apply(S,arguments)}},r.ptmi(`root`)),[o(`div`,y({class:`p-hidden-accessible`},r.ptm(`hiddenInputContainer`),{"data-p-hidden-accessible":!0}),[o(`input`,y({ref:`focusInput`,id:r.inputId,type:`text`,role:`combobox`,class:r.inputClass,style:r.inputStyle,readonly:``,disabled:r.disabled,tabindex:r.disabled?-1:r.tabindex,"aria-labelledby":r.ariaLabelledby,"aria-label":r.ariaLabel,"aria-haspopup":`tree`,"aria-expanded":x.overlayVisible,"aria-controls":x.overlayVisible?S.listId:void 0,onFocus:c[0]||=function(e){return S.onFocus(e)},onBlur:c[1]||=function(e){return S.onBlur(e)},onKeydown:c[2]||=function(e){return S.onKeyDown(e)}},Q(Q({},r.inputProps),r.ptm(`hiddenInput`))),null,16,he)],16),o(`div`,y({class:r.cx(`labelContainer`)},r.ptm(`labelContainer`)),[o(`div`,y({class:r.cx(`label`)},r.ptm(`label`)),[l(r.$slots,`value`,{value:S.selectedNodes,placeholder:r.placeholder},function(){return[r.display===`comma`?(i(),s(u,{key:0},[a(f(S.label||`empty`),1)],64)):r.display===`chip`?(i(),s(u,{key:1},[S.chipSelectedItems?(i(),s(`span`,ge,f(S.label),1)):(i(),s(u,{key:1},[(i(!0),s(u,null,e(S.selectedNodes,function(e){return i(),s(`div`,y({key:e.key,class:r.cx(`chipItem`)},{ref_for:!0},r.ptm(`chipItem`)),[d(C,{class:h(r.cx(`pcChip`)),label:e.label,unstyled:r.unstyled,pt:r.ptm(`pcChip`)},null,8,[`class`,`label`,`unstyled`,`pt`])],16)}),128)),S.emptyValue?(i(),s(u,{key:0},[a(f(r.placeholder||`empty`),1)],64)):v(``,!0)],64))],64)):v(``,!0)]})],16)],16),S.isClearIconVisible?l(r.$slots,`clearicon`,{key:0,class:h(r.cx(`clearIcon`)),clearCallback:S.onClearClick},function(){return[(i(),t(p(r.clearIcon?`i`:`TimesIcon`),y({ref:`clearIcon`,class:[r.cx(`clearIcon`),r.clearIcon],onClick:S.onClearClick},r.ptm(`clearIcon`),{"data-pc-section":`clearicon`}),null,16,[`class`,`onClick`]))]}):v(``,!0),o(`div`,y({class:r.cx(`dropdown`),role:`button`,"aria-haspopup":`tree`,"aria-expanded":x.overlayVisible},r.ptm(`dropdown`)),[l(r.$slots,r.$slots.dropdownicon?`dropdownicon`:`triggericon`,{class:h(r.cx(`dropdownIcon`))},function(){return[(i(),t(p(`ChevronDownIcon`),y({class:r.cx(`dropdownIcon`)},r.ptm(`dropdownIcon`)),null,16,[`class`]))]})],16,$),d(T,{appendTo:r.appendTo},{default:_(function(){return[d(m,y({name:`p-anchored-overlay`,onEnter:S.onOverlayEnter,onAfterEnter:S.onOverlayAfterEnter,onLeave:S.onOverlayLeave,onAfterLeave:S.onOverlayAfterLeave},r.ptm(`transition`)),{default:_(function(){return[x.overlayVisible?(i(),s(`div`,y({key:0,ref:S.overlayRef,onClick:c[8]||=function(){return S.onOverlayClick&&S.onOverlayClick.apply(S,arguments)},class:[r.cx(`panel`),r.panelClass],onKeydown:c[9]||=function(){return S.onOverlayKeydown&&S.onOverlayKeydown.apply(S,arguments)}},Q(Q({},r.panelProps),r.ptm(`panel`))),[o(`span`,y({ref:`firstHiddenFocusableElementOnOverlay`,role:`presentation`,class:`p-hidden-accessible p-hidden-focusable`,tabindex:0,onFocus:c[3]||=function(){return S.onFirstHiddenFocus&&S.onFirstHiddenFocus.apply(S,arguments)}},r.ptm(`hiddenFirstFocusableEl`),{"data-p-hidden-accessible":!0,"data-p-hidden-focusable":!0}),null,16),l(r.$slots,`header`,{value:r.d_value,options:r.options}),o(`div`,y({class:r.cx(`treeContainer`),style:{"max-height":r.scrollHeight}},r.ptm(`treeContainer`)),[r.options&&r.options.length>0?(i(),t(w,{key:0,ref:`tree`,id:S.listId,value:r.options,selectionMode:r.selectionMode,loading:r.loading,loadingIcon:r.loadingIcon,loadingMode:r.loadingMode,filter:r.filter,filterBy:r.filterBy,filterMode:r.filterMode,filterPlaceholder:r.filterPlaceholder,filterLocale:r.filterLocale,"onUpdate:selectionKeys":S.onSelectionChange,selectionKeys:r.d_value,expandedKeys:x.d_expandedKeys,"onUpdate:expandedKeys":S.onNodeToggle,metaKeySelection:r.metaKeySelection,onNodeExpand:c[4]||=function(e){return r.$emit(`node-expand`,e)},onNodeCollapse:c[5]||=function(e){return r.$emit(`node-collapse`,e)},onNodeSelect:S.onNodeSelect,onNodeUnselect:S.onNodeUnselect,onClick:c[6]||=te(function(){},[`stop`]),level:0,unstyled:r.unstyled,pt:r.ptm(`pcTree`)},n({_:2},[r.$slots.option?{name:`default`,fn:_(function(e){return[l(r.$slots,`option`,{node:e.node,expanded:e.expanded,selected:e.selected})]}),key:`0`}:void 0,r.$slots.itemtoggleicon?{name:`toggleicon`,fn:_(function(e){return[l(r.$slots,`itemtoggleicon`,{node:e.node,expanded:e.expanded,class:h(e.class)})]}),key:`1`}:r.$slots.itemtogglericon?{name:`togglericon`,fn:_(function(e){return[l(r.$slots,`itemtogglericon`,{node:e.node,expanded:e.expanded,class:h(e.class)})]}),key:`2`}:void 0,r.$slots.itemcheckboxicon?{name:`checkboxicon`,fn:_(function(e){return[l(r.$slots,`itemcheckboxicon`,{checked:e.checked,partialChecked:e.partialChecked,class:h(e.class)})]}),key:`3`}:void 0]),1032,[`id`,`value`,`selectionMode`,`loading`,`loadingIcon`,`loadingMode`,`filter`,`filterBy`,`filterMode`,`filterPlaceholder`,`filterLocale`,`onUpdate:selectionKeys`,`selectionKeys`,`expandedKeys`,`onUpdate:expandedKeys`,`metaKeySelection`,`onNodeSelect`,`onNodeUnselect`,`unstyled`,`pt`])):v(``,!0),S.emptyOptions&&!r.loading?(i(),s(`div`,y({key:1,class:r.cx(`emptyMessage`)},r.ptm(`emptyMessage`)),[l(r.$slots,`empty`,{},function(){return[a(f(S.emptyMessageText),1)]})],16)):v(``,!0)],16),l(r.$slots,`footer`,{value:r.d_value,options:r.options}),o(`span`,y({ref:`lastHiddenFocusableElementOnOverlay`,role:`presentation`,class:`p-hidden-accessible p-hidden-focusable`,tabindex:0,onFocus:c[7]||=function(){return S.onLastHiddenFocus&&S.onLastHiddenFocus.apply(S,arguments)}},r.ptm(`hiddenLastFocusableEl`),{"data-p-hidden-accessible":!0,"data-p-hidden-focusable":!0}),null,16)],16)):v(``,!0)]}),_:3},16,[`onEnter`,`onAfterEnter`,`onLeave`,`onAfterLeave`])]}),_:3},8,[`appendTo`])],16)}Y.render=_e;export{Y as default};