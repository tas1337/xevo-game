# ---- Build Angular App ----
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# You might want to use a web server like nginx to serve the static files
FROM nginx
COPY --from=build /app/dist/public /usr/share/nginx/html