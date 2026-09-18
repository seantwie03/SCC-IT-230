kitten @ set-font-size 30.0 && ssh workstation
clear

#^ Exercise: Fix SELinux Label on about.html File
# Requirements
#   Host: workstation
#   Prerequisite: Add New Web Page
#   Apply the correct label to about.html
# Steps
#   1. Inspect the policy for /var/www
#   2. Use restorecon to apply the policy to /var/www recursively
#   3. Verify access to about.html
#   4. Test cp vs mv: what if we had copied instead?
#   5. Clean up the test pages
clear

#^ 1. Inspect the policy for /var/www
sudo semanage fcontext -l | grep '/var/www' | head -n5
clear

#^ 2. Use restorecon to apply the policy to /var/www recursively
sudo restorecon -Rv /var/www
ls -lZ /var/www/html/
clear

#^ 3. Verify access to about.html
getenforce
curl http://localhost/about.html
clear

#^ 4. Test cp vs mv: what if we had copied instead?
echo '<h1>About Us - Again</h1>' > /tmp/about2.html
ls -lZ /tmp/about2.html
#! cp creates a new file, so the copy takes the label its new directory calls for
sudo cp /tmp/about2.html /var/www/html/about2.html
ls -lZ /var/www/html/about2.html
curl http://localhost/about2.html
clear

#^ 5. Clean up the test pages
sudo rm -f /var/www/html/about.html /var/www/html/about2.html /tmp/about2.html
ls -lZ /var/www/html/
