kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 8
#^ Exercise: Manage Container Images
# Requirements
#   Host: servera
#   Prerequisite exercise: Run Your First Container
#   Find, download, inspect, and remove web server images
# Steps
#   1. Find the registries Podman searches
#   2. Search the registries for an httpd-24 image
#   3. Pull ubi10/httpd-24 from registry.access.redhat.com and httpd from docker.io
#   4. List the local images
#   5. Find the ports each httpd image exposes
#   6. Remove the docker.io image
clear

#^ 1. Find the registries Podman searches
grep ^unqualified /etc/containers/registries.conf
clear

#^ 2. Search the registries for an httpd-24 image
#! registry.access.redhat.com does not answer searches; its UBI images are listed under registry.redhat.io
#@ pause 6
podman search httpd-24
clear

#^ 3. Pull ubi10/httpd-24 from registry.access.redhat.com and httpd from docker.io
#! The same UBI image as registry.redhat.io/ubi10/httpd-24, without a login
#@ pause 6
podman pull registry.access.redhat.com/ubi10/httpd-24
#@ pause 5
podman pull docker.io/library/httpd
clear

#^ 4. List the local images
#@ pause 5
podman images
clear

#^ 5. Find the ports each httpd image exposes
podman image inspect --format '{{.Config.ExposedPorts}}' ubi10/httpd-24
podman image inspect --format '{{.Config.ExposedPorts}}' docker.io/library/httpd
#! Red Hat's image listens on 8080 and 8443, Docker Hub's on 80
clear

#^ 6. Remove the docker.io image
podman rmi docker.io/library/httpd
#@ pause 5
podman images

# Complete
