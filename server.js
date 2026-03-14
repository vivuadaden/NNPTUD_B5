const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");
const Role = require("./models/Role");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://phidoan1882004_db_user:ditmemay18@cluster0.1ychyee.mongodb.net/?appName=Cluster0")
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err));

/* ================= ROLE ================= */

//create role
app.post("/roles", async(req,res)=>{
    const role = new Role(req.body);
    await role.save();
    res.json(role);
});

//get all roles
app.get("/roles", async(req,res)=>{
    const roles = await Role.find();
    res.json(roles);
});

//get role by id
app.get("/roles/:id", async(req,res)=>{
    const role = await Role.findById(req.params.id);
    res.json(role);
});

//update role
app.put("/roles/:id", async(req,res)=>{
    const role = await Role.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json(role);
});

//delete role (soft delete optional)
app.delete("/roles/:id", async(req,res)=>{
    await Role.findByIdAndDelete(req.params.id);
    res.json({message:"deleted"});
});


/* ================= USER ================= */

//create user
app.post("/users", async(req,res)=>{
    const user = new User(req.body);
    await user.save();
    res.json(user);
});

//get all users
app.get("/users", async(req,res)=>{
    const users = await User.find().populate("role");
    res.json(users);
});

//get user by id
app.get("/users/:id", async(req,res)=>{
    const user = await User.findById(req.params.id).populate("role");
    res.json(user);
});

//update user
app.put("/users/:id", async(req,res)=>{
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json(user);
});

//delete user
app.delete("/users/:id", async(req,res)=>{
    await User.findByIdAndDelete(req.params.id);
    res.json({message:"deleted"});
});


/* ================= ENABLE USER ================= */

app.post("/enable", async(req,res)=>{
    const {email,username} = req.body;

    const user = await User.findOne({email,username});

    if(!user) return res.json({message:"user not found"});

    user.status = true;
    await user.save();

    res.json(user);
});


/* ================= DISABLE USER ================= */

app.post("/disable", async(req,res)=>{
    const {email,username} = req.body;

    const user = await User.findOne({email,username});

    if(!user) return res.json({message:"user not found"});

    user.status = false;
    await user.save();

    res.json(user);
});


/* ================= GET USERS BY ROLE ================= */

app.get("/roles/:id/users", async(req,res)=>{
    const users = await User.find({role:req.params.id});
    res.json(users);
});


app.listen(3000,()=>{
    console.log("Server running port 3000");
});