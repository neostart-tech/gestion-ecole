import{$ as e,I as t,J as n,S as r,T as i,Vt as a,a as o,dt as s,f as c,g as l,on as u,w as d,z as f}from"./B75DpUry.js";import{nt as p,t as m}from"./DtbrKeYJ.js";import{t as h}from"./GEDtbPuf.js";var g=p(),_=m.extend({name:`terminal`,style:`
    .p-terminal {
        display: block;
        height: dt('terminal.height');
        overflow: auto;
        background: dt('terminal.background');
        color: dt('terminal.color');
        border: 1px solid dt('terminal.border.color');
        padding: dt('terminal.padding');
        border-radius: dt('terminal.border.radius');
    }

    .p-terminal-prompt {
        display: flex;
        align-items: center;
    }

    .p-terminal-prompt-value {
        flex: 1 1 auto;
        border: 0 none;
        background: transparent;
        color: inherit;
        padding: 0;
        outline: 0 none;
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
    }

    .p-terminal-prompt-label {
        margin-inline-end: dt('terminal.prompt.gap');
    }

    .p-terminal-input::-ms-clear {
        display: none;
    }

    .p-terminal-command-response {
        margin: dt('terminal.command.response.margin');
    }
`,classes:{root:`p-terminal p-component`,welcomeMessage:`p-terminal-welcome-message`,commandList:`p-terminal-command-list`,command:`p-terminal-command`,commandValue:`p-terminal-command-value`,commandResponse:`p-terminal-command-response`,prompt:`p-terminal-prompt`,promptLabel:`p-terminal-prompt-label`,promptValue:`p-terminal-prompt-value`}});t(),a(),o();var v={name:`Terminal`,extends:{name:`BaseTerminal`,extends:h,props:{welcomeMessage:{type:String,default:null},prompt:{type:String,default:null}},style:_,provide:function(){return{$pcTerminal:this,$parentInstance:this}}},inheritAttrs:!1,data:function(){return{commandText:null,commands:[]}},mounted:function(){g.on(`response`,this.responseListener),this.$refs.input.focus()},updated:function(){this.$el.scrollTop=this.$el.scrollHeight},beforeUnmount:function(){g.off(`response`,this.responseListener)},methods:{onClick:function(){this.$refs.input.focus()},onKeydown:function(e){e.key===`Enter`&&this.commandText&&(this.commands.push({text:this.commandText}),g.emit(`command`,this.commandText),this.commandText=``)},responseListener:function(e){this.commands[this.commands.length-1].response=e}}};function y(t,a,o,p,m,h){return n(),i(`div`,f({class:t.cx(`root`),onClick:a[2]||=function(){return h.onClick&&h.onClick.apply(h,arguments)}},t.ptmi(`root`)),[t.welcomeMessage?(n(),i(`div`,f({key:0,class:t.cx(`welcomeMessage`)},t.ptm(`welcomeMessage`)),u(t.welcomeMessage),17)):d(``,!0),r(`div`,f({class:t.cx(`commandList`)},t.ptm(`content`)),[(n(!0),i(l,null,e(m.commands,function(e,a){return n(),i(`div`,f({key:e.text+a.toString(),class:t.cx(`command`)},{ref_for:!0},t.ptm(`commands`)),[r(`span`,f({class:t.cx(`promptLabel`)},{ref_for:!0},t.ptm(`prompt`)),u(t.prompt),17),r(`span`,f({class:t.cx(`commandValue`)},{ref_for:!0},t.ptm(`command`)),u(e.text),17),r(`div`,f({class:t.cx(`commandResponse`),"aria-live":`polite`},{ref_for:!0},t.ptm(`response`)),u(e.response),17)],16)}),128))],16),r(`div`,f({class:t.cx(`prompt`)},t.ptm(`container`)),[r(`span`,f({class:t.cx(`promptLabel`)},t.ptm(`prompt`)),u(t.prompt),17),s(r(`input`,f({ref:`input`,"onUpdate:modelValue":a[0]||=function(e){return m.commandText=e},class:t.cx(`promptValue`),type:`text`,autocomplete:`off`,onKeydown:a[1]||=function(){return h.onKeydown&&h.onKeydown.apply(h,arguments)}},t.ptm(`commandText`)),null,16),[[c,m.commandText]])],16)],16)}v.render=y;export{v as default};