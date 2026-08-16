kitten @ set-font-size 30.0 && ssh servera
clear
#^ Task: Demonstrate finding and navigating Man Pages

#^ Open the man page for ls
man ls
#! Show: Spacebar, G, g, / '  -a', n, N, b, ?
#! If you forget any of these, less also has a man page
man less
q

#^ Search for man pages
#! First need to update the manual database
sudo mandb
man -k find
clear
man -k systemd
clear
man -k selinux
clear
man -k conf
clear

#^ Yes man has a man page
man man
q

#^ It is TOTALLY normal to look at the man page for the touch command
man touch
q
