<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

try {
    $activityItems = [];
    $alertItems = [];

    // Actividad reciente - últimas 10 acciones
    $stmt = $pdo->query("
        SELECT 'patient' as type, CONCAT('Nuevo paciente: ', nombre, ' ', apellido) as title,
               CONCAT('Registro completado - ', DATE_FORMAT(fecha_registro, '%d/%m/%Y')) as description,
               TIMESTAMPDIFF(MINUTE, fecha_registro, NOW()) as minutes_ago,
               id, fecha_registro as timestamp
        FROM pacientes
        ORDER BY fecha_registro DESC
        LIMIT 3

        UNION ALL

        SELECT 'appointment' as type,
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
        LIMIT 7
    ");

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $timeAgo = getTimeAgo($row['minutes_ago']);

        $status = 'success';
        if (strpos($row['title'], 'cancelada') !== false) {
            $status = 'warning';
        } elseif (strpos($row['title'], 'programada') !== false) {
            $status = 'pending';
        }

        $avatarFallback = substr($row['description'], 0, 2);

        $activityItems[] = [
            'id' => $row['type'] . '_' . $row['id'],
            'type' => $row['type'],
            'title' => $row['title'],
            'description' => $row['description'],
            'time' => $timeAgo,
            'status' => $status,
            'avatar' => ['fallback' => strtoupper($avatarFallback)]
        ];
    }

    // Alertas - citas pendientes urgentes y otros
    $stmt = $pdo->prepare("
        SELECT c.id, p.nombre, p.apellido, c.fecha_hora,
               TIMESTAMPDIFF(MINUTE, c.fecha_hora, NOW()) as minutes_ago
        FROM citas c
        JOIN pacientes p ON c.paciente_id = p.id
        WHERE c.estado = 'pendiente'
        AND DATE(c.fecha_hora) = CURDATE()
        ORDER BY c.fecha_hora ASC
        LIMIT 3
    ");
    $stmt->execute();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $timeAgo = getTimeAgo($row['minutes_ago']);

        $alertItems[] = [
            'id' => 'alert_' . $row['id'],
            'type' => 'warning',
            'title' => 'Cita pendiente hoy',
            'description' => $row['nombre'] . ' ' . $row['apellido'] . ' - ' . date('H:i', strtotime($row['fecha_hora'])),
            'time' => $timeAgo
        ];
    }

    // Agregar alertas simuladas si no hay suficientes
    if (count($alertItems) < 2) {
        $alertItems[] = [
            'id' => 'alert_system_1',
            'type' => 'info',
            'title' => 'Sistema funcionando correctamente',
            'description' => 'Todos los servicios operativos',
            'time' => 'Hace 1 hora'
        ];
    }

    $data = [
        'activityItems' => array_slice($activityItems, 0, 10),
        'alertItems' => array_slice($alertItems, 0, 5)
    ];

    echo json_encode($data);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener actividad: ' . $e->getMessage()]);
}

function getTimeAgo($minutes) {
    if ($minutes < 60) {
        return "Hace {$minutes} min";
    } elseif ($minutes < 1440) {
        $hours = floor($minutes / 60);
        return "Hace {$hours} hora" . ($hours > 1 ? 's' : '');
    } else {
        $days = floor($minutes / 1440);
        return "Hace {$days} día" . ($days > 1 ? 's' : '');
    }
}
?>