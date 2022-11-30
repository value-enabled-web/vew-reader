FROM golang:bullseye

ARG LNDHUB_VERSION
ENV PATH=/opt/lndhub.go-${LNDHUB_VERSION}:$PATH

RUN apt-get update -y \
  && apt-get install -y curl gosu make \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN curl -SLO https://github.com/getAlby/lndhub.go/archive/refs/tags/${LNDHUB_VERSION}.tar.gz \
  && tar -xzf *.tar.gz -C /opt \
  && rm *.tar.gz

RUN cd /opt/lndhub.go-${LNDHUB_VERSION} && make

COPY docker-entrypoint.sh /entrypoint.sh
RUN mkdir -p /home/lndhub

RUN chmod a+x /entrypoint.sh

VOLUME ["/home/lnd/.lnd"]

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
