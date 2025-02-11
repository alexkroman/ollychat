# Use the official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /ollychat

# Copy package.json and package-lock.json (if available) first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on (if applicable)
EXPOSE 3000

ENV APP_MODE="cli"

# Define the command to run your app
CMD ["sh", "-c", "if [ \"$APP_MODE\" = 'cli' ]; then npm run cli:start; else npm run slack:start; fi"]
