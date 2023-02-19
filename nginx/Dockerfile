FROM nginx:1.17.4-alpine

RUN apk add --no-cache bash

COPY wait.sh /wait.sh

RUN chmod +x /wait.sh

CMD ["/wait.sh", "react:3000", "--", "nginx", "-g", "daemon off;"]

# confファイルのバックアップ
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.org
# 用意したconfファイルをコピー
COPY default.conf /etc/nginx/conf.d
