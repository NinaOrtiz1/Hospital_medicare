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
    // Total pacientes
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM pacientes");
    $totalPacientes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Doctores activos
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM medicos WHERE estado = 'activo'");
    $totalDoctores = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Citas de hoy
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM citas WHERE DATE(fecha_hora) = CURDATE()");
    $stmt->execute();
    $citasHoy = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Alertas (citas pendientes o urgentes)
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM citas WHERE estado = 'pendiente'");
    $alertas = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Nuevos pacientes este mes
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM pacientes WHERE MONTH(fecha_registro) = MONTH(CURDATE()) AND YEAR(fecha_registro) = YEAR(CURDATE())");
    $stmt->execute();
    $nuevosPacientesMes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Citas pendientes hoy
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM citas WHERE DATE(fecha_hora) = CURDATE() AND estado = 'pendiente'");
    $stmt->execute();
    $citasPendientes = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

    // Alertas urgentes (podríamos definir como citas con prioridad alta o algo similar)
    // Por ahora, usar citas pendientes como alertas
    $alertasUrgentes = $alertas;

    $stats = [
        'totalPacientes' => $totalPacientes,
        'totalDoctores' => $totalDoctores,
        'citasHoy' => $citasHoy,
        'alertas' => $alertas,
        'nuevosPacientesMes' => $nuevosPacientesMes,
        'citasPendientes' => $citasPendientes,
        'alertasUrgentes' => $alertasUrgentes
    ];

    echo json_encode($stats);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener estadísticas: ' . $e->getMessage()]);
}
?>