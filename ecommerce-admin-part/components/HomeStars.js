import axios from "axios"
import { useEffect, useState } from "react"
import Spinner from "./Spinner"
import { subHours } from "date-fns"

export default function HomeStats() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        setIsLoading(true)
        axios.get('/api/orders').then(res => {
            setOrders(res.data)
        }).catch(error => {
            console.error('There was an error fetching the orders', error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [])

    if (isLoading) {
        return (
            <div className="my-4">
                <Spinner fullWidth={true}/>
            </div>
        )
    }

    const ordersToday = orders.filter(order => order.createdAt > subHours(new Date, 24)).length
    return (
        <div className="">
            <h2>Orders</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="tile">
                    <h3 className="tile-header">Today</h3>
                    <div className="tile-number">{ordersToday}</div>
                    <div className="tile-desc">2 orders today</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This week</h3>
                    <div className="tile-number">2</div>
                    <div className="tile-desc">2 orders this week</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This month</h3>
                    <div className="tile-number">2</div>
                    <div className="tile-desc">2 orders this month</div>
                </div>
            </div>
            <h2>Revenue</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="tile">
                    <h3 className="tile-header">Today</h3>
                    <div className="tile-number">$20</div>
                    <div className="tile-desc">2 orders this week</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This week</h3>
                    <div className="tile-number">$2000</div>
                    <div className="tile-desc">2 orders this week</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This month</h3>
                    <div className="tile-number">$26263</div>
                    <div className="tile-desc">2 orders this week</div>
                </div>
            </div>
        </div>
    )
}