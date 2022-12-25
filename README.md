# LetsCode Collaboration

# Config Redis
1. Update app list ```sudo apt update```
2. Install redis-server ```sudo apt install redis-server```
3. Change supervised no to supervised systemd and bind to 0.0.0.0 ::1
```
sudo nano /etc/redis/redis.conf
```
4. Restart redis ```sudo systemctl restart redis.service```
5. Test redis