kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Serving a Web Page
# Requirements
#   Hosts: servera
#   Home page at http://localhost/
#   Second page at http://localhost/about/contact-us.html
# Tasks
#   1. Install httpd
#   2. Write a home page
#   3. Enable and start the service
#   4. Add a page in a subdirectory
#   5. Clean up
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
#@ noenter
i<h1>Welcome to servera</h1>
#@ key escape
:wq
clear

#^ 3. Enable and start the service
systemctl enable --now httpd
systemctl is-active httpd
curl http://localhost/
clear

#^ 4. Add a page in a subdirectory
mkdir /var/www/html/about
vim /var/www/html/about/contact-us.html
#@ noenter
i<h1>Contact Us</h1>
#@ key escape
:wq
curl http://localhost/about/contact-us.html
#! The URL path is the file path under DocumentRoot
clear

#^ 5. Clean up
sudo systemctl disable --now httpd
sudo rm -rf /var/www/html/index.html /var/www/html/about
#@ pause 6
sudo dnf remove -y httpd

