FROM node:lts

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install

CMD [ "/bin/bash" ]



