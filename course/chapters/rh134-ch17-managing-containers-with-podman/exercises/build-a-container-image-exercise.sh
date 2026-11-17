kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 10
#^ Exercise: Build a Container Image
# Requirements
#   Host: servera
#   Prerequisite exercise: Manage a Container
#   Build your own web server image, then change the page it serves
# Steps
#   1. Write a page and a Containerfile that copies it into a UBI 10 image with httpd
#   2. Build it as intranet:1.0, run it with host port 8082, and test it
#   3. Change the page and test again
#   4. Build intranet:1.1 and replace the container with one from it
#   5. Test again and list your images
clear

#^ 1. Write a page and a Containerfile that copies it into a UBI 10 image with httpd
mkdir ~/intranet-image
cd ~/intranet-image
echo '<h1>Intranet: under construction</h1>' > index.html
vim Containerfile
#@ noenter
i
FROM registry.access.redhat.com/ubi10/ubi
RUN dnf install -y httpd
COPY index.html /var/www/html/
EXPOSE 80
#@ pause 5
#@ noenter
CMD ["/usr/sbin/httpd", "-DFOREGROUND"]
#@ key escape
:wq
cat Containerfile
clear

#^ 2. Build it as intranet:1.0, run it with host port 8082, and test it
#! Every step runs the first time, so dnf prints its whole install
#@ pause 15
podman build -t intranet:1.0 .
#! This image's httpd listens on port 80, as its EXPOSE line records
podman run -d --name intranet -p 8082:80 intranet:1.0
curl -s localhost:8082
clear

#^ 3. Change the page and test again
echo '<h1>Intranet: open for business</h1>' > index.html
cat index.html
#! Still the old page: the container serves the copy inside its image
#@ pause 5
curl -s localhost:8082
clear

#^ 4. Build intranet:1.1 and replace the container with one from it
#! STEP 2 comes from the cache; COPY finds a new index.html, so it and the steps after it run again
#@ pause 8
podman build -t intranet:1.1 .
podman stop intranet
podman rm intranet
podman run -d --name intranet -p 8082:80 intranet:1.1
clear

#^ 5. Test again and list your images
curl -s localhost:8082
#@ pause 5
podman images
#! Cleanup: the next exercise runs intranet:1.1 in a container of its own
podman stop intranet
podman rm intranet

# Complete
