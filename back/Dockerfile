FROM node as deps
WORKDIR /polynames/back
RUN npm config set maxsockets 1
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm install
RUN npm audit --audit-level=moderate

FROM polynames-core
WORKDIR /polynames/back
COPY --from=0 /polynames/back /polynames/back

COPY . .
RUN npm run build
CMD npm run start