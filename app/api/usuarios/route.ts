import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hospital_medicare'
}

export async function GET(request: NextRequest) {
  let connection: mysql.Connection | null = null

  try {
    connection = await mysql.createConnection(dbConfig)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const action = searchParams.get('action')

    if (action === 'login') {
      return NextResponse.json({ error: 'Use POST for login' }, { status: 400 })
    }

    if (id) {
      const [rows] = await connection.execute('SELECT id, nombre, email, rol, activo, created_at, updated_at FROM usuarios WHERE id = ?', [id])
      const usuario = (rows as any[])[0]
      return NextResponse.json(usuario || null)
    } else {
      const [rows] = await connection.execute('SELECT id, nombre, email, rol, activo, created_at, updated_at FROM usuarios ORDER BY created_at DESC')
      return NextResponse.json(rows)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}

export async function POST(request: NextRequest) {
  let connection: mysql.Connection | null = null

  try {
    connection = await mysql.createConnection(dbConfig)
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'login') {
      const [rows] = await connection.execute('SELECT id, nombre, email, rol, activo, password FROM usuarios WHERE email = ?', [body.email])
      const usuario = (rows as any[])[0]

      if (usuario && await bcrypt.compare(body.password, usuario.password)) {
        const { password, ...userWithoutPassword } = usuario
        return NextResponse.json(userWithoutPassword)
      }
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    } else {
      const hashedPassword = await bcrypt.hash(body.password, 10)
      const [result] = await connection.execute(
        'INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES (?, ?, ?, ?, ?)',
        [body.nombre, body.email, hashedPassword, body.rol || 'recepcionista', body.activo ?? true]
      )
      return NextResponse.json({ id: (result as any).insertId })
    }
  } catch (error) {
    console.error('Error with user operation:', error)
    return NextResponse.json({ error: 'Error with user operation' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}

export async function PUT(request: NextRequest) {
  let connection: mysql.Connection | null = null

  try {
    connection = await mysql.createConnection(dbConfig)
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    let updateFields = []
    let params = []

    if (body.nombre) {
      updateFields.push('nombre = ?')
      params.push(body.nombre)
    }
    if (body.email) {
      updateFields.push('email = ?')
      params.push(body.email)
    }
    if (body.password) {
      updateFields.push('password = ?')
      params.push(await bcrypt.hash(body.password, 10))
    }
    if (body.rol) {
      updateFields.push('rol = ?')
      params.push(body.rol)
    }
    if (typeof body.activo === 'boolean') {
      updateFields.push('activo = ?')
      params.push(body.activo)
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ affected: 0 })
    }

    params.push(id)
    const [result] = await connection.execute(
      `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    )

    return NextResponse.json({ affected: (result as any).affectedRows })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}

export async function DELETE(request: NextRequest) {
  let connection: mysql.Connection | null = null

  try {
    connection = await mysql.createConnection(dbConfig)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const [result] = await connection.execute('DELETE FROM usuarios WHERE id = ?', [id])
    return NextResponse.json({ affected: (result as any).affectedRows })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}