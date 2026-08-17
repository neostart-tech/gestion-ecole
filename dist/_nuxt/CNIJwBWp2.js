import{$ as e,C as t,I as n,J as r,N as i,S as a,T as o,Vt as s,g as c,k as l,nn as u,rt as d,tt as f,w as p,z as m}from"./B75DpUry.js";import{I as h,t as g}from"./DtbrKeYJ.js";import{t as _}from"./GEDtbPuf.js";import{t as v}from"./DIUR7bRq2.js";import{t as y}from"./BGsfAMZu.js";var b=g.extend({name:`organizationchart`,style:`
    .p-organizationchart-table {
        border-spacing: 0;
        border-collapse: separate;
        margin: 0 auto;
    }

    .p-organizationchart-table > tbody > tr > td {
        text-align: center;
        vertical-align: top;
        padding: 0 dt('organizationchart.gutter');
    }

    .p-organizationchart-node {
        display: inline-block;
        position: relative;
        border: 1px solid dt('organizationchart.node.border.color');
        background: dt('organizationchart.node.background');
        color: dt('organizationchart.node.color');
        padding: dt('organizationchart.node.padding');
        border-radius: dt('organizationchart.node.border.radius');
        transition:
            background dt('organizationchart.transition.duration'),
            border-color dt('organizationchart.transition.duration'),
            color dt('organizationchart.transition.duration'),
            box-shadow dt('organizationchart.transition.duration');
    }

    .p-organizationchart-node:has(.p-organizationchart-node-toggle-button) {
        padding: dt('organizationchart.node.toggleable.padding');
    }

    .p-organizationchart-node.p-organizationchart-node-selectable:not(.p-organizationchart-node-selected):hover {
        background: dt('organizationchart.node.hover.background');
        color: dt('organizationchart.node.hover.color');
    }

    .p-organizationchart-node-selected {
        background: dt('organizationchart.node.selected.background');
        color: dt('organizationchart.node.selected.color');
    }

    .p-organizationchart-node-toggle-button {
        position: absolute;
        inset-block-end: calc(-1 * calc(dt('organizationchart.node.toggle.button.size') / 2));
        margin-inline-start: calc(-1 * calc(dt('organizationchart.node.toggle.button.size') / 2));
        z-index: 2;
        inset-inline-start: 50%;
        user-select: none;
        cursor: pointer;
        width: dt('organizationchart.node.toggle.button.size');
        height: dt('organizationchart.node.toggle.button.size');
        text-decoration: none;
        background: dt('organizationchart.node.toggle.button.background');
        color: dt('organizationchart.node.toggle.button.color');
        border-radius: dt('organizationchart.node.toggle.button.border.radius');
        border: 1px solid dt('organizationchart.node.toggle.button.border.color');
        display: inline-flex;
        justify-content: center;
        align-items: center;
        outline-color: transparent;
        transition:
            background dt('organizationchart.transition.duration'),
            color dt('organizationchart.transition.duration'),
            border-color dt('organizationchart.transition.duration'),
            outline-color dt('organizationchart.transition.duration'),
            box-shadow dt('organizationchart.transition.duration');
    }

    .p-organizationchart-node-toggle-button:hover {
        background: dt('organizationchart.node.toggle.button.hover.background');
        color: dt('organizationchart.node.toggle.button.hover.color');
    }

    .p-organizationchart-node-toggle-button:focus-visible {
        box-shadow: dt('organizationchart.node.toggle.button.focus.ring.shadow');
        outline: dt('organizationchart.node.toggle.button.focus.ring.width') dt('organizationchart.node.toggle.button.focus.ring.style') dt('organizationchart.node.toggle.button.focus.ring.color');
        outline-offset: dt('organizationchart.node.toggle.button.focus.ring.offset');
    }

    .p-organizationchart-node-toggle-button-icon {
        position: relative;
        inset-block-start: 1px;
    }

    .p-organizationchart-connector-down {
        margin: 0 auto;
        height: dt('organizationchart.connector.height');
        width: 1px;
        background: dt('organizationchart.connector.color');
    }

    .p-organizationchart-connector-right {
        border-radius: 0;
    }

    .p-organizationchart-connector-left {
        border-radius: 0;
        border-inline-end: 1px solid dt('organizationchart.connector.color');
    }

    .p-organizationchart-connector-top {
        border-block-start: 1px solid dt('organizationchart.connector.color');
    }

    .p-organizationchart-node-selectable {
        cursor: pointer;
    }

    .p-organizationchart-connectors :nth-child(1 of .p-organizationchart-connector-left) {
        border-inline-end: 0 none;
    }

    .p-organizationchart-connectors :nth-last-child(1 of .p-organizationchart-connector-left) {
        border-start-end-radius: dt('organizationchart.connector.border.radius');
    }

    .p-organizationchart-connectors :nth-child(1 of .p-organizationchart-connector-right) {
        border-inline-start: 1px solid dt('organizationchart.connector.color');
        border-start-start-radius: dt('organizationchart.connector.border.radius');
    }
`,classes:{root:`p-organizationchart p-component`,table:`p-organizationchart-table`,node:function(e){var t=e.instance;return[`p-organizationchart-node`,{"p-organizationchart-node-selectable":t.selectable,"p-organizationchart-node-selected":t.selected}]},nodeToggleButton:function(e){return[`p-organizationchart-node-toggle-button`,{"p-disabled":!e.instance.selectable}]},nodeToggleButtonIcon:`p-organizationchart-node-toggle-button-icon`,connectors:`p-organizationchart-connectors`,connectorDown:`p-organizationchart-connector-down`,connectorLeft:function(e){return[`p-organizationchart-connector-left`,{"p-organizationchart-connector-top":e.index!==0}]},connectorRight:function(e){var t=e.props;return[`p-organizationchart-connector-right`,{"p-organizationchart-connector-top":e.index!==t.node.children.length-1}]},nodeChildren:`p-organizationchart-node-children`}});n(),s();var x={name:`BaseOrganizationChart`,extends:_,props:{value:{type:null,default:null},selectionKeys:{type:null,default:null},selectionMode:{type:String,default:null},collapsible:{type:Boolean,default:!1},collapsedKeys:{type:null,default:null}},style:b,provide:function(){return{$pcOrganizationChart:this,$parentInstance:this}}},S={name:`OrganizationChartNode`,hostName:`OrganizationChart`,extends:_,emits:[`node-click`,`node-toggle`],props:{node:{type:null,default:null},templates:{type:null,default:null},collapsible:{type:Boolean,default:!1},collapsedKeys:{type:null,default:null},selectionKeys:{type:null,default:null},selectionMode:{type:String,default:null}},methods:{getPTOptions:function(e){return this.ptm(e,{context:{expanded:this.expanded,selectable:this.selectable,selected:this.selected,toggleable:this.toggleable,active:this.selected}})},getNodeOptions:function(e,t){return this.ptm(t,{context:{lineTop:e}})},onNodeClick:function(e){h(e.target,`data-pc-section`,`nodetogglebutton`)||h(e.target,`data-pc-section`,`nodetogglebuttonicon`)||this.selectionMode&&this.$emit(`node-click`,this.node)},onChildNodeClick:function(e){this.$emit(`node-click`,e)},toggleNode:function(){this.$emit(`node-toggle`,this.node)},onChildNodeToggle:function(e){this.$emit(`node-toggle`,e)},onKeydown:function(e){(e.code===`Enter`||e.code===`NumpadEnter`||e.code===`Space`)&&(this.toggleNode(),e.preventDefault())}},computed:{leaf:function(){return this.node.leaf!==!1&&!(this.node.children&&this.node.children.length)},colspan:function(){return this.node.children&&this.node.children.length?this.node.children.length*2:null},childStyle:function(){return{visibility:!this.leaf&&this.expanded?`inherit`:`hidden`}},expanded:function(){return this.collapsedKeys[this.node.key]===void 0},selectable:function(){return this.selectionMode&&this.node.selectable!==!1},selected:function(){return this.selectable&&this.selectionKeys&&this.selectionKeys[this.node.key]===!0},toggleable:function(){return this.collapsible&&this.node.collapsible!==!1&&!this.leaf}},components:{ChevronDownIcon:v,ChevronUpIcon:y}},C=[`colspan`],w=[`colspan`],T=[`colspan`];function E(n,s,h,g,_,v){var y=f(`OrganizationChartNode`,!0);return r(),o(`table`,m({class:n.cx(`table`)},n.ptm(`table`)),[a(`tbody`,u(i(n.ptm(`body`))),[h.node?(r(),o(`tr`,u(m({key:0},n.ptm(`row`))),[a(`td`,m({colspan:v.colspan},n.ptm(`cell`)),[a(`div`,m({class:[n.cx(`node`),h.node.styleClass],onClick:s[2]||=function(){return v.onNodeClick&&v.onNodeClick.apply(v,arguments)}},v.getPTOptions(`node`)),[(r(),t(d(h.templates[h.node.type]||h.templates.default),{node:h.node},null,8,[`node`])),v.toggleable?(r(),o(`a`,m({key:0,tabindex:`0`,class:n.cx(`nodeToggleButton`),onClick:s[0]||=function(){return v.toggleNode&&v.toggleNode.apply(v,arguments)},onKeydown:s[1]||=function(){return v.onKeydown&&v.onKeydown.apply(v,arguments)}},v.getPTOptions(`nodeToggleButton`)),[h.templates.toggleicon||h.templates.togglericon?(r(),t(d(h.templates.toggleicon||h.templates.togglericon),m({key:0,expanded:v.expanded,class:n.cx(`nodeToggleButtonIcon`)},v.getPTOptions(`nodeToggleButtonIcon`)),null,16,[`expanded`,`class`])):(r(),t(d(v.expanded?`ChevronDownIcon`:`ChevronUpIcon`),m({key:1,class:n.cx(`nodeToggleButtonIcon`)},v.getPTOptions(`nodeToggleButtonIcon`)),null,16,[`class`]))],16)):p(``,!0)],16)],16,C)],16)):p(``,!0),a(`tr`,m({style:v.childStyle,class:n.cx(`connectors`)},n.ptm(`connectors`)),[a(`td`,m({colspan:v.colspan},n.ptm(`lineCell`)),[a(`div`,m({class:n.cx(`connectorDown`)},n.ptm(`connectorDown`)),null,16)],16,w)],16),a(`tr`,m({style:v.childStyle,class:n.cx(`connectors`)},n.ptm(`connectors`)),[h.node.children&&h.node.children.length===1?(r(),o(`td`,m({key:0,colspan:v.colspan},n.ptm(`lineCell`)),[a(`div`,m({class:n.cx(`connectorDown`)},n.ptm(`connectorDown`)),null,16)],16,T)):p(``,!0),h.node.children&&h.node.children.length>1?(r(!0),o(c,{key:1},e(h.node.children,function(e,t){return r(),o(c,{key:e.key},[a(`td`,m({class:n.cx(`connectorLeft`,{index:t})},{ref_for:!0},v.getNodeOptions(t!==0,`connectorLeft`)),`\xA0`,16),a(`td`,m({class:n.cx(`connectorRight`,{index:t})},{ref_for:!0},v.getNodeOptions(t!==h.node.children.length-1,`connectorRight`)),`\xA0`,16)],64)}),128)):p(``,!0)],16),a(`tr`,m({style:v.childStyle,class:n.cx(`nodeChildren`)},n.ptm(`nodeChildren`)),[(r(!0),o(c,null,e(h.node.children,function(e){return r(),o(`td`,m({key:e.key,colspan:`2`},{ref_for:!0},n.ptm(`nodeCell`)),[l(y,{node:e,templates:h.templates,collapsedKeys:h.collapsedKeys,onNodeToggle:v.onChildNodeToggle,collapsible:h.collapsible,selectionMode:h.selectionMode,selectionKeys:h.selectionKeys,onNodeClick:v.onChildNodeClick,pt:n.pt,unstyled:n.unstyled},null,8,[`node`,`templates`,`collapsedKeys`,`onNodeToggle`,`collapsible`,`selectionMode`,`selectionKeys`,`onNodeClick`,`pt`,`unstyled`])],16)}),128))],16)],16)],16)}S.render=E;function D(e){"@babel/helpers - typeof";return D=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},D(e)}function O(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function k(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?O(Object(n),!0).forEach(function(t){A(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):O(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function A(e,t,n){return(t=j(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function j(e){var t=M(e,`string`);return D(t)==`symbol`?t:t+``}function M(e,t){if(D(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(D(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var N={name:`OrganizationChart`,extends:x,inheritAttrs:!1,emits:[`node-unselect`,`node-select`,`update:selectionKeys`,`node-expand`,`node-collapse`,`update:collapsedKeys`],data:function(){return{d_collapsedKeys:this.collapsedKeys||{}}},watch:{collapsedKeys:function(e){this.d_collapsedKeys=e}},methods:{onNodeClick:function(e){var t=e.key;if(this.selectionMode){var n=this.selectionKeys?k({},this.selectionKeys):{};n[t]?(delete n[t],this.$emit(`node-unselect`,e)):(this.selectionMode===`single`&&(n={}),n[t]=!0,this.$emit(`node-select`,e)),this.$emit(`update:selectionKeys`,n)}},onNodeToggle:function(e){var t=e.key;this.d_collapsedKeys[t]?(delete this.d_collapsedKeys[t],this.$emit(`node-expand`,e)):(this.d_collapsedKeys[t]=!0,this.$emit(`node-collapse`,e)),this.d_collapsedKeys=k({},this.d_collapsedKeys),this.$emit(`update:collapsedKeys`,this.d_collapsedKeys)}},components:{OrganizationChartNode:S}};function P(e,t,n,i,a,s){var c=f(`OrganizationChartNode`);return r(),o(`div`,m({class:e.cx(`root`)},e.ptmi(`root`)),[l(c,{node:e.value,templates:e.$slots,onNodeToggle:s.onNodeToggle,collapsedKeys:a.d_collapsedKeys,collapsible:e.collapsible,onNodeClick:s.onNodeClick,selectionMode:e.selectionMode,selectionKeys:e.selectionKeys,pt:e.pt,unstyled:e.unstyled},null,8,[`node`,`templates`,`onNodeToggle`,`collapsedKeys`,`collapsible`,`onNodeClick`,`selectionMode`,`selectionKeys`,`pt`,`unstyled`])],16)}N.render=P;export{N as default};