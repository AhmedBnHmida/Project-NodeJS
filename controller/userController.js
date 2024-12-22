const express = require("express");
const User = require("../modele/user");

async function getall(req, res) {
  try {
    const data = await User.find();
    res.send(data);
  } catch (err) {
    res.send(err);
  }
}

// Get User by ID
async function getbyid(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// Create User
async function add(req, res) {
  try {
    const { name, email, role } = req.body;
    const user = new User({ name, email, role });
    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function  addT(user) {
    try {
      const newUser = new User(user);
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error(`Failed to add user: ${error.message}`);
    }
  }


async function update(req, res){
    try {
      const { name, email, role } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, role },
        { new: true, runValidators: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };



  // Delete User
async  function remove(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
module.exports = { getall, getbyid, add, update, remove, addT};
