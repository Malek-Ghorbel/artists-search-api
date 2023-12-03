# Use an official Node.js runtime as a parent image
FROM node:14


WORKDIR /app

COPY package.json /app


RUN npm install

COPY src ./src


COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]
