# letscode-be-collaboration

1. Install redis-server
2. Edit supervised no to supervised systemd
```
sudo nano /etc/redis/redis.conf

```
3. Restart redis
```
sudo systemctl restart redis.service
```
4. Bind to localhost and Replace protected-mode yes with protected-mode no
```
sudo nano /etc/redis/redis.conf 

bind 0.0.0.0 ::1 
protected-mode no
```
5. Restart redis
6. Allowed port 6379 in firewall
```
sudo ufw allow 6379 && sudo ufw allow 6379/tcp
```
5. Restart redis
6. Check netsat
``` 
sudo netstat -tulpn | grep redis