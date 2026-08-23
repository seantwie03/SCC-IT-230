kitten @ set-font-size 30.0 && ssh servera
clear
#^ Task: Search the System Log with grep

#^ Find every line that mentions the SSH service
#! /var/log/messages is mode 0600 and owned by root, so every search needs sudo.
sudo grep 'sshd' /var/log/messages
clear

#^ Read the neighborhood around a match with -C
#! -C3 prints three lines on each side. Good when you do not yet know what you are looking for.
sudo grep -C3 'Startup finished' /var/log/messages
clear

#^ Read forward from a match with -A
#! You have the event and want to know what happened next.
sudo grep -A2 'Reached target' /var/log/messages
clear

#^ Read backward from a match with -B
#! You have the symptom and want to know what led to it.
sudo grep -B2 'Startup finished' /var/log/messages
clear

#^ Remove the noise with -v
#! First the noisy search.
sudo grep 'systemd' /var/log/messages
#! Now drop every line that also mentions the user manager.
sudo grep 'systemd' /var/log/messages | grep -v 'systemd --user'
clear

#^ Search for two services at once with -e
sudo grep -e 'sshd' -e 'chronyd' /var/log/messages
clear

#^ Ignore capitalization with -i
#! Without -i this misses every line that spells it "Finished".
sudo grep 'finished' /var/log/messages
sudo grep -i 'finished' /var/log/messages
clear
