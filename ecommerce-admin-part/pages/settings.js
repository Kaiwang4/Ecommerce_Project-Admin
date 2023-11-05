import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function SettingsPage({swal}) {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [featuredProductId, setFeaturedProductId] = useState('')
    const [featuredLoading, setFeaturedLoading] = useState(false)
    useEffect(() => {
        setIsLoading(true)
        setFeaturedLoading(true)
        axios.get('/api/products').then(res => {
            setProducts(res.data)
        }).catch(error => {
            console.error('There was an error fetching the settings', error);
        }).finally(() => {
            setIsLoading(false);
        });
        axios.get('/api/settings?name=featuredProductId').then(res => {
            setFeaturedProductId(res.data.value)
        }).catch(error => {
            console.error('There was an error fetching the featured product', error);
        }).finally(() => {
            setFeaturedLoading(false);
        });
    }, [])

    async function saveSettings() {
        await axios.put('/api/settings', {
            name: 'featuredProductId',
            value: featuredProductId,
        }).then(() => {
            swal.fire({
                title: 'Settings saved!',
                icon: 'success',
            })
        })
    }
    return (
        <Layout>
            <h1>Settings</h1>
            {(isLoading || featuredLoading) && (
                <Spinner />
            )}
            {(!isLoading && !featuredLoading) && (
                <>
                    <label>Featured product</label>
                    <select value={featuredProductId} onChange={e => setFeaturedProductId(e.target.value)}>
                        {products.length > 0 && products.map(product => (
                            <option key={product._id} value={product._id}>{product.title}</option>
                        ))}
                    </select>
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