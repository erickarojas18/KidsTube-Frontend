# KidsTube - Plataforma de Videos para Niños

KidsTube es una aplicación web diseñada específicamente para niños, que permite crear perfiles personalizados y gestionar playlists de videos educativos y entretenidos de manera segura.

## 🚀 Características Principales

- **Perfiles Personalizados**: Cada niño puede tener su propio perfil con avatar personalizado
- **Sistema de PIN**: Protección por PIN para cada perfil
- **Playlists Personalizadas**: Creación y gestión de listas de reproducción
- **Interfaz Amigable**: Diseño intuitivo y colorido para niños
- **Panel de Administración**: Gestión de perfiles y contenido
- **Sistema de Login**: Acceso seguro para padres y administradores

## 🛠️ Tecnologías Utilizadas

- **Frontend**:
  - React.js
  - React Router
  - React Bootstrap
  - Axios para peticiones HTTP

- **Backend**:
  - Node.js
  - Express
  - MongoDB
  - JWT para autenticación

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- MongoDB
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/KidsTube-Frontend.git
cd KidsTube-Frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con:
```
REACT_APP_API_URL=http://localhost:5000
```

4. Iniciar el servidor de desarrollo:
```bash
npm start
```

## 🌐 Estructura del Proyecto

```
KidsTube-Frontend/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── pages/         # Páginas principales
│   ├── assets/        # Recursos estáticos
│   ├── App.js         # Componente principal
│   └── index.js       # Punto de entrada
├── public/            # Archivos públicos
└── package.json       # Dependencias y scripts
```

## 🔐 Rutas Principales

- `/` - Página de inicio/Login
- `/register` - Registro de nuevos usuarios
- `/select-profile` - Selección de perfil
- `/user-playlists` - Playlists del usuario
- `/AdminRestricted` - Panel de administración
- `/videos` - Gestión de videos
- `/playlists` - Gestión de playlists

## 👥 Roles de Usuario

1. **Administrador**:
   - Gestión completa de perfiles
   - Administración de contenido
   - Acceso al panel de control

2. **Usuario (Padre)**:
   - Creación de perfiles para niños
   - Gestión de PINs
   - Acceso a playlists

3. **Perfil Niño**:
   - Acceso a videos asignados
   - Gestión de playlists personales
   - Personalización de avatar

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 👥 Autores

- **Daniela Pereira** - *Desarrolladora Frontend* - [DanielaPereira](https://github.com/DanielaPereira)
- **Ericka Rojas** - *Desarrolladora Frontend* - [ErickaRojas](https://github.com/ErickaRojas)



- React.js
- React Bootstrap
- MongoDB
- Express.js
