# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install TypeScript and ts-node globally
RUN npm install -g typescript ts-node

# Install application dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

# Expose a port if your Node.js app listens on a specific port
EXPOSE 9090

# Define the command to run your Node.js application
CMD [ "npm", "start" ]




