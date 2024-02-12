import React, { useState } from 'react';
import axios from 'axios';
import './AddCategory.css'
const AddCategoryForm = ({ onClose, onCategoryAdded }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post('https://kaizntree-charan-448e5dca4b32.herokuapp.com/categories/', {
                name: categoryName,
            }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response.status === 201) {
                // Callback to refresh the category list in the parent component
                onCategoryAdded();
                onClose();
                alert("Category added successfully");
            }
        } catch (error) {
            console.error("There was an error adding the category: ", error.response.data);
            alert("Failed to add the category.");
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <form onSubmit={handleSubmit} className='category-form'>
                    <label htmlFor="categoryName">Category Name</label>
                    <input
                        type="text"
                        id="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                    />
                    <button type="submit">Add Category</button>
                </form>
            </div>
            <div className="modal-overlay" onClick={onClose}></div>
        </div>
    );
};

export default AddCategoryForm;
