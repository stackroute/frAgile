FROM quizrtsocial/base-image
WORKDIR /usr/src/service

RUN mkdir /data/chathistory/ -p

COPY package.json /usr/src/service
RUN npm install --production

COPY chatservice.js /usr/src/service

CMD ["npm","start","--production"]
