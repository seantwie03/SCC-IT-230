kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 10
#^ Exercise: Manage a Container
# Requirements
#   Hosts: servera, workstation
#   Prerequisite exercise: Manage Container Images
#   Run, explore, and remove containers
# Steps
#   1. Remove the stopped containers left from the first exercise
#   2. Run the httpd image in the foreground, then stop it
#   3. Run it in the background as intranet, publishing host port 8081
#   4. Check it with curl and podman logs
#   5. Open a shell in it and look around
#   6. Reach it from workstation
#   7. Print an environment variable from a container that removes itself
#   8. Stop and remove intranet
clear

#^ 1. Remove the stopped containers left from the first exercise
#@ pause 5
podman ps -a
podman rm -a
clear

#^ 2. Run the httpd image in the foreground, then stop it
#! --rm removes the container as soon as it stops
#@ pause 6
podman run --rm registry.access.redhat.com/ubi10/httpd-24
#@ key ctrl+c
podman ps -a
clear

#^ 3. Run it in the background as intranet, publishing host port 8081
podman run -d --name intranet -p 8081:8080 registry.access.redhat.com/ubi10/httpd-24
#@ pause 5
podman ps
clear

#^ 4. Check it with curl and podman logs
#! No index.html yet, so httpd answers with Red Hat's test page
curl -s localhost:8081 | grep '<title>'
#@ pause 6
podman logs intranet
clear

#^ 5. Open a shell in it and look around
podman exec -it intranet /bin/bash
id
#! The image carries httpd and what it needs, not ps
ps aux
ls /var/www/html
exit
clear

#^ 6. Reach it from workstation
sudo firewall-cmd --add-port=8081/tcp
exit
ssh workstation
curl -s servera:8081 | grep '<title>'
exit
ssh servera
clear

#^ 7. Print an environment variable from a container that removes itself
podman run --rm -e GREETING=Hello registry.access.redhat.com/ubi10/ubi printenv GREETING
clear

#^ 8. Stop and remove intranet
podman stop intranet
podman rm intranet
podman ps -a
#! Cleanup: close the port again
sudo firewall-cmd --remove-port=8081/tcp

# Complete
