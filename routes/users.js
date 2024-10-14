const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const router = express.Router();

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', { users });
});

// Ruta para mostrar el formulario de edición de usuario
router.get('/update/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render('partials/edit', { user });
});

// Ruta para crear un nuevo usuario
router.post('/', async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.redirect('/users');
});

// Ruta para actualizar un usuario
router.post('/update/:id', async (req, res) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/users');
});

// Ruta para eliminar usuario
router.get('/delete/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/users');
});

module.exports = router;
