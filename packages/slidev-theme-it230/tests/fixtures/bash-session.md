---
theme: ../..
title: Bash session integration fixture
---

# Static Bash-session highlighting

<TerminalWindow title="student@lab:~">

```bash-session {2}
student@lab:~$ printf '%s\n' '# [ ] $HOME'
# [ ] $HOME
student@lab:~$ values[0]="$PATH"
array[0]=$value # output [ok]
```

</TerminalWindow>

---

# Dynamic Bash-session highlighting

<TerminalWindow title="student@lab:~">

```bash-session {hide|none|1|2|3|all}
student@lab:~$ cd /etc/sshd
student@lab:/etc/sshd$ sudo -i
root@lab:~# printf '%s\n' '$PATH [root] #'
$PATH [root] #
```

</TerminalWindow>
