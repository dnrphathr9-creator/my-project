function getUser() {
  return JSON.parse(localStorage.getItem('user'))
}

function requireLogin() {
  if (!getUser()) location.href = 'login.html'
}

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
