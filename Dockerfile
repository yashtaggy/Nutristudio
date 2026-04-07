# Use Node
FROM node:18-alpine

WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install

COPY . .

# Build Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]