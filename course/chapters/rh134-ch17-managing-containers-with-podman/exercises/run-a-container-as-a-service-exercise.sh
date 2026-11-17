kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 8
#^ Exercise: Run a Container as a Service
# Requirements
#   Host: servera
#   Prerequisite exercise: Mount Web Content
#   Serve a page from a container that starts at boot, as a service of a user of its own
# Steps
#   1. Create the user webapp with a password
#   2. Log in as webapp with SSH and run a web container on host port 8083
#   3. Generate a unit for the container and start it as a service
#   4. Log out and test the page
#   5. Enable lingering for webapp and test again
#   6. Reboot servera and test again
clear

#^ 1. Create the user webapp with a password
sudo useradd webapp
sudo passwd webapp
redhat
redhat
clear

#^ 2. Log in as webapp with SSH and run a web container on host port 8083
#! SSH, not su - or sudo -iu: only a login session gives webapp a systemd of its own
ssh webapp@servera
redhat
#! webapp has an image store of its own, so it starts empty
podman images
mkdir ~/html
echo '<h1>Intranet: running as a service</h1>' > ~/html/index.html
#! webapp pulls the image for itself
#@ pause 12
podman run -d --name intranet -p 8083:8080 -v ~/html:/var/www/html:Z registry.access.redhat.com/ubi10/httpd-24
curl -s localhost:8083
clear

#^ 3. Generate a unit for the container and start it as a service
mkdir -p ~/.config/systemd/user
cd ~/.config/systemd/user
#! The two network options make the service wait for servera's network at boot; without them the port does not answer after a reboot
podman generate systemd --new --files --name \
--wants podman-user-wait-network-online.service \
#@ pause 5
--after podman-user-wait-network-online.service intranet
#! --new makes the service create its own container, so remove this one
podman rm -f intranet
systemctl --user daemon-reload
systemctl --user enable --now container-intranet
curl -s localhost:8083
clear

#^ 4. Log out and test the page
#! systemd stops webapp's services about 10 seconds after its last session ends
#@ pause 15
exit
#! Without -s, curl says why it failed
curl localhost:8083
clear

#^ 5. Enable lingering for webapp and test again
sudo loginctl enable-linger webapp
#@ pause 5
loginctl list-users
curl -s localhost:8083
clear

#^ 6. Reboot servera and test again
#@ pause 15
sudo systemctl reboot
ssh servera
curl -s localhost:8083
#! student has containers of its own, and none are running: webapp's are not listed
podman ps
clear

#^ Clean up
#! disable-linger stops webapp's services; the pause lets them end before the user is deleted
#@ pause 5
sudo loginctl disable-linger webapp
sudo userdel -r webapp
#@ pause 10
sudo dnf remove -y podman

# Complete
