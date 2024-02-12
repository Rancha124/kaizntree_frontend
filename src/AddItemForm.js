import React, { useState } from 'react';
import axios from 'axios';
import './AddItemForm.css';

const AddItemForm = ({ onItemAdded, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        tags: '',
        stock_status: '',
        available_stock: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formattedTags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
        console.log(formData)
        try {
            const response = await axios.post('https://kaizntree-charan-448e5dca4b32.herokuapp.com/items/', {
                ...formData,
                tags: formattedTags,
                available_stock: parseInt(formData.available_stock),
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response.status === 201) {
                // Callback to refresh the item list in the parent component
                onItemAdded();
                onClose();
            }
        } catch (error) {
            console.error("There was an error adding the item: ", error.response.data);
            alert("Failed to add the item.");
        }
    };

    return (
        <>
            <div className="overlay"></div>
            <div className="modal">
                <div className="modal-header">
                    <span className="modal-title">Add New Item</span>
                    <button className="modal-close-button" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input className="form-input" type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">SKU</label>
                        <input className="form-input" type="text" name="sku" value={formData.sku} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <input className="form-input" type="text" name="category" value={formData.category} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Tags</label>
                        <input className="form-input" type="text" name="tags" value={formData.tags} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Stock Status</label>
                        <input className="form-input" type="text" name="stock_status" value={formData.stock_status} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Available Stock</label>
                        <input className="form-input" type="number" name="available_stock" value={formData.available_stock} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="form-submit-btn">Add Item</button>
                </form>
            </div>
        </>
    );
};

export default AddItemForm;


