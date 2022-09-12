export const networkConfig = {
  POLYGON: {
    onboard: '78906f42-66e0-42ee-aa59-c29c7f9759f0',
    networkId: 80001,
    main_address: '0x0bF7eA526D591afb2484373c25E2b538357ae607',
    currency: 'MATIC',
    multi_contract_address: '0x046bed4246bec21055fb2a2d8d88bb535b78ecd3', // Multisend_Polygon
    platform_contract_address: '0xF1cfA37d496a2252D78B5D330CAB55E4E330db6A', // Auction_Polygon
    explorer: 'https://mumbai.polygonscan.com/',
    rpc_url: 'https://matic-mumbai.chainstacklabs.com',
    contract_address: '0x6B984f9DEc5146e0A675Ee42Fd6588a826F1EE6c', // ERC_Polygon
    block_chain: 'POLYGON'
  },
  OKEX: {
    onboard: '78906f42-66e0-42ee-aa59-c29c7f9759f0',
    networkId: 65,
    main_address: '0x0bF7eA526D591afb2484373c25E2b538357ae607',
    currency: 'OKT',
    multi_contract_address: '0x271c3a1f4732EdA1A5E67E407dBfdeb093053c32', // Multisend_OKX
    platform_contract_address: '0x021863dD8b0285Ad0CEf0DD4Fb3738FbD71b3F6E', // Auction_OKX
    explorer: 'https://www.oklink.com/okc-test/',
    rpc_url: 'https://exchaintestrpc.okex.org',
    contract_address: '0x8C5d5C062fe88Cb5E5306E2EB7A8BCA11F752F84', // ERC_OKX
    block_chain: 'OKEX'
  }
}

export const config = {
  onboard: '78906f42-66e0-42ee-aa59-c29c7f9759f0',
  networkId: 80001,
  main_address: '0x0bF7eA526D591afb2484373c25E2b538357ae607',
  currency: 'MATIC',
  multi_contract_address: '0x046bed4246bec21055fb2a2d8d88bb535b78ecd3', // Multisend_Polygon
  platform_contract_address: '0xF1cfA37d496a2252D78B5D330CAB55E4E330db6A', // Auction_Polygon
  explorer: 'https://mumbai.polygonscan.com/',
  rpc_url: 'https://matic-mumbai.chainstacklabs.com',
  contract_address: '0x6B984f9DEc5146e0A675Ee42Fd6588a826F1EE6c', // ERC_Polygon
  block_chain: 'Polygon'
}

export const config2 = {
  onboard: '78906f42-66e0-42ee-aa59-c29c7f9759f0',
  networkId: 65,
  main_address: '0x0bF7eA526D591afb2484373c25E2b538357ae607',
  currency: 'OKT',
  multi_contract_address: '0x271c3a1f4732EdA1A5E67E407dBfdeb093053c32', // Multisend_OKX
  platform_contract_address: '0x021863dD8b0285Ad0CEf0DD4Fb3738FbD71b3F6E', // Auction_OKX
  explorer: 'https://www.oklink.com/okc-test/',
  rpc_url: 'https://exchaintestrpc.okex.org',
  contract_address: '0x3e4261E6C2877A22e3cFfcDFdBC05ed2cC175fE8', // ERC_OKX
  block_chain: 'OKC'
}

export const networks = {
  polygon: {
	  chainId: `0x${Number(137).toString(16)}`,
	  chainName: 'Polygon Mainnet',
	  nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
	  },
	  rpcUrls: ['https://polygon-rpc.com/'],
	  blockExplorerUrls: ['https://polygonscan.com/']
  },
  bsc: {
	  chainId: `0x${Number(56).toString(16)}`,
	  chainName: 'Binance Smart Chain Mainnet',
	  nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18
	  },
	  rpcUrls: [
      'https://bsc-dataseed1.binance.org',
      'https://bsc-dataseed2.binance.org',
      'https://bsc-dataseed3.binance.org',
      'https://bsc-dataseed4.binance.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed2.defibit.io',
      'https://bsc-dataseed3.defibit.io',
      'https://bsc-dataseed4.defibit.io',
      'https://bsc-dataseed1.ninicoin.io',
      'https://bsc-dataseed2.ninicoin.io',
      'https://bsc-dataseed3.ninicoin.io',
      'https://bsc-dataseed4.ninicoin.io',
      'wss://bsc-ws-node.nariox.org'
	  ],
	  blockExplorerUrls: ['https://bscscan.com']
  }
}
