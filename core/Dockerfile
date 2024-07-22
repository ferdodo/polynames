FROM node
WORKDIR /polynames/core
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm config set maxsockets 1
RUN npm install
RUN npm audit --audit-level=moderate

FROM polynames-design-system
WORKDIR /polynames/core
COPY --from=0 /polynames/core /polynames/core

COPY . .

RUN npm run build
