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

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const [rows] = await connection.execute('SELECT * FROM configuracion WHERE user_id = ?', [userId])
    const config = (rows as any[])[0]

    return NextResponse.json(config || {
      user_id: userId,
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      appointment_reminders: true,
      system_alerts: true,
      theme: 'system',
      language: 'es',
      timezone: 'America/Mexico_City',
      auto_save: true,
      data_retention: '1year',
      backup_frequency: 'daily'
    })
  } catch (error) {
    console.error('Error fetching configuration:', error)
    return NextResponse.json({ error: 'Error fetching configuration' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}

export async function POST(request: NextRequest) {
  let connection: mysql.Connection | null = null

  try {
    connection = await mysql.createConnection(dbConfig)
    const body = await request.json()

    // Check if configuration already exists
    const [existing] = await connection.execute('SELECT id FROM configuracion WHERE user_id = ?', [body.user_id])

    if ((existing as any[]).length > 0) {
      // Update existing configuration
      const [result] = await connection.execute(
        `UPDATE configuracion SET
          email_notifications = ?, push_notifications = ?, sms_notifications = ?,
          appointment_reminders = ?, system_alerts = ?, theme = ?, language = ?,
          timezone = ?, auto_save = ?, data_retention = ?, backup_frequency = ?,
          updated_at = NOW()
         WHERE user_id = ?`,
        [
          body.email_notifications, body.push_notifications, body.sms_notifications,
          body.appointment_reminders, body.system_alerts, body.theme, body.language,
          body.timezone, body.auto_save, body.data_retention, body.backup_frequency,
          body.user_id
        ]
      )
      return NextResponse.json({ affected: (result as any).affectedRows })
    } else {
      // Create new configuration
      const [result] = await connection.execute(
        `INSERT INTO configuracion (
          user_id, email_notifications, push_notifications, sms_notifications,
          appointment_reminders, system_alerts, theme, language, timezone,
          auto_save, data_retention, backup_frequency, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          body.user_id, body.email_notifications, body.push_notifications, body.sms_notifications,
          body.appointment_reminders, body.system_alerts, body.theme, body.language,
          body.timezone, body.auto_save, body.data_retention, body.backup_frequency
        ]
      )
      return NextResponse.json({ id: (result as any).insertId })
    }
  } catch (error) {
    console.error('Error saving configuration:', error)
    return NextResponse.json({ error: 'Error saving configuration' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}

export async function PUT(request: NextRequest) {
  // PUT is handled by POST for simplicity
  return POST(request)
}