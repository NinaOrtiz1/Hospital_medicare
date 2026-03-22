<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

function getHistorial($pacienteId) {
    global $pdo;
    $stmt = $pdo->prepare("
        SELECT hm.*,
               CONCAT(m.nombre, ' ', m.apellido) as medico_nombre,
               m.especialidad
        FROM historial_medico hm
        JOIN medicos m ON hm.medico_id = m.id
        WHERE hm.paciente_id = ?
        ORDER BY hm.fecha DESC, hm.created_at DESC
    ");
    $stmt->execute([$pacienteId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getRegistroHistorial($id) {
    global $pdo;
    $stmt = $pdo->prepare("
        SELECT hm.*,
               CONCAT(m.nombre, ' ', m.apellido) as medico_nombre,
               m.especialidad,
               CONCAT(p.nombre, ' ', p.apellido) as paciente_nombre
        FROM historial_medico hm
        JOIN medicos m ON hm.medico_id = m.id
        JOIN pacientes p ON hm.paciente_id = p.id
        WHERE hm.id = ?
    ");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function addRegistroHistorial($data) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO historial_medico (paciente_id, medico_id, fecha, tipo, titulo, notas, especialidad, archivos_adjuntos) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $archivos = isset($data['archivos_adjuntos']) ? json_encode($data['archivos_adjuntos']) : null;
    $stmt->execute([$data['paciente_id'], $data['medico_id'], $data['fecha'], $data['tipo'], $data['titulo'], $data['notas'], $data['especialidad'], $archivos]);
    return $pdo->lastInsertId();
}

function updateRegistroHistorial($id, $data) {
    global $pdo;
    $updateFields = [];
    $params = [];
    
    if (isset($data['paciente_id'])) {
        $updateFields[] = "paciente_id = ?";
        $params[] = $data['paciente_id'];
    }
    if (isset($data['medico_id'])) {
        $updateFields[] = "medico_id = ?";
        $params[] = $data['medico_id'];
    }
    if (isset($data['fecha'])) {
        $updateFields[] = "fecha = ?";
        $params[] = $data['fecha'];
    }
    if (isset($data['tipo'])) {
        $updateFields[] = "tipo = ?";
        $params[] = $data['tipo'];
    }
    if (isset($data['titulo'])) {
        $updateFields[] = "titulo = ?";
        $params[] = $data['titulo'];
    }
    if (isset($data['notas'])) {
        $updateFields[] = "notas = ?";
        $params[] = $data['notas'];
    }
    if (isset($data['especialidad'])) {
        $updateFields[] = "especialidad = ?";
        $params[] = $data['especialidad'];
    }
    if (isset($data['archivos_adjuntos'])) {
        $updateFields[] = "archivos_adjuntos = ?";
        $params[] = json_encode($data['archivos_adjuntos']);
    }
    
    if (empty($updateFields)) {
        return 0;
    }
    
    $params[] = $id;
    $stmt = $pdo->prepare("UPDATE historial_medico SET " . implode(', ', $updateFields) . " WHERE id = ?");
    $stmt->execute($params);
    return $stmt->rowCount();
}

function deleteRegistroHistorial($id) {
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM historial_medico WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->rowCount();
}

// Manejo de requests
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$patientId = $_GET['patientId'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $registro = getRegistroHistorial($id);
            echo json_encode($registro);
        } elseif ($patientId) {
            try {
                // Obtener información del paciente
                $stmt = $pdo->prepare("
                    SELECT p.*, TIMESTAMPDIFF(YEAR, p.fecha_nacimiento, CURDATE()) as edad
                    FROM pacientes p
                    WHERE p.id = ?
                ");
                $stmt->execute([$patientId]);
                $patient = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$patient) {
                    http_response_code(404);
                    echo json_encode(['error' => 'Patient not found']);
                    exit;
                }

                // Obtener historial médico
                $records = getHistorial($patientId);

                // Formatear registros
                $formattedRecords = array_map(function($record) {
                    return [
                        'id' => $record['id'],
                        'date' => $record['fecha'],
                        'type' => $record['tipo'],
                        'title' => $record['titulo'],
                        'doctor' => $record['medico_nombre'],
                        'specialty' => $record['especialidad'] ?: $record['especialidad'],
                        'notes' => $record['notas'],
                        'attachments' => json_decode($record['archivos_adjuntos'] ?? '[]', true)
                    ];
                }, $records);

                // Obtener alergias y condiciones crónicas (simuladas por ahora)
                $allergies = ['Penicilina', 'Mariscos'];
                $chronicConditions = ['Hipertensión', 'Diabetes Tipo 2'];

                $patientHistory = [
                    'id' => $patient['id'],
                    'name' => $patient['nombre'] . ' ' . $patient['apellido'],
                    'dateOfBirth' => $patient['fecha_nacimiento'],
                    'age' => $patient['edad'],
                    'bloodType' => 'O+', // Simulado
                    'allergies' => $allergies,
                    'chronicConditions' => $chronicConditions,
                    'records' => $formattedRecords
                ];

                echo json_encode($patientHistory);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Error al obtener historial médico: ' . $e->getMessage()]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID de paciente requerido']);
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = addRegistroHistorial($data);
        echo json_encode(['id' => $id]);
        break;
    case 'PUT':
        if ($id) {
            $data = json_decode(file_get_contents('php://input'), true);
            $affected = updateRegistroHistorial($id, $data);
            echo json_encode(['affected' => $affected]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID requerido']);
        }
        break;
    case 'DELETE':
        if ($id) {
            $affected = deleteRegistroHistorial($id);
            echo json_encode(['affected' => $affected]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'ID requerido']);
        }
        break;
}
?>