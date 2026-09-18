kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Allow Apache to Send Email
# Requirements
#   Host: servera
#   Allow Apache to send email
# Steps
#   1. Find the appropriate SELinux boolean
#   2. View the current value of the boolean
#   3. Permanently set the boolean to allow Apache to send mail
#   4. Verify the boolean is set
#   5. Clean up
clear

#^ 1. Find the appropriate SELinux boolean
#! selinux-policy-doc installs a man page for each SELinux domain
sudo dnf install selinux-policy-doc -y
clear
man -k _selinux | grep httpd
man 8 httpd_selinux
/mail
#@ noenter
q
clear

#^ 2. View the current value of the boolean
getsebool httpd_can_sendmail
sudo semanage boolean -l | grep httpd_can_sendmail
clear

#^ 3. Permanently set the boolean to allow Apache to send mail
sudo setsebool -P httpd_can_sendmail on
clear

#^ 4. Verify the boolean is set
getsebool httpd_can_sendmail
sudo semanage boolean -l | grep httpd_can_sendmail
clear

#^ 5. Clean up
sudo setsebool -P httpd_can_sendmail off
sudo dnf remove -y selinux-policy-doc
