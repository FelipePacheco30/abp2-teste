# frontend/Dockerfile

# 1️⃣ Build da aplicação React
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2️⃣ Container final com Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Remover configuração default do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Adicionar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
