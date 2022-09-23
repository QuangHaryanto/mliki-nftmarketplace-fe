import React, { useEffect } from 'react';
import {
	BrowserRouter as Router,
	Link,
	withRouter
  } from "react-router-dom";
  import Popup from 'reactjs-popup';
import {connect} from 'react-redux';
import {actionNotifyUser} from './../../redux/NotifyAction'
import Onboard from 'bnc-onboard'
import {networkConfig} from './../../helper/VVConfig'
import { ethers } from "ethers";
import {loginAPI, getUser, getOptions, getProfileAPI, getSearchListAPI, updateNotificationAPI, getNotificationListAPI} from './../../services/VVUserService'
import { api } from '../../helper/VVApi';
import {addRoyaltyAPI, generateAbiAPI, getApprovalStatus, getRoyaltyStatus, updateCollectionApproval} from '../../services/VVCollectionService'
import { abi } from '../../helper/VVABI';
import {VVSend} from '../../helper/VVSend';
import axios from "axios";
import VVUserModel from '../../models/VVUserModel';
import VVItemModal from '../../models/VVItemModal';
import Loader from "react-loader-spinner";
import { BsFillWalletFill } from "react-icons/bs";
import { copyToClipboard } from '../../hooks/copyHook';
import { toast } from 'react-toastify';
// import { VVAuction } from '../../helper/VVAuction';
import { getItemListAPI } from '../../services/VVItemService';
import { VVPlatformBid } from '../../helper/VVPlatformBid';
import { VVPlatform } from '../../helper/VVPlatform';
import { depositAPI, withdrawAPI } from '../../services/VVItemService';
import NetworkActions from '../../redux/actions/NetworkActions';

const networks = {
	POLYGON: {
	  chainId: `0x${Number(137).toString(16)}`,
	  chainName: "POLYGON",
	  nativeCurrency: {
		name: "MATIC",
		symbol: "MATIC",
		decimals: 18
	  },
	  rpcUrls: ["https://polygon-rpc.com/"],
	  blockExplorerUrls: ["https://polygonscan.com/"]
	},
	OKEX: {
	  chainId: `0x${Number(66).toString(16)}`,
	  chainName: "OKXChain Mainnet",
	  nativeCurrency: {
		name: "OKT",
		symbol: "OKT",
		decimals: 18
	  },
	  rpcUrls: [
		"https://exchainrpc.okex.org"
	  ],
	  blockExplorerUrls: ["https://www.oklink.com/en/okc/"]
	}
  };

class VVHeaderVW extends React.Component {
	constructor(props) {
		super(props);
		localStorage.removeItem("token");
		this.web3Provider = null;
		this.signer = null;
		this.address = null;
		this.wallet = null;
		this.user = null;
		this.admin_commission = 0;
		this.keyword = ""
		this.dropDownRef = React.createRef();
		this.walletRef = React.createRef();
		this.searchDownRef = React.createRef();
		this.cancelTokenSource = null;
		this.timer = null;
		this.wallets = [
		{ 	walletName: "metamask",
			preferred: true },
		{
			walletName: 'walletConnect',
			rpc: {
				[props.config.networkId]: props.config.rpc_url
			}
		},
		{ 
			walletName: "coinbase", preferred: true 
		},
		{
			walletName: "torus" 
		}]
		this.onboard = Onboard({
			dappId: props.config.onboard,       // [String] The API key created by step one above
			networkId: props.config.networkId,  // [Integer] The Ethereum network ID your Dapp uses.
			darkMode: true,
			walletSelect: {
				wallets: this.wallets
			},
			subscriptions: {
				address: address => {
					if(address) {
						this.address = address;
						this.web3Provider = new ethers.providers.Web3Provider(this.wallet.provider)
						this.signer = this.web3Provider.getSigner();
						var params = {
							address: address
						}
						this.loginUser(params)
					} else {
						this.address = null;
						this.web3Provider = null;
						this.signer = null
						this.menuAction("logout");
					}
				},
				wallet: wallet => {
					this.connectWallet(wallet);
				}
			}
		});
		this.depositAuction = this.depositAuction.bind(this)
		this.withdrawAuction = this.withdrawAuction.bind(this)
		this.lockAuction = this.lockAuction.bind(this)
		this.unlockAuction = this.unlockAuction.bind(this)
		this.approveNFT = this.approveNFT.bind(this)
		this.sendOfferPayment = this.sendOfferPayment.bind(this)
		this.sendMoneyToOwner = this.sendMoneyToOwner.bind(this)
		this.mintContract = this.mintContract.bind(this)
		this.approveContract = this.approveContract.bind(this)
		this.state = {
			showSearch : false,
			searchLoading: false,
			showMenu: false,
			showWallet: false,
			showDropDownMenu: false,
			path:'',
			isLoggedIn: false,
			profile_image: '/images/userdefault.jpg',
			user_id: '',
			user_name: '',
			user_balance: '',
			user_addreess: '',
			unlocked_user_balance: 0,
			unlocked_contract_balance: 0,
			is_verfied: false,
			items: [],
			creators: [],
			hasResult: false,
			keywordloading: false,
			keyword: '',
			notificationcount: 0,
			notificationcount_str: '0',
			isOpen: false
		}
	}

	handleOpen = () => {
		this.setState({ isOpen: true });
	  }
	  
	  handleClose = () => {
		this.setState({ isOpen: false });
	  }
	
	
	componentDidMount() {
		this.setState({
			path:this.props.location.pathname
		})
		// this.walletSelect();
		let that = this;
		document.addEventListener("mousedown", (event) => {
			if(that.dropDownRef.current !== null) {
				if(that.dropDownRef.current.contains(event.target)) {
				} else {
					if(this.state.showDropDownMenu) {
						this.setState({
							showDropDownMenu: false
						})
					}
				}
			} else {
				if(this.state.showDropDownMenu) {
					this.setState({
						showDropDownMenu: false
					})
				}
				
			}

			if(that.walletRef.current !== null) {
				if(that.walletRef.current.contains(event.target)) {
				} else {
					if(this.state.showWallet) {
						this.setState({
							showWallet: false
						})
					}
				}
			} else {
				if(this.state.showWallet) {
					this.setState({
						showWallet: false
					})
				}
				
			}

			if(that.searchDownRef.current !== null) {
				if(that.searchDownRef.current.contains(event.target)) {
				} else {
					if(this.state.hasResult) {
						this.keyword = ""
						this.setState({
							items: [],
							creators: [],
							hasResult: false,
							searchloading: false,
							keyword: ""
						})
					}
				}
			} else {
				if(this.state.hasResult) {
					this.keyword = ""
					this.setState({
						items: [],
						creators: [],
						hasResult: false,
						searchloading: false,
						keyword: ""
					})
				}
				
			}

		});
	
	}

	walletSelect = async() => {
		if(localStorage.getItem("wallet")) {
			await this.onboard.walletSelect(localStorage.getItem("wallet"));
			await this.onboard.walletCheck()
		} 
		
	}

	connectWallet = async(wallet) => {
		if(wallet) {
			this.wallet = wallet;
			console.log(wallet);
			localStorage.setItem("wallet",wallet.name)
		} else {
			this.wallet = null;
		}
	}

	componentDidUpdate(prevProps) {
		if (
		this.props.location.pathname !== prevProps.location.pathname
		) {
		window.scrollTo(0, 0);
		this.setState({
			path:this.props.location.pathname
		})
		if(this.user !== null) {
			this.getNotificationList()
		}
		}
		
		if(this.props.notifier !==prevProps.notifier) {
			console.log("header notifier", this.props.notifier);
			if(this.props.notifier.type==="update") {
			this.configureUser();
			}else if(this.props.notifier.type=="addoffer"){
				this.lockAuction(this.props.notifier.payload)
			}else if(this.props.notifier.type=="removeoffer"){
				this.unlockAuction(this.props.notifier.payload)
			}
		}

		let notifier = this.props.notifier;
		if(notifier) {
			if(notifier.type === "create_contract") {
				this.createContract(notifier.payload);
			} else if(notifier.type === "mint_contract") {
				this.mintContract(notifier.payload);
			} else if(notifier.type === "buynft") {
				this.buyNFT(notifier.payload);
			} else if(notifier.type === "switchwallet") {
				this.switchWallet(notifier.payload);
			} else if(notifier.type === "approvenft") {
				this.approveNFT(notifier.payload);
			} else if(notifier.type === "sendoffer") {
				this.sendOfferPayment(notifier.payload);
			} else if(notifier.type === "update_royalty") {
				console.log(notifier.payload);
				this.setRoyalty(notifier.payload, notifier.type)
			} else if(notifier.type === "create_auction") {
				this.createAuction(notifier.payload)
			} else if(notifier.type === "delete_auction") {
				this.deleteAuction(notifier.payload)
			}else if(notifier.type === "deposit") {
				this.depositAuction(notifier.payload)
			}else if(notifier.type === "withdraw") {
				this.withdrawAuction(notifier.payload)
			}
		}
	}

	depositAuction = async (walletInfo) => {
		let that = this;
		try {
			const currentContract = new ethers.Contract(this.props.config.platform_contract_address, VVPlatform, this.signer)
			getOptions("gas_fee").then(optionObj=>{
				let gas_fee = parseInt(optionObj.result.value);
				currentContract.deposit({
					gasLimit: gas_fee * 100000, 
					gasPrice: ethers.utils.parseUnits(gas_fee.toString(), 'gwei'), 
					value: ethers.utils.parseEther(walletInfo.amount.toString())._hex
				}).then((result) => {
					depositAPI({
							user_id: walletInfo.user_id,
							price: walletInfo.amount,
							hash: result.hash
						}).then(response=>{
								if(response.status){
									this.props.actionNotifyUser({
										type: "deposit_success",
									})
									toast(response.message,{
								type: "success",
								toastId: 'successDepositWallet'
								});
								}
						});
				}).catch(error => {
					console.log("error.message ->", 1)
					toast(error.message,{
					type: "Error",
					toastId: 'errorWallet'
					});
				});
			});

		} catch (error) {
			console.log(error);
		toast("Error on Transfer",{
			type: "Error",
			toastId: 'errorWallet'
			});
		}
	}

	withdrawAuction = async (walletInfo) => {
		let that = this;
		try {
			const currentContract = new ethers.Contract(this.props.config.platform_contract_address, VVPlatform, this.signer)
			getOptions("gas_fee").then(optionObj=>{
				let gas_fee = parseInt(optionObj.result.value);
				currentContract.withdraw(walletInfo.wallet, ethers.utils.parseEther(walletInfo.amount.toString())._hex,{
					gasLimit: gas_fee * 100000, 
					gasPrice: ethers.utils.parseUnits(gas_fee.toString(), 'gwei'), 
				}).then((result) => {
					withdrawAPI({
							user_id: walletInfo.user_id,
							price: walletInfo.amount,
							hash: result.hash
						}).then(response=>{
								if(response.status){
									this.props.actionNotifyUser({
									type: "withdraw_success",
									})
									toast(response.message,{
								type: "success",
								toastId: 'successWithdrawWallet'
							});
								}
						});
			}).catch(error => {
				console.log("error.message ->", 2)
				toast(error.message,{
					type: "Error",
					toastId: 'errorWallet'
				});
			});
			});

		} catch (error) {
		toast("Error on Transfer",{
			type: "Error",
			toastId: 'errorWallet'
			});
		}
	}

	lockAuction = async (walletInfo) => {
		// console.log('datawallet',walletInfo.item.blockchain)
		let that = this;
		// if (walletInfo.item.blockchain != this.props.config.block_chain) {
			
			

		// 	await this.handleNetworkSwitch(walletInfo.item.blockchain)
			
		// }
		try {
			console.log(walletInfo);
			const currentContract = new ethers.Contract(this.props.config.platform_contract_address, VVPlatformBid, this.signer)
			getOptions("gas_fee").then(optionObj=>{
				let gas_fee = parseInt(optionObj.result.value);
				currentContract.lockBid({
					gasLimit: gas_fee * 100000, 
					gasPrice: ethers.utils.parseUnits(gas_fee.toString(), 'gwei'), 
					value:ethers.utils.parseEther(walletInfo.amount.toString())._hex
				}).then((result) => {
						this.props.actionNotifyUser({
							type: "offersuccess",
						})
				}).catch(error => {
					var message;
					if(typeof error.data?.message!='undefined'){
						message = error.data.message;
					}else{
						message = error.message;
					}
					if (message.includes('insufficient funds')) {
						message = "Balance Not Enough";
					}			
					toast(message,{
					type: "Error",
					toastId: 'errorWallet'
					});
					this.props.actionNotifyUser({
						type: "offerfail",
					})
				});
			});


		} catch (error) {
			toast("Error on Transfer",{
			type: "Error",
			toastId: 'errorWallet'
			});
			this.props.actionNotifyUser({
				type: "offerfail",
			})
		}
	
	}

	unlockAuction = async (walletInfo) => {
		let that = this;
		try {
			const currentContract = new ethers.Contract(this.props.config.platform_contract_address, VVPlatformBid, this.signer)
			getOptions("gas_fee").then(optionObj=>{
				let gas_fee = parseInt(optionObj.result.value);
				currentContract.unlockBid(walletInfo.wallet, ethers.utils.parseEther(walletInfo.amount.toString())._hex,{
					gasLimit: gas_fee * 100000, 
					gasPrice: ethers.utils.parseUnits(gas_fee.toString(), 'gwei'), 
				}).then((result) => {
						this.props.actionNotifyUser({
							type: "removeoffersuccess",
							items: walletInfo.item
						})
				}).catch(error => {
					var message;
					if(typeof error.data?.message!='undefined'){
						message = error.data.message;
					}else{
						message = error.message;
					}
					toast(message,{
					type: "Error",
					toastId: 'errorWallet'
					});
					this.props.actionNotifyUser({
						type: "offerfail",
					})
			});
			});

		} catch (error) {
		toast("Error on Remove Offer",{
			type: "Error",
			toastId: 'errorWallet',
			items: walletInfo.item
			});
			this.props.actionNotifyUser({
				type: "offerfail",
			})
		}
	}

	createAuction = (auctionInfo) => {
		var admin_commission = 0;
		var platform_comission = 0;
		var artist = "";
		getOptions("admin_commission").then(result=>{
			admin_commission = result.result.value;
			getItemListAPI({
				page: 1,
				item_id: auctionInfo.item_id,
				type: "view"
			}).then(result=>{
				var itemInfo = result.data.docs[0];
				platform_comission = itemInfo.collection_id.royalties;
				getProfileAPI(itemInfo.collection_id.author_id).then(artistInfo=>{
					console.log(auctionInfo._id);
					console.log(auctionInfo.min_offer);
					console.log(auctionInfo.offer_duration)
					console.log(platform_comission)
					console.log(admin_commission)
					console.log(artistInfo.result.public_key)


				})
			})
		});
	}

	deleteAuction = (auctionInfo) => {
		// const currentContract = new ethers.Contract(this.props.config.auction_address, VVAuction, this.signer)
		// currentContract.updateAuction(auctionInfo._id, ethers.utils.parseEther(auctionInfo.min_offer.toString())._hex, 0).then((result) => {
		// 	this.props.actionNotifyUser({
		// 		type: "delete_auction_success"
		// 	})
		// }).catch((error) => {
		// 	this.props.actionNotifyUser({
		// 		type: "delete_auction_fail"
		// 	})
		// })
	}

	approveNFT = (itemInfo) => {
		let that = this;
		this.approveContract(this.props.config.contract_address,function(approveResult){
			if(approveResult.status == true) {
			updateCollectionApproval({
				collection_id: itemInfo.collection_id._id
			}).then(result=>{
				this.props.actionNotifyUser({
					type: "approvesuccess",
				})
			})
			} else {
				this.props.actionNotifyUser({
					type: "approvefail",
				})
			}
		})
	}

	sendOfferPayment = (payload) => {
		const addressArray = [];
		const priceArray = [];
		addressArray.push(this.props.config.main_address);
		priceArray.push(ethers.utils.parseEther("100")._hex)
		let that  = this
		this.sendMoneyToOwner(addressArray,priceArray,ethers.utils.parseEther(payload.price.toString())._hex,function(transactionResult){
			if(transactionResult.status == true) {
				this.props.actionNotifyUser({
				type: "sendoffersuccess",
			})
			} else {
			this.props.actionNotifyUser({
				type: "sendofferfail",
			})
			}
		})
	}

	LoginAction2 = async (networkName) => {
		await this.props.setNetworkName(networkName)
		await this.onboard.walletReset();
		await this.onboard.walletSelect();
		await this.onboard.walletCheck();
	}

	ReadyToTransact = async () => {
		await this.onboard.walletCheck()
	}

	
// returns a Promise that:
// resolves with true if user is ready to transact
// resolves with false if user exited before completing all wallet checks

LoginAction2 = async (networkName) => {
	await this.props.setNetworkName(networkName)
	console.log('DATA-->>',networkName)
	console.log('data',this.props.config)
	await this.onboard.walletReset();
	await this.onboard.walletSelect();
	await this.onboard.walletCheck();
}
changeNetwork = async ({ networkName, setError }) => {
	
	
	//   if (!window.ethereum) throw new Error("No crypto wallet found");
	// //   await window.ethereum.request({
	// // 	method: "wallet_addEthereumChain",
	// // 	params: [
	// // 	  {
	// // 		...networks[networkName]
	// // 	  }
	// // 	]
	// //   });
	// await window.ethereum
    // .request({ method: 'wallet_addEthereumChain', params: [
	// 	{
	// 	  ...networks[networkName]
	// 	}
	//   ] })
    // .then()
	// console.log('Success')
	// await this.props.setNetworkName(networkName)

	// await this.onboard.walletReset()
	// await this.onboard.walletSelect()
	// // await this.onboard.walletCheck();
    // .catch((error) => {
	// 	console.log('Error',error);
    //   if (error.code === 4001) {
    //     // EIP-1193 userRejectedRequest error
    //     console.log('Please connect to MetaMask.');
    //   } else {
    //     console.error(error);
    //   }
    // });


	// console.log('data', ({
	// 	...networks[networkName] }.chainId
	//   ) )
	// try {
	// 	await window.ethereum.request({
			
	// 	  method: 'wallet_switchEthereumChain',
	// 	  params: [
	// 		{
	// 		  chainId: ({ ...networks[networkName]}.chainId)
	// 		}
	// 	  ]
	// 	});
	// 	then ((success)){

	// 	}
	//   } catch (switchError) {
	// 	console.log('ERROR1',switchError);
	// 	// This error code indicates that the chain has not been added to MetaMask.
	// 	if (switchError.code !== 4001) {
	// 		console.log('ERROR00');
	// 	  try {
	// 		await window.ethereum.request({
	// 		  method: 'wallet_addEthereumChain',
	// 		  params: [
	// 			{
	// 			  ...networks[networkName]
	// 			}
	// 		  ]
	// 		});
	// 		await this.props.setNetworkName(networkName)

	// 		await this.onboard.walletReset()
	// 		await this.onboard.walletSelect()
	// 		// await this.onboard.walletCheck();
	// 	  } catch (addError) {
	// 		// handle "add" error
	// 		console.log('ERROR2');
	// 	  }
	// 	  console.log('ERROR3');
	// 	}
	// 	// handle other "switch" errors
	//   }
	//   console.log('test2');

	await window.ethereum
  .request({
    method: 'wallet_switchEthereumChain',
		  params: [
			{
			  chainId: ({ ...networks[networkName]}.chainId)
			}
		  ]
  })
  .then (async(success) => {
    if (success) {
      console.log('FOO successfully added to wallet!');
    } else {
      await this.props.setNetworkName(networkName)

	await this.onboard.walletReset()
	await this.onboard.walletSelect()
	// await this.onboard.walletCheck();
    }
  })
  .catch(async (error) => {
	if (error.code === 4902) {
		console.log('FOO successfully added to wallet!');
		try {
		await window.ethereum.request({
			method: 'wallet_addEthereumChain',
			params: [
			{
				...networks[networkName]
			}
			]
		});
		await this.props.setNetworkName(networkName)

		await this.onboard.walletReset()
		await this.onboard.walletSelect()
		// await this.onboard.walletCheck();
		} catch (addError) {
		// handle "add" error
		}
	  } else {
		
	  }
  })
	  
  

	

  };


	handleNetworkSwitch = async (networkName) => {
		this.setState({ isOpen: false });
		await this.changeNetwork({ networkName });
	};

	handleNetworkColection = async (networkName) => {
		await this.handleNetworkSwitch('polygon')
	};

	switchWallet = async (itemInfo, networkName) => {
		let notifier = this.props.notifier;
		let that = this
		that.props.actionNotifyUser({
			type: "switchnetwork",
		})
		 await this.handleNetworkSwitch(itemInfo.blockchain)

		//  this.buyNFT(notifier.payload);
	}



	buyNFT = async (itemInfo, networkName) => {

			var admin_commission = 0;
			var authorInfo;
			getOptions("admin_commission").then(result=>{
				getProfileAPI(itemInfo.author_id).then(result1=>{
					admin_commission = result.result.value;
					authorInfo = result1.result;
					const addressArray = [];
					const priceArray = [];
					var originalPrice = itemInfo.price;
					var admin_royalties = parseFloat(originalPrice) * (parseFloat(admin_commission)/100);
					var finalPrice = 0;
					if(itemInfo.author_id == itemInfo.current_owner._id || itemInfo.author_id == this.state.user_id) {
					finalPrice = originalPrice - admin_royalties;
					addressArray.push(itemInfo.current_owner.public_key);
					priceArray.push(ethers.utils.parseEther(finalPrice.toString())._hex)
					} else {
					var royalties = parseFloat(originalPrice) * (parseFloat(itemInfo.collection_id.royalties)/100);
					finalPrice = originalPrice - (royalties + admin_royalties);
				
					addressArray.push(itemInfo.current_owner.public_key);
					priceArray.push(ethers.utils.parseEther(finalPrice.toString())._hex)
				
					addressArray.push(authorInfo.public_key);
					priceArray.push(ethers.utils.parseEther(royalties.toString())._hex)
					}
					addressArray.push(this.props.config.main_address);
					priceArray.push(ethers.utils.parseEther(admin_royalties.toFixed(8).toString())._hex)
	
	
					let that = this;
					this.approveContract(this.props.config.contract_address,function(approveResult){
						if(approveResult.status == true) {
						updateCollectionApproval({
							collection_id: itemInfo.collection_id._id
						}).then(result=>{
						})
						}
						that.sendMoneyToOwner(addressArray,priceArray,ethers.utils.parseEther(originalPrice.toString())._hex,function(transactionResult){
							if(transactionResult.status == true) {
							that.getTransactionPayment(transactionResult.result.hash)
							} else {
							that.props.actionNotifyUser({
								type: "buyfail",
							})
							}
						})
					})
				})
			})
		
			
		
		
	}

	sendMoneyToOwner = (addressArray, priceArray, priceValue, callback) => {
		const currentContract = new ethers.Contract(this.props.config.multi_contract_address, VVSend, this.signer)
		getOptions("gas_fee").then(optionObj=>{
			let gas_fee = parseInt(optionObj.result.value);
			currentContract.sendPayment(addressArray, priceArray,{
				gasLimit: gas_fee * 100000, 
				gasPrice: ethers.utils.parseUnits(gas_fee.toString(), 'gwei'), 
				value: priceValue
			}).then((result) => {
				var resulter = {
				status: true, 
				result: result,
				message: 'money send successful'
				}
				callback(resulter);
			}).catch((error) => {
				console.log(error);
				var resulter = {
				status: false,
				message: 'money failed send'
				}
				callback(resulter)
			})
		})

	}

	mintContract = async (payload) => {
		let that = this;
		this.approveContract(this.props.config.contract_address,function(approveResult){
			if(approveResult.status === true) {
				getOptions("gas_fee").then(optionObj=>{
					let gas_fee = parseInt(optionObj.result.value);
					if(payload.is_type){
						var tokenId = [];
						var amount = [];
						var tokenUri = [];
						var systemId = payload.token_id;
						for (let i = 0; i < payload.no_of_copies; i++) {
							tokenId.push(payload.token_id++);
							amount.push(1);
							tokenUri.push(payload.ipfs_cid);
						}
						console.log(tokenId);
						console.log(amount);
						const currentContract = new ethers.Contract(that.props.config.contract_address, abi, that.signer)
						currentContract.mintNft(that.address, amount, tokenUri, "0x00",{
							gasLimit: gas_fee * 100000, 
							gasPrice: ethers.utils.parseUnits(gas_fee.toString(), 'gwei'), 
						}).then((result) => {
							that.getTransactionToken(result.hash)
						}).catch((error) => {
							this.props.actionNotifyUser({
								type: "mintfailed",
							})
							this.props.actionNotifyUser({})
						})
					}else{
						const currentContract = new ethers.Contract(that.props.config.contract_address, abi, that.signer)
						currentContract.mintNft(that.address, [1], [payload.ipfs_cid], "0x00",{
							gasLimit: gas_fee * 100000, 
							gasPrice: ethers.utils.parseUnits(gas_fee.toString(), 'gwei'), 
						}).then((result) => {
							that.getTransactionToken(result.hash)
						}).catch((error) => {
							that.props.actionNotifyUser({
								type: "mintfailed",
							})
							that.props.actionNotifyUser({})
						})
					}
				})
			} else {
				that.props.actionNotifyUser({
					type: "mintfailed",
				})
				that.props.actionNotifyUser({})
			}
		});

	}

	/**
	* This is the function which used to track for token id 
	*/
	getTransactionToken = (hash) => {
		let that = this;
		setTimeout(() => {
			that.web3Provider.send( 'eth_getTransactionReceipt', [hash] ).then((tresult) => {
				if (tresult != null) {
				var resulter = {
					status: true,
					result: tresult.logs.slice(-1)[0].topics[2],
					message: 'mint created successfully'
				}
				that.parseTokenResult(resulter,hash)
				} else {
					var result = {
						status: false,
						message: 'mint created failed'
					}
					that.parseTokenResult(result,hash)
				}
			}).catch((error) => {
				console.log(error);
				var resulter = {
				status: false,
				message: 'minted failed'
				}
				that.parseTokenResult(resulter,hash)
			})
		},2000)
	}

	/**
	 * This is the function which used to track for token id on loop
	 */
	parseTokenResult = (result, transaction_hash) => {
		if (result.status == false) {
			this.getTransactionToken(transaction_hash);
		} else {
			this.props.actionNotifyUser({
				type: "mintsuccess",
				payload: {
					token: result.result,
					hash: transaction_hash,
				}
			})
			this.props.actionNotifyUser({})
		}
	}

	createContract = (collectionDetails) => {
		generateAbiAPI({
			name: collectionDetails.name,
			symbol: collectionDetails.contract_symbol
		}).then(generateresult=>{
			if(generateresult.status === true) {
				console.log("generate abi success")
				this.web3Provider.send('eth_sendTransaction', [{
					from: this.address,
					data: generateresult.result
				}]
				).then((result) => {
				this.getTransactionContract(result)
				}).catch((error) => {
					this.props.actionNotifyUser({
						type: "contractfail",
						payload: collectionDetails
					})
				})
			} else {
				this.props.actionNotifyUser({
					type: "contractfail",
					payload: collectionDetails
				})
			}
		})
	}

	approveContract = (contract_address, callback) => {
		const currentContract = new ethers.Contract(contract_address, abi, this.signer)
		currentContract.isApprovedForAll(this.address,this.props.config.main_address).then((isApproved) => {
		if(isApproved) {
			var resulter = {
			status: true,
			result: isApproved,
			message: 'approve success'
			}
			callback(resulter);
		} else {
			getOptions("gas_fee").then(optionObj=>{
				let gas_fee = parseInt(optionObj.result.value);
				currentContract.setApprovalForAll(this.props.config.main_address, true,{
					gasLimit: gas_fee * 100000, 
					gasPrice: ethers.utils.parseUnits(gas_fee.toString(), 'gwei'), 
				}).then((result) => {
					var resulter = {
					status: true,
					result: result,
					message: 'approve success'
					}
					callback(resulter);
				}).catch((error) => {
					console.log(error);
					var resulter = {
					status: false,
					message: 'approve failed'
					}
					callback(resulter)
				})
			});

		}
		}).catch((error) => {
			console.log(error);
			var resulter = {
			status: false,
			message: 'approve failed'
			}
			callback(resulter)
		})
	}

	/**
	 * This is the function which used to track for contract address completion
	 */
	getTransactionContract = (hash) => {
		let that = this;
		setTimeout(() => {
			that.getTransactionConract(hash, function (result) {
			that.parseContractResult(result, hash);
			})
		}, 2000);

	}

	getTransactionConract = (hash, callback) => {
		this.web3Provider.send( 'eth_getTransactionReceipt', [hash] ).then((tresult) => {
			console.log("transaction receipt ", tresult);
			if (tresult != null) {
			var resulter = {
				status: true,
				result: tresult.contractAddress,
				message: 'mint created successfully'
			}
			callback(resulter)
			} else {
			var result = {
				status: false,
				message: 'mint created failed'
			}
			callback(result)
			}
		}).catch((error) => {
			console.log(error);
			var resulter = {
			status: false,
			message: 'minted failed'
			}
			callback(resulter)
		})
	}

	/**
	 * This is the function which used to track for token id on loop
	 */
	parseContractResult = (result, hash) => {
	if (result.status == false) {
		this.getTransactionContract(hash);
	} else {
		let that = this
		that.approveMetaMaskContract(result.result)
	}
	}
		
	/**
	 * This is the function which used to create contract through meta mask
	 */
	approveMetaMaskContract = (contract_address) => {
	let that = this;
	this.approveContract(contract_address,function(approveResult){
		if(approveResult.status == true) {
			this.props.actionNotifyUser({
				type: "contractsuccess",
				payload: {
					contract_address : contract_address
				}
			})
		} else {
			this.props.actionNotifyUser({
				type: "contractfail",
				payload: {}
			})
		}
	});
	}

	showSearch = (status) => {
		this.setState({
		showSearch: status
		});
	}

	searchByKeyword = () => {

	}

	showMenu = () => {
		this.setState({
		showMenu: this.state.showMenu ? false : true
		});
	}

	showDropDownMenu = () => {
		this.setState({
			showDropDownMenu: this.state.showDropDownMenu ? false : true
		});
	}

	LoginAction = async (networkName) => {
		await this.props.setNetworkName(networkName)
		await this.onboard.walletReset();
		await this.onboard.walletSelect();
		await this.onboard.walletCheck();
	}

	menuAction = (type) => {
		this.setState({
			showDropDownMenu: false
		});
		if(type == "logout") {
				localStorage.removeItem("wallet");
				localStorage.removeItem("token");
				this.setState({
					isLoggedIn : false
				})
				// this.props.history.push("/");
			} else if (type === "profile") {
				this.props.history.push("/profile/"+ this.state.user_id)
			} else if (type === "mycollection") {
				this.props.history.push("/profile/"+ this.state.user_id + "/collection")
			} else if (type === "settings") {
				this.props.history.push("/profile/"+ this.state.user_id + "/settings")
			} else if (type === "notification") {
				this.props.history.push("/profile/"+ this.state.user_id + "/notification")
				this.resetNotificationCount();
			} else if (type == "wallet") {
				this.setState({
					showWallet: this.state.showWallet ? false : true
				});
			} else if (type === "import") {
				this.props.history.push("/import-item");
			}else if (type === "user-wallet") {
				this.props.history.push("/wallet");
			}
	}

	loginUser = (params) => {
		loginAPI(params).then(result=>{
			if(result.status == true) {
				localStorage.setItem("token",result.token);
				this.setState({
					isLoggedIn : true
				})
				this.configureUser();
				
			}
		})
	}

	configureUser = async() => {
		const balance = await this.web3Provider.getBalance(this.address)
		this.user = getUser();
		if(this.user !== null) {
			let username = "";
			if(this.user.first_name.length!==0) {
			username = this.user.first_name + " " + this.user.last_name;
			} else {
			username = this.user.username
			}
			let profile_image = "/images/userdefault.jpg";
			if(this.user.profile_image.length!==0) {
				let thumbArray = this.user.profile_image
				profile_image = thumbArray
			}
			let userbalance = ethers.utils.formatEther(balance)
			if (userbalance !== '' && !userbalance.match(/^\d+(\.\d{1,6})?$/)) {
			userbalance = parseFloat(userbalance).toFixed(6)
		}
			this.setState({
				user_name: username,
				profile_image: profile_image,
				user_balance: userbalance,
				user_addreess: this.address,
				is_verfied: this.user.is_verified,
				user_id: this.user.user_id
			})
			this.props.actionNotifyUser({
				type: 'login',
				payload:this.user
			})
			this.getNotificationList()
		}
	}

	getNotificationList = () => {
		getNotificationListAPI({
			page: 1
		}).then(result=>{
			let counter = result.return_id;
			this.setState({
				notificationcount: counter,
				notificationcount_str : counter > 9 ? "9+" : counter.toString()
			})
		})
	}

	resetNotificationCount = () => {
		updateNotificationAPI().then(result=>{
			this.setState({
			notificationcount: 0,
			notificationcount_str : '0'
			})
		})
	}

	changeKeyword = (e) => {
		if(this.timer) {
			clearInterval(this.timer)
			this.timer = null
		}
		let search_text = e.target.value;
		this.setState({
			creators: [],
			items: [],
			searchloading: true,
			hasResult: false,
			keyword: e.target.value,
		});
		this.keyword = search_text;
		if(this.cancelTokenSource) {
		this.cancelTokenSource.cancel();
		}
		if(search_text.trim().length<3) {
			this.setState({
			keywordloading: false
			})
			return
		}
		
		this.setState({
			keywordloading: true
		})
		let that = this;
		this.timer = setInterval(() => {
			that.activateSearch()
		}, 2000);
		
	}

	activateSearch = () => {
		if(this.timer) {
		clearInterval(this.timer)
		this.timer = null
		}
		this.searchAPIAction(this.keyword)
	}
	
	searchAPIAction = (keyword) => {
		var params = {
		keyword: keyword,
		};
		if(this.user !== null) {
		params["user_id"] = this.user.user_id
		}
		this.cancelTokenSource = axios.CancelToken.source();
		getSearchListAPI(params, this.cancelTokenSource).then(result=>{
		if(result.status === true) {
			this.cancelTokenSource = null;
			var tempArray = VVUserModel.parseSellerList(result.creators.docs);
			var tempArray1 = [];
			if(result.items) {
				tempArray1 = VVItemModal.parseItemList(result.items)
			}
			this.setState({
			searchloading: false,
			keywordloading: false,
			hasResult: (tempArray.length>0 || tempArray1.length>0) ? true : false,
			creators: tempArray,
			items: tempArray1
			})
		}
		})
	}

	searchNavigate = (item,type) => {
		if(this.timer) {
			clearInterval(this.timer)
			this.timer = null
		}
		if(type === "user") {
			this.props.history.push("/profile/"+ item.user_id)
		} else {
			this.props.history.push("/item/"+ item.item_id)
		}
		this.setState({
			creators: [],
			items: [],
			searchloading: false,
			hasResult: false,
			keyword:'',
		});
	}

	copyAddress() {
		copyToClipboard(this.state.user_addreess);
		toast("Address copied",{
		type: "success"
		});
	}

	getAuctionAmount = () => {
		// const currentContract = new ethers.Contract(this.props.config.auction_address, VVAuction, this.signer)
		// currentContract.getUserBalance().then((user_balance) => {
			
		// }).catch((error) => {
			
		// })
	}

	addFund = () => {

	}

	getTransactionPayment = (hash) => {
		let that = this;
		setTimeout(() => {
			that.getTransactionPaymentReceipt(hash, function (result) {
				that.parsePaymentResult(result, hash);
			})
		}, 3000);
	}

	getTransactionPaymentReceipt = (hash, callback) => {
			this.web3Provider.send( 'eth_getTransactionReceipt', [hash] ).then((tresult) => {
				console.log("transaction receipt ", tresult);
				if (tresult != null) {
					var resulter = {
						status: true,
						result: tresult,
						message: 'payment confirmed successfully'
					}
					callback(resulter)
				} else {
					var result = {
						status: false,
						message: 'payment not confirmed'
					}
					callback(result)
				}
			}).catch((error) => {
				console.log(error);
				var resulter = {
				status: false,
				message: 'minted failed'
				}
				callback(resulter)
			})
	}

	parsePaymentResult = (result, hash) => {
		if (result.status == false) {
			this.getTransactionPayment(hash);
		} else {
			if(result.result.status === "0x1") {
				this.props.actionNotifyUser({
					type: "buysuccess",
				})
			} else {
				this.props.actionNotifyUser({
					type: "buyfail",
				})
			}
		}
	}

	render() {
		return (
		<div>
		  <header className="header__1">
			<div className="container">
			  <div className="wrapper js-header-wrapper">
				<div className="avatars space-x-10">
					<Link to="/">
						<img src={`/assets/img/logos/mliki white (1).png`} alt="Avatar" class=" avatar-md" width={80} />
					</Link>
				</div>
				<div className="header__menu">
				  <ul className="d-flex space-x-20">
							<li>
								<Link to="/" className={"" + (this.state.path == "/" ? 'color_brand' : 'color_white')}>Home</Link>
							</li>
							<li>
								<Link to="/marketplace" className={"" + (this.state.path == "/marketplace" ? 'color_brand' : 'color_white')}>Marketplace</Link>
							</li>
							<li>
								<Link to="/activity" className={"" + (this.state.path == "/activity" ? 'color_brand' : 'color_white')}>Activity</Link>
							</li>
							<li>
								<Link to="/creators" className={"" + (this.state.path == "/creators" ? 'color_brand' : 'color_white')}>Creators</Link>
							</li>
				  </ul>
				</div>
	
				<div className="header__search" ref={this.searchDownRef}>
					<input type="text" placeholder="Search items, collections, and creators" onChange={this.changeKeyword} value={this.state.keyword} />
					{!this.state.keywordloading &&
					   <button type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z"/></svg></button>
					}
					{this.state.keywordloading &&
						<button type="button">
							<Loader
								type="Puff"
								color="#6164ff"
								height={20}
								width={20}
							/>
						</button>
					}
				  { (this.state.hasResult && !this.state.searchloading) &&
							<div class="search_result">
								{ this.state.items.length>0  &&
									<div class="search_result_item">
										<h6 class="color_white">Items</h6>
										<ul>
										{this.state.items.map((item, index) => (
											<li>
												<div class="search_result_left"><a href="javascript:void(0)" onClick={()=>{this.searchNavigate(item,"item")}}><img src={item.thumb} alt="" /></a> </div>
												<div class="search_result_right"><a href="javascript:void(0)" onClick={()=>{this.searchNavigate(item,"item")}}>{item.name}</a></div>
											</li>
										))}
										</ul>
									</div>
								}
								{ this.state.creators.length>0 &&
									<div class="search_result_user">
									<h6>Creators</h6>
									<ul>
									{this.state.creators.map((item, index) => (
										<li>
											<div class="search_result_left"><a href="javascript:void(0)" onClick={()=>{this.searchNavigate(item,"user")}}><img src={item.profile_image} alt="" /></a></div>
											<div class="search_result_right"><a href="javascript:void(0)" onClick={()=>{this.searchNavigate(item,"user")}}>{item.fullname}</a></div>
										</li>
									))}
									</ul>
									</div>
								}
							</div>
						}
				</div>
	
	
					
					<div className="space-x-20 d-flex flex-column flex-md-row sm:space-y-20">
						<div className='header__actions'>
	
						{ !this.state.isLoggedIn &&
							<Popup
							on='click'
										open={this.state.isOpen}
										onOpen={this.handleOpen}
								className="custom"
								ref={this.ref}
								trigger={
									<a className="btn btn-white" >
										<i className="ri-wallet-3-line" /> Connect wallet
									</a>
								}
								position="bottom center">
								<div>
								<div
									className="popup"
									id="popup_bid"
									tabIndex={-1}
									role="dialog"
									aria-hidden="true">
									<div>
									<button
										onClick={this.handleClose}
										
										type="button"
										className="button close"
										data-dismiss="modal"
										aria-label="Close"
										>
										<span aria-hidden="true">×</span>
									</button>
	
									<div className="space-y-20">
										<h3 className="text-center">Please Select Your Network</h3>
										<p className="text-center">
										Choose how you want to connect. There are several wallet providers.
										</p>
										<div className="d-flex justify-content-center space-x-20">
										{/* <Link className="btn btn-dark" onClick={()=>this.LoginAction('polygon')} href="javascript:void(0)">
											POLYGON
										</Link>
										<Link className="btn btn-dark" onClick={()=>this.LoginAction('bsc')} href="javascript:void(0)">
											OKEX
										</Link> */}

										<Link className="btn btn-dark" onClick={()=>this.handleNetworkSwitch('POLYGON')} href="javascript:void(0)" data-dismiss="modal">
											POLYGON
										</Link>
										<Link className="btn btn-dark" onClick={()=>this.handleNetworkSwitch('OKEX')} href="javascript:void(0)">
											OKC
										</Link>
										
										</div>
									</div>
									</div>
								</div>
								</div>
							</Popup>
						}
	
						{ this.state.isLoggedIn &&
										<div ref={this.dropDownRef} className="header__action header__action--profile">
											
										<a className={"header__profile-btn "+ (this.state.is_verfied === true ? "header__profile-btn--verified" : "")} href="javascript:void(0)" role="button" id="dropdownMenuProfile" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={()=>{
							this.showDropDownMenu()
						}}>                 
											<div class="menu_profile_image">
												<img src={this.state.profile_image} alt="" />
												{this.state.notificationcount > 0 &&
													<span>{this.state.notificationcount_str}</span>
												}
												
											</div>
											
											<div><p>{this.state.user_name}</p>
											<span>{this.state.user_balance} {this.props.config.currency}  </span></div>
											{ !this.state.showDropDownMenu &&
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
													<path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
												</svg>
											}
											{ this.state.showDropDownMenu &&
												<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
													<path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
												</svg>
											}
																	</a>
					
										<ul className={"dropdown-menu header__profile-menu " + (this.state.showDropDownMenu ? "show" : "") }aria-labelledby="dropdownMenuProfile">
											<li><a href="javascript:void(0)" onClick={()=>{
							this.menuAction('profile')
						}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1,1,0,0,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1A10,10,0,0,0,15.71,12.71ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z"/></svg> <span>Profile</span></a></li>
	
					<li><a href="javascript:void(0)" onClick={()=>{
							this.menuAction('notification')
						}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bell" viewBox="0 0 16 16">
						<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
					</svg> <span>Notifications</span>
					{this.state.notificationcount > 0 &&
													<div className='badge'>{this.state.notificationcount_str}</div>
												}
					</a></li>			
					<li><a href="javascript:void(0)" onClick={()=>{
							this.menuAction('logout')
						}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4,12a1,1,0,0,0,1,1h7.59l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H5A1,1,0,0,0,4,12ZM17,2H7A3,3,0,0,0,4,5V8A1,1,0,0,0,6,8V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v3a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V5A3,3,0,0,0,17,2Z"/></svg> <span>Sign out</span></a></li>
										</ul>
									</div>
						}
						</div>
	
					</div>
	
					<div className="header__burger js-header-burger" onClick={this.showMenu}/>
	
					<div className={` header__mobile js-header-mobile  ${this.state.showMenu ? 'visible': null} `}>
						<div className="header__mobile__menu space-y-40">
							<ul className="d-flex space-y-20">
								<li>
									<Link to="/" className={"" + (this.state.path == "/" ? 'color_brand' : 'color_black')} onClick={this.showMenu}>Home</Link>
								</li>
								<li>
									<Link to="/marketplace" className={"" + (this.state.path == "/marketplace" ? 'color_brand' : 'color_black')} onClick={this.showMenu}>Marketplace</Link>
								</li>
								<li>
									<Link to="/activity" className={"" + (this.state.path == "/activity" ? 'color_brand' : 'color_black')} onClick={this.showMenu}>Activity</Link>
								</li>
								<li>
									<Link to="/creators" className={"" + (this.state.path == "/creators" ? 'color_brand' : 'color_black')} onClick={this.showMenu}>Creators</Link>
								</li>
							</ul>
						</div>
					</div>
	
				</div>
			</div>
		  </header>
		</div>
	
	
	
	
		);
	  }
	}
	
	function mapStateToProps(state) {
		const config = networkConfig[state.paymentnetwork.networkName]
		return {
		  notifier: state.notifier,
		  config
		};
	}
	function mapDispatchToProps(dispatch) {
		return {
			setNetworkName: data => dispatch(NetworkActions.changeNetwork(data)),
			actionNotifyUser: data => dispatch(actionNotifyUser(data))
			
		};
	}
	
	export default connect(mapStateToProps,mapDispatchToProps)(withRouter(VVHeaderVW))
