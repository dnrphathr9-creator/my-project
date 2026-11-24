const express = require('express')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')

const app = express()
app.use(express.json()) 
app.use(express.static('public')) 

const db = mysql.createPool({
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: 'root',
  database: 'simpledb',
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username])
  if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password))) {
    return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' })
  }
  res.json({ id: rows[0].id, username: rows[0].username, full_name: rows[0].full_name })
})

app.get('/api/requests', async (req, res) => {
  let sql = 'SELECT * FROM requests WHERE title LIKE ?'
  const params = ['%' + (req.query.search || '') + '%']
  if (req.query.status) {
    sql += ' AND status = ?'
    params.push(req.query.status)
  }
  if (req.query.category) {
    sql += ' AND category = ?'
    params.push(req.query.category)
  }
  sql += ' ORDER BY id DESC'
  const [rows] = await db.query(sql, params)
  res.json(rows)
})

app.get('/api/requests/:id', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM requests WHERE id = ?', [req.params.id])
  if (rows.length === 0) {
    return res.status(404).json({ message: 'ไม่พบรายการ' })
  }
  res.json(rows[0])
})

app.post('/api/requests', async (req, res) => {
  const { title, category, reporter } = req.body
  if (!title || !category) {
    return res.status(400).json({ message: 'กรุณากรอกหัวข้อและเลือกประเภท' })
  }
  await db.query('INSERT INTO requests (title, category, reporter) VALUES (?, ?, ?)',
    [title, category, reporter])
  res.json({ message: 'บันทึกสำเร็จ' })
})

app.put('/api/requests/:id', async (req, res) => {
  const { title, category, status } = req.body
  if (!title || !category || !status) {
    return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' })
  }
  const [result] = await db.query(
    'UPDATE requests SET title = ?, category = ?, status = ? WHERE id = ?',
    [title, category, status, req.params.id]
  )
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'ไม่พบรายการ' })
  }
  res.json({ message: 'แก้ไขสำเร็จ' })
})

app.delete('/api/requests/:id', async (req, res) => {
  await db.query('DELETE FROM requests WHERE id = ?', [req.params.id])
  res.json({ message: 'ลบสำเร็จ' })
})

app.use((err, req, res, next) => {
  console.log(err.message)
  res.status(500).json({ message: 'เกิดข้อผิดพลาด: ' + err.message })
})

app.listen(3000, async () => {
  console.log('เปิดเว็บที่ http://localhost:3000/login.html')
  try {
    
    const hash = await bcrypt.hash('1234', 10)
    await db.query(
      "INSERT IGNORE INTO users (username, password, full_name) VALUES ('user1', ?, 'สมชาย ใจดี')",
      [hash]
    )
    console.log('เชื่อมต่อฐานข้อมูลสำเร็จ')
  } catch (err) {
    console.log('เชื่อมต่อฐานข้อมูลไม่ได้: ' + err.message)
  }
})
