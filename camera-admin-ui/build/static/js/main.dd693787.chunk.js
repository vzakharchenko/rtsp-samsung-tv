(this["webpackJsonpcamera-admin-ui"]=this["webpackJsonpcamera-admin-ui"]||[]).push([[0],{175:function(e,a,t){e.exports=t(335)},180:function(e,a,t){},334:function(e,a,t){},335:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),c=t(22),s=t.n(c),l=(t(180),t(181),t(35)),i=t(41),o=t.n(i),u=t(67),m=t(144),h=t(47),d=t(115),f=t(172),v=t(168),g=t(82),p=t(338),C=t(70),E=t(154),b=t(340),w=t(337),S=t(339),y=t(182);function O(e){return k.apply(this,arguments)}function k(){return(k=Object(u.a)(o.a.mark((function e(a){var t,n,r,c,s=arguments;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=s.length>1&&void 0!==s[1]?s[1]:"GET",n=s.length>2?s[2]:void 0,r="".concat("").concat(a),e.next=5,y({url:r,method:t,headers:n,transformResponse:function(e){return e},withCredentials:!0,timeout:4900});case 5:return c=e.sent,e.abrupt("return",c.data);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function x(e){return j.apply(this,arguments)}function j(){return(j=Object(u.a)(o.a.mark((function e(a){var t,n,r,c,s=arguments;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=s.length>1&&void 0!==s[1]?s[1]:"POST",n=s.length>2?s[2]:void 0,r=s.length>3?s[3]:void 0,e.next=5,y({url:"".concat("").concat(a),method:t,data:n,transformResponse:function(e){return e},headers:r||{"Content-Type":"application/json"},withCredentials:!0,timeout:4900});case 5:return c=e.sent,e.abrupt("return",c.data);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var T=g.a.Option,D=function(e){Object(f.a)(t,e);var a=Object(v.a)(t);function t(e){var n;return Object(m.a)(this,t),(n=a.call(this,e)).state={loading:!0,config:null,error:null,status:null,newCamera:{}},n.save=n.save.bind(Object(h.a)(n)),n.handleMainTransportChange=n.handleMainTransportChange.bind(Object(h.a)(n)),n.handleCameraChange=n.handleCameraChange.bind(Object(h.a)(n)),n.cameraDatasource=n.cameraDatasource.bind(Object(h.a)(n)),n.cameraColumns=n.cameraColumns.bind(Object(h.a)(n)),n.saveActiveChannel=n.saveActiveChannel.bind(Object(h.a)(n)),n.addDatasource=n.addDatasource.bind(Object(h.a)(n)),n}return Object(d.a)(t,[{key:"save",value:function(){var e=Object(u.a)(o.a.mark((function e(){var a,t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.setState({loading:!0}),e.prev=1,a=JSON.stringify(this.state.config.config),e.next=5,x("/admin/config/save","POST",a);case 5:t=e.sent,this.setState({config:JSON.parse(t)}),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(1),this.setState({error:e.t0.message});case 12:return e.prev=12,this.setState({loading:!1}),e.finish(12);case 15:case"end":return e.stop()}}),e,this,[[1,9,12,15]])})));return function(){return e.apply(this,arguments)}}()},{key:"saveActiveChannel",value:function(){var e=Object(u.a)(o.a.mark((function e(){var a,t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.setState({loading:!0}),e.prev=1,a=JSON.stringify(this.state.status),e.next=5,x("/admin/status/save","POST",a);case 5:t=e.sent,this.setState({status:JSON.parse(t)}),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(1),this.setState({error:e.t0.message});case 12:return e.prev=12,this.setState({loading:!1}),e.finish(12);case 15:case"end":return e.stop()}}),e,this,[[1,9,12,15]])})));return function(){return e.apply(this,arguments)}}()},{key:"commonColumns",value:function(){var e=this;return[{title:"Parameter Name",dataIndex:"name",key:"name",render:function(e){return r.a.createElement("a",null,e)}},{title:"Parameter Value",dataIndex:"value",key:"value",render:function(a,t){return"1"===t.key?r.a.createElement("div",null,r.a.createElement(g.a,{defaultValue:a,style:{width:120},onChange:e.handleMainTransportChange},r.a.createElement(T,{value:"udp"},"UDP"),r.a.createElement(T,{value:"tcp"},"TCP"))):r.a.createElement("a",null,a)}}]}},{key:"addColumns",value:function(){var e=this;return[{title:"Mode",dataIndex:"mode",key:"mode",render:function(a){return r.a.createElement("div",null,r.a.createElement(g.a,{defaultValue:a,style:{width:120},onChange:e.handleCameraChange},r.a.createElement(T,{value:"single"},"1 Camera"),r.a.createElement(T,{value:"multi"},"4 Cameras")))}},{title:"rtsp Streams",dataIndex:"rtsp",key:"rtsp",render:function(){return"multi"===e.state.newCamera.mode?r.a.createElement("div",null,r.a.createElement(p.a.Text,{editable:{onChange:function(a){var t=Object(l.a)({},e.state.newCamera);t.camera1=a,e.setState({newCamera:t})}}},e.state.newCamera.camera1||""),r.a.createElement("br",null),r.a.createElement(p.a.Text,{editable:{onChange:function(a){var t=Object(l.a)({},e.state.newCamera);t.camera2=a,e.setState({newCamera:t})}}},e.state.newCamera.camera2||""),r.a.createElement("br",null),r.a.createElement(p.a.Text,{editable:{onChange:function(a){var t=Object(l.a)({},e.state.newCamera);t.camera3=a,e.setState({newCamera:t})}}},e.state.newCamera.camera3||""),r.a.createElement("br",null),r.a.createElement(p.a.Text,{editable:{onChange:function(a){var t=Object(l.a)({},e.state.newCamera);t.camera4=a,e.setState({newCamera:t})}}},e.state.newCamera.camera4||""),r.a.createElement("br",null)):r.a.createElement(p.a.Text,{editable:{onChange:function(a){var t=Object(l.a)({},e.state.newCamera);t.camera1=a,e.setState({newCamera:t})}}},e.state.newCamera.camera1||"")}},{title:"",dataIndex:"save",key:"save",render:function(){var a=e.state.newCamera.mode||"single",t=!1;return"single"!==a||e.state.newCamera.camera1||(t=!0),"multi"!==a||e.state.newCamera.camera1&&e.state.newCamera.camera2&&e.state.newCamera.camera3&&e.state.newCamera.camera4||(t=!0),t?r.a.createElement("div",null,r.a.createElement(C.a,{disabled:!0},"Save")):r.a.createElement("div",null,r.a.createElement(C.a,{onClick:function(){var t,n=Object(l.a)({},e.state.config);t="single"===a?{streamUrl:e.state.newCamera.camera1}:{streamUrl:[e.state.newCamera.camera1,e.state.newCamera.camera2,e.state.newCamera.camera3,e.state.newCamera.camera4]},n.config.channels.push(t),e.setState({config:n}),e.save().then((function(){e.setState({newCamera:{}})}))}},"Save"))}}]}},{key:"addDatasource",value:function(){var e=this.state.newCamera;return[{mode:e.mode||"single",rtsp:[e.camera1,e.camera2,e.camera3,e.camera4]}]}},{key:"cameraColumns",value:function(){var e=this;return[{title:"Status",dataIndex:"status",key:"status",render:function(a,t,n){return a?r.a.createElement(p.a.Text,null,"Current"):r.a.createElement(C.a,{onClick:function(){e.state.status.currentChannel=n,e.saveActiveChannel().then()}},"Activate")}},{title:"Camera",dataIndex:"camera",key:"camera",render:function(e){return r.a.createElement("a",null,e)}},{title:"Camera Mode",dataIndex:"mode",key:"mode",render:function(e){return r.a.createElement("a",null,1===e?"1 Camera":"4 Cameras")}},{title:"rtsp Streams",dataIndex:"rtsp",key:"rtsp",render:function(a,t,n){return a?Array.isArray(a)?a.length>1?a.map((function(a,t){return r.a.createElement("div",null,r.a.createElement(p.a.Text,{editable:{onChange:function(a){e.state.config.config.channels[n].streamUrl[t]=a,e.save().then()}}},a),r.a.createElement("br",null))})):r.a.createElement(p.a.Text,{editable:{onChange:function(a){e.state.config.config.channels[n].streamUrl=a,e.save().then()}}},a.length>0?a[0]:""):r.a.createElement(p.a.Text,{editable:{onChange:function(a){e.state.config.config.channels[n].streamUrl=a,e.save().then()}}},a):r.a.createElement("a",null)}},{title:"Transport",dataIndex:"transport",key:"transport",render:function(a,t,n){return r.a.createElement("div",null,r.a.createElement(g.a,{defaultValue:a,style:{width:120},onChange:function(a){console.log("selected ".concat(a));var t=Object(l.a)({},e.state.config);t.config.channels[n].transport=a,e.setState({config:t}),e.save().then()}},r.a.createElement(T,{value:"udp"},"UDP"),r.a.createElement(T,{value:"tcp"},"TCP")))}},{title:"",dataIndex:"actions",key:"actions",render:function(a,t,n){return r.a.createElement("div",null,0===n?r.a.createElement(C.a,{disabled:!0},"UP"):r.a.createElement(C.a,{onClick:function(){var a=Object(l.a)({},e.state.config),t=a.config.channels[n];a.config.channels[n]=a.config.channels[n-1],a.config.channels[n-1]=t;var r=Object(l.a)({},e.state.status);r.currentChannel===n&&(r.currentChannel=r.currentChannel-1),e.setState({config:a,status:r}),e.save().then((function(){e.saveActiveChannel().then()}))}},"UP"),n===e.state.config.config.channels.length-1?r.a.createElement(C.a,{disabled:!0},"DOWN"):r.a.createElement(C.a,{onClick:function(){var a=Object(l.a)({},e.state.config),t=a.config.channels[n];a.config.channels[n]=a.config.channels[n+1],a.config.channels[n+1]=t;var r=Object(l.a)({},e.state.status);r.currentChannel===n&&(r.currentChannel=r.currentChannel+1),e.setState({config:a,status:r}),e.save().then((function(){e.saveActiveChannel().then()}))}},"DOWN"),r.a.createElement(C.a,{onClick:function(){var a=Object(l.a)({},e.state.config);a.config.channels=a.config.channels.filter((function(e,a){return a!==n})),e.setState({config:a}),e.save().then()}},"Delete"))}}]}},{key:"cameraDatasource",value:function(e){var a=this,t=[];return e.channels&&e.channels.forEach((function(n,r){t.push({status:r===a.state.status.currentChannel,camera:r,transport:n.transport||e.transport||"udp",mode:Array.isArray(n.streamUrl)&&n.streamUrl.length>1?4:1,rtsp:n.streamUrl})})),t}},{key:"commonDatasource",value:function(e){return[{key:"1",name:"Default Transport",value:e.transport}]}}]),Object(d.a)(t,[{key:"componentDidMount",value:function(){var e=Object(u.a)(o.a.mark((function e(){var a,t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return this.setState({loading:!0}),e.prev=1,e.next=4,O("/admin/config/get","GET");case 4:return a=e.sent,e.next=7,O("/admin/status/get","GET");case 7:t=e.sent,this.setState({config:JSON.parse(a)}),this.setState({status:JSON.parse(t)}),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(1),this.setState({error:e.t0.message});case 15:return e.prev=15,this.setState({loading:!1}),e.finish(15);case 18:case"end":return e.stop()}}),e,this,[[1,12,15,18]])})));return function(){return e.apply(this,arguments)}}()},{key:"handleMainTransportChange",value:function(e){console.log("selected ".concat(e));var a=Object(l.a)({},this.state.config);a.config.transport=e,this.setState({config:a}),this.save().then()}},{key:"handleCameraChange",value:function(e){console.log("selected ".concat(e));var a=Object(l.a)({},this.state.newCamera);a.mode=e,this.setState({newCamera:a})}},{key:"render",value:function(){var e,a=this.state,t=a.loading,n=a.config,c=a.error;if(t)e=r.a.createElement(E.a,{indicator:r.a.createElement(S.a,{style:{fontSize:128},spin:!0})});else if(n&&n.config){var s=n.config,l=this.commonDatasource(s),i=this.cameraDatasource(s);e=r.a.createElement("div",null,c?r.a.createElement(b.a,{message:c,type:"error"}):null,r.a.createElement(p.a.Text,null,"Common Settings"),r.a.createElement("br",null),r.a.createElement(p.a.Text,{code:!0},"File: ",s.file),r.a.createElement("br",null),r.a.createElement(w.a,{columns:this.commonColumns(),dataSource:l,pagination:{total:l.length,pageSize:l.length,hideOnSinglePage:!0}}),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement(p.a.Text,null,"Add new Camera"),r.a.createElement("br",null),r.a.createElement(w.a,{columns:this.addColumns(),dataSource:this.addDatasource(),pagination:{hideOnSinglePage:!0}}),r.a.createElement(p.a.Text,null,"Camera Settings"),r.a.createElement("br",null),r.a.createElement(w.a,{columns:this.cameraColumns(),dataSource:i,pagination:{total:i.length,pageSize:i.length,hideOnSinglePage:!0}}))}else e=r.a.createElement(b.a,{message:"config is empty",type:"error"});return e}}]),t}(r.a.Component);t(334);var A=function(){return r.a.createElement("div",{className:"App"},r.a.createElement("header",{className:"App-header"},r.a.createElement(D,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(A,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[175,1,2]]]);
//# sourceMappingURL=main.dd693787.chunk.js.map