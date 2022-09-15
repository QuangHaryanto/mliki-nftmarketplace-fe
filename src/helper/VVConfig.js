export const networkConfig = {
  POLYGON: {
    onboard: '78906f42-66e0-42ee-aa59-c29c7f9759f0',
    networkId: 137,
    main_address: '0x457fc2AE6793e7A5D42A6388EE9383d2aB5f6819',
    currency: 'MATIC',
    multi_contract_address: '0x21B8e4e76Cde6Defc9ACf0d494069bd5Ea09f973', // Multisend_Polygon
    platform_contract_address: '0x62C1fbc83AE2d5CF389b11335FDD4cA4558e1CDC', // Auction_Polygon
    explorer: "https://polygonscan.com/",
    rpc_url: "https://polygon-rpc.com/",
    contract_address: "0x934EB0dB4f9cC538FFB7C6279F204818C85fbfCa", //done
    block_chain: 'POLYGON'
  },
  OKEX: {
    onboard: '78906f42-66e0-42ee-aa59-c29c7f9759f0',
    networkId: 66,
    main_address: '0x457fc2AE6793e7A5D42A6388EE9383d2aB5f6819',
    currency: 'OKT',
    multi_contract_address: '0x3D32456Ef08ac189A716e07a20697eB84D115C22', // Multisend_OKX
    platform_contract_address: '0xa207133a41696fe3D04dfe7fDa9C47a0A57B3dCf', // Auction_OKX
    explorer: 'https://www.oklink.com/en/okc/',
    rpc_url: 'https://exchainrpc.okex.org/',
    contract_address: '0x52969A26fF97674ddAD4FC21d1230B3cf881B83E', // ERC_OKX
    block_chain: 'OKEX'
  }
}

export const config = {
  onboard : "78906f42-66e0-42ee-aa59-c29c7f9759f0",
  networkId: 137,
  main_address: "0x457fc2AE6793e7A5D42A6388EE9383d2aB5f6819",
  currency: "MATIC",
  multi_contract_address: "0x21B8e4e76Cde6Defc9ACf0d494069bd5Ea09f973", //done
  platform_contract_address: "0x62C1fbc83AE2d5CF389b11335FDD4cA4558e1CDC", //done
  explorer: "https://polygonscan.com/",
  rpc_url: "https://polygon-rpc.com/",
  contract_address: "0x934EB0dB4f9cC538FFB7C6279F204818C85fbfCa", //done
  block_chain: "Polygon"
}
