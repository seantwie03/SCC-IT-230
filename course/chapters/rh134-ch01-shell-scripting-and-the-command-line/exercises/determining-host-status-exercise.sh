kitten @ set-font-size 30.0 && ssh servera
clear

#^ Exercise: Determining Host Status
# Requirements
#   Host: servera
#   Script location: /home/student/scripts/pinger.sh
#   Report which addresses used by the finance application are reachable
# Tasks
#   1. Create a basic script file
#   2. Make it executable
#   3. Write a basic for loop
#   4. Branch on the result of ping
#   5. Silence the ping output
#   6. Clean up
clear

#^ 1. Create a basic script file
mkdir -p ~/scripts
cd ~/scripts
vim pinger.sh
#! Press enter, backspace, enter after the next command.
i#!/bin/bash
echo "Starting $0"
jj:wq

#^ 2. Make it executable
chmod a+x pinger.sh
./pinger.sh
clear

#^ 3. Write a basic for loop
#! Three of these addresses are on our network and two are not.
vim pinger.sh
/Starting \$0
o
finance_app_ips="172.25.250.9 19.19.19.18 172.25.250.10 19.19.19.19 172.25.250.11"
for host in $finance_app_ips; do
    echo "Checking $host..."
done
jj:wq
./pinger.sh
clear

#^ 4. Branch on the result of ping
#! ping returns 0 when the host answers and 1 when it does not. if reads that number.
vim pinger.sh
/echo "Checking \$host..."
o
    if ping -c1 -W1 "$host"; then
        echo "$host is UP"
    else
        echo "$host is DOWN"
    fi
jj:wq
./pinger.sh
clear

#^ 5. Silence the ping output
#! The report is buried in ping's own output. Send that output to /dev/null.
vim pinger.sh
/if ping -c1
f;
i
 > /dev/null
jj:wq
cat pinger.sh
clear
./pinger.sh
clear

#^ 6. Clean up
rm ~/scripts/pinger.sh
cd ~
