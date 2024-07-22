FROM node
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
RUN npm run build
CMD npm run start
