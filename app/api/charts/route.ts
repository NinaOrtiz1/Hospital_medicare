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

    // Datos para AppointmentsBarChart - citas por mes últimos 6 meses
    const appointmentsData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleString('en-US', { month: 'short' })
      const yearMonth = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0')

      const [rows] = await connection.execute(`
        SELECT
          SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as completadas,
          SUM(CASE WHEN estado = 'cancelada' THEN 1 ELSE 0 END) as canceladas,
          SUM(CASE WHEN estado = 'programada' THEN 1 ELSE 0 END) as pendientes
        FROM citas
        WHERE DATE_FORMAT(fecha_hora, '%Y-%m') = ?
      `, [yearMonth])

      const row = (rows as any[])[0]
      appointmentsData.push({
        month: monthName,
        completadas: Number(row?.completadas || 0),
        canceladas: Number(row?.canceladas || 0),
        pendientes: Number(row?.pendientes || 0)
      })
    }

    // Datos para PatientGrowthLineChart - crecimiento de pacientes
    const patientGrowthData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleString('en-US', { month: 'short' })
      const yearMonth = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0')

      // Nuevos pacientes en ese mes
      const [newPatientsRows] = await connection.execute(`
        SELECT COUNT(*) as nuevos
        FROM pacientes
        WHERE DATE_FORMAT(created_at, '%Y-%m') = ?
      `, [yearMonth])
      const nuevos = Number((newPatientsRows as any[])[0]?.nuevos || 0)

      // Pacientes con retorno (que tuvieron citas en ese mes)
      const [returnPatientsRows] = await connection.execute(`
        SELECT COUNT(DISTINCT paciente_id) as retorno
        FROM citas
        WHERE DATE_FORMAT(fecha_hora, '%Y-%m') = ?
        AND paciente_id IN (
          SELECT id FROM pacientes
          WHERE DATE_FORMAT(created_at, '%Y-%m') < ?
        )
      `, [yearMonth, yearMonth])
      const retorno = Number((returnPatientsRows as any[])[0]?.retorno || 0)

      patientGrowthData.push({
        month: monthName,
        nuevos,
        retorno
      })
    }

    // Datos para DepartmentPieChart - distribución por especialidad
    const [departmentRows] = await connection.execute(`
      SELECT m.especialidad, COUNT(c.id) as value
      FROM medicos m
      LEFT JOIN citas c ON m.id = c.medico_id
      GROUP BY m.especialidad
      ORDER BY value DESC
      LIMIT 5
    `)

    const colors = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)']
    const departmentData = (departmentRows as any[]).map((row, index) => ({
      name: row.especialidad || 'Sin especialidad',
      value: Number(row.value),
      fill: colors[index % colors.length]
    }))

    // Datos para RevenueAreaChart - análisis financiero (simulado)
    const revenueData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleString('en-US', { month: 'short' })

      // Simular ingresos basados en citas completadas
      const [revenueRows] = await connection.execute(`
        SELECT COUNT(*) * 500 as revenue
        FROM citas
        WHERE estado = 'completada'
        AND DATE_FORMAT(fecha_hora, '%Y-%m') = ?
      `, [date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0')])

      revenueData.push({
        month: monthName,
        revenue: Number((revenueRows as any[])[0]?.revenue || 0)
      })
    }

    return NextResponse.json({
      appointmentsData,
      patientGrowthData,
      departmentData,
      revenueData
    })
  } catch (error) {
    console.error('Error fetching charts data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch charts data' },
      { status: 500 }
    )
  } finally {
    if (connection) await connection.end()
  }
}