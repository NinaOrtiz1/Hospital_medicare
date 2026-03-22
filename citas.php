&lt;?php
require_once 'config.php';

function getCitas() {
    global $pdo;
    $stmt = $pdo-&gt;query("SELECT c.*, p.nombre as paciente_nombre, p.apellido as paciente_apellido, m.nombre as medico_nombre, m.apellido as medico_apellido FROM citas c JOIN pacientes p ON c.paciente_id = p.id JOIN medicos m ON c.medico_id = m.id ORDER BY c.fecha_hora DESC");
    return $stmt-&gt;fetchAll(PDO::FETCH_ASSOC);
}

function getCita($id) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("SELECT c.*, p.nombre as paciente_nombre, p.apellido as paciente_apellido, m.nombre as medico_nombre, m.apellido as medico_apellido FROM citas c JOIN pacientes p ON c.paciente_id = p.id JOIN medicos m ON c.medico_id = m.id WHERE c.id = ?");
    $stmt-&gt;execute([$id]);
    return $stmt-&gt;fetch(PDO::FETCH_ASSOC);
}

function addCita($data) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("INSERT INTO citas (paciente_id, medico_id, fecha_hora, motivo, estado) VALUES (?, ?, ?, ?, ?)");
    $stmt-&gt;execute([$data['paciente_id'], $data['medico_id'], $data['fecha_hora'], $data['motivo'], $data['estado'] ?? 'programada']);
    return $pdo-&gt;lastInsertId();
}

function updateCita($id, $data) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("UPDATE citas SET paciente_id = ?, medico_id = ?, fecha_hora = ?, motivo = ?, estado = ? WHERE id = ?");
    $stmt-&gt;execute([$data['paciente_id'], $data['medico_id'], $data['fecha_hora'], $data['motivo'], $data['estado'], $id]);
    return $stmt-&gt;rowCount();
}

function deleteCita($id) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("DELETE FROM citas WHERE id = ?");
    $stmt-&gt;execute([$id]);
    return $stmt-&gt;rowCount();
}

// Manejo de requests
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $cita = getCita($id);
            echo json_encode($cita);
        } else {
            $citas = getCitas();
            echo json_encode($citas);
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = addCita($data);
        echo json_encode(['id' =&gt; $id]);
        break;
    case 'PUT':
        if ($id) {
            $data = json_decode(file_get_contents('php://input'), true);
            $affected = updateCita($id, $data);
            echo json_encode(['affected' =&gt; $affected]);
        }
        break;
    case 'DELETE':
        if ($id) {
            $affected = deleteCita($id);
            echo json_encode(['affected' =&gt; $affected]);
        }
        break;
}
?&gt;