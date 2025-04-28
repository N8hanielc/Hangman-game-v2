# Base image
FROM node:18

# Set working directory
WORKDIR /server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the server code
COPY . .

# Expose the port the server runs on
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
