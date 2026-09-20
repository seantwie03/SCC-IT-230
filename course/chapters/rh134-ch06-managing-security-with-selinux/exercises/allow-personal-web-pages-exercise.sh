kitten @ set-font-size 30.0 && ssh workstation
clear

#@ pause 10
#^ Exercise: Allow Users to Have Personal Web Pages
# Requirements
#   Host: workstation
#   Prerequisite: Set Up a Basic Web Server
#   Configure Apache's UserDir feature
# Steps
#   1. Create a personal web page for the student user
#   2. Enable Apache's UserDir feature
#   3. Test the configuration
#   4. Fix permissions (DAC)
#   5. Test again to observe a different failure
#   6. Troubleshoot: sealert and getsebool
#   7. Turn on the SELinux boolean (MAC)
#   8. Verify the results
#   9. Clean up
clear

#^ 1. Create a personal web page for the student user
mkdir ~/public_html
vim ~/public_html/index.html
#@ noenter
i<h1>Hello from student's home directory</h1>
#@ pause 5
#@ key escape
:wq
cat ~/public_html/index.html
clear

#^ 2. Enable Apache's UserDir feature
#! Keep a copy of the original for the cleanup step. Only files ending in .conf are loaded.
sudo cp /etc/httpd/conf.d/userdir.conf /etc/httpd/conf.d/userdir.conf.orig
sudo vim /etc/httpd/conf.d/userdir.conf
/UserDir disabled
#@ noenter
I#
#@ key escape
/#UserDir public_html
#@ noenter
#@ pause 5
x
:wq
sudo systemctl restart httpd.service
#@ pause 5
systemctl status httpd.service --no-pager
clear

#^ 3. Test the configuration
#! Expect 403 Forbidden: Apache cannot traverse the home directory (700 permissions)
#@ pause 5
curl http://localhost/~student/
sudo ls /var/log/httpd
sudo less /var/log/httpd/error_log
#@ noenter
#@ pause 6
G
#@ noenter
q
ls -ld ~
clear

#^ 4. Fix permissions (DAC)
#! chmod 711 lets apache traverse the home directory without being able to list it
chmod 711 ~
ls -ld ~
ls -ld ~/public_html
clear

#^ 5. Test again to observe a different failure
#! Still 403 Forbidden, but now SELinux is the reason
#@ pause 5
curl http://localhost/~student/
clear

#^ 6. Troubleshoot: sealert and getsebool
#@ pause 8
sudo sealert -a /var/log/audit/audit.log | less
#@ pause 6
/home/student
#@ noenter
q
getsebool httpd_enable_homedirs
clear

#^ 7. Turn on the SELinux boolean (MAC)
#@ pause 6
sudo setsebool -P httpd_enable_homedirs on
getsebool httpd_enable_homedirs
clear

#^ 8. Verify the results
curl http://localhost/~student/
clear

#^ 9. Clean up
sudo setsebool -P httpd_enable_homedirs off
chmod 700 ~
rm -rf ~/public_html
sudo mv /etc/httpd/conf.d/userdir.conf.orig /etc/httpd/conf.d/userdir.conf
sudo systemctl disable --now httpd.service
sudo rm -f /var/www/html/index.html
#@ pause 6
sudo dnf remove -y httpd
