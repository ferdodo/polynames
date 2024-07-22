FROM node
WORKDIR /polynames/design-system
COPY package.json .
COPY npm-shrinkwrap.json .
RUN npm config set maxsockets 1
RUN npm install
RUN npm audit --audit-level=low
COPY . .
RUN npm run build
CMD npm run start
