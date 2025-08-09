FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose ports (3000 for Next.js, 24678 for HMR WebSocket)
EXPOSE 3000 24678

# Start development server
CMD ["npm", "run", "dev"]