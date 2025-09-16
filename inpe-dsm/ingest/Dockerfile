FROM node:20-alpine
WORKDIR /app

# Instala cliente psql
RUN apk add --no-cache postgresql-client

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "start"]
