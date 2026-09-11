import{C as e,I as t,J as n,T as r,Vt as i,et as a,on as o,rt as s,tn as c,w as l,z as u}from"./B75DpUry.js";import{t as d}from"./DtbrKeYJ.js";import{t as f}from"./CRHlWn3X.js";import{t as p}from"./GEDtbPuf.js";var m=d.extend({name:`avatar`,style:`
    .p-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: dt('avatar.width');
        height: dt('avatar.height');
        font-size: dt('avatar.font.size');
        background: dt('avatar.background');
        color: dt('avatar.color');
        border-radius: dt('avatar.border.radius');
    }

    .p-avatar-image {
        background: transparent;
    }

    .p-avatar-circle {
        border-radius: 50%;
    }

    .p-avatar-circle img {
        border-radius: 50%;
    }

    .p-avatar-icon {
        font-size: dt('avatar.icon.size');
        width: dt('avatar.icon.size');
        height: dt('avatar.icon.size');
    }

    .p-avatar img {
        width: 100%;
        height: 100%;
    }

    .p-avatar-lg {
        width: dt('avatar.lg.width');
        height: dt('avatar.lg.width');
        font-size: dt('avatar.lg.font.size');
    }

    .p-avatar-lg .p-avatar-icon {
        font-size: dt('avatar.lg.icon.size');
        width: dt('avatar.lg.icon.size');
        height: dt('avatar.lg.icon.size');
    }

    .p-avatar-xl {
        width: dt('avatar.xl.width');
        height: dt('avatar.xl.width');
        font-size: dt('avatar.xl.font.size');
    }

    .p-avatar-xl .p-avatar-icon {
        font-size: dt('avatar.xl.icon.size');
        width: dt('avatar.xl.icon.size');
        height: dt('avatar.xl.icon.size');
    }

    .p-avatar-group {
        display: flex;
        align-items: center;
    }

    .p-avatar-group .p-avatar + .p-avatar {
        margin-inline-start: dt('avatar.group.offset');
    }

    .p-avatar-group .p-avatar {
        border: 2px solid dt('avatar.group.border.color');
    }

    .p-avatar-group .p-avatar-lg + .p-avatar-lg {
        margin-inline-start: dt('avatar.lg.group.offset');
    }

    .p-avatar-group .p-avatar-xl + .p-avatar-xl {
        margin-inline-start: dt('avatar.xl.group.offset');
    }
`,classes:{root:function(e){var t=e.props;return[`p-avatar p-component`,{"p-avatar-image":t.image!=null,"p-avatar-circle":t.shape===`circle`,"p-avatar-lg":t.size===`large`,"p-avatar-xl":t.size===`xlarge`}]},label:`p-avatar-label`,icon:`p-avatar-icon`}});t(),i();var h={name:`BaseAvatar`,extends:p,props:{label:{type:String,default:null},icon:{type:String,default:null},image:{type:String,default:null},size:{type:String,default:`normal`},shape:{type:String,default:`square`},ariaLabelledby:{type:String,default:null},ariaLabel:{type:String,default:null}},style:m,provide:function(){return{$pcAvatar:this,$parentInstance:this}}};function g(e){"@babel/helpers - typeof";return g=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},g(e)}function _(e,t,n){return(t=v(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function v(e){var t=y(e,`string`);return g(t)==`symbol`?t:t+``}function y(e,t){if(g(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(g(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var b={name:`Avatar`,extends:h,inheritAttrs:!1,emits:[`error`],methods:{onError:function(e){this.$emit(`error`,e)}},computed:{dataP:function(){return f(_(_({},this.shape,this.shape),this.size,this.size))}}},x=[`aria-labelledby`,`aria-label`,`data-p`],S=[`data-p`],C=[`data-p`],w=[`src`,`alt`,`data-p`];function T(t,i,d,f,p,m){return n(),r(`div`,u({class:t.cx(`root`),"aria-labelledby":t.ariaLabelledby,"aria-label":t.ariaLabel},t.ptmi(`root`),{"data-p":m.dataP}),[a(t.$slots,`default`,{},function(){return[t.label?(n(),r(`span`,u({key:0,class:t.cx(`label`)},t.ptm(`label`),{"data-p":m.dataP}),o(t.label),17,S)):t.$slots.icon?(n(),e(s(t.$slots.icon),{key:1,class:c(t.cx(`icon`))},null,8,[`class`])):t.icon?(n(),r(`span`,u({key:2,class:[t.cx(`icon`),t.icon]},t.ptm(`icon`),{"data-p":m.dataP}),null,16,C)):t.image?(n(),r(`img`,u({key:3,src:t.image,alt:t.ariaLabel,onError:i[0]||=function(){return m.onError&&m.onError.apply(m,arguments)}},t.ptm(`image`),{"data-p":m.dataP}),null,16,w)):l(``,!0)]})],16,x)}b.render=T;export{b as default};