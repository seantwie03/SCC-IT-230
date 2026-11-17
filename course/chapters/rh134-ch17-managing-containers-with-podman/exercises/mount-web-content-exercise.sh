kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 8
#^ Exercise: Mount Web Content
# Requirements
#   Host: servera
#   Prerequisite exercise: Build a Container Image
#   Serve a page straight from the host's disk through your own intranet:1.1 image
# Steps
#   1. Create a web page in ~/intranet/html
#   2. Run intranet:1.1 with that directory mounted, and test it
#   3. Find out why the page is not served
#   4. Run it again with :Z and test it
#   5. Edit the page on the host twice, testing after each edit
clear

#^ 1. Create a web page in ~/intranet/html
mkdir -p ~/intranet/html
echo '<h1>Intranet: served from the host</h1>' > ~/intranet/html/index.html
cat ~/intranet/html/index.html
clear

#^ 2. Run intranet:1.1 with that directory mounted, and test it
podman run -d --name intranet -p 8082:80 -v ~/intranet/html:/var/www/html intranet:1.1
#! The test page's title: httpd served neither our page nor the one baked into the image
curl -s localhost:8082 | grep '<title>'
clear

#^ 3. Find out why the page is not served
podman exec -it intranet /bin/bash
#! Even root inside the container is refused: that is SELinux, not file permissions
cat /var/www/html/index.html
exit
#@ pause 5
ls -dZ ~/intranet/html
clear

#^ 4. Run it again with :Z and test it
podman rm -f intranet
podman run -d --name intranet -p 8082:80 -v ~/intranet/html:/var/www/html:Z intranet:1.1
#! The mounted page covers the one baked into intranet:1.1
curl -s localhost:8082
#@ pause 5
ls -dZ ~/intranet/html
clear

#^ 5. Edit the page on the host twice, testing after each edit
echo '<h1>Intranet: edited on the host</h1>' > ~/intranet/html/index.html
curl -s localhost:8082
echo '<p>No rebuild needed</p>' >> ~/intranet/html/index.html
#@ pause 5
curl -s localhost:8082
clear

#^ Clean up
podman stop intranet
podman rm intranet
#! Removes every image no container uses: both intranet versions and the two UBI images
podman image prune -a
y
cd ~
rm -rf ~/intranet ~/intranet-image

# Complete
