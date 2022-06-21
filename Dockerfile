# build environment
FROM node:14.18.1 as build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN yarn install
RUN yarn build

# production environment
FROM nginx:1.21.4-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx","-g", "daemon off;"]
