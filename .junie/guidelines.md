# Guías de Junie

# Guía para Usar los Endpoints de Información del Backend

Cuando estés desarrollando localmente, puedes utilizar los siguientes endpoints para 
obtener información sobre la estructura del backend. Todos estos endpoints están 
disponibles en `http://localhost:8080/api/backend-info`.

## Exploración de Endpoints

### Listar Todos los Endpoints

http GET /api/backend-info/endpoints

Este endpoint te proporcionará una lista de todos los endpoints disponibles en la aplicación.
Es útil para tener una visión general de la API.

### Obtener Detalles de un Endpoint Específico

http GET /api/backend-info/endpoints/details?path=/api/tu-endpoint&method=GET

Parámetros requeridos:
- `path`: La ruta del endpoint (ejemplo: `/api/usuarios`)
- `method`: El método HTTP (GET, POST, PUT, DELETE, etc.)

Este endpoint te dará información detallada sobre un endpoint específico, incluyendo parámetros esperados y tipos de respuesta.

## Exploración de Modelos

### Listar Paquetes de Modelos

http GET /api/backend-info/models/packages

Lista todos los paquetes que contienen modelos. También puedes filtrar 
por un paquete específico:

http GET /api/backend-info/models/packages?package=lacosmetics.planta


### Obtener Información de una Clase Modelo
http GET /api/backend-info/models/class-info?className=lacosmetics.planta.tumodelo
Parámetro requerido:
- `className`: El nombre completo de la clase incluyendo el paquete

Este endpoint proporciona información detallada sobre una clase específica, incluyendo sus atributos y relaciones.

## Ejemplos de Uso

1. Para ver todos los endpoints disponibles:
   bash curl [http://localhost:8080/api/backend-info/endpoints](http://localhost:8080/api/backend-info/endpoints)


2. Para ver detalles del endpoint de usuarios:
   bash curl "[http://localhost:8080/api/backend-info/endpoints/details?path=/api/usuarios&method=GET](http://localhost:8080/api/backend-info/endpoints/details?path=/api/usuarios&method=GET)"

3. Para explorar las clases modelo en un paquete específico:
   bash curl "[http://localhost:8080/api/backend-info/models/packages?package=lacosmetics.planta](http://localhost:8080/api/backend-info/models/packages?package=lacosmetics.planta)"


## Nota Importante
Estos endpoints están diseñados específicamente para ayudar durante el desarrollo. Utilízalos para:
- Explorar la estructura de la API
- Entender los modelos de datos
- Verificar los parámetros esperados en cada endpoint
- Validar tipos de respuesta

Todos los endpoints devuelven respuestas en formato JSON para fácil integración con herramientas de desarrollo.```