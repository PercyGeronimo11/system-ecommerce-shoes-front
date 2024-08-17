# Use a base image of Node.js to build and run the project
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Angular CLI
RUN npm install -g @angular/cli@18.0.0-next.3

# Install the application's dependencies
RUN npm install --legacy-peer-deps

# Fix vulnerabilities (optional)
RUN npm audit fix --force

# Copy the rest of the project files
COPY . .

# Expose the port that the Angular application will use
EXPOSE 4200

# Default command to run the Angular application
CMD ["ng", "serve", "--port", "4200", "--host", "0.0.0.0"]
