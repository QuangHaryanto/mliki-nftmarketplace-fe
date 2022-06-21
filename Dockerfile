# build environment
FROM node:14.18.1 as build
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN yarn install
RUN yarn build

# production environment
FROM nginx:1.21.4-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "nginx","-g", "daemon off;"]
