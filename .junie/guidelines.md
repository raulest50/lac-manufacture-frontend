# Guías de Junie

## Tech Stack and Coding Style
- Usar siempre axios para los request
- usar chakra ui v2 para ui
- cada modulo esta separado por pages. y cada page tiene su propio types.tsx
   procurar definir cualquier interface en los correspondientes types.tsx

## Backend API Integration
- The backend API details are stored in `.junie/backend_endpoints.json`.
- Before implementing or modifying frontend code that interacts with the backend, refer to this JSON file to understand available endpoints, their methods, parameters, and expected responses.
- This approach ensures consistency between frontend and backend, even though Junie doesn't have direct access to the backend source code.
- 