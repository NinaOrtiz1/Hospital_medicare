import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

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

    if (id) {
      const [rows] = await connection.execute('SELECT * FROM pacientes WHERE id = ?', [id])
      const paciente = (rows as any[])[0]
      return NextResponse.json(paciente || null)
    } else {
      const [rows] = await connection.execute('SELECT * FROM pacientes ORDER BY created_at DESC')
      return NextResponse.json(rows)
    }
  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json({ error: 'Error fetching patients' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}

export async function POST(request: NextRequest) {
  let connection: mysql.Connection | null = null

  try {
    connection = await mysql.createConnection(dbConfig)
    const body = await request.json()

    const [result] = await connection.execute(
      'INSERT INTO pacientes (nombre, apellido, fecha_nacimiento, telefono, email, direccion) VALUES (?, ?, ?, ?, ?, ?)',
      [body.nombre, body.apellido, body.fecha_nacimiento, body.telefono, body.email, body.direccion]
    )

    return NextResponse.json({ id: (result as any).insertId })
  } catch (error) {
    console.error('Error adding patient:', error)
    return NextResponse.json({ error: 'Error adding patient' }, { status: 500 })
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

    const [result] = await connection.execute(
      'UPDATE pacientes SET nombre = ?, apellido = ?, fecha_nacimiento = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?',
      [body.nombre, body.apellido, body.fecha_nacimiento, body.telefono, body.email, body.direccion, id]
    )

    return NextResponse.json({ affected: (result as any).affectedRows })
  } catch (error) {
    console.error('Error updating patient:', error)
    return NextResponse.json({ error: 'Error updating patient' }, { status: 500 })
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

    const [result] = await connection.execute('DELETE FROM pacientes WHERE id = ?', [id])
    return NextResponse.json({ affected: (result as any).affectedRows })
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json({ error: 'Error deleting patient' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}