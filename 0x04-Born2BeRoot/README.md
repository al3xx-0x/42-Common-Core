# Born2BeRoot

a system administration project introducing virtualization, partitioning, system security, and server configuration using a virtual machine.

## description

create and configure a virtual machine with strict security policies.  focuses on virtualization, os installation, partition management, security hardening, and automated monitoring.

## objectives

- set up vm using **virtualbox** or **utm**
- install minimal **debian** or **rocky linux** server (no gui)
- implement encrypted partitions using **lvm**
- configure **ssh** on port 4242, **ufw** firewall, strong password policy, strict **sudo** rules
- create monitoring script displaying system information

## technical requirements

### partitioning & encryption
- at least **2 encrypted partitions** using lvm

### ssh configuration
- runs on port **4242** only
- root login disabled

### firewall (ufw)
- only port **4242** open
- active on startup

### password policy
- expires every **30 days**, min **2 days** between changes, **7 day** warning
- min length: **10 characters** (1 uppercase, 1 lowercase, 1 number)
- max **3 consecutive identical characters**
- must not contain username
- at least **7 new characters** (not for root)

### sudo configuration
- **3 attempts** max for wrong password
- custom error message
- log all commands to `/var/log/sudo/`
- **tty mode** enabled
- restricted sudo paths

### user management
- create user with your login
- user belongs to **user42** and **sudo** groups

## monitoring script

displays system info every **10 minutes** via `wall`:

```bash
#!/bin/bash
echo "#Architecture: $(uname -a)"
echo "#CPU physical: $(grep "physical id" /proc/cpuinfo | sort -u | wc -l)"
echo "#vCPU: $(grep "processor" /proc/cpuinfo | sort -u | wc -l)"
free_memory=$(free -m | grep 'Mem:' | awk '{print $4}')
total_memory=$(free -m | grep 'Mem:' | awk '{print $2}')
rate=$(free -m | grep 'Mem:' | awk '{printf "%.2f", ($3/$2) * 100}')
echo "#Memory Usage: $free_memory/$total_memory MB ($rate%)"
Disk_size=$(df -h --total | grep "total" | tr -d 'G' | awk '{printf $3 "/" $2 "Gb " "(%d%%)\n", ($3/$2) * 100}')
echo "#Disk Usage: $Disk_size"
CPU_Usage=$(mpstat -P ALL | grep "all" | awk '{print 100 - $13 "%"}')
echo "#CPU Usage: $CPU_Usage"
last_reboot=$(who -b | awk '{print $3 " " $4}')
echo "#Last boot: $last_reboot"
check_lvm=$(lsblk | grep -q "lvm" && echo "yes" || echo "no")
echo "#LVM use: $check_lvm"
connection=$(netstat | grep -c ESTABLISHED)
echo "#Connections TCP: $connection ESTABLISHED"
User_log=$(who | grep -c pts)
echo "#User log: $User_log"
echo "#Network IP: $(hostname -I) ($(ip addr | grep "ether" | awk '{print $2}'))"
sudo_counter=$(grep -c 'COMMAND' /var/log/sudo/sudo.log)
echo "#Sudo: $sudo_counter cmd"
```

**cron setup**: `sudo crontab -e` → add `*/10 * * * * /usr/local/bin/monitoring. sh | wall`

## setup guide

**1. vm creation**: download debian/rocky iso, create vm (1gb ram min), configure network, attach iso  
**2. installation**: install without gui, hostname: `your_login42`, encrypted lvm partitions  
**3. users**: `sudo adduser your_login && sudo groupadd user42 && sudo usermod -aG user42,sudo your_login`  
**4. ssh**: install openssh-server, edit `/etc/ssh/sshd_config` → `Port 4242`, `PermitRootLogin no`  
**5. firewall**: `sudo apt install ufw && sudo ufw enable && sudo ufw allow 4242`  
**6. password policy**: install libpam-pwquality, edit `/etc/pam. d/common-password` and `/etc/login.defs`  
**7. sudo config**: `sudo visudo` → add passwd_tries=3, badpass_message, logfile, log_input/output, requiretty, secure_path  
**8.  monitoring**: create `/usr/local/bin/monitoring. sh`, make executable, add to crontab

## verification commands

```bash
lsblk                                    # check partitions
sudo ufw status                          # check firewall
sudo systemctl status ssh                # check ssh
sudo chage -l username                   # check password policy
getent group sudo                        # check groups
sudo /usr/local/bin/monitoring. sh        # test script
```

## key concepts

**lvm**: physical volume (pv) → volume group (vg) → logical volume (lv).  benefits: flexible disk management, easy resizing  
**apparmor/selinux**: mandatory access control (mac) systems for additional security  
**tty**: requiretty prevents sudo from non-terminal sources  
**ufw**: user-friendly iptables frontend

## defense preparation

- what is a vm?  why debian/rocky? 
- difference between aptitude and apt
- explain lvm, ssh, ufw, sudo
- how to add/remove users/groups
- how to check sudo logs
- modify monitoring script interval

---

**grade**: validated ✅  
**project**: 42 school common core
**created**: november 23, 2023