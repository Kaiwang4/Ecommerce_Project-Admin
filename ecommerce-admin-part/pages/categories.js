import Layout from "@/components/Layout";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {
    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('')
    const [parentCategory, setParentCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [properties, setProperties] = useState([])
    const {data: session} = useSession()
    useEffect(() => {
        fetchCategories()
    }, [])
    function fetchCategories() {
        axios.get('/api/categories').then(result =>{
            setCategories(result.data) 
        })
    }
    function editCategory(category) {
        setEditedCategory(category)
        setName(category.name)
        setParentCategory(category.parent?._id)
        // console.log("Editing category:", category);
        // console.log("Properties values:", category.properties.map(p => p.values));
        setProperties(category.properties.map(({name, values}) => ({
            name, 
            values: values.join(',')
        })))
    }
    async function saveCategory(e) {
        e.preventDefault()
        const data = {
            name, 
            parentCategory, 
            properties: properties.map(p => ({
                name: p.name, 
                values: p.values.split(',')
            }))
        }
        if (editedCategory) {
            data._id = editedCategory._id
            await axios.put('/api/categories', data)
            setEditedCategory(null)
            setParentCategory('')
        } else {
            await axios.post('/api/categories', data)
        }
        setName('')
        setParentCategory('')
        setProperties([])
        fetchCategories()
    }
    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Sure, Delete it now!!!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
        }).then(async result => {
            if (result.isConfirmed) {
                const {_id} = category
                await axios.delete('/api/categories?_id='+_id, {_id})
                fetchCategories()
            }
        });
    }
    function addProperty() {
        setProperties(prev => {
            return [...prev, {name: '', values: ''}]
        })
    }
    function handlePropertyNameChange(index, property, newName) {
        // console.log(index, property, newName);
        setProperties(prev => {
            const properties = [...prev]
            properties[index].name = newName
            return properties
        })
    }
    function handlePropertyValueChange(index, property, newValues) {
        // console.log(index, property, newName);
        setProperties(prev => {
            const properties = [...prev]
            properties[index].values = newValues
            return properties
        })
    }
    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove
            })
        })
    }
    return (
        <Layout>
            <h1>Categories</h1>
            {session.isAdmin && (<label>{editedCategory? `Edit category ${editedCategory.name}` : 'Create new category'}</label>)}
            {session.isAdmin && (<form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input 
                    type="text" 
                    onChange={e => setName(e.target.value)}
                    placeholder={'Category name'}
                    value={name} />
                    <select onChange={e => setParentCategory(e.target.value)}
                            value={parentCategory}>
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button onClick={addProperty} type="button" className="btn-default text-sm mb-2">Add new property</button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div key={index} className="flex gap-1 mb-2">
                            <input type="text" 
                                   value={property.name} 
                                   className="mb-0"
                                   onChange={e => handlePropertyNameChange(index, property, e.target.value)}
                                   placeholder="property name (example: color)"/>
                            <input type="text" 
                                   value={property.values} 
                                   className="mb-0"
                                   onChange={e => handlePropertyValueChange(index, property, e.target.value)}
                                   placeholder="values, comma separated"/>
                            <button onClick={() => removeProperty(index)}
                                    type="button"
                                    className="btn-red">Remove</button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editedCategory && (
                        <button type="button" 
                                onClick={() => {
                                    setEditedCategory(null)
                                    setName('')
                                    setParentCategory('')
                                    setProperties([])
                                }} 
                                className="btn-default">Cancel</button>
                    )}
                    <button type="submit" className="btn-primary py-1">Save</button>
                </div>
            </form>)}
            {!editedCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent category</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    {session.isAdmin && (<button onClick={() => editCategory(category)} className="btn-default mr-1">Edit</button>)}
                                    {session.isAdmin && (<button onClick={() => deleteCategory(category)} className="btn-red">Delete</button>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
        </Layout>
    )
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
))