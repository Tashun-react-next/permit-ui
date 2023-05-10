import logo from './logo.svg';
import './App.css';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListGroup from 'react-bootstrap/ListGroup';
import PopUpModal from "./PopUpModal";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import CustomContainer from "./components/custom-container";
import OrderBook from "./components/orderbook";
import {Order} from "./model/general-models";


function App() {
    return (
        <div className="App">
            <header className="App-header">
                {/*<OrderBook*/}
                {/*    buyOrders={[*/}
                {/*        Order.getFilledOrder(new Date(), new Date(), 50, 50),*/}
                {/*        Order.getFilledOrder(new Date(), new Date(), 50, 50),*/}
                {/*        ]}*/}
                {/*    sellOrders={[*/}
                {/*        Order.getFilledOrder(new Date(), new Date(), 50, 50),*/}

                {/*    ]}*/}
                {/*>*/}
                {/**/}
                {/*</OrderBook>*/}
                <CustomContainer></CustomContainer>


                {/*<PopUpModal></PopUpModal>*/}

            </header>
        </div>
    );
}

async function getAccount() {

}

export default App;
