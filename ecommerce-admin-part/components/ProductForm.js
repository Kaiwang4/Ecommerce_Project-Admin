import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { withSwal } from "react-sweetalert2"

const API_BASE_URL = process.env.NEXTAUTH_URL

function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: existingCategory,
    properties: existingProperties,
    swal
}) {
    const [title,setTitle] = useState(existingTitle || '');
    const [description,setDescription] = useState(existingDescription || '');
    const [category, setCategory] = useState(existingCategory || '')
    const [productProperties, setProductProperties] = useState(existingProperties || {})
    const [price,setPrice] = useState(existingPrice || '');
    const [images, setImages] = useState(existingImages || [])
    const [isUploading, setIsUploading] = useState(false)
    const [goToProducts, setGoToProducts] = useState(false);
    const [categories, setCategories] = useState([])
    const [categoriesLoading, setCategoriesLoading] = useState(false)
    const router = useRouter();
    useEffect(() => {
        setCategoriesLoading(true)
        axios.get(`${API_BASE_URL}/api/categories`).then(result => {
            setCategories(result.data)
        }).catch(error => {
            console.error('Failed to fetch categories:', error);
        }).finally(() => {
            setCategoriesLoading(false)
        });
    }, [])
    async function saveProduct(e) {
        e.preventDefault();
        const data = {title, description, price, images, category, properties: productProperties}
        // console.log(_id);
        try{
            let response
            if (_id) {
                //update product info
                response = await axios.put(`${API_BASE_URL}/api/products`, {...data, _id})
            } else {
                // create new product
                response = await axios.post(`${API_BASE_URL}/api/products`, data);
            }

            if (response.status === 200 || response.status === 201) {
                swal.fire({
                    title: 'Success!',
                    text: 'Product updated sucessfully!!!',
                    icon: 'success',
                }).then((result) => {
                    if (result.isConfirmed) {
                        setGoToProducts(true);
                    }
                });
            }
        } catch (error) {
            swal.fire({
              title: 'Error!',
              text: error.response?.data?.message || 'There was an error saving the product.',
              icon: 'error',
            });
            console.error('Failed to save the product:', error);
        }
    }
    if (goToProducts) router.push(`${API_BASE_URL}/products`);

    async function uploadImages(e) {
        e.preventDefault();
        const files = e.target?.files;
        if (files?.length > 0) {
            setIsUploading(true)
            const data = new FormData();
            for (const file of files) {
                data.append('file', file)
            }
            try{
                const res = await axios.post(`${API_BASE_URL}/api/upload`, data)
                setImages(oldImages => {
                    return [...oldImages, ...res.data.links]
                })
                swal.fire({ 
                    title: 'Success!',
                    text: 'Images uploaded successfully!',
                    icon: 'success',
                })
            } catch (error) {
                swal.fire({
                    title: 'Error!',
                    text: error.response?.data?.message || 'An error occurred while uploading the images.',
                    icon: 'error',
                });
            }
            setIsUploading(false)
        }
    }
    function updateImagesOrder(images) {
        setImages(images);
    }
    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProps = {...prev}
            newProductProps[propName] = value
            return newProductProps
        })
    }
    const propertiesToFill = [];
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category);
        if (catInfo) {
            propertiesToFill.push(...catInfo.properties);
            while (catInfo?.parent?._id) {
                const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
                if (parentCat) { 
                    propertiesToFill.push(...parentCat.properties);
                    catInfo = parentCat;
                } else {
                    break;
                }
            }
        }
    }

    return (
        <form onSubmit={saveProduct}>
            <label>Product name</label>
            <input 
            type="text" 
            placeholder="product name" 
            value={title} 
            onChange={e => {setTitle(e.target.value)}}/>
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Uncategorized</option>
                {categories.length > 0 && categories.map(category => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                ))}
            </select>
            {categoriesLoading && (
                <Spinner fullWidth={true}/>
            )}
            {propertiesToFill.length > 0 && propertiesToFill.map((property, index) => (
                <div key={index} className="">
                    <label>{property.name}</label>
                    <div>
                        <select value={productProperties[property.name]}
                                onChange={e => setProductProp(property.name, e.target.value)}>
                            {property.values.map(value => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}
            <label>
                Photos
            </label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable 
                list={images} 
                className="flex flex-wrap gap-1"
                setList={updateImagesOrder}>
                    {!!images?.length && images.map((link, index) => (
                        <div key={index} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                            <img key={link} src={link} className="rounded-lg"/>
                        </div>
                    ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner />
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-gray-200 bg-white shadow-sm border border-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Add image
                    </div>
                    <input type="file" onChange={uploadImages} className="hidden"/>
                </label>
            </div>
            <label>Description</label>
            <textarea 
            placeholder="description"
            value={description}
            onChange={e => {setDescription(e.target.value)}}/>
            <label>Price (in AUD)</label>
            <input 
            type="text" 
            placeholder="price"
            value={price}
            onChange={e => {setPrice(e.target.value)}}/>
            <button
            type="submit" 
            className="btn-primary">
            Save
            </button>
        </form>
    )
}

export default withSwal(ProductForm)