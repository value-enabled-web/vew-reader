FROM node:bullseye

ARG GH_ACCESS_TOKEN

RUN apt-get update -y \
  && apt-get install -y curl gosu git \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN git clone https://${GH_ACCESS_TOKEN}@github.com/seetee-io/vew-accounts.git
RUN cd vew-accounts && npm install

COPY docker-entrypoint.sh /entrypoint.sh
COPY .env /vew-accounts/.env
RUN mkdir -p /home/vewaccounts

RUN chmod a+x /entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
