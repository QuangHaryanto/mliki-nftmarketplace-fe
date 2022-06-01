import { ethers } from 'ethers'

class UncheckedJsonRpcSigner extends ethers.Signer {
  constructor(signer) {
    super()
    ethers.utils.defineReadOnly(this, 'signer', signer)
    ethers.utils.defineReadOnly(this, 'provider', signer.provider)
  }

  getAddress() {
    return this.signer.getAddress()
  }
}

function getSigner(provider) {
  return new UncheckedJsonRpcSigner(provider.getSigner())
}

export default getSigner