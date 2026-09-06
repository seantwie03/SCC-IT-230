kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Serving a Web Page
# Requirements
#   Hosts: servera and workstation
#   Home page at http://servera/
#   Second page at http://servera/about/contact-us.html
# Tasks
#   1. Install httpd
#   2. Write a home page
#   3. Enable and start the service
#   4. Add a page in a subdirectory
#   5. Reach both pages from workstation
#   6. Clean up
clear

#^ 1. Install httpd
sudo -i
dnf install -y httpd
#! Installed but not running. httpd ships disabled.
systemctl is-enabled httpd
systemctl is-active httpd
clear

#^ 2. Write a home page
grep DocumentRoot /etc/httpd/conf/httpd.conf
vim /var/www/html/index.html
i<h1>Welcome to servera</h1>
jj:wq
clear

#^ 3. Enable and start the service
systemctl enable --now httpd
systemctl is-active httpd
curl http://localhost/
clear

#^ 4. Add a page in a subdirectory
mkdir /var/www/html/about
vim /var/www/html/about/contact-us.html
i<h1>Contact Us</h1>
jj:wq
curl http://localhost/about/contact-us.html
#! The URL path is the file path under DocumentRoot
clear

#^ 5. Reach both pages from workstation
exit
ssh workstation
#! This will hang, because firewalld has not been told about port 80
curl --max-time 5 http://servera/
exit
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --reload
sudo firewall-cmd --list-services
ssh workstation
curl http://servera/
curl http://servera/about/contact-us.html
exit
clear

#^ 6. Clean up
sudo firewall-cmd --remove-service=http --permanent
sudo firewall-cmd --reload
sudo systemctl disable --now httpd
sudo rm -rf /var/www/html/index.html /var/www/html/about
sudo dnf remove -y httpd
