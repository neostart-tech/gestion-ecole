import{$ as e,I as t,J as n,S as r,T as i,et as a,g as o,w as s,z as c}from"./B75DpUry.js";import{t as l,wt as u}from"./DtbrKeYJ.js";import{t as d}from"./CRHlWn3X.js";import{t as f}from"./GEDtbPuf.js";var p=l.extend({name:`timeline`,style:`
    .p-timeline {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        direction: ltr;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .p-timeline-left .p-timeline-event-opposite {
        text-align: right;
    }

    .p-timeline-left .p-timeline-event-content {
        text-align: left;
    }

    .p-timeline-right .p-timeline-event {
        flex-direction: row-reverse;
    }

    .p-timeline-right .p-timeline-event-opposite {
        text-align: left;
    }

    .p-timeline-right .p-timeline-event-content {
        text-align: right;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) {
        flex-direction: row-reverse;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-opposite {
        text-align: right;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-content {
        text-align: left;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-opposite {
        text-align: left;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-content {
        text-align: right;
    }

    .p-timeline-vertical .p-timeline-event-opposite,
    .p-timeline-vertical .p-timeline-event-content {
        padding: dt('timeline.vertical.event.content.padding');
    }

    .p-timeline-vertical .p-timeline-event-connector {
        width: dt('timeline.event.connector.size');
    }

    .p-timeline-event {
        display: flex;
        position: relative;
        min-height: dt('timeline.event.min.height');
    }

    .p-timeline-event:last-child {
        min-height: 0;
    }

    .p-timeline-event-opposite {
        flex: 1;
    }

    .p-timeline-event-content {
        flex: 1;
    }

    .p-timeline-event-separator {
        flex: 0;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .p-timeline-event-marker {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        align-self: baseline;
        border-width: dt('timeline.event.marker.border.width');
        border-style: solid;
        border-color: dt('timeline.event.marker.border.color');
        border-radius: dt('timeline.event.marker.border.radius');
        width: dt('timeline.event.marker.size');
        height: dt('timeline.event.marker.size');
        background: dt('timeline.event.marker.background');
    }

    .p-timeline-event-marker::before {
        content: ' ';
        border-radius: dt('timeline.event.marker.content.border.radius');
        width: dt('timeline.event.marker.content.size');
        height: dt('timeline.event.marker.content.size');
        background: dt('timeline.event.marker.content.background');
    }

    .p-timeline-event-marker::after {
        content: ' ';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: dt('timeline.event.marker.border.radius');
        box-shadow: dt('timeline.event.marker.content.inset.shadow');
    }

    .p-timeline-event-connector {
        flex-grow: 1;
        background: dt('timeline.event.connector.color');
    }

    .p-timeline-horizontal {
        flex-direction: row;
    }

    .p-timeline-horizontal .p-timeline-event {
        flex-direction: column;
        flex: 1;
    }

    .p-timeline-horizontal .p-timeline-event:last-child {
        flex: 0;
    }

    .p-timeline-horizontal .p-timeline-event-separator {
        flex-direction: row;
    }

    .p-timeline-horizontal .p-timeline-event-connector {
        width: 100%;
        height: dt('timeline.event.connector.size');
    }

    .p-timeline-horizontal .p-timeline-event-opposite,
    .p-timeline-horizontal .p-timeline-event-content {
        padding: dt('timeline.horizontal.event.content.padding');
    }

    .p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) {
        flex-direction: column-reverse;
    }

    .p-timeline-bottom .p-timeline-event {
        flex-direction: column-reverse;
    }
`,classes:{root:function(e){var t=e.props;return[`p-timeline p-component`,`p-timeline-`+t.align,`p-timeline-`+t.layout]},event:`p-timeline-event`,eventOpposite:`p-timeline-event-opposite`,eventSeparator:`p-timeline-event-separator`,eventMarker:`p-timeline-event-marker`,eventConnector:`p-timeline-event-connector`,eventContent:`p-timeline-event-content`}});t();var m={name:`BaseTimeline`,extends:f,props:{value:null,align:{mode:String,default:`left`},layout:{mode:String,default:`vertical`},dataKey:null},style:p,provide:function(){return{$pcTimeline:this,$parentInstance:this}}};function h(e){"@babel/helpers - typeof";return h=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},h(e)}function g(e,t,n){return(t=_(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _(e){var t=v(e,`string`);return h(t)==`symbol`?t:t+``}function v(e,t){if(h(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(h(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var y={name:`Timeline`,extends:m,inheritAttrs:!1,methods:{getKey:function(e,t){return this.dataKey?u(e,this.dataKey):t},getPTOptions:function(e,t){return this.ptm(e,{context:{index:t,count:this.value.length}})}},computed:{dataP:function(){return d(g(g({},this.layout,this.layout),this.align,this.align))}}},b=[`data-p`],x=[`data-p`],S=[`data-p`],C=[`data-p`],w=[`data-p`],T=[`data-p`],E=[`data-p`];function D(t,l,u,d,f,p){return n(),i(`div`,c({class:t.cx(`root`)},t.ptmi(`root`),{"data-p":p.dataP}),[(n(!0),i(o,null,e(t.value,function(e,o){return n(),i(`div`,c({key:p.getKey(e,o),class:t.cx(`event`)},{ref_for:!0},p.getPTOptions(`event`,o),{"data-p":p.dataP}),[r(`div`,c({class:t.cx(`eventOpposite`,{index:o})},{ref_for:!0},p.getPTOptions(`eventOpposite`,o),{"data-p":p.dataP}),[a(t.$slots,`opposite`,{item:e,index:o})],16,S),r(`div`,c({class:t.cx(`eventSeparator`)},{ref_for:!0},p.getPTOptions(`eventSeparator`,o),{"data-p":p.dataP}),[a(t.$slots,`marker`,{item:e,index:o},function(){return[r(`div`,c({class:t.cx(`eventMarker`)},{ref_for:!0},p.getPTOptions(`eventMarker`,o),{"data-p":p.dataP}),null,16,w)]}),o===t.value.length-1?s(``,!0):a(t.$slots,`connector`,{key:0,item:e,index:o},function(){return[r(`div`,c({class:t.cx(`eventConnector`)},{ref_for:!0},p.getPTOptions(`eventConnector`,o),{"data-p":p.dataP}),null,16,T)]})],16,C),r(`div`,c({class:t.cx(`eventContent`)},{ref_for:!0},p.getPTOptions(`eventContent`,o),{"data-p":p.dataP}),[a(t.$slots,`content`,{item:e,index:o})],16,E)],16,x)}),128))],16,b)}y.render=D;export{y as default};