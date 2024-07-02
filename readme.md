# 📚 Introducción a Cookies, Sesiones y JWT

Hola a todos! 👋 En este documento vamos a explorar las ventajas y desventajas de utilizar Cookies, Sesiones y JSON Web Tokens (JWT) en el desarrollo web. Además, veremos ejemplos prácticos de cada tecnología, sus descripciones y casos de uso.

## 🍪 Cookies

### Descripción

Las cookies son pequeños fragmentos de datos que se almacenan en el navegador del cliente. Son comúnmente usadas para recordar información de los usuarios entre las visitas a un sitio web.

### Ventajas

- **Persistencia del lado del cliente:** Las cookies se almacenan en el navegador del cliente.
- **Fácil acceso desde el cliente:** El cliente puede leer y escribir cookies.
- **Soporte universal:** Todos los navegadores soportan cookies.

### Desventajas

- **Tamaño limitado:** Máximo de 4 KB.
- **Seguridad:** Pueden ser interceptadas y manipuladas.
- **Privacidad:** Pueden ser usadas para rastrear usuarios.

### Casos de Uso

- **Recordar preferencias del usuario:** Idioma, tema, etc.
- **Seguimiento de sesión:** Mantener al usuario conectado entre visitas.
- **Publicidad personalizada:** Seguimiento de hábitos de navegación.

### Ejemplo de Uso

```javascript
const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()

app.use(cookieParser())

app.get('/set-cookie', (req, res) => {
  res.cookie('username', 'JohnDoe', { maxAge: 900000, httpOnly: true })
  res.send('Cookie has been set')
})

app.get('/get-cookie', (req, res) => {
  const username = req.cookies.username
  res.send(`Username from cookie: ${username}`)
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
```

- \*\*Autenticación de usuario: Mantener la sesión iniciada.
- **Preferencias del usuario:** Recordar configuraciones personalizadas.
- **Seguimiento:** Mantener el estado entre diferentes visitas al sitio web.

## 🛠️ Sesiones

### Descripción

Las sesiones permiten almacenar información del usuario en el servidor durante la interacción con una aplicación. Son útiles para mantener el estado de la aplicación entre diferentes solicitudes HTTP.

### Ventajas

- **Almacenamiento del lado del servidor:** Más seguro.
- **Mayor capacidad:** No están limitadas por el tamaño de las cookies.
- **Control centralizado:** El servidor controla la información de la sesión.

### Desventajas

- **Escalabilidad:** Difíciles de manejar en aplicaciones distribuidas.
- **Almacenamiento en el servidor:** Requieren recursos del servidor.
- **Dependencia de cookies:** Necesitan una cookie para el ID de sesión.

### Casos de Uso

- **Autenticación:** Mantener al usuario autenticado mientras navega por la aplicación.
- **Carritos de compra:** Mantener el estado del carrito de compras en una tienda en línea.
- **Configuraciones temporales:** Almacenar configuraciones temporales del usuario.

### Ejemplo de Uso

```javascript
// Configuración de sesión en Express
const session = require('express-session')

app.use(
  session({
    secret: 'miSecreto',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
)

// Acceder a la sesión
app.get('/', (req, res) => {
  if (req.session.views) {
    req.session.views++
    res.send(`Número de vistas: ${req.session.views}`)
  } else {
    req.session.views = 1
    res.send('Bienvenido a tu primera sesión.')
  }
})
```

## 🔐 JSON Web Tokens (JWT)

### Descripción

Los JSON Web Tokens (JWT) son un estándar para crear tokens de acceso que pueden ser firmados y, opcionalmente, cifrados. Son auto-contenidos y pueden ser verificados sin necesidad de almacenar información en el servidor.

### Ventajas

- **Sin estado (stateless):** No requiere almacenamiento en el servidor.
- **Seguridad:** Pueden ser firmados y cifrados.
- **Interoperabilidad:** Independientes de la plataforma.

### Desventajas

- **Tamaño:** Pueden ser grandes.
- **Revocación:** No se pueden invalidar fácilmente antes de expirar.
- **Exposición:** Si un JWT es comprometido, el atacante puede acceder hasta que expire.

### Casos de Uso

- **Autenticación:** Proveer tokens de acceso para APIs.
- **Autorización:** Controlar el acceso a recursos específicos.
- **Comunicación entre servicios:** Autenticar y autorizar microservicios.

### Ejemplo de Uso

```javascript
const jwt = require('jsonwebtoken')

// Crear un JWT
const token = jwt.sign({ username: 'JohnDoe' }, 'miSecreto', {
  expiresIn: '1h',
})

// Verificar un JWT
jwt.verify(token, 'miSecreto', (err, decoded) => {
  if (err) {
    console.log('Token no válido')
  } else {
    console.log('Token válido', decoded)
  }
})
```

## 🔗 Uso en Conjunto

### Descripción

Combinar Cookies, Sesiones y JWT puede aprovechar las ventajas de cada tecnología para proporcionar una solución robusta y segura.

### Ventajas

- **Mejora de la seguridad:** Cookies seguras para almacenar JWT.
- **Escalabilidad y persistencia:** Combina la escalabilidad de JWT con la capacidad de manejo de datos de las sesiones.
- **Flexibilidad:** Optimiza tanto la seguridad como el rendimiento.

### Desventajas

- **Complejidad:** Aumenta la complejidad de la implementación.
- **Gestión de estado:** Puede introducir desafíos.
- **Sobrecarga:** Necesidad de manejar múltiples tecnologías.

### Casos de Uso

- **Aplicaciones complejas:** Que requieren alta seguridad y escalabilidad.
- **Aplicaciones distribuidas:** Donde se necesita mantener el estado del usuario de manera eficiente.
- **Sistemas de autenticación:** Que deben ser seguros y rápidos.

### Ejemplo de Uso

```javascript
// Crear una cookie para almacenar el JWT
res.cookie('token', token, { httpOnly: true, secure: true })

// Leer el JWT desde la cookie
const token = req.cookies.token
jwt.verify(token, 'miSecreto', (err, decoded) => {
  if (err) {
    res.status(401).send('Token no válido')
  } else {
    res.send('Token válido')
  }
})
```

Esperamos que esta guía les haya sido útil. ¡Feliz programación! 🚀
