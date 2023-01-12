import Vue from 'vue'
import Web3 from 'web3'
import abi from "./abi.json";
import config from "./config"
import utils from "./utils"

const install = () => {

	/** change wallet address **/
	Vue.prototype.$changeWalletAddress = (callBack) => {
		if (window.ethereum) {
			ethereum.on("accountsChanged", (accounts) => {
				
				callBack(accounts[0]);
			});
		}
	}

	/** change wallet network **/
	Vue.prototype.$changeNetwork = (callBack) => {
		if (window.ethereum) {
			ethereum.on("networkChanged", (networkIDstring) => {
				callBack(networkIDstring);
			});
		}
	}

	/** switch network **/
	Vue.prototype.$switchNetwork = async (callBack) => {
		try {
			await (window.ethereum).request({
				method: 'wallet_switchEthereumChain',
				params: [{
					chainId: config.defaultChainId
				}]
			})
			callBack("success")
		} catch (e) {
			callBack("error")
		}
	}

	/* Web3 isConnected */
	Vue.prototype.$isConnected = async () => {
		if (window.ethereum) {
			// console.log("ethereum.isConnected:", window.ethereum.isConnected());
			const res = await window.ethereum.request({
				method: "eth_requestAccounts"
			})
			return res[0] != null;
		}
		return false;
	}

	/* Web3 is network */
	Vue.prototype.$isNetwork = async () => {
		if (window.ethereum) {
			const chainId = await ethereum.request({
				method: 'eth_chainId'
			});
			return config.networkChainIdList.includes(chainId);
		}
		return false;
	}
	
	/* disconnect */
	Vue.prototype.$disconnect = async () => {
		localStorage.setItem("disconnect", true);
	}

	/* check connected and network */
	Vue.prototype.$checkConnectedAndNetwork = async () => {
		if (window.ethereum) {
			if (ethereum.isMetaMask != true || ethereum.isBraveWallet)
			    return false;
			const chainId = await ethereum.request({
				method: 'eth_chainId'
			});

			

            //const address = window.ethereum.selectedAddress;
			const res = await window.ethereum.request({
				method: "eth_accounts"
			})
            let address = res[0]
			
			
			if (localStorage.getItem("disconnect")) {
				address = null;
			}
			
			return {
				network: config.networkChainIdList.includes(chainId),
				connected: address != null
			};
		}
		return false;
	}

	/* Web3 chainId */
	Vue.prototype.$getChainId = async () => {
		if (window.ethereum) {
			const chainId = await ethereum.request({
				method: 'eth_chainId'
			});
			return chainId;
		}
		return false;
	}

	/* Get wallet address */
	Vue.prototype.$getWalletAddress = async () => {
        Vue.prototype.$address = ""
		localStorage.removeItem("disconnect");
		if (window.ethereum) {
			const res = await window.ethereum.request({
				method: "eth_requestAccounts"
			})
            Vue.prototype.$address = res[0]
			return res[0];
		}
		return false;
	}

	/* Web3 signature */
	Vue.prototype.$sign = async (data, walletAddress) => {
		if (window.web3) {
			let web3 = new Web3(Web3.givenProvider)
			// let web3 = new Web3(window.web3.currentProvider)
			return await web3.eth.personal.sign(data, walletAddress, "");
		}
	}

	/* Call contract payment */
	Vue.prototype.$contractBuy = (uploadId, price, walletAddress, callback) => {
		if (window.web3) {
			let web3 = new Web3(Web3.givenProvider)
			let ethContract = new web3.eth.Contract(abi, config.contractAddress);
			let amount = price * Math.pow(10, 18);
			ethContract.methods.buy(uploadId).send({
					from: walletAddress,
					value: amount + ""
				})
				.on('confirmation', (confirmationNumber, receipt) => {
					callback(confirmationNumber);
				})
				.on('receipt', (receipt) => {
					
				})
				.on('error', (error) => {
					callback("error");
				});
		}
	}

	/* Call contract upload */
	Vue.prototype.$contractUpload = (uploadId, price, walletAddress, callback) => {
		if (window.web3) {
			let web3 = new Web3(Web3.givenProvider)
			let ethContract = new web3.eth.Contract(abi, config.contractAddress);
			let amount = price * Math.pow(10, 18);
			ethContract.methods.mint(uploadId, amount + "").send({
					from: walletAddress
				})
				.on('confirmation', (confirmationNumber, receipt) => {
					callback(confirmationNumber);
				})
				.on('receipt', (receipt) => {
					
				})
				.on('error', (error) => {
					callback("error");
				});
		}
	}

	/* Call contract claim */
	Vue.prototype.$contractClaim = (walletAddress, callback) => {
		if (window.web3) {
			let web3 = new Web3(window.web3.currentProvider)
			let ethContract = new web3.eth.Contract(abi, config.contractAddress);
			ethContract.methods.withdraw().send({
					from: walletAddress
				})
				.on('confirmation', (confirmationNumber, receipt) => {
					callback(confirmationNumber);
				})
				.on('receipt', (receipt) => {
					
				})
				.on('error', (error) => {
					callback("error");
				});
		}
	}

	/* Call contract balances */
	Vue.prototype.$contractBalances = async (walletAddress) => {
		if (window.web3) {
			let web3 = new Web3(window.web3.currentProvider)
			let ethContract = new web3.eth.Contract(abi, config.contractAddress);
			return await ethContract.methods.balances(walletAddress).call()
		}
	}


}

install();
