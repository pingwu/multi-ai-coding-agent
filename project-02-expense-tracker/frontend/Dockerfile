# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application's source code
COPY . .

# Ensure non-root permissions and drop privileges
RUN chown -R node:node /app
USER node

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Lightweight healthcheck without curl using Node's http module
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', r => process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# Run the app when the container launches
CMD ["npm", "start"]
