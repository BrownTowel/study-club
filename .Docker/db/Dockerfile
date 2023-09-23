FROM mariadb:10.6.14

RUN touch /var/log/mysql/mysqld.log

ADD my.cnf /etc/mysql/conf.d/my.cnf
RUN chmod 644 /etc/mysql/my.cnf
