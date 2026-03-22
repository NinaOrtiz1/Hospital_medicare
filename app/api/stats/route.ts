import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hospital_medicare'
}

export async function GET() {
  let connection: mysql.Connection | null = null

  try {
    connection = await mysql.createConnection(dbConfig)

    // Total pacientes
    const [totalPacientesRows] = await connection.execute('SELECT COUNT(*) as total FROM pacientes')
    const totalPacientes = Number((totalPacientesRows as any[])[0].total)

    // Doctores activos
    const [totalDoctoresRows] = await connection.execute('SELECT COUNT(*) as total FROM medicos')
    const totalDoctores = Number((totalDoctoresRows as any[])[0].total)

    // Citas de hoy
    const [citasHoyRows] = await connection.execute("SELECT COUNT(*) as total FROM citas WHERE DATE(fecha_hora) = CURDATE()")
    const citasHoy = Number((citasHoyRows as any[])[0].total)

    // Alertas (citas pendientes)
    const [alertasRows] = await connection.execute("SELECT COUNT(*) as total FROM citas WHERE estado = 'programada'")
    const alertas = Number((alertasRows as any[])[0].total)

    // Nuevos pacientes este mes
    const [nuevosPacientesRows] = await connection.execute(`
      SELECT COUNT(*) as total FROM pacientes
      WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())
    `)
    const nuevosPacientesMes = Number((nuevosPacientesRows as any[])[0].total)

    // Citas pendientes hoy
    const [citasPendientesRows] = await connection.execute(`
      SELECT COUNT(*) as total FROM citas
      WHERE DATE(fecha_hora) = CURDATE() AND estado = 'programada'
    `)
    const citasPendientes = Number((citasPendientesRows as any[])[0].total)

    const stats = {
      totalPacientes,
      totalDoctores,
      citasHoy,
      alertas,
      nuevosPacientesMes,
      citasPendientes,
      alertasUrgentes: alertas
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  } finally {
    if (connection) await connection.end()
  }
}