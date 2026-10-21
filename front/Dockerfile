FROM node AS deps
WORKDIR /polynames/front
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm config set maxsockets 1
RUN npm install
RUN npm audit --audit-level=high

FROM polynames-core
WORKDIR /polynames/front
COPY --from=polynames-front-deps /polynames/front /polynames/front

COPY . .

ARG VITE_BACK_DOMAIN
ARG VITE_WEBSOCKET_PROTOCOL
ARG VITE_BACK_PORT
ARG VITE_PROD_BACK_DOMAIN
ARG VITE_PROD_WEBSOCKET_PROTOCOL
ARG VITE_PROD_BACK_PORT

RUN npm run build

RUN : "${VITE_PROD_BACK_DOMAIN:?}" "${VITE_PROD_WEBSOCKET_PROTOCOL:?}" "${VITE_PROD_BACK_PORT:?}" && \
	VITE_BACK_DOMAIN=$VITE_PROD_BACK_DOMAIN \
	VITE_WEBSOCKET_PROTOCOL=$VITE_PROD_WEBSOCKET_PROTOCOL \
	VITE_BACK_PORT=$VITE_PROD_BACK_PORT \
	npx vite build --outDir dist-prod

CMD npm run start
