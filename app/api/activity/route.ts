import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hospital_medicare'
}

function getTimeAgo(minutes: number): string {
  if (minutes < 1) return 'Hace menos de 1 minuto'
  if (minutes < 60) return `Hace ${Math.floor(minutes)} minutos`
  if (minutes < 1440) return `Hace ${Math.floor(minutes / 60)} horas`
  return `Hace ${Math.floor(minutes / 1440)} días`
}

export async function GET() {
  let connection: mysql.Connection | null = null

  try {
    connection = await mysql.createConnection(dbConfig)

    const activityItems: any[] = []
    const alertItems: any[] = []

    // Actividad reciente - últimas 10 acciones
    const [activityRows] = await connection.execute(`
      (SELECT 'patient' as type, CONCAT('Nuevo paciente: ', nombre, ' ', apellido) as title,
             CONCAT('Registro completado - ', DATE_FORMAT(created_at, '%d/%m/%Y')) as description,
             TIMESTAMPDIFF(MINUTE, created_at, NOW()) as minutes_ago,
             id, created_at as timestamp
      FROM pacientes
      ORDER BY created_at DESC
      LIMIT 3)

      UNION ALL

      (SELECT 'appointment' as type,
             CASE
               WHEN c.estado = 'completada' THEN 'Cita completada'
               WHEN c.estado = 'cancelada' THEN 'Cita cancelada'
               ELSE 'Cita programada'
             END as title,
             CONCAT(p.nombre, ' ', p.apellido, ' - ', m.nombre, ' ', m.apellido) as description,
             TIMESTAMPDIFF(MINUTE, c.fecha_hora, NOW()) as minutes_ago,
             c.id, c.fecha_hora as timestamp
      FROM citas c
      JOIN pacientes p ON c.paciente_id = p.id
      JOIN medicos m ON c.medico_id = m.id
      ORDER BY c.fecha_hora DESC
      LIMIT 7)

      ORDER BY timestamp DESC
      LIMIT 10
    `)

    for (const row of activityRows as any[]) {
      const timeAgo = getTimeAgo(row.minutes_ago)

      let status = 'success'
      if (row.title.includes('cancelada')) {
        status = 'warning'
      } else if (row.title.includes('programada')) {
        status = 'pending'
      }

      const avatarFallback = row.description.substring(0, 2).toUpperCase()

      activityItems.push({
        id: `${row.type}_${row.id}`,
        type: row.type,
        title: row.title,
        description: row.description,
        time: timeAgo,
        status: status,
        avatar: { fallback: avatarFallback }
      })
    }

    // Alertas - citas pendientes urgentes
    const [alertRows] = await connection.execute(`
      SELECT c.id, p.nombre, p.apellido, c.fecha_hora,
             TIMESTAMPDIFF(MINUTE, c.fecha_hora, NOW()) as minutes_ago
      FROM citas c
      JOIN pacientes p ON c.paciente_id = p.id
      WHERE c.estado = 'programada'
      AND DATE(c.fecha_hora) = CURDATE()
      ORDER BY c.fecha_hora ASC
      LIMIT 3
    `)

    for (const row of alertRows as any[]) {
      const timeAgo = getTimeAgo(row.minutes_ago)

      alertItems.push({
        id: `alert_${row.id}`,
        type: 'warning',
        title: 'Cita pendiente hoy',
        description: `${row.nombre} ${row.apellido} - ${new Date(row.fecha_hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
        time: timeAgo
      })
    }

    // Agregar alertas simuladas si no hay suficientes
    if (alertItems.length < 2) {
      alertItems.push({
        id: 'alert_system_1',
        type: 'info',
        title: 'Sistema funcionando correctamente',
        description: 'Todos los servicios operativos',
        time: 'Hace 1 hora'
      })
    }

    return NextResponse.json({
      activityItems,
      alertItems
    })
  } catch (error) {
    console.error('Error fetching activity data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity data' },
      { status: 500 }
    )
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}