const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const app = express()
const PUERTO = 3000

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  session({
    secret: 'nuestra-clave-secreta-larga-con-caracteres-raros',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // En true cuando utilizamos HTTPS
  })
)

// Simulamos una BD de usuarios en memoria
const usuarios = [
  {
    id: 1,
    nombreUsuario: 'test',
    password: 'contraseña',
  },
]

// Ruta de inicio de sesion
app.post('/login', (req, res) => {
  const { nombreUsuario, password } = req.body
  // Si la clave en la BD esta códificada (bcrypt), hariamos la compáración encriptandola
  const usuario = usuarios.find(
    (usuario) =>
      usuario.nombreUsuario === nombreUsuario && usuario.password === password
  )
  if (usuario) {
    // Creamos el token de autenticación (JWT)
    const token = jwt.sign(
      { id: usuario.id },
      'clave-secreta-guardada-en-el-env',
      { expiresIn: '1h' }
    )
    // Guardamos el token en la cookie
    res.cookie('token', token, { httpOnly: true, secure: false })
    // Guardamos el token en la sesion
    // req.session.token = token
    req.session.userId = usuario.id
    res.json({ mensaje: 'Inicio de sesión exitoso' })
  }
})

function autenticar(req, res, next) {
  const token = req.cookies.token

  if (token) {
    jwt.verify(token, 'clave-secreta-guardada-en-el-env', (err, decoded) => {
      if (err) return res.status(401).json({ mensaje: 'Token inválido' })
      req.userId = decoded.id
      next()
    })
  } else {
    res.status(401).json({ mensaje: 'Token no encontrado' })
  }
}

// Ruta protegida
app.get('/dashboard', autenticar, (req, res) => {
  if (req.session.userId) {
    res.json({ mensaje: 'Bienvenido al dashboard' })
  } else {
    res.json({ mensaje: 'No estas autenticado' })
  }
})

// Ruta de cierre de sesion -> destruir la sesión y limpiar la cookie
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ mensaje: 'Error al cerrar sesión' })
    } else {
      res.clearCookie('token')
      res.json({ mensaje: 'Sesión cerrada' })
    }
  })
})

app.listen(PUERTO, () => {
  console.log(`Servidor funcionando en http://localhost:${PUERTO}`)
})
