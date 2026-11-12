kitten @ action --self change_font_size current 30 && ssh servera
clear

#@ pause 10
#^ Exercise: Determining Host Status
# Requirements
#   Host: servera
#   Script location: /home/student/scripts/pinger.sh
#   Report which addresses used by the finance application are reachable
# Steps
#   1. Create a basic script file
#   2. Make it executable and run it
#   3. Loop over a list of addresses and announce each one as it is checked
#   4. Branch on the result of ping to report each host as up or down
#   5. Silence the ping output so only your own report remains
#   6. Confirm that both a reachable and an unreachable address are reported correctly
clear

#^ 1. Create a basic script file
mkdir -p ~/scripts
cd ~/scripts
vim pinger.sh
#! Students' vim adds # after the hashbang; Enter, Backspace, Enter clears it
i#!/bin/bash
#@ noenter
echo "Starting $0"
#@ key escape
:wq
clear

#^ 2. Make it executable and run it
chmod a+x pinger.sh
./pinger.sh
clear

#^ 3. Loop over a list of addresses and announce each one as it is checked
#! Three of these addresses are on the lab network and two are not
vim pinger.sh
/Starting \$0
#@ noenter
o
finance_app_ips="172.25.250.9 19.19.19.18 172.25.250.10 19.19.19.19 172.25.250.11"
for host in $finance_app_ips; do
    echo "Checking $host..."
#@ pause 5
#@ noenter
done
#@ key escape
:wq
./pinger.sh
clear

#^ 4. Branch on the result of ping to report each host as up or down
#! ping returns 0 when the host answers and 1 when it does not; if reads that number
vim pinger.sh
/echo "Checking \$host..."
#@ noenter
o
    if ping -c1 -W1 "$host"; then
        echo "$host is UP"
    else
        echo "$host is DOWN"
#@ pause 5
#@ noenter
    fi
#@ key escape
:wq
#@ pause 10
./pinger.sh
clear

#^ 5. Silence the ping output so only your own report remains
#! The report is buried in ping's own output; send that output to /dev/null
vim pinger.sh
/if ping -c1
#@ noenter
f;
#@ noenter
i
#@ pause 5
#@ noenter
 > /dev/null
#@ key escape
:wq
#@ pause 5
cat pinger.sh
clear

#^ 6. Confirm that both a reachable and an unreachable address are reported correctly
#! The 172.25.250 addresses answer; the 19.19.19 ones do not
#@ pause 10
./pinger.sh
clear

#^ Clean up
#! Nothing later uses this script
\rm ~/scripts/pinger.sh

# Complete
