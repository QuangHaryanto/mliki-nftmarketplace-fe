(this.webpackJsonpmilki_frontend=this.webpackJsonpmilki_frontend||[]).push([[87],{819:function(r,e,i){"use strict";i.r(e),i.d(e,"generateAddresses",(function(){return d})),i.d(e,"isValidPath",(function(){return o}));var n=i(525),t=i(683),u=i.n(t),s=i(42),a=n.publicToAddress,c=n.toChecksumAddress;function d(r,e){var i=r.publicKey,n=r.chainCode,t=r.path,d=new u.a;d.publicKey=new s.Buffer(i,"hex"),d.chainCode=new s.Buffer(n,"hex");for(var o=[],f=e;f<5+e;f++){var h=d.deriveChild(f),l=a(h.publicKey,!0).toString("hex");o.push({dPath:"".concat(t,"/").concat(f),address:c("0x".concat(l))})}return o}function o(r){var e=r.split("/");if("m"!==e[0])return!1;if("44'"!==e[1])return!1;if(!["60'","1'","73799'","246'"].includes(e[2]))return!1;if(void 0===e[3]||"0'"===e[3])return!0;var i=Number(e[3].slice(0,-1));if(isNaN(i)||i<0||"'"!==e[3].slice(-1))return!1;if(void 0===e[4])return!0;var n=Number(e[4]);if(isNaN(n)||n<0)return!1;if(void 0===e[5])return!0;var t=Number(e[5]);return!(isNaN(t)||t<0)}}}]);
//# sourceMappingURL=87.50034b71.chunk.js.map