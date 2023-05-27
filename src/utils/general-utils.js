import {BigNumber, ethers} from "ethers";
import {from, map, merge, Subject} from "rxjs";


export const AppChainId = "0xAA36A7";
// export const ContractAddress = "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853";
export const ContractAddress = "0x1DBf65138637185cD9D11a81B10005A1Dbf00AD5";
// export const ContractAddress = "0x0442Cd51bDb95499bf0c089Bb065452C222376b5";
// export const ContractAddress = "0xa5d8f2c1e79b495120426cb12f23c9f89db94f8e";
// export const SpenderAddress = "0x5C0122Eb7AE6F776E63A1294c1dd0d66FB221F6e";
export const SpenderAddress = "0xa513e6e4b8f2a923d98304ec87f64353c4d5c853";
export const RCP_URL = "https://matic-mumbai.chainstacklabs.com"; // rpcUrl: 'https://matic-mumbai.chainstacklabs.com',


export const getShortenedAccountNumber = (accountAddress) => {
    return (accountAddress.length > 12) ?
        accountAddress.substring(0, 5) + '.............' + accountAddress.substring(accountAddress.length - 7) :
        accountAddress;


}


//////////////////////////////////////////////

// export const getChainIds = (setChainId) => {
//     from(window.ethereum?.request({method: 'eth_chainId'})).subscribe(
//         data => {
//             return setChainId(data)
//         }
//     );
// }

export const checkIfWalletIsConnected = (setError, setConnected, setSelectedAccount) => {
    try {
        const ethereum = getEthereumFromWindow(setError);
        if (!ethereum) return;

        const subscription = from(ethereum.request({method: "eth_accounts"})).subscribe(
            accounts => {
                if (accounts.length !== 0) {
                    const account = accounts[0];
                    console.log("Found an authorized account:", account);
                    setConnected(true);
                    setSelectedAccount(account);
                } else {
                    console.log("No authorized account found");
                }
                if (subscription) {
                    subscription.unsubscribe();
                }
            }
        );


    } catch (error) {
        console.log(error);
    }
};

/**
 * Implement your connectWallet method here
 */
export const connectWallet = (setError, setConnected, setSelectedAccount) => {
    try {
        const ethereum = getEthereumFromWindow(setError);

        if (!ethereum) {
            setError("MetaMask is not installed. Please consider installing it: https://metamask.io/download.html");
            return;
        }

        const subscription = from(ethereum.request({
            method: "eth_requestAccounts",
        })).subscribe(accounts => {
            console.log("Connected", accounts[0]);
            setConnected(true);
            setSelectedAccount(accounts[0]);
            subscription.unsubscribe();
        });
    } catch (error) {
        setError(error);
    }
};
export const switchNetwork = (setError) => {
    const ethereum = getEthereumFromWindow(setError);
    try {
        // check if the chain to connect to is installed
        ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId: AppChainId}],
        });
    } catch (error) {
        if (error.code === 4902) {
            try {
                ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: AppChainId,
                            rpcUrl: RCP_URL,
                        },
                    ],
                });
            } catch (addError) {
                setError(addError);
            }
        }
        setError(error);
    }

};

const getEthereumFromWindow = (setError) => {
    const {ethereum} = window;
    if (!ethereum) {
        setError("MetaMask is not installed. Please consider installing it: https://metamask.io/download.html");
    }
    return ethereum;
}


//////////////////////////////////////////////


export const msgParams = (owner,spender,value,deadline, nonce) => {

    const typedData = {
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" },
            ],
            Permit: [
                { name: "owner", type: "address" },
                { name: "spender", type: "address" },
                { name: "value", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" }
            ],
        },
        primaryType: "Permit",
        domain: {
            name: "PermitTokens",
            version: "1",
            chainId: 11155111,
            verifyingContract: ContractAddress
        },
        message: {
            owner: owner,
            spender: ContractAddress,
            value: value,
            nonce: nonce,
            deadline: deadline
        }
    };
    return typedData;
}


/////////////////////////////////////////////////

// export const getContractBalance = (selectedAccount, tokenId) => {
//     try {
//         const contract = getDeployedContractReference();
//         return from(contract.balanceOf(selectedAccount, tokenId)).pipe(map(data => data.toString()));
//     } catch (error) {
//         console.log(error);
//     }
// }
//
// export const getTokenUpdatedPrice = (tokenId) => {
//     try {
//         const contract = getDeployedContractReference();
//         return from(contract.getMiningPriceForToken(tokenId)).pipe(map(data => BigNumber.from(data) / (10 ** 18)));
//     } catch (error) {
//         console.log(error);
//     }
// }
//
// export const mintToken = (id, amount) => {
//     let returningSubject = new Subject();
//     if (id === 0 || id === 1 || id === 2) {
//         const contract = getDeployedContractReference();
//         if (contract) {
//             return from(contract.estimateGas.startMintingToken(id, amount))
//                 .subscribe(startEstimate => {
//                     if (startEstimate) {
//                         merge(from(contract.startMintingToken(id, amount, {gasLimit: startEstimate})))
//                     } else {
//                         merge(from(contract.startMintingToken(id, amount)))
//                     }
//                 });
//         } else {
//             returningSubject.next({error: -1, message: "Error fetching contract"});
//         }
//     } else {
//         returningSubject.next({error: -1, message: "Selected Token Id can not be minted Directly"})
//     }
//     return returningSubject;
// }
//
// export const forgeToken = (id, amount) => {
//     let returningSubject = new Subject();
//     if (id === 3 || id === 4 || id === 5 || id === 6) {
//         const contract = getDeployedContractReference();
//         if (contract) {
//             const price = amount * 0.01
//             return from(contract.startMintingToken(id, amount, {
//                 value: ethers.utils.parseEther(price.toString())
//             }));
//         } else {
//             returningSubject.next({error: -1, message: "Error fetching contract"});
//         }
//     } else {
//         returningSubject.next({error: -1, message: "Selected Token Id can not be Forged"});
//     }
//     return returningSubject;
// }
//
// export const burnToken = (id, amount) => {
//     let returningSubject = new Subject();
//     if (id === 3 || id === 4 || id === 5 || id === 6) {
//         const contract = getDeployedContractReference();
//         if (contract) {
//             return from(contract.estimateGas.startBurningToken(id, amount))
//                 .subscribe(startEstimate => {
//                     if (startEstimate) {
//                         merge(from(contract.startBurningToken(id, amount, {gasLimit: startEstimate})))
//                     } else {
//                         merge(from(contract.startBurningToken(id, amount)))
//                     }
//                 });
//         } else {
//             returningSubject.next({error: -1, message: "Error fetching contract"});
//         }
//     } else {
//         returningSubject.next({error: -1, message: "Selected Token Id can not be Forged"});
//     }
//     return returningSubject;
//
// }
//
// export const transferToken = (fromId, toId, amount) => {
//     let returningSubject = new Subject();
//
//     const contract = getDeployedContractReference();
//     if (contract) {
//         return from(contract.estimateGas.startTransferringToken(fromId, toId, amount))
//             .subscribe(startEstimate => {
//                 if (startEstimate) {
//                     merge(from(contract.startTransferringToken(fromId, toId, amount, {gasLimit: startEstimate})))
//                 } else {
//                     merge(from(contract.startTransferringToken(fromId, toId, amount)))
//                 }
//             });
//     } else {
//         returningSubject.next({error: -1, message: "Error fetching contract"});
//     }
//     return returningSubject;
//
// }
//
// export const getAllTokenDetails = (selectedAccount, setTokenMap) => {
//     allTokenIds().forEach(id => {
//         getContractBalance(selectedAccount, id).subscribe(value => setTokenMap(prev => new Map(prev.set(id, value))));
//         console.log(id);
//
//     });
//
// }
//
// export const setEventListener = (selectedAccount, isOnValidNetwork, setTokenMap,setProcessing) => {
//     const contract = getDeployedContractReference();
//     if (contract && selectedAccount && isOnValidNetwork) {
//         contract.on("ActionNotifier", (observer) => {
//             console.log(observer, selectedAccount);
//             if (observer?.toLowerCase() === selectedAccount?.toLowerCase()) {
//                 if (selectedAccount && isOnValidNetwork) {
//                     getAllTokenDetails(selectedAccount, setTokenMap);
//                     setProcessing(() =>false);
//                 }
//             }
//         });
//     }
// }
//
// export const getDeployedContractReference = () => {
//     try {
//         const {ethereum} = window;
//         if (ethereum) {
//             const provider = new ethers.providers.Web3Provider(ethereum);
//             const signer = provider.getSigner();
//             return new ethers.Contract(contractAddress, contractABI.abi, signer);
//
//
//         } else {
//             console.error("Ethereum is not injected to window");
//         }
//     } catch (error) {
//         console.error("Error taking fetching Contract");
//     }
// }
//
//
// export const setRoute = (router, id) => {
//     router.push(id);
// }
//
//
// export const getIndexFromNavigation = (navigation) => {
//     return navigationData.find(data => data.link === navigation)?.index;
// }