import axios from "axios"
import { useEffect, useState } from "react"
import Spinner from "./Spinner"
import { subHours } from "date-fns"
import { useSession } from "next-auth/react"
import EyeOpenIcon from "./icons/EyeOpenIcon"
import EyeClosedIcon from "./icons/EyeClosedIcon"

export default function HomeStats() {
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [showToday, setShowToday] = useState(true)
    const [showWeek, setShowWeek] = useState(true)
    const [showMonth, setShowMonth] = useState(true)
    const {data: session} = useSession()
    useEffect(() => {
        if (!session?.isAdmin) return

        setIsLoading(true)
        axios.get('/api/orders').then(res => {
            setOrders(res.data)
        }).catch(error => {
            console.error('There was an error fetching the orders', error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [session?.isAdmin])

    function ordersTotal(orders) {
        let sum = 0
        orders.forEach(order => {
            const {line_items} = order
            line_items.forEach(line_item => {
                const itemSum = line_item.quantity * line_item.price_data.unit_amount / 100
                sum += itemSum
            })
        })
        return new Intl.NumberFormat('en-AU').format(sum);
    }

    if (isLoading) {
        return (
            <div className="my-4">
                <Spinner fullWidth={true}/>
            </div>
        )
    }

    const ordersToday = orders.filter(order => new Date(order.createdAt)  > subHours(new Date, 24))
    const ordersWeek = orders.filter(order => new Date(order.createdAt)  > subHours(new Date, 24*7))
    const ordersMonth = orders.filter(order => new Date(order.createdAt)  > subHours(new Date, 24*30))
    const displayValue = (show, value) => show ? value : '**'
    return (
        <div className="">
            <h2>Orders</h2>
            <div className="tile-grid">
                <div className="tile">
                    <div className="tile-topline">
                        <h3 className="tile-header">Today</h3>
                        {session?.isAdmin && (
                            <button className="icon-button" onClick={() => setShowToday(!showToday)}>
                                {showToday ? <EyeOpenIcon className="icon" /> : <EyeClosedIcon className="icon" />}
                            </button>
                        )}                       
                    </div>                 
                    <div className="tile-number">{session?.isAdmin ? displayValue(showToday, `${ordersToday.length}`) : '**'}</div>
                    <div className="tile-desc">{session?.isAdmin ? displayValue(showToday, `${ordersToday.length}`) : '**'} orders today</div>
                </div>
                <div className="tile">
                    <div className="tile-topline">
                        <h3 className="tile-header">This week</h3>
                        {session?.isAdmin && (
                            <button onClick={() => setShowWeek(!showWeek)}>
                                {showWeek ? <EyeOpenIcon className="icon" /> : <EyeClosedIcon className="icon" />}
                            </button>
                        )}                 
                    </div>                   
                    <div className="tile-number">{session?.isAdmin ? displayValue(showWeek, `${ordersWeek.length}`) : '**'}</div>
                    <div className="tile-desc">{session?.isAdmin ? displayValue(showWeek, `${ordersWeek.length}`) : '**'} orders this week</div>
                </div>
                <div className="tile">
                    <div className="tile-topline">
                        <h3 className="tile-header">This month</h3>
                        {session?.isAdmin && (
                            <button onClick={() => setShowMonth(!showMonth)}>
                                {showMonth ? <EyeOpenIcon className="icon" /> : <EyeClosedIcon className="icon" />}
                            </button>
                        )}                     
                    </div>                   
                    <div className="tile-number">{session?.isAdmin ? displayValue(showMonth, `${ordersMonth.length}`) : '**'}</div>
                    <div className="tile-desc">{session?.isAdmin ? displayValue(showMonth, `${ordersMonth.length}`) : '**'} orders this month</div>
                </div>
            </div>
            <h2>Revenue</h2>
            <div className="tile-grid">
                <div className="tile">
                    <h3 className="tile-header">Today</h3>
                    <div className="tile-number">{session?.isAdmin ? displayValue(showToday, `$${ordersTotal(ordersToday)}`) : '**'}</div>
                    <div className="tile-desc">{session?.isAdmin ? displayValue(showToday, `${ordersToday.length}`) : '**'} orders today</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This week</h3>
                    <div className="tile-number">{session?.isAdmin ? displayValue(showWeek, `$${ordersTotal(ordersWeek)}`) : '**'}</div>
                    <div className="tile-desc">{session?.isAdmin ? displayValue(showWeek, `${ordersWeek.length}`) : '**'} orders this week</div>
                </div>
                <div className="tile">
                    <h3 className="tile-header">This month</h3>
                    <div className="tile-number">{session?.isAdmin ? displayValue(showMonth, `$${ordersTotal(ordersMonth)}`) : '**'}</div>
                    <div className="tile-desc">{session?.isAdmin ? displayValue(showMonth, `${ordersMonth.length}`) : '**'} orders this month</div>
                </div>
            </div>
        </div>
    )
}