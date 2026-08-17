import{C as e,E as t,I as n,J as r,O as i,S as a,T as o,Vt as s,et as c,g as l,on as u,tn as d,tt as f,ut as p,w as m,z as h}from"./B75DpUry.js";import{ft as g,gt as _,t as v,wt as y}from"./DtbrKeYJ.js";import{t as b}from"./GEDtbPuf.js";import{n as x}from"./K5hG2ZJ9.js";var S=v.extend({name:`dataview`,style:`
    .p-dataview {
        position: relative;
        display: block;
        border-color: dt('dataview.border.color');
        border-width: dt('dataview.border.width');
        border-style: solid;
        border-radius: dt('dataview.border.radius');
        padding: dt('dataview.padding');
    }

    .p-dataview-header {
        background: dt('dataview.header.background');
        color: dt('dataview.header.color');
        border-color: dt('dataview.header.border.color');
        border-width: dt('dataview.header.border.width');
        border-style: solid;
        padding: dt('dataview.header.padding');
        border-radius: dt('dataview.header.border.radius');
    }

    .p-dataview-content {
        background: dt('dataview.content.background');
        border-color: dt('dataview.content.border.color');
        border-width: dt('dataview.content.border.width');
        border-style: solid;
        color: dt('dataview.content.color');
        padding: dt('dataview.content.padding');
        border-radius: dt('dataview.content.border.radius');
    }

    .p-dataview-footer {
        background: dt('dataview.footer.background');
        color: dt('dataview.footer.color');
        border-color: dt('dataview.footer.border.color');
        border-width: dt('dataview.footer.border.width');
        border-style: solid;
        padding: dt('dataview.footer.padding');
        border-radius: dt('dataview.footer.border.radius');
    }

    .p-dataview-paginator-top {
        border-width: dt('dataview.paginator.top.border.width');
        border-color: dt('dataview.paginator.top.border.color');
        border-style: solid;
    }

    .p-dataview-paginator-bottom {
        border-width: dt('dataview.paginator.bottom.border.width');
        border-color: dt('dataview.paginator.bottom.border.color');
        border-style: solid;
    }

    .p-dataview-loading-overlay {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
    }
`,classes:{root:function(e){var t=e.props;return[`p-dataview p-component`,{"p-dataview-list":t.layout===`list`,"p-dataview-grid":t.layout===`grid`}]},header:`p-dataview-header`,pcPaginator:function(e){return`p-dataview-paginator-`+e.position},content:`p-dataview-content`,emptyMessage:`p-dataview-empty-message`,footer:`p-dataview-footer`}});n(),s();var C={name:`BaseDataView`,extends:b,props:{value:{type:Array,default:null},layout:{type:String,default:`list`},rows:{type:Number,default:0},first:{type:Number,default:0},totalRecords:{type:Number,default:0},paginator:{type:Boolean,default:!1},paginatorPosition:{type:String,default:`bottom`},alwaysShowPaginator:{type:Boolean,default:!0},paginatorTemplate:{type:String,default:`FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown`},pageLinkSize:{type:Number,default:5},rowsPerPageOptions:{type:Array,default:null},currentPageReportTemplate:{type:String,default:`({currentPage} of {totalPages})`},sortField:{type:[String,Function],default:null},sortOrder:{type:Number,default:null},lazy:{type:Boolean,default:!1},dataKey:{type:String,default:null}},style:S,provide:function(){return{$pcDataView:this,$parentInstance:this}}};function w(e){return O(e)||D(e)||E(e)||T()}function T(){throw TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function E(e,t){if(e){if(typeof e==`string`)return k(e,t);var n={}.toString.call(e).slice(8,-1);return n===`Object`&&e.constructor&&(n=e.constructor.name),n===`Map`||n===`Set`?Array.from(e):n===`Arguments`||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?k(e,t):void 0}}function D(e){if(typeof Symbol<`u`&&e[Symbol.iterator]!=null||e[`@@iterator`]!=null)return Array.from(e)}function O(e){if(Array.isArray(e))return k(e)}function k(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var A={name:`DataView`,extends:C,inheritAttrs:!1,emits:[`update:first`,`update:rows`,`page`],data:function(){return{d_first:this.first,d_rows:this.rows}},watch:{first:function(e){this.d_first=e},rows:function(e){this.d_rows=e},sortField:function(){this.resetPage()},sortOrder:function(){this.resetPage()}},methods:{getKey:function(e,t){return this.dataKey?y(e,this.dataKey):t},onPage:function(e){this.d_first=e.first,this.d_rows=e.rows,this.$emit(`update:first`,this.d_first),this.$emit(`update:rows`,this.d_rows),this.$emit(`page`,e)},sort:function(){var e=this;if(this.value){var t=w(this.value),n=g();return t.sort(function(t,r){var i=y(t,e.sortField),a=y(r,e.sortField);return _(i,a,e.sortOrder,n)}),t}return null},resetPage:function(){this.d_first=0,this.$emit(`update:first`,this.d_first)}},computed:{getTotalRecords:function(){return this.totalRecords?this.totalRecords:this.value?this.value.length:0},empty:function(){return!this.value||this.value.length===0},emptyMessageText:function(){var e;return((e=this.$primevue.config)==null||(e=e.locale)==null?void 0:e.emptyMessage)||``},paginatorTop:function(){return this.paginator&&(this.paginatorPosition!==`bottom`||this.paginatorPosition===`both`)},paginatorBottom:function(){return this.paginator&&(this.paginatorPosition!==`top`||this.paginatorPosition===`both`)},items:function(){if(this.value&&this.value.length){var e=this.value;if(e&&e.length&&this.sortField&&(e=this.sort()),this.paginator){var t=this.lazy?0:this.d_first;return e.slice(t,t+this.d_rows)}return e}return null}},components:{DVPaginator:x}};function j(n,s,g,_,v,y){var b=f(`DVPaginator`);return r(),o(`div`,h({class:n.cx(`root`)},n.ptmi(`root`)),[n.$slots.header?(r(),o(`div`,h({key:0,class:n.cx(`header`)},n.ptm(`header`)),[c(n.$slots,`header`)],16)):m(``,!0),y.paginatorTop?(r(),e(b,{key:1,rows:v.d_rows,first:v.d_first,totalRecords:y.getTotalRecords,pageLinkSize:n.pageLinkSize,template:n.paginatorTemplate,rowsPerPageOptions:n.rowsPerPageOptions,currentPageReportTemplate:n.currentPageReportTemplate,class:d(n.cx(`pcPaginator`,{position:`top`})),alwaysShow:n.alwaysShowPaginator,onPage:s[0]||=function(e){return y.onPage(e)},unstyled:n.unstyled,pt:n.ptm(`pcPaginator`)},t({_:2},[n.$slots.paginatorcontainer?{name:`container`,fn:p(function(e){return[c(n.$slots,`paginatorcontainer`,{first:e.first,last:e.last,rows:e.rows,page:e.page,pageCount:e.pageCount,pageLinks:e.pageLinks,totalRecords:e.totalRecords,firstPageCallback:e.firstPageCallback,lastPageCallback:e.lastPageCallback,prevPageCallback:e.prevPageCallback,nextPageCallback:e.nextPageCallback,rowChangeCallback:e.rowChangeCallback,changePageCallback:e.changePageCallback})]}),key:`0`}:void 0,n.$slots.paginatorstart?{name:`start`,fn:p(function(){return[c(n.$slots,`paginatorstart`)]}),key:`1`}:void 0,n.$slots.paginatorend?{name:`end`,fn:p(function(){return[c(n.$slots,`paginatorend`)]}),key:`2`}:void 0]),1032,[`rows`,`first`,`totalRecords`,`pageLinkSize`,`template`,`rowsPerPageOptions`,`currentPageReportTemplate`,`class`,`alwaysShow`,`unstyled`,`pt`])):m(``,!0),a(`div`,h({class:n.cx(`content`)},n.ptm(`content`)),[y.empty?(r(),o(`div`,h({key:1,class:n.cx(`emptyMessage`)},n.ptm(`emptyMessage`)),[c(n.$slots,`empty`,{layout:n.layout},function(){return[i(u(y.emptyMessageText),1)]})],16)):(r(),o(l,{key:0},[n.$slots.list&&n.layout===`list`?c(n.$slots,`list`,{key:0,items:y.items}):m(``,!0),n.$slots.grid&&n.layout===`grid`?c(n.$slots,`grid`,{key:1,items:y.items}):m(``,!0)],64))],16),y.paginatorBottom?(r(),e(b,{key:2,rows:v.d_rows,first:v.d_first,totalRecords:y.getTotalRecords,pageLinkSize:n.pageLinkSize,template:n.paginatorTemplate,rowsPerPageOptions:n.rowsPerPageOptions,currentPageReportTemplate:n.currentPageReportTemplate,class:d(n.cx(`pcPaginator`,{position:`bottom`})),alwaysShow:n.alwaysShowPaginator,onPage:s[1]||=function(e){return y.onPage(e)},unstyled:n.unstyled,pt:n.ptm(`pcPaginator`)},t({_:2},[n.$slots.paginatorcontainer?{name:`container`,fn:p(function(e){return[c(n.$slots,`paginatorcontainer`,{first:e.first,last:e.last,rows:e.rows,page:e.page,pageCount:e.pageCount,pageLinks:e.pageLinks,totalRecords:e.totalRecords,firstPageCallback:e.firstPageCallback,lastPageCallback:e.lastPageCallback,prevPageCallback:e.prevPageCallback,nextPageCallback:e.nextPageCallback,rowChangeCallback:e.rowChangeCallback,changePageCallback:e.changePageCallback})]}),key:`0`}:void 0,n.$slots.paginatorstart?{name:`start`,fn:p(function(){return[c(n.$slots,`paginatorstart`)]}),key:`1`}:void 0,n.$slots.paginatorend?{name:`end`,fn:p(function(){return[c(n.$slots,`paginatorend`)]}),key:`2`}:void 0]),1032,[`rows`,`first`,`totalRecords`,`pageLinkSize`,`template`,`rowsPerPageOptions`,`currentPageReportTemplate`,`class`,`alwaysShow`,`unstyled`,`pt`])):m(``,!0),n.$slots.footer?(r(),o(`div`,h({key:3,class:n.cx(`footer`)},n.ptm(`footer`)),[c(n.$slots,`footer`)],16)):m(``,!0)],16)}A.render=j;export{A as default};