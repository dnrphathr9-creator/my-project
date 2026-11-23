// ไฟล์กลาง: ข้อมูลผู้ใช้ และฟังก์ชันเรียก Backend

// อ่านผู้ใช้ที่เข้าสู่ระบบอยู่ (ไม่มี = null)
function getUser() {
  return JSON.parse(localStorage.getItem('user'))
}

// ถ้ายังไม่เข้าสู่ระบบ ให้ไปหน้า login
function requireLogin() {
  if (!getUser()) location.href = 'login.html'
}

// เรียก Backend แล้วคืนผลเป็นข้อมูล ถ้าผิดพลาดจะโยน error พร้อมข้อความ
async function callApi(method, url, data) {
  let res
  try {
    res = await fetch('/api' + url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined,
    })
  } catch (err) {
    throw new Error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาตรวจสอบว่ารัน node server.js อยู่')
  }
  let json
  try {
    json = await res.json()
  } catch (err) {
    throw new Error('ไม่พบ Backend: ต้องเปิดเว็บที่ http://localhost:3000 (ห้ามใช้ Live Server)')
  }
  if (!res.ok) throw new Error(json.message)
  return json
}
