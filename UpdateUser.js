import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UpdateUser({ userId, closeUpdate }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        employeeId: '',
        designation: '',
        joiningDate: '',
        image: null
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        axios.get(`http://localhost:3019/getUser/${userId}`)
            .then(response => {
                const user = response.data;
                setFormData({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    employeeId: user.employeeId,
                    designation: user.designation,
                    joiningDate: new Date(user.joiningDate).toISOString().substring(0, 10),
                    image: user.image
                });
            })
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        axios.put(`http://localhost:3019/updateUser/${userId}`, data)
            .then(() => {
                closeUpdate();
            })
            .catch(err => console.log("Error updating user data: ", err));
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
            <input type="text" name="employeeId" placeholder="Employee ID" value={formData.employeeId} onChange={handleChange} required />
            <input type="text" name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} required />
            <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
            <input type="file" name="image" onChange={handleFileChange} />
            <button type="submit">Update</button>
            <button type="button" onClick={closeUpdate}>Cancel</button>
        </form>
    );
}

export default UpdateUser;
