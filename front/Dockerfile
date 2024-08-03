FROM node AS deps
WORKDIR /polynames/front
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm config set maxsockets 1
RUN npm install
RUN npm audit --audit-level=low

FROM polynames-core
WORKDIR /polynames/front
COPY --from=0 /polynames/front /polynames/front

COPY . .

ARG VITE_BACK_DOMAIN
ARG VITE_WEBSOCKET_PROTOCOL

RUN npm run build
CMD npm run start
