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
    const patientId = searchParams.get('patientId')
    const id = searchParams.get('id')

    if (id) {
      const [rows] = await connection.execute(`
        SELECT hm.*,
               CONCAT(m.nombre, ' ', m.apellido) as medico_nombre,
               m.especialidad,
               CONCAT(p.nombre, ' ', p.apellido) as paciente_nombre
        FROM historial_medico hm
        JOIN medicos m ON hm.medico_id = m.id
        JOIN pacientes p ON hm.paciente_id = p.id
        WHERE hm.id = ?
      `, [id])
      const registro = (rows as any[])[0]
      return NextResponse.json(registro || null)
    } else if (patientId) {
      // Obtener información del paciente
      const [patientRows] = await connection.execute(`
        SELECT p.*, TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) as edad
        FROM pacientes p
        WHERE p.id = ?
      `, [patientId])

      const patient = (patientRows as any[])[0]
      if (!patient) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
      }

      // Obtener historial médico
      const [recordsRows] = await connection.execute(`
        SELECT hm.*,
               CONCAT(m.nombre, ' ', m.apellido) as medico_nombre,
               m.especialidad
        FROM historial_medico hm
        JOIN medicos m ON hm.medico_id = m.id
        WHERE hm.paciente_id = ?
        ORDER BY hm.fecha DESC, hm.created_at DESC
      `, [patientId])

      // Formatear registros
      const formattedRecords = (recordsRows as any[]).map(record => ({
        id: record.id,
        date: record.fecha,
        type: record.tipo,
        title: record.titulo,
        doctor: record.medico_nombre,
        specialty: record.especialidad || '',
        notes: record.notas,
        attachments: JSON.parse(record.archivos_adjuntos || '[]')
      }))

      const patientHistory = {
        id: patient.id,
        name: `${patient.nombre} ${patient.apellido}`,
        dateOfBirth: patient.fecha_nacimiento,
        age: patient.edad,
        bloodType: 'O+', // Simulado
        allergies: ['Penicilina', 'Mariscos'], // Simulado
        chronicConditions: ['Hipertensión', 'Diabetes Tipo 2'], // Simulado
        records: formattedRecords
      }

      return NextResponse.json(patientHistory)
    } else {
      return NextResponse.json({ error: 'Patient ID required' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error fetching medical history:', error)
    return NextResponse.json({ error: 'Error fetching medical history' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}

export async function POST(request: NextRequest) {
  let connection: mysql.Connection | null = null

  try {
    connection = await mysql.createConnection(dbConfig)
    const body = await request.json()

    const archivos = body.archivos_adjuntos ? JSON.stringify(body.archivos_adjuntos) : null

    const [result] = await connection.execute(
      'INSERT INTO historial_medico (paciente_id, medico_id, fecha, tipo, titulo, notas, especialidad, archivos_adjuntos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [body.paciente_id, body.medico_id, body.fecha, body.tipo, body.titulo, body.notas, body.especialidad, archivos]
    )

    return NextResponse.json({ id: (result as any).insertId })
  } catch (error) {
    console.error('Error adding medical record:', error)
    return NextResponse.json({ error: 'Error adding medical record' }, { status: 500 })
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

    if (body.paciente_id) {
      updateFields.push('paciente_id = ?')
      params.push(body.paciente_id)
    }
    if (body.medico_id) {
      updateFields.push('medico_id = ?')
      params.push(body.medico_id)
    }
    if (body.fecha) {
      updateFields.push('fecha = ?')
      params.push(body.fecha)
    }
    if (body.tipo) {
      updateFields.push('tipo = ?')
      params.push(body.tipo)
    }
    if (body.titulo) {
      updateFields.push('titulo = ?')
      params.push(body.titulo)
    }
    if (body.notas) {
      updateFields.push('notas = ?')
      params.push(body.notas)
    }
    if (body.especialidad) {
      updateFields.push('especialidad = ?')
      params.push(body.especialidad)
    }
    if (body.archivos_adjuntos) {
      updateFields.push('archivos_adjuntos = ?')
      params.push(JSON.stringify(body.archivos_adjuntos))
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ affected: 0 })
    }

    params.push(id)
    const [result] = await connection.execute(
      `UPDATE historial_medico SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    )

    return NextResponse.json({ affected: (result as any).affectedRows })
  } catch (error) {
    console.error('Error updating medical record:', error)
    return NextResponse.json({ error: 'Error updating medical record' }, { status: 500 })
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

    const [result] = await connection.execute('DELETE FROM historial_medico WHERE id = ?', [id])
    return NextResponse.json({ affected: (result as any).affectedRows })
  } catch (error) {
    console.error('Error deleting medical record:', error)
    return NextResponse.json({ error: 'Error deleting medical record' }, { status: 500 })
  } finally {
    if (connection) await connection.end()
  }
}