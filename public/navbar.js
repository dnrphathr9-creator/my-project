document.write(`
  <div class="navbar bg-primary text-primary-content px-4">
    <div class="flex-1 text-lg font-bold">ระบบแจ้งซ่อม</div>
    <span class="mr-3">${getUser() ? getUser().full_name : ''}</span>
    <a href="login.html" class="btn btn-sm" onclick="localStorage.clear()">ออกจากระบบ</a>
  </div>
`)