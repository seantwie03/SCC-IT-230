kitten @ set-font-size 30.0 && ssh workstation
clear

#^ Exercise: Set Up a Basic Web Server
# Requirements
#   Host: workstation
#   Install a basic web server and view its SELinux labels
# Steps
#   1. Install the httpd package
#   2. Create a web page
#   3. Enable and start the systemd service
#   4. Verify the results
clear

#^ 1. Install the httpd package
sudo dnf install httpd -y
clear

#^ 2. Create a web page
sudo vim /var/www/html/index.html
#@ noenter
i<h1>Welcome to Workstation</h1>
#@ key escape
:wq
ls -lZ /var/www/html/index.html
#! httpd_sys_content_t: the page was created inside /var/www
clear

#^ 3. Enable and start the systemd service
sudo systemctl enable httpd.service --now
systemctl status httpd.service --no-pager
ps -AZ | grep httpd
#! Every httpd process runs as httpd_t
clear

#^ 4. Verify the results
curl http://localhost/
#! Leave httpd running. The next exercises use this web server.
