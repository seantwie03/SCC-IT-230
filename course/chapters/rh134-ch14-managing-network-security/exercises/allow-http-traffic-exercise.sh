kitten @ set-font-size 30.0 && ssh workstation
clear

#@ pause 8
#^ Exercise: Allow HTTP Traffic
# Requirements
#   Host: servera, from workstation
#   Install a web server on servera and let workstation reach it
# Steps
#   1. Install httpd and write a page
#   2. Enable and start the service
#   3. Request the page from workstation
#   4. Inspect what the zone allows
#   5. Allow the http service
#   6. Request the page again
#   7. Keep the change
clear

#^ 1. Install httpd and write a page
ssh student@servera
#@ pause 5
sudo dnf install -y httpd
#@ pause 10
clear
echo "<h1>Welcome to servera</h1>" | sudo tee /var/www/html/index.html
clear

#^ 2. Enable and start the service
sudo systemctl enable --now httpd
#@ pause 5
systemctl is-active httpd
curl http://localhost/
#! It serves the page to itself. The question is whether anyone else can reach it
clear

#^ 3. Request the page from workstation
exit
#@ pause 4
curl http://servera/
#@ pause 6
#! Refused immediately. The server is running, so something in front of it said no
clear

#^ 4. Inspect what the zone allows
ssh student@servera
#@ pause 5
sudo firewall-cmd --list-services
#! cockpit, dhcpv6-client, and ssh. No http, so port 80 is not open
clear

#^ 5. Allow the http service
sudo firewall-cmd --add-service=http
sudo firewall-cmd --list-services
#@ pause 6
clear

#^ 6. Request the page again
exit
#@ pause 4
curl http://servera/
#@ pause 6
#! Same server, same page, one service opened
clear

#^ 7. Keep the change
ssh student@servera
#@ pause 5
sudo firewall-cmd --list-services --permanent
#! The permanent config still has no http. A reload would undo the work
sudo firewall-cmd --runtime-to-permanent
sudo firewall-cmd --list-services --permanent
#@ pause 6
#! Now it survives a reload and a reboot

# Complete
