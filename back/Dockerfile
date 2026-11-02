FROM node:slim AS deps
WORKDIR /polynames/back
RUN npm config set maxsockets 1
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm install
RUN npm audit --audit-level=high

FROM polynames-core
WORKDIR /polynames/back
COPY --from=polynames-back-deps /polynames/back /polynames/back

COPY . .
RUN npm run build
CMD npm run start