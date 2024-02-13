import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './DashboardComponent.css';
import AddItemForm from './AddItemForm';
import AddCategoryForm from './components/AddCategory/AddCategoryForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faNetworkWired, faShapes, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const DashboardComponent = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState('name');
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navigate = useNavigate()
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isCategoryFormVisible, setIsCategoryFormVisible] = useState(false);
    const [categoriesCount, setCategoriesCount] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isDateFilterVisible, setIsDateFilterVisible] = useState(false);


    const [isSortingVisible, setIsSortingVisible] = useState(false);
    const sortingOptionsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortingOptionsRef.current && !sortingOptionsRef.current.contains(event.target)) {
                setIsSortingVisible(false);
            }
        };

        // Add when the component mounts
        document.addEventListener("mousedown", handleClickOutside);
        // Remove event listener on cleanup
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const showCategoryForm = () => setIsCategoryFormVisible(true);
    const hideCategoryForm = () => setIsCategoryFormVisible(false);

    const toggleDateFilter = () => {
        setIsDateFilterVisible(!isDateFilterVisible);
    };


    const toggleSortingOptions = () => {
        setIsSortingVisible(!isSortingVisible);
    };
    const showForm = () => setIsFormVisible(true);
    const hideForm = () => setIsFormVisible(false);


    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const initiateSearch = () => {
        setSearchTerm(searchQuery);
    };

    const handleSortChange = (e) => {
        setSortKey(e);
        toggleSortingOptions()
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            initiateSearch();
        }
    };

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`https://kaizntree-charan-448e5dca4b32.herokuapp.com/items/`, {
                params: {
                    search: searchTerm,
                    ordering: sortKey,
                    start_date: startDate,
                    end_date: endDate
                },
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log("res", response.data);
            setItems(response.data);
        } catch (error) {
            console.error("There was an error fetching the items: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyDateFilter = () => {
        // Call fetchItems with startDate and endDate to filter the items
        fetchItems(startDate, endDate);
        // Hide date filter options after applying
        setIsDateFilterVisible(false);
    };


    const refreshCategories = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('https://kaizntree-charan-448e5dca4b32.herokuapp.com/categories/', {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log("what", response.data)
            setCategoriesCount(response.data.length);
        } catch (error) {
            console.error("There was an error fetching the categories count: ", error);
        }
    };

    const handleLogOut = () => {
        localStorage.removeItem('token');
        navigate('/');
    }


    useEffect(() => {
        fetchItems();
    }, [searchTerm, sortKey]);


    useEffect(() => {
        refreshCategories();
    }, []);


    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="dashboard">
            <button className="burger-menu" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                ☰
            </button>
            <div className={`side-panel ${isSidebarOpen ? 'open' : 'closed'}`}>
                <ul>
                    <li>Home</li>
                    <li>Items</li>
                    <li>Stock</li>
                    <li>Build</li>
                    <li>Customers</li>
                    <li>Sales Orders</li>
                    <li>Suppliers</li>
                    <li>Purchase Orders</li>
                    <li>Reports</li>
                </ul>
                <ul>
                    <li>Help</li>
                    <li>Integrations</li>
                    <li onClick={handleLogOut} >Logout</li>
                    <li>My Profile</li>
                </ul>
            </div>


            <div className="dashboard-container">
                <div className='dashboard-header'>
                    <div className='title'>
                        <h1>Item Dashboard</h1>
                        <p>All Items</p>
                    </div>

                    <div className="dashboard-stats">
                        <div className="stats-container">
                            <div className="stat">
                                <FontAwesomeIcon icon={faNetworkWired} /> <span>Categories:</span> <span>{categoriesCount}</span>
                            </div>
                            <hr className="divider" />
                            <div className="stat">
                                <FontAwesomeIcon icon={faShapes} /> <span>Items:</span> <span>{items.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='new-category'>
                    <button onClick={showCategoryForm} className="add-item-button">NEW ITEM CATEGORY</button>
                    {isCategoryFormVisible && (
                        <AddCategoryForm
                            onClose={hideCategoryForm}
                            onCategoryAdded={refreshCategories}
                        />
                    )}
                </div>
                <div className="controls">
                    <button onClick={showForm} className="add-item-button"> NEW ITEM </button>
                    {isFormVisible && <AddItemForm onItemAdded={() => {
                        hideForm();
                        fetchItems();
                        alert('Item added successfully');
                    }} onClose={hideForm} />}
                    <div className='query-section'>
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleKeyPress}
                        />
                        <button onClick={initiateSearch} className="search-button">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                        <div className="date-filter-container">
                            <button onClick={() => setIsDateFilterVisible(!isDateFilterVisible)} className="date-filter-button">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                            </button>
                            {isDateFilterVisible && (
                                <div className="date-filter-options">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                    <button onClick={applyDateFilter}>Apply</button>
                                </div>
                            )}
                        </div>
                        <div className="sorting-container">
                            <button onClick={toggleSortingOptions} className="sort-button">
                                <FontAwesomeIcon icon={faFilter} />
                            </button>
                            {isSortingVisible && (
                                <div ref={sortingOptionsRef} className="sorting-options">
                                    <div onClick={() => handleSortChange('name')}>Name</div>
                                    <div onClick={() => handleSortChange('stock_status')}>Stock Status</div>
                                    <div onClick={() => handleSortChange('sku')}>SKU</div>
                                    <div onClick={() => handleSortChange('available_stock')}>Available Stock</div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
                <div className="item-table">
                    <table>
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Name</th>
                                <th>Tags</th>
                                <th>Category</th>
                                <th>Stock Status</th>
                                <th>Available Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.sku}>
                                    <td>{item.sku}</td>
                                    <td>{item.name}</td>
                                    <td>{item.tag_names.join(", ")}</td>
                                    <td>{item.category_name}</td>
                                    <td>{item.stock_status}</td>
                                    <td>{item.available_stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>




        </div>
    );
};

export default DashboardComponent;
