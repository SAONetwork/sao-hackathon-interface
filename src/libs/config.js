export default {

	localStorageUserKey: "sao_user",
	localStorageSignKey: "sao_sign",
	localStorageSignKeyList: "sao_sign_list",

	//Base API
	timeout: 100000,
	baseApi: "https://bsctest.sao.network/saods/api/v1/",
	
	//Contract address
	contractAddress: "0xBe3359e7d267E9C7d6e044b5F509c0074B8f71C0",
	
	//network chainId
	networkChainIdList: ["0x61"],

    //default chainId
    defaultChainId: "0x61",

    //default Provider: 
    defaultProvider: "https://data-seed-prebsc-1-s1.binance.org:8545",

    //default chainName
    defaultChainName: "Binance Smart Chain Testnet",

    //default Symbol
    defaultSymbol: "BNB",
	
	//sign message
	signMessage: `Welcome to Storverse\nClick "Sign" to continue.\n\nThis signature will cost 0 gas.\n\nWallet address:\n`


}
