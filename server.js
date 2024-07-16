const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = 3019;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://127.0.0.1:27017/employee', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const db = mongoose.connection;

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    employeeId: String,
    designation: String,
    joiningDate: Date,
    image: String
});
const User = mongoose.model('User', userSchema);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.post('/post', upload.single('image'), async (req, res) => {
    const { name, email, phone, employeeId, designation, joiningDate } = req.body;
    const image = req.file ? req.file.path : null;

    const user = new User({
        name,
        email,
        phone,
        employeeId,
        designation,
        joiningDate,
        image
    });

    try {
        await user.save();
        res.send("Form submission successful");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});

app.get('/getUsers', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/getUser/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/deleteUser/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.send("User deleted successfully");
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/updateUser/:id', upload.single('image'), async (req, res) => {
    const { name, email, phone, employeeId, designation, joiningDate } = req.body;
    const image = req.file ? req.file.path : null;

    try {
        const updateData = {
            name,
            email,
            phone,
            employeeId,
            designation,
            joiningDate
        };

        if (image) {
            updateData.image = image;
        }

        await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.send("User updated successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
});

db.once('open', () => {
    console.log("MongoDB connection successful");
});

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

app.listen(port, () => {
    console.log("Server started on port", port);
});
