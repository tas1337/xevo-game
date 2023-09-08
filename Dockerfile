
# Step 1: Build the Angular application in a Node.js environment
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Step 2: Serve the Angular app using Nginx
FROM nginx:alpine
# Copy Angular build artifacts from build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom Nginx configuration
COPY custom_nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

