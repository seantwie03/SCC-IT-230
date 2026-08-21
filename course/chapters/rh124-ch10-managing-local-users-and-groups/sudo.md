---
layout: center
routeAlias: sudo
topicInfo:
  alignments:
    redHatAcademy:
      - course: RH124
        chapter: "10"
        title: Managing Local Users and Groups
    rhcsaCertGuide:
      - chapter: "06"
        title: User and Group Management
---

# Sudo

<div class="mx-auto pt-4">

![xkcd comic #149, "Sandwich": a user runs a command as a regular user and is refused, then prefixes it with sudo and the computer complies.](./assets/sudo-xkcd_149.png)

</div>

<div class="text-center text-sm">

[xkcd #149, "Sandwich"](https://xkcd.com/149/) — used under [CC BY-NC 2.5](https://creativecommons.org/licenses/by-nc/2.5/)

</div>

---
layout: center
---

# `sudo` runs a command as a different user.
## If no user is specified, it runs as the `root` user.

---
vertical: start
---

# Accessing a Sensitive File as a Regular User

Logged in as the `student` user.

Try to access `/var/log/secure`

<TerminalWindow title="student@servera:~">

````md magic-move
```bash-session
student@servera:~$
```
```bash-session
student@servera:~$ ls -l /var/log/secure
```
```bash-session
student@servera:~$ ls -l /var/log/secure
-rw-------. 1 root root 1646 Jan  6 12:52 /var/log/secure
student@servera:~$
```
```bash-session
student@servera:~$ ls -l /var/log/secure
-rw-------. 1 root root 1646 Jan  6 12:52 /var/log/secure
student@servera:~$ cat /var/log/secure
```
```bash-session
student@servera:~$ ls -l /var/log/secure
-rw-------. 1 root root 1646 Jan  6 12:52 /var/log/secure
student@servera:~$ cat /var/log/secure
cat: /var/log/secure: Permission denied
student@servera:~$
```
```bash-session
student@servera:~$ ls -l /var/log/secure
-rw-------. 1 root root 1646 Jan  6 12:52 /var/log/secure
student@servera:~$ cat /var/log/secure
cat: /var/log/secure: Permission denied
student@servera:~$ sudo cat /var/log/secure
```
```bash-session
student@servera:~$ ls -l /var/log/secure
-rw-------. 1 root root 1646 Jan  6 12:52 /var/log/secure
student@servera:~$ cat /var/log/secure
cat: /var/log/secure: Permission denied
student@servera:~$ sudo cat /var/log/secure
Password: ***must provide student's password***
```
```bash-session
student@servera:~$ ls -l /var/log/secure
-rw-------. 1 root root 1646 Jan  6 12:52 /var/log/secure
student@servera:~$ cat /var/log/secure
cat: /var/log/secure: Permission denied
student@servera:~$ sudo cat /var/log/secure
Jan  6 12:26:47 servera sshd-session[3269]: Accepted publickey for student from 172.25.250.1 port 45098 ssh2:...
Jan  6 12:26:47 servera (systemd)[3274]: pam_unix(systemd-user:session): session opened for user student(uid=1000)...
Jan  6 12:26:47 servera sshd-session[3269]: pam_unix(sshd:session): session opened for user student(uid=1000) by...
...
student@servera:~$
```
````

</TerminalWindow>

---
vertical: start
---

# Without Using `sudo`

If I wanted to view the file without using `sudo`

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
student@servera:~$
```
```bash-session
student@servera:~$ su - root
```
```bash-session
student@servera:~$ su - root
Password: ***must provide root's password***
```
```bash-session
student@servera:~$ su - root
root@servera:~#
```
```bash-session
student@servera:~$ su - root
root@servera:~# cat /var/log/secure
```
```bash-session
student@servera:~$ su - root
root@servera:~# cat /var/log/secure
Jan  6 12:26:47 servera sshd-session[3269]: Accepted publickey for student from 172.25.250.1 port 45098 ssh2:...
Jan  6 12:26:47 servera (systemd)[3274]: pam_unix(systemd-user:session): session opened for user student(uid=1000)...
Jan  6 12:26:47 servera sshd-session[3269]: pam_unix(sshd:session): session opened for user student(uid=1000) by...
...
root@servera:~#
```
```bash-session
student@servera:~$ su - root
root@servera:~# cat /var/log/secure
Jan  6 12:26:47 servera sshd-session[3269]: Accepted publickey for student from 172.25.250.1 port 45098 ssh2:...
Jan  6 12:26:47 servera (systemd)[3274]: pam_unix(systemd-user:session): session opened for user student(uid=1000)...
Jan  6 12:26:47 servera sshd-session[3269]: pam_unix(sshd:session): session opened for user student(uid=1000) by...
...
root@servera:~# exit
```
```bash-session
student@servera:~$ su - root
root@servera:~# cat /var/log/secure
Jan  6 12:26:47 servera sshd-session[3269]: Accepted publickey for student from 172.25.250.1 port 45098 ssh2:...
Jan  6 12:26:47 servera (systemd)[3274]: pam_unix(systemd-user:session): session opened for user student(uid=1000)...
Jan  6 12:26:47 servera sshd-session[3269]: pam_unix(sshd:session): session opened for user student(uid=1000) by...
...
root@servera:~# exit
student@servera:~$
```
````

</TerminalWindow>

---
---

# Open a Shell as the `root` User

Easily "log in" as a different user using `sudo -i`

Uses <AccentText>YOUR</AccentText> password.

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
student@workstation:~$
```
```bash-session
student@workstation:~$ sudo -i
```
```bash-session
student@workstation:~$ sudo -i
Password: ***must provide student's password***
```
```bash-session
student@workstation:~$ sudo -i
root@workstation:~#
```
````

</TerminalWindow>

<v-click>

No user was specified, so it opened a shell as the **root** user.

</v-click>

---
---

# Open a Shell as a Specified User

To specify a different user, use the `-u` option.

Open an interactive login shell as the **bob** user.

<TerminalWindow title="student@workstation:~">

````md magic-move
```bash-session
student@workstation:~$
```
```bash-session
student@workstation:~$ sudo -iu bob
```
```bash-session
student@workstation:~$ sudo -iu bob
Password: ***must provide student's password***
```
```bash-session
student@workstation:~$ sudo -iu bob
bob@workstation:~$
```
````

</TerminalWindow>
