import React, { useEffect, useState } from "react";
import "./App.css";
import axios from 'axios';
import UpdateUser from './UpdateUser';

function App() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        employeeId: '',
        designation: '',
        joiningDate: '',
        image: null
    });
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editUserId, setEditUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:3019/getUsers')
            .then(response => setUsers(response.data))
            .catch(err => console.log(err));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            image: e.target.files[0]
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        const { name, email, phone, employeeId, designation, joiningDate, image } = formData;

        if (!name) newErrors.name = "Name is required";
        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email address is invalid";
        }
        if (!phone) newErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(phone)) {
            newErrors.phone = "Phone number must be 10 digits";
        }
        if (!employeeId) newErrors.employeeId = "Employee ID is required";
        if (!designation) newErrors.designation = "Designation is required";
        if (!joiningDate) newErrors.joiningDate = "Joining Date is required";
        if (!image) newErrors.image = "Image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        axios.post('http://localhost:3019/post', data)
            .then(() => {
                fetchUsers();
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    employeeId: '',
                    designation: '',
                    joiningDate: '',
                    image: null
                });
                setErrors({});
            })
            .catch(err => console.log(err));
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:3019/deleteUser/${id}`)
            .then(() => fetchUsers())
            .catch(err => console.log(err));
    };

    const handleEdit = (id) => {
        setEditUserId(id);
        setIsEditing(true);
    };

    const closeUpdate = () => {
        setEditUserId(null);
        setIsEditing(false);
        fetchUsers();
    };

    return (
        <div className="App">
            <h1>CRUD Operation</h1>
            {!isEditing ? (
                <>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.name && <p className="error">{errors.name}</p>}

                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.email && <p className="error">{errors.email}</p>}

                        <input 
                            type="tel" 
                            name="phone" 
                            placeholder="Phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.phone && <p className="error">{errors.phone}</p>}

                        <input 
                            type="text" 
                            name="employeeId" 
                            placeholder="Employee ID" 
                            value={formData.employeeId} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.employeeId && <p className="error">{errors.employeeId}</p>}

                        <input 
                            type="text" 
                            name="designation" 
                            placeholder="Designation" 
                            value={formData.designation} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.designation && <p className="error">{errors.designation}</p>}

                        <input 
                            type="date" 
                            name="joiningDate" 
                            value={formData.joiningDate} 
                            onChange={handleChange} 
                            required 
                        />
                        {errors.joiningDate && <p className="error">{errors.joiningDate}</p>}

                        <input 
                            type="file" 
                            name="image" 
                            onChange={handleFileChange} 
                            required 
                        />
                        {errors.image && <p className="error">{errors.image}</p>}

                        <button type="submit">Submit</button>
                    </form>
                </>
            ) : (
                <UpdateUser userId={editUserId} closeUpdate={closeUpdate} />
            )}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Employee ID</th>
                        <th>Designation</th>
                        <th>Joining Date</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.employeeId}</td>
                            <td>{user.designation}</td>
                            <td>{new Date(user.joiningDate).toLocaleDateString()}</td>
                            <td>
                                <img 
                                    src={`http://localhost:3019/${user.image}`} 
                                    alt="User" 
                                    style={{ width: '50px' }} 
                                />
                            </td>
                            <td>
                                <button onClick={() => handleDelete(user._id)}>Delete</button>
                                <button onClick={() => handleEdit(user._id)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
