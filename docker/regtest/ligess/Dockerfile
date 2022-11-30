FROM node:bullseye

RUN apt-get update -y \
  && apt-get install -y curl gosu git xxd \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN git clone https://github.com/Dolu89/ligess.git
RUN cd ligess && yarn

COPY docker-entrypoint.sh /entrypoint.sh
RUN mkdir -p /home/ligess

RUN chmod a+x /entrypoint.sh

VOLUME ["/home/lnd/.lnd"]

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
