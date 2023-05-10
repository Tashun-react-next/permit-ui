import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
    checkIfWalletIsConnected,
    connectWallet,
    ContractAddress,
    msgParams,
    SpenderAddress
} from "../utils/general-utils";
import {useEffect, useState} from "react";
import {ethers} from "ethers";

// import sigUtils from "@metamask/eth-sig-util/dist/utils";


function CustomContainer() {
    const [error, setError] = useState("");
    const [isConnected, setConnected] = useState(false);
    const [account, setSelectedAccount] = useState();
    const [value, setValue] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [timeStamp, setTimeStamp] = useState(0);


    useEffect(() => {
        // setProcessing(true);
        checkIfWalletIsConnected(setError, setConnected, setSelectedAccount);
    }, []);


    const handleClick = async () => {
        setLoading(true);
        // const customHttpProvider = new ethers.providers.JsonRpcProvider( Window.ethereum )
        const customHttpProvider = new ethers.providers.Web3Provider(window.ethereum);
        const deadline = (await customHttpProvider.getBlock("latest")).timestamp + 60;
        const signer = await customHttpProvider.getSigner(0);
        const myAddress = await signer.getAddress()
        const ABI = [
            // "function transfer(address to, uint amount)"
            // "function transferFrom(address sender,address recipient,uint amount)"
            "function permit(address owner, address spender,uint256 value,uint256 deadline,uint8 v,bytes32 r,bytes32 s)",
            "function nonces(address owner) public view returns (uint256)"


        ];
        const contract = new ethers.Contract(ContractAddress, ABI, signer)
        const nonce = parseInt(await contract.nonces(myAddress), 10);
        let signature = await signer.provider.send(
            "eth_signTypedData_v4",
            [myAddress, JSON.stringify(msgParams(myAddress, ContractAddress, 1000, deadline, nonce))]
        );

        const split = ethers.utils.splitSignature(signature);

        console.log("r: ", split.r);
        console.log("s: ", split.s);
        console.log("v: ", split.v);


        const tnx = await contract.permit(myAddress, ContractAddress, 1000, deadline, split.v, split.r, split.s, {gasPrice: 8000000000});
        const receipt = await tnx.wait()
        console.log(receipt)
        setLoading(false);



        wait().then(() => {
            setLoading(false);
        });
    };

    const signMessage = async (message) => {
        const customHttpProvider = new ethers.providers.JsonRpcProvider(Window.ethereum);
        const signer = await customHttpProvider.getSigner();
        return signer.signMessage(message);


    }

    const verifyIfTheMessageFromSigner = async (message, signature) => {
        const customHttpProvider = new ethers.providers.JsonRpcProvider(Window.ethereum);
        const signer = await customHttpProvider.getSigner();
        const address = ethers.utils.verifyMessage(message, signature);
        return signer.address === address;
    }


    return (
        <Container>
            <Row>
                <Col>Owner</Col>
                <Col
                    xs={6}>{account ? account.toString().substring(0, 8) + "......." + account.toString().substring(35, 42) :
                    <Button
                        onClick={() =>connectWallet(setError, setConnected, setSelectedAccount)}
                    >
                        Connect Wallet
                    </Button>}</Col>
            </Row>

            <Row>
                <Col>Spender</Col>
                <Col
                    xs={6}>{ContractAddress.toString().substring(0, 8) + "......." + ContractAddress.toString().substring(35, 42)}</Col>
            </Row>

            <Row>
                <Col>value</Col>
                <Col xs={6}>
                    {/*<input*/}
                    {/*    type="text"*/}
                    {/*    onChange={setValue}*/}
                    {/*>*/}
                    1000

                    {/*</input>*/}
                </Col>
            </Row>


            <Row>
                <Col>
                    <Button variant="primary" size="lg"
                            disabled={isLoading || !value}
                            onClick={!isLoading ? handleClick : null}
                    >
                        Permit
                    </Button>
                </Col>

            </Row>
        </Container>
    );
}

function wait() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
}

export default CustomContainer;