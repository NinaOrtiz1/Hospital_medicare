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
      const [rows] = await connection.execute('SELECT * FROM medicos WHERE id = ?', [id])
      const medico = (rows as any[])[0]
      return NextResponse.json(medico || null)
    } else {
      const [rows] = await connection.execute('SELECT * FROM medicos ORDER BY created_at DESC')
      return NextResponse.json(rows)
    }
  } catch (error) {
    console.error('Error fetching doctors:', error)
    return NextResponse.json({ error: 'Error fetching doctors' }, { status: 500 })
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
      'INSERT INTO medicos (nombre, apellido, especialidad, telefono, email, cedula_profesional) VALUES (?, ?, ?, ?, ?, ?)',
      [body.nombre, body.apellido, body.especialidad, body.telefono, body.email, body.cedula_profesional]
    )

    return NextResponse.json({ id: (result as any).insertId })
  } catch (error) {
    console.error('Error adding doctor:', error)
    return NextResponse.json({ error: 'Error adding doctor' }, { status: 500 })
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
      'UPDATE medicos SET nombre = ?, apellido = ?, especialidad = ?, telefono = ?, email = ?, cedula_profesional = ? WHERE id = ?',
      [body.nombre, body.apellido, body.especialidad, body.telefono, body.email, body.cedula_profesional, id]
    )

    return NextResponse.json({ affected: (result as any).affectedRows })
  } catch (error) {
    console.error('Error updating doctor:', error)
    return NextResponse.json({ error: 'Error updating doctor' }, { status: 500 })
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

    const [result] = await connection.execute('DELETE FROM medicos WHERE id = ?', [id])
    return NextResponse.json({ affected: (result as any).affectedRows })
  } catch (error) {
    console.error('Error deleting doctor:', error)
    return NextResponse.json({ error: 'Error deleting doctor' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}