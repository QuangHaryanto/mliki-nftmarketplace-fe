(this.webpackJsonpmilki_frontend=this.webpackJsonpmilki_frontend||[]).push([[91],{467:function(t,e,n){"use strict";n.r(e);var r=n(5),o=(n(147),n(148));n(79),n(115),n(116);function i(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function c(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?i(Object(n),!0).forEach((function(e){a(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function u(t,e,n,r,o,i,c){try{var a=t[i](c),u=a.value}catch(s){return void n(s)}a.done?e(u):Promise.resolve(u).then(r,o)}function s(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var i=t.apply(e,n);function c(t){u(i,r,o,c,a,"next",t)}function a(t){u(i,r,o,c,a,"throw",t)}c(void 0)}))}}e.default=function(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=e.heading,i=e.description,a=e.icon,u=e.html,l=e.button,f=!1;return o.c.subscribe((function(e){var n=e.walletCheckInProgress;!1===t&&!0===n&&(f=!1),t=n})),function(){var t=s(Object(r.a)().mark((function t(e){var p,b,w,h,d,v,k,y,m;return Object(r.a)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(p=e.network,b=e.appNetworkId,w=e.walletSelect,h=e.walletCheck,d=e.exit,v=e.stateSyncStatus,k=e.stateStore,y=e.wallet,null!==p){t.next=5;break}if(!v.network){t.next=5;break}return t.next=5,new Promise((function(t){v.network&&v.network.then(t),setTimeout((function(){null===p&&t(void 0)}),500)}));case 5:if(f||k.network.get()==b||"WalletConnect"===Object(o.d)(null===y||void 0===y?void 0:y.provider)){t.next=14;break}return t.prev=6,f=!0,t.next=10,null===y||void 0===y||null===(m=y.provider)||void 0===m?void 0:m.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+(null===b||void 0===b?void 0:b.toString(16))}]});case 10:t.next=14;break;case 12:t.prev=12,t.t0=t.catch(6);case 14:if(k.network.get()==b){t.next=16;break}return t.abrupt("return",{heading:n||"You Must Change Networks",description:i||"We've detected that you need to switch your wallet's network from <b>".concat(Object(o.m)(p),"</b> to <b>").concat(Object(o.m)(b),'</b> for this Dapp. <br><br> <i style="font-size: inherit; font-family: inherit;">*Some wallets may not support changing networks. If you can not change networks in your wallet you may consider switching to a different wallet.</i>'),eventCode:"networkFail",button:l||{onclick:function(){var t=s(Object(r.a)().mark((function t(){var e,n;return Object(r.a)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return d(!1,{switchingWallets:!0}),t.next=3,w();case 3:if(e=t.sent,t.t0=e,!t.t0){t.next=9;break}return t.next=8,h();case 8:t.t0=t.sent;case 9:n=t.t0,o.c.update((function(t){return c(c({},t),{},{switchingWallets:!1,walletCheckCompleted:n})}));case 11:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),text:"Switch Wallet"},html:u,icon:a||o.j});case 16:case"end":return t.stop()}}),t,null,[[6,12]])})));return function(e){return t.apply(this,arguments)}}()}}}]);
//# sourceMappingURL=91.852b5ed5.chunk.js.map