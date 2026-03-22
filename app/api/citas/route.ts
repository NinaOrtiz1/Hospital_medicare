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
      const [rows] = await connection.execute(`
        SELECT c.*, p.nombre as paciente_nombre, p.apellido as paciente_apellido,
               m.nombre as medico_nombre, m.apellido as medico_apellido
        FROM citas c
        JOIN pacientes p ON c.paciente_id = p.id
        JOIN medicos m ON c.medico_id = m.id
        WHERE c.id = ?
      `, [id])
      const cita = (rows as any[])[0]
      return NextResponse.json(cita || null)
    } else {
      const [rows] = await connection.execute(`
        SELECT c.*, p.nombre as paciente_nombre, p.apellido as paciente_apellido,
               m.nombre as medico_nombre, m.apellido as medico_apellido
        FROM citas c
        JOIN pacientes p ON c.paciente_id = p.id
        JOIN medicos m ON c.medico_id = m.id
        ORDER BY c.fecha_hora DESC
      `)
      return NextResponse.json(rows)
    }
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Error fetching appointments' }, { status: 500 })
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
      'INSERT INTO citas (paciente_id, medico_id, fecha_hora, motivo, estado) VALUES (?, ?, ?, ?, ?)',
      [body.paciente_id, body.medico_id, body.fecha_hora, body.motivo, body.estado || 'programada']
    )

    return NextResponse.json({ id: (result as any).insertId })
  } catch (error) {
    console.error('Error adding appointment:', error)
    return NextResponse.json({ error: 'Error adding appointment' }, { status: 500 })
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
      'UPDATE citas SET paciente_id = ?, medico_id = ?, fecha_hora = ?, motivo = ?, estado = ? WHERE id = ?',
      [body.paciente_id, body.medico_id, body.fecha_hora, body.motivo, body.estado, id]
    )

    return NextResponse.json({ affected: (result as any).affectedRows })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json({ error: 'Error updating appointment' }, { status: 500 })
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

    const [result] = await connection.execute('DELETE FROM citas WHERE id = ?', [id])
    return NextResponse.json({ affected: (result as any).affectedRows })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json({ error: 'Error deleting appointment' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}