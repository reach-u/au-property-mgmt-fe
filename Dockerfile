FROM httpd:2.4

COPY ./docker /usr/local/
COPY ./build /usr/local/apache2/htdocs/
