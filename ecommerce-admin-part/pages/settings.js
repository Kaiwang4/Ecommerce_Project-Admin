import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function SettingsPage({swal}) {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [featuredProductId, setFeaturedProductId] = useState('')
    const [shippingFee, setShippingFee] = useState('')
    useEffect(() => {
        setIsLoading(true)
        Promise.all([
            axios.get('/api/products'),
            axios.get('/api/settings?name=featuredProductId'),
            axios.get('/api/settings?name=shippingFee'),
        ]).then(([productsRes, featuredRes, shippingFeeRes]) => {
            setProducts(productsRes.data)
            setFeaturedProductId(featuredRes.data.value)
            setShippingFee(shippingFeeRes.data.value)
            setIsLoading(false);
        }).catch(error => {
            console.error("Error fetching data: ", error);
            setIsLoading(false);
        });
    }, [])

    async function saveSettings() {
        setIsLoading(true)
        await axios.put('/api/settings', {
            name: 'featuredProductId',
            value: featuredProductId,
        })
        await axios.put('/api/settings', {
            name: 'shippingFee',
            value: shippingFee,
        })
        setIsLoading(false)
        await swal.fire({
            title: 'Settings saved!',
            icon: 'success',
        })
    }
    return (
        <Layout>
            <h1>Settings</h1>
            { isLoading && (
                <Spinner />
            )}
            { !isLoading && (
                <>
                    <label>Featured product</label>
                    <select value={featuredProductId} onChange={e => setFeaturedProductId(e.target.value)}>
                        {products.length > 0 && products.map(product => (
                            <option key={product._id} value={product._id}>{product.title}</option>
                        ))}
                    </select>
                    <label>Shipping price (in AUD)</label>
                    <input type="number" value={shippingFee} onChange={e => setShippingFee(e.target.value)}/>
                    <div>
                        <button onClick={saveSettings} className="btn-primary">Save Settings</button>
                    </div>
                </>               
            )}
            
        </Layout>
    )
}

export default withSwal(({swal}) => (
    <SettingsPage swal={swal} />
))