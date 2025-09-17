# Frontend Dockerfile for Google Sheets Task Tracker
FROM node:20-bullseye

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Ensure non-root permissions and drop privileges
RUN chown -R node:node /app
USER node

# Expose port
EXPOSE 3000

# Healthcheck using Node's http module
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', r => process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

# Start development server
CMD ["npm", "start"]
