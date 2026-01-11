# Hướng Dẫn SSH Tunnel với Termius - Access Admin từ iPhone 📱

## Tổng quan

Dùng **SSH Tunnel** để truy cập Strapi admin chạy trên máy tính (Mac/PC) từ iPhone qua Termius app.

**Flow**: iPhone ↔️ SSH Tunnel ↔️ Mac/PC (localhost:1337)

---

## Bước 1: Enable SSH Server trên Mac/PC

### **Trên macOS:**

```bash
# Enable Remote Login (SSH Server)
sudo systemsetup -setremotelogin on

# Check if SSH is running
sudo systemsetup -getremotelogin
# Output: Remote Login: On

# Find your Mac's IP address
ifconfig | grep "inet " | grep -v 127.0.0.1
# Example output: inet 192.168.1.100 ...
```

**Hoặc qua GUI:**
1. System Settings → General → Sharing
2. Bật **Remote Login**
3. Note lại local IP address (ví dụ: `192.168.1.100`)

### **Trên Windows:**

```powershell
# Install OpenSSH Server (nếu chưa có)
Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0

# Start SSH Service
Start-Service sshd

# Set to start automatically
Set-Service -Name sshd -StartupType 'Automatic'

# Check firewall
New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22

# Find your PC's IP address
ipconfig
# Look for IPv4 Address: 192.168.1.100
```

**Test SSH từ chính máy đó:**

```bash
ssh username@localhost
# Nhập password của user
# Nếu connect được → SSH server đang chạy OK
```

---

## Bước 2: Setup Termius trên iPhone

### **2.1: Download Termius**

- App Store → Search "Termius"
- Download và mở app

### **2.2: Add SSH Host**

1. **Mở Termius** → Tap **Hosts** (tab dưới)
2. Tap **+ (New Host)**
3. Điền thông tin:

```
Alias: Mac Admin (hoặc tên gì cũng được)
Hostname: 192.168.1.100 (IP máy tính của bạn)
Port: 22
Username: your_mac_username (username đăng nhập Mac/PC)
Password: your_mac_password (password Mac/PC)
```

4. **Save**

⚠️ **Lưu ý**: iPhone và Mac/PC phải cùng WiFi!

---

## Bước 3: Setup Port Forwarding

### **3.1: Config Port Forwarding trong Termius**

1. **Vào Host vừa tạo** → Tap **Edit** (biểu tượng bút chì)
2. Scroll xuống → Tap **Port Forwarding**
3. Tap **+ Add Port Forwarding**
4. Chọn **Local Port Forwarding**
5. Điền thông tin:

```
Label: Strapi Admin
Local Port: 1337
Remote Host: localhost (hoặc 127.0.0.1)
Remote Port: 1337
```

6. **Save** → **Done**

**Giải thích:**
- `Local Port 1337` = Port trên iPhone
- `Remote Host: localhost` = Máy tính (qua SSH tunnel)
- `Remote Port 1337` = Port Strapi admin đang chạy

---

## Bước 4: Run Local Admin trên Mac/PC

**Trên Mac/PC, chạy Strapi admin:**

```bash
cd /path/to/sonhangtravel/backend
npm run develop
```

**Verify admin đang chạy:**
- Mở browser trên Mac: http://localhost:1337/admin
- Nếu thấy Strapi login page → OK!

---

## Bước 5: Connect SSH Tunnel từ iPhone

### **5.1: Connect qua Termius**

1. **Mở Termius** trên iPhone
2. **Hosts** → Tap vào **Mac Admin**
3. Tap **Connect**
4. **Nhập password** nếu được hỏi
5. **Connected!** → Bạn sẽ thấy terminal shell

### **5.2: Verify Tunnel**

Trong Termius terminal, check port forwarding:

```bash
# Trên shell vừa connect
netstat -an | grep 1337
# Hoặc
lsof -i :1337
```

Nếu thấy output có `LISTEN` → Port forwarding đang hoạt động!

---

## Bước 6: Truy cập Admin từ Safari trên iPhone

1. **Mở Safari** trên iPhone
2. **Vào URL**: `http://localhost:1337/admin`
3. **Đăng nhập** Strapi admin như bình thường

✅ **Kết quả**: Admin chạy nhanh như trên máy tính!

---

## 🎯 Full Workflow

```
┌─────────────────────────────────────────────┐
│ 1. Mac/PC: npm run develop (port 1337)     │
│    → Strapi admin running on localhost     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 2. iPhone: Termius → Connect SSH           │
│    → Tunnel: iPhone:1337 → Mac:1337        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ 3. iPhone: Safari → localhost:1337/admin   │
│    → Access admin cực nhanh!               │
└─────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### **Lỗi 1: Cannot connect to host**

**Nguyên nhân:**
- iPhone và Mac không cùng WiFi
- SSH server chưa bật
- Firewall block port 22

**Fix:**
```bash
# Mac: Check SSH running
sudo systemsetup -getremotelogin

# Mac: Check firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# Windows: Check SSH service
Get-Service sshd
```

### **Lỗi 2: Connection refused to localhost:1337 trên Safari**

**Nguyên nhân:**
- SSH tunnel chưa connect
- Strapi admin chưa chạy trên Mac/PC
- Port forwarding config sai

**Fix:**
1. **Check Termius**: Phải thấy "Connected" và có shell
2. **Check Mac/PC terminal**:
   ```bash
   lsof -i :1337
   # Phải thấy node process đang listen port 1337
   ```
3. **Check Termius Port Forwarding**:
   - Edit Host → Port Forwarding
   - Verify: Local 1337 → localhost:1337

### **Lỗi 3: Admin load chậm hoặc timeout**

**Nguyên nhân:**
- WiFi yếu
- Máy tính sleep mode

**Fix:**
- Dùng WiFi 5GHz thay vì 2.4GHz
- Disable sleep trên Mac:
  ```bash
  sudo pmset -a sleep 0; sudo pmset -a hibernatemode 0; sudo pmset -a disablesleep 1
  ```
- Kết nối qua USB + Hotspot:
  1. iPhone → Settings → Personal Hotspot → Enable
  2. Mac → Connect to iPhone hotspot
  3. Update Termius hostname to new iPhone IP

### **Lỗi 4: Authentication failed**

**Fix:**
- Verify username/password trong Termius
- Mac: Check username: `whoami` trong Terminal
- Thử login qua SSH từ Mac trước:
  ```bash
  ssh username@localhost
  ```

---

## 🔒 Security Tips

1. **Không expose SSH port 22 ra Internet**
   - Chỉ dùng trong local network
   - Không port forward 22 trên router

2. **Dùng SSH Key thay vì Password** (Advanced):
   ```bash
   # Trên Mac, generate SSH key
   ssh-keygen -t ed25519 -C "iphone-admin"

   # Copy public key
   cat ~/.ssh/id_ed25519.pub

   # Add to authorized_keys
   cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys

   # Trong Termius: Add Key → Paste private key
   ```

3. **Tắt SSH server khi không dùng**:
   ```bash
   # macOS
   sudo systemsetup -setremotelogin off

   # Windows
   Stop-Service sshd
   ```

---

## 💡 Alternative: Termius SFTP (Bonus)

Nếu chỉ cần edit files từ iPhone (không cần admin UI):

1. Termius → **SFTP** tab
2. Connect to same host
3. Browse files: `/path/to/sonhangtravel/backend`
4. Edit `.md` files, config, etc.

**Use case:** Quick fix typos trong docs, update env vars, etc.

---

## 📊 So sánh Options

| Method | Speed | Setup | Internet Required | Cost |
|--------|-------|-------|-------------------|------|
| **SSH Tunnel (Termius)** | ⚡ Cực nhanh | ⚠️ Trung bình | ❌ Local WiFi only | ✅ Free |
| Tailscale VPN | ⚡ Nhanh | ⚠️ Setup VPN | ✅ Yes (anywhere) | ✅ Free |
| ngrok | ⚡ Nhanh | ✅ Dễ | ✅ Yes (anywhere) | ⚠️ Free (limited) |
| Chrome Remote Desktop | 🐌 Chậm (full desktop) | ✅ Dễ | ✅ Yes (anywhere) | ✅ Free |
| Render Admin | 🐌 Rất chậm | ✅ Không cần | ✅ Yes | ✅ Free |

**→ Khuyến nghị:**
- **Ở nhà**: SSH Tunnel (Termius) - nhanh nhất
- **Đi làm/xa nhà**: Tailscale VPN hoặc ngrok
- **Emergency quick fix**: Chrome Remote Desktop

---

## ✅ Checklist

- [ ] Enable SSH server trên Mac/PC
- [ ] Check Mac/PC IP address (cùng WiFi với iPhone)
- [ ] Download Termius trên iPhone
- [ ] Add Host với IP, username, password
- [ ] Setup Port Forwarding: Local 1337 → localhost:1337
- [ ] Chạy `npm run develop` trên Mac/PC
- [ ] Connect SSH trong Termius
- [ ] Mở Safari → http://localhost:1337/admin
- [ ] Login Strapi admin
- [ ] Test thêm/sửa content

---

## 🎉 Kết quả

Bây giờ bạn có thể:
- ✅ Quản lý Strapi admin từ iPhone
- ✅ Tốc độ nhanh như dùng trên máy tính
- ✅ Không bị lag như Render
- ✅ Miễn phí 100%

**Next step:**
- Setup Tailscale VPN nếu muốn access từ xa (không cùng WiFi)
- Setup weekly backup script (xem LOCAL_ADMIN_SETUP.md)

---

**Status**: ✅ Admin nhanh trên iPhone qua SSH Tunnel! 🚀
