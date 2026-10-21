FROM node AS deps
WORKDIR /polynames/core
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm config set maxsockets 1
RUN npm install
RUN npm audit --audit-level=high

FROM polynames-design-system
WORKDIR /polynames/core
COPY --from=polynames-core-deps /polynames/core /polynames/core

COPY . .

RUN npm run build
