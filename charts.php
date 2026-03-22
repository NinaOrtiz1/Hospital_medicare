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
    // Datos para AppointmentsBarChart - citas por mes últimos 6 meses
    $appointmentsData = [];
    for ($i = 5; $i >= 0; $i--) {
        $date = date('Y-m-01', strtotime("-$i months"));
        $monthName = date('M', strtotime("-$i months"));

        $stmt = $pdo->prepare("
            SELECT
                SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as completadas,
                SUM(CASE WHEN estado = 'cancelada' THEN 1 ELSE 0 END) as canceladas,
                SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes
            FROM citas
            WHERE DATE_FORMAT(fecha_hora, '%Y-%m') = DATE_FORMAT(?, '%Y-%m')
        ");
        $stmt->execute([$date]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $appointmentsData[] = [
            'month' => $monthName,
            'completadas' => (int)($row['completadas'] ?? 0),
            'canceladas' => (int)($row['canceladas'] ?? 0),
            'pendientes' => (int)($row['pendientes'] ?? 0)
        ];
    }

    // Datos para PatientGrowthLineChart - crecimiento de pacientes
    $patientGrowthData = [];
    for ($i = 5; $i >= 0; $i--) {
        $date = date('Y-m-01', strtotime("-$i months"));
        $monthName = date('M', strtotime("-$i months"));

        // Nuevos pacientes en ese mes
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as nuevos
            FROM pacientes
            WHERE DATE_FORMAT(fecha_registro, '%Y-%m') = DATE_FORMAT(?, '%Y-%m')
        ");
        $stmt->execute([$date]);
        $nuevos = $stmt->fetch(PDO::FETCH_ASSOC)['nuevos'];

        // Pacientes con retorno (que tuvieron citas en ese mes)
        $stmt = $pdo->prepare("
            SELECT COUNT(DISTINCT paciente_id) as retorno
            FROM citas
            WHERE DATE_FORMAT(fecha_hora, '%Y-%m') = DATE_FORMAT(?, '%Y-%m')
            AND paciente_id IN (
                SELECT id FROM pacientes
                WHERE DATE_FORMAT(fecha_registro, '%Y-%m') < DATE_FORMAT(?, '%Y-%m')
            )
        ");
        $stmt->execute([$date, $date]);
        $retorno = $stmt->fetch(PDO::FETCH_ASSOC)['retorno'];

        $patientGrowthData[] = [
            'month' => $monthName,
            'nuevos' => (int)$nuevos,
            'retorno' => (int)$retorno
        ];
    }

    // Datos para DepartmentPieChart - distribución por especialidad
    $stmt = $pdo->query("
        SELECT m.especialidad, COUNT(c.id) as value
        FROM medicos m
        LEFT JOIN citas c ON m.id = c.medico_id
        GROUP BY m.especialidad
        ORDER BY value DESC
        LIMIT 5
    ");
    $departmentData = [];
    $colors = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)', 'var(--color-chart-5)'];
    $index = 0;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $departmentData[] = [
            'name' => $row['especialidad'] ?: 'Sin especialidad',
            'value' => (int)$row['value'],
            'fill' => $colors[$index % count($colors)]
        ];
        $index++;
    }

    // Datos para RevenueAreaChart - análisis financiero (simulado ya que no hay tabla de finanzas)
    // Usaremos un cálculo basado en citas completadas
    $revenueData = [];
    for ($i = 5; $i >= 0; $i--) {
        $date = date('Y-m-01', strtotime("-$i months"));
        $monthName = date('M', strtotime("-$i months"));

        // Simular ingresos basados en citas completadas (ej: $200 por cita)
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as completadas
            FROM citas
            WHERE DATE_FORMAT(fecha_hora, '%Y-%m') = DATE_FORMAT(?, '%Y-%m')
            AND estado = 'completada'
        ");
        $stmt->execute([$date]);
        $completadas = $stmt->fetch(PDO::FETCH_ASSOC)['completadas'];

        $ingresos = $completadas * 200; // $200 por cita completada
        $gastos = $ingresos * 0.7; // Gastos aproximados al 70%

        $revenueData[] = [
            'month' => $monthName,
            'ingresos' => (int)$ingresos,
            'gastos' => (int)$gastos
        ];
    }

    $chartsData = [
        'appointmentsData' => $appointmentsData,
        'patientGrowthData' => $patientGrowthData,
        'departmentData' => $departmentData,
        'revenueData' => $revenueData
    ];

    echo json_encode($chartsData);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al obtener datos de gráficos: ' . $e->getMessage()]);
}
?>