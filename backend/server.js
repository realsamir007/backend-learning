const express = require('express');
const app = express();

app.use(express.json());

let users = [
    { "id": 1, "name": "Sameer", "email": "sameer@gmail.com" },
    { "id": 2, "name": "Batman", "email": "batman@gmail.com" },
];

// I. GET
app.get('/users', (req, res) => {
    res.status(200);
    res.json(users);
});

// II. GET USERS BY ID
app.get('/users/:id', (req, res)=>{
    // 1. Extract the ID from the URL parameters
    const userId = parseInt(req.params.id);

    // 2. Find the user in the array
    const user = users.find(u => u.id === userId);

    // 3. If user doesn't exist, send a 404 error
    if (!user){
        return res.status(404).json({error: "User not found"});
    }

    // 4. If found, send the user data
    res.status(200).json(user);
});

// III. POST
app.post('/users', (req, res) => {
    // this means, the body will accept two fields which is the value of name and email
    const { name, email } = req.body;

    //checking if the user has inserted name and email
    if (!name || !email) {
        return res.status(400).json({ error: "name and email is required" });
    }

    // increasing the user id by 1, first checking if users exists or not, if so, calculate it's last index position
    // and add 1
    if (users.length > 0) {
        newId = users[users.length - 1].id + 1;
    } else {
        // and if the users does not exist, just give the index 1
        newId = 1;
    }

    // store the value of new users in a variable newUser
    const newUser = {
        id: newId,
        name: name,
        email: email,

    };

    users.push(newUser);
    
    //201 status code means "Created" successfully

    res.status(201).json(newUser);

});

//IV. PUT
app.put('/users/:id', (req, res)=>{
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (!user){
        res.status(404).json({error: "User not found"});
    }
    // Destructure the new data from the request body
    const {name, email} = req.body;

    // Update the user properties if new values were provided
    if (name) user.name = name;
    if (email) user.email = email;

    // Respond with the updated user data
    res.status(200).json(user);
});

// V. DELETE
app.delete('/users/:id', (req, res)=>{
    // 1. Find the index (position) of the user in the array
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    // Remember: If the index is not found the userIndex will be -1

   // 2. If the user index is -1, it means the user wasn't found
    if (userIndex === -1) {
        return res.status(404).json({error: "User Not Found"});
    }

    // 4. Remove the user from the array using splice (userIndex: the index, 1: one item)
    const deleteUser = users.splice(userIndex, 1);
    
    // 5. Respond with a 200 status and the details of the deleted user
    res.status(200).json({message: "User Successfully Deleted", user: deleteUser[0]});
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
