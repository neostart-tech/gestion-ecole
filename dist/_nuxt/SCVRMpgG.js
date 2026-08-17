import{$ as e,I as t,J as n,S as r,T as i,Vt as a,et as o,g as s,k as c,tn as l,tt as u,ut as d,z as f}from"./B75DpUry.js";import{t as p}from"./DtbrKeYJ.js";import{t as m}from"./GEDtbPuf.js";import{n as h}from"./_xSRfgEu2.js";var g=p.extend({name:`inputchips`,style:`
    .p-inputchips {
        display: inline-flex;
    }

    .p-inputchips-input {
        margin: 0;
        list-style-type: none;
        cursor: text;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        padding: calc(dt('inputchips.padding.y') / 2) dt('inputchips.padding.x');
        gap: calc(dt('inputchips.padding.y') / 2);
        color: dt('inputchips.color');
        background: dt('inputchips.background');
        border: 1px solid dt('inputchips.border.color');
        border-radius: dt('inputchips.border.radius');
        width: 100%;
        transition:
            background dt('inputchips.transition.duration'),
            color dt('inputchips.transition.duration'),
            border-color dt('inputchips.transition.duration'),
            outline-color dt('inputchips.transition.duration'),
            box-shadow dt('inputchips.transition.duration');
        outline-color: transparent;
        box-shadow: dt('inputchips.shadow');
    }

    .p-inputchips:not(.p-disabled):hover .p-inputchips-input {
        border-color: dt('inputchips.hover.border.color');
    }

    .p-inputchips:not(.p-disabled).p-focus .p-inputchips-input {
        border-color: dt('inputchips.focus.border.color');
        box-shadow: dt('inputchips.focus.ring.shadow');
        outline: dt('inputchips.focus.ring.width') dt('inputchips.focus.ring.style') dt('inputchips.focus.ring.color');
        outline-offset: dt('inputchips.focus.ring.offset');
    }

    .p-inputchips.p-invalid .p-inputchips-input {
        border-color: dt('inputchips.invalid.border.color');
    }

    .p-variant-filled.p-inputchips-input {
        background: dt('inputchips.filled.background');
    }

    .p-inputchips:not(.p-disabled).p-focus .p-variant-filled.p-inputchips-input {
        background: dt('inputchips.filled.focus.background');
    }

    .p-inputchips.p-disabled .p-inputchips-input {
        opacity: 1;
        background: dt('inputchips.disabled.background');
        color: dt('inputchips.disabled.color');
    }

    .p-inputchips-chip.p-chip {
        padding-top: calc(dt('inputchips.padding.y') / 2);
        padding-bottom: calc(dt('inputchips.padding.y') / 2);
        border-radius: dt('inputchips.chip.border.radius');
        transition:
            background dt('inputchips.transition.duration'),
            color dt('inputchips.transition.duration');
    }

    .p-inputchips-chip-item.p-focus .p-inputchips-chip {
        background: dt('inputchips.chip.focus.background');
        color: dt('inputchips.chip.focus.color');
    }

    .p-inputchips-input:has(.p-inputchips-chip) {
        padding-left: calc(dt('inputchips.padding.y') / 2);
        padding-right: calc(dt('inputchips.padding.y') / 2);
    }

    .p-inputchips-input-item {
        flex: 1 1 auto;
        display: inline-flex;
        padding-top: calc(dt('inputchips.padding.y') / 2);
        padding-bottom: calc(dt('inputchips.padding.y') / 2);
    }

    .p-inputchips-input-item input {
        border: 0 none;
        outline: 0 none;
        background: transparent;
        margin: 0;
        padding: 0;
        box-shadow: none;
        border-radius: 0;
        width: 100%;
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: inherit;
    }

    .p-inputchips-input-item input::placeholder {
        color: dt('inputchips.placeholder.color');
    }
`,classes:{root:function(e){var t=e.instance,n=e.props;return[`p-inputchips p-component p-inputwrapper`,{"p-disabled":n.disabled,"p-invalid":n.invalid,"p-focus":t.focused,"p-inputwrapper-filled":n.modelValue&&n.modelValue.length||t.inputValue&&t.inputValue.length,"p-inputwrapper-focus":t.focused}]},input:function(e){var t=e.props,n=e.instance;return[`p-inputchips-input`,{"p-variant-filled":t.variant?t.variant===`filled`:n.$primevue.config.inputStyle===`filled`||n.$primevue.config.inputVariant===`filled`}]},chipItem:function(e){var t=e.state,n=e.index;return[`p-inputchips-chip-item`,{"p-focus":t.focusedIndex===n}]},pcChip:`p-inputchips-chip`,chipIcon:`p-inputchips-chip-icon`,inputItem:`p-inputchips-input-item`}});t(),a();var _={name:`BaseInputChips`,extends:m,props:{modelValue:{type:Array,default:null},max:{type:Number,default:null},separator:{type:[String,Object],default:null},addOnBlur:{type:Boolean,default:null},allowDuplicate:{type:Boolean,default:!0},placeholder:{type:String,default:null},variant:{type:String,default:null},invalid:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},inputId:{type:String,default:null},inputClass:{type:[String,Object],default:null},inputStyle:{type:Object,default:null},inputProps:{type:null,default:null},removeTokenIcon:{type:String,default:void 0},chipIcon:{type:String,default:void 0},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:g,provide:function(){return{$pcInputChips:this,$parentInstance:this}}};function v(e){return S(e)||x(e)||b(e)||y()}function y(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function b(e,t){if(e){if(typeof e==`string`)return C(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?C(e,t):void 0}}function x(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function S(e){if(Array.isArray(e))return C(e)}function C(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var w={name:`InputChips`,extends:_,inheritAttrs:!1,emits:[`update:modelValue`,`add`,`remove`,`focus`,`blur`],data:function(){return{inputValue:null,focused:!1,focusedIndex:null}},mounted:function(){console.warn(`Deprecated since v4. Use AutoComplete component instead with its typeahead property.`)},methods:{onWrapperClick:function(){this.$refs.input.focus()},onInput:function(e){this.inputValue=e.target.value,this.focusedIndex=null},onFocus:function(e){this.focused=!0,this.focusedIndex=null,this.$emit(`focus`,e)},onBlur:function(e){this.focused=!1,this.focusedIndex=null,this.addOnBlur&&this.addItem(e,e.target.value,!1),this.$emit(`blur`,e)},onKeyDown:function(e){var t=e.target.value;switch(e.code){case`Backspace`:t.length===0&&this.modelValue&&this.modelValue.length>0&&(this.focusedIndex===null?this.removeItem(e,this.modelValue.length-1):this.removeItem(e,this.focusedIndex));break;case`Enter`:case`NumpadEnter`:t&&t.trim().length&&!this.maxedOut&&this.addItem(e,t,!0);break;case`ArrowLeft`:t.length===0&&this.modelValue&&this.modelValue.length>0&&this.$refs.container.focus();break;case`ArrowRight`:e.stopPropagation();break;default:this.separator&&(this.separator===e.key||e.key.match(this.separator))&&this.addItem(e,t,!0)}},onPaste:function(e){var t=this;if(this.separator){var n=this.separator.replace(`\\n`,`
`).replace(`\\r`,`\r`).replace(`\\t`,`	`),r=(e.clipboardData||window.clipboardData).getData(`Text`);if(r){var i=this.modelValue||[],a=r.split(n);a=a.filter(function(e){return t.allowDuplicate||i.indexOf(e)===-1}),i=[].concat(v(i),v(a)),this.updateModel(e,i,!0)}}},onContainerFocus:function(){this.focused=!0},onContainerBlur:function(){this.focusedIndex=-1,this.focused=!1},onContainerKeyDown:function(e){switch(e.code){case`ArrowLeft`:this.onArrowLeftKeyOn(e);break;case`ArrowRight`:this.onArrowRightKeyOn(e);break;case`Backspace`:this.onBackspaceKeyOn(e)}},onArrowLeftKeyOn:function(){this.inputValue.length===0&&this.modelValue&&this.modelValue.length>0&&(this.focusedIndex=this.focusedIndex===null?this.modelValue.length-1:this.focusedIndex-1,this.focusedIndex<0&&(this.focusedIndex=0))},onArrowRightKeyOn:function(){this.inputValue.length===0&&this.modelValue&&this.modelValue.length>0&&(this.focusedIndex===this.modelValue.length-1?(this.focusedIndex=null,this.$refs.input.focus()):this.focusedIndex++)},onBackspaceKeyOn:function(e){this.focusedIndex!==null&&this.removeItem(e,this.focusedIndex)},updateModel:function(e,t,n){var r=this;this.$emit(`update:modelValue`,t),this.$emit(`add`,{originalEvent:e,value:t}),this.$refs.input.value=``,this.inputValue=``,setTimeout(function(){r.maxedOut&&(r.focused=!1)},0),n&&e.preventDefault()},addItem:function(e,t,n){if(t&&t.trim().length){var r=this.modelValue?v(this.modelValue):[];(this.allowDuplicate||r.indexOf(t)===-1)&&(r.push(t),this.updateModel(e,r,n))}},removeItem:function(e,t){if(!this.disabled){var n=v(this.modelValue),r=n.splice(t,1);this.focusedIndex=null,this.$refs.input.focus(),this.$emit(`update:modelValue`,n),this.$emit(`remove`,{originalEvent:e,value:r})}}},computed:{maxedOut:function(){return this.max&&this.modelValue&&this.max===this.modelValue.length},focusedOptionId:function(){return this.focusedIndex===null?null:`${this.$id}_inputchips_item_${this.focusedIndex}`}},components:{Chip:h}};function T(e){"@babel/helpers - typeof";return T=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},T(e)}function E(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function D(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?E(Object(n),!0).forEach(function(t){O(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):E(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function O(e,t,n){return(t=k(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function k(e){var t=A(e,`string`);return T(t)==`symbol`?t:t+``}function A(e,t){if(T(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(T(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var j=[`aria-labelledby`,`aria-label`,`aria-activedescendant`],M=[`id`,`aria-label`,`aria-setsize`,`aria-posinset`,`data-p-focused`],N=[`id`,`disabled`,`placeholder`,`aria-invalid`];function P(t,a,p,m,h,g){var _=u(`Chip`);return n(),i(`div`,f({class:t.cx(`root`)},t.ptmi(`root`)),[r(`ul`,f({ref:`container`,class:t.cx(`input`),tabindex:`-1`,role:`listbox`,"aria-orientation":`horizontal`,"aria-labelledby":t.ariaLabelledby,"aria-label":t.ariaLabel,"aria-activedescendant":h.focused?g.focusedOptionId:void 0,onClick:a[5]||=function(e){return g.onWrapperClick()},onFocus:a[6]||=function(){return g.onContainerFocus&&g.onContainerFocus.apply(g,arguments)},onBlur:a[7]||=function(){return g.onContainerBlur&&g.onContainerBlur.apply(g,arguments)},onKeydown:a[8]||=function(){return g.onContainerKeyDown&&g.onContainerKeyDown.apply(g,arguments)}},t.ptm(`input`)),[(n(!0),i(s,null,e(t.modelValue,function(e,r){return n(),i(`li`,f({key:`${r}_${e}`,id:t.$id+`_inputchips_item_`+r,role:`option`,class:t.cx(`chipItem`,{index:r}),"aria-label":e,"aria-selected":!0,"aria-setsize":t.modelValue.length,"aria-posinset":r+1},{ref_for:!0},t.ptm(`chipItem`),{"data-p-focused":h.focusedIndex===r}),[o(t.$slots,`chip`,{class:l(t.cx(`pcChip`)),index:r,value:e,removeCallback:function(e){return t.removeOption(e,r)}},function(){return[c(_,{class:l(t.cx(`pcChip`)),label:e,removeIcon:t.chipIcon||t.removeTokenIcon,removable:``,unstyled:t.unstyled,onRemove:function(e){return g.removeItem(e,r)},pt:t.ptm(`pcChip`)},{removeicon:d(function(){return[o(t.$slots,t.$slots.chipicon?`chipicon`:`removetokenicon`,{class:l(t.cx(`chipIcon`)),index:r,removeCallback:function(e){return g.removeItem(e,r)}})]}),_:2},1032,[`class`,`label`,`removeIcon`,`unstyled`,`onRemove`,`pt`])]})],16,M)}),128)),r(`li`,f({class:t.cx(`inputItem`),role:`option`},t.ptm(`inputItem`)),[r(`input`,f({ref:`input`,id:t.inputId,type:`text`,class:t.inputClass,style:t.inputStyle,disabled:t.disabled||g.maxedOut,placeholder:t.placeholder,"aria-invalid":t.invalid||void 0,onFocus:a[0]||=function(e){return g.onFocus(e)},onBlur:a[1]||=function(e){return g.onBlur(e)},onInput:a[2]||=function(){return g.onInput&&g.onInput.apply(g,arguments)},onKeydown:a[3]||=function(e){return g.onKeyDown(e)},onPaste:a[4]||=function(e){return g.onPaste(e)}},D(D({},t.inputProps),t.ptm(`inputItemField`))),null,16,N)],16)],16,j)],16)}w.render=P;export{w as default};