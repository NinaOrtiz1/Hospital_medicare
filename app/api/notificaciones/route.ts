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
    const userId = searchParams.get('userId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    let query = 'SELECT * FROM notificaciones'
    let params: any[] = []

    if (userId) {
      query += ' WHERE user_id = ?'
      params.push(userId)
    }

    if (unreadOnly) {
      query += userId ? ' AND leida = 0' : ' WHERE leida = 0'
    }

    query += ' ORDER BY created_at DESC'

    const [rows] = await connection.execute(query, params)
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Error fetching notifications' }, { status: 500 })
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
      'INSERT INTO notificaciones (user_id, tipo, titulo, mensaje, leida, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [body.user_id, body.tipo, body.titulo, body.mensaje, body.leida || 0]
    )

    return NextResponse.json({ id: (result as any).insertId })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Error creating notification' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}

export async function PUT(request: NextRequest) {
  let connection: mysql.Connection | null = null

  try {
    connection = await mysql.createConnection(dbConfig)
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 })
    }

    const body = await request.json()
    const [result] = await connection.execute(
      'UPDATE notificaciones SET leida = ?, updated_at = NOW() WHERE id = ?',
      [body.leida, id]
    )

    return NextResponse.json({ affected: (result as any).affectedRows })
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json({ error: 'Error updating notification' }, { status: 500 })
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
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 })
    }

    const [result] = await connection.execute('DELETE FROM notificaciones WHERE id = ?', [id])
    return NextResponse.json({ affected: (result as any).affectedRows })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json({ error: 'Error deleting notification' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}