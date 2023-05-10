import Table from 'react-bootstrap/Table';
import type {Order} from "../model/general-models";

function OrderBook(data) {
    return (
        <div>
            <h2> Token A / Token B</h2>
            <div className="flex">

                <Table striped bordered hover variant="dark">
                    <thead>
                    <tr>
                        <th colSpan={4}>Buy</th>
                    </tr>
                    <tr>
                        <th>Created Time</th>
                        <th>Valid Till</th>
                        <th>Token Amount</th>
                        <th>Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.buyOrders?.map((x, i) =>
                        <tr key={i}>
                            <td>{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(x.valid)}</td>
                            <td>{x.valid.toDateString()}</td>
                            <td>{x.price}</td>
                            <td>{x.quantity}</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
                <Table striped bordered hover variant="dark">
                    <thead>
                    <tr>
                        <th colSpan={4}>Sell</th>
                    </tr>
                    <tr>
                        <th>Created Time</th>
                        <th>Valid Till</th>
                        <th>Token Amount</th>
                        <th>Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.sellOrders?.map((x, i) =>
                        <tr key={i}>
                            <td>{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(x.valid)}</td>
                            <td>{x.valid.toDateString()}</td>
                            <td>{x.price}</td>
                            <td>{x.quantity}</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </div>
        </div>


    );
}

export default OrderBook;