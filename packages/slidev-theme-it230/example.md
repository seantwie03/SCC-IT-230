---
theme: ./
title: IT-230 Theme Gallery
info: A focused gallery for the Adwaita-inspired IT-230 Slidev theme.
layout: cover
---

::kicker::

Adwaita-inspired light theme

::default::

# IT-230 Theme Gallery

A classroom-readable Linux visual language built for presentations, not a
simulated desktop application.

---

# Ordinary technical content

The default slide treatment keeps familiar Markdown clear without requiring
custom Vue markup.

- Use descriptive headings and short, parallel list items.
- Keep commands copyable, such as `systemctl status sshd`.
- Use an accessible [descriptive link](https://example.com), not color alone.

> Prefer the smallest command that proves the system state you need to inspect.

---
layout: section
---

::kicker::

Section 02 · Service management

::default::

# Inspect before changing state

Read the current unit status, identify the desired state, and make one
deliberate change.

---

# Commands and terminal output

Fenced code and terminal commands share accessible Bash syntax colors on light
surfaces; prompts remain distinct and output stays neutral.

```bash
systemctl status sshd --no-pager
sudo systemctl enable --now sshd
```

<TerminalWindow title="student@lab:~">

```bash-session {1|all}
student@lab:~$ cd /etc/ssh
student@lab:/etc/ssh$ printf '%s\n' '# [ ] $HOME'
# [ ] $HOME
student@lab:/etc/ssh$ sudo systemctl enable --now sshd
student@lab:/etc/ssh$ sudo -i
root@lab:~# systemctl is-active sshd
active
```

</TerminalWindow>

---
layout: two-cols-header
---

# Compare inspection and change workflows

Use the full-width header to establish one shared idea, then compare related
technical evidence in equal columns.

::left::

## Inspect state

Use a Bash fence when command output is intentionally omitted.

```bash
systemctl is-enabled sshd
systemctl is-active sshd
journalctl -u sshd -n 20
```

- Confirm current state before changing it.
- Capture evidence needed to explain the decision.

::right::

## Change and verify

Use a terminal session when the resulting output matters.

<TerminalWindow title="student@lab:~">

```bash-session
student@lab:~$ sudo systemctl is-enabled sshd
enabled
student@lab:~$ systemctl is-active sshd
active
```

</TerminalWindow>

- Make one deliberate change at a time.
- Verify the resulting state before moving on.

---

# Labeled callouts

Color reinforces each state; its label and symbol carry the same meaning.

<div class="grid grid-cols-2 gap-4">

<Callout type="note">
Read the unit file before creating an override.
</Callout>

<Callout type="tip">
Use <code>--no-pager</code> during a projected demonstration.
</Callout>

<Callout type="warning">
Confirm the service name before enabling it at boot.
</Callout>

<Callout type="danger" title="Stop and verify">
Do not interrupt an active remote-access path.
</Callout>

</div>

---

# Tables and hierarchy

| Question         | Command                     | Expected evidence   |
| ---------------- | --------------------------- | ------------------- |
| Is it running?   | `systemctl is-active sshd`  | *active*            |
| Starts at boot?  | `systemctl is-enabled sshd` | **enabled**         |
| Recent messages? | `journalctl -u sshd -n 20`  | Timestamped entries |

### Visual rule

Use spacing, weight, labels, and borders alongside color so the slide remains
understandable when colors are difficult to distinguish.
