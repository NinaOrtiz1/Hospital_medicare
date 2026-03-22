&lt;?php
require_once 'config.php';

function getPacientes() {
    global $pdo;
    $stmt = $pdo-&gt;query("SELECT * FROM pacientes ORDER BY created_at DESC");
    return $stmt-&gt;fetchAll(PDO::FETCH_ASSOC);
}

function getPaciente($id) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("SELECT * FROM pacientes WHERE id = ?");
    $stmt-&gt;execute([$id]);
    return $stmt-&gt;fetch(PDO::FETCH_ASSOC);
}

function addPaciente($data) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("INSERT INTO pacientes (nombre, apellido, fecha_nacimiento, telefono, email, direccion) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt-&gt;execute([$data['nombre'], $data['apellido'], $data['fecha_nacimiento'], $data['telefono'], $data['email'], $data['direccion']]);
    return $pdo-&gt;lastInsertId();
}

function updatePaciente($id, $data) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("UPDATE pacientes SET nombre = ?, apellido = ?, fecha_nacimiento = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?");
    $stmt-&gt;execute([$data['nombre'], $data['apellido'], $data['fecha_nacimiento'], $data['telefono'], $data['email'], $data['direccion'], $id]);
    return $stmt-&gt;rowCount();
}

function deletePaciente($id) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("DELETE FROM pacientes WHERE id = ?");
    $stmt-&gt;execute([$id]);
    return $stmt-&gt;rowCount();
}

// Manejo de requests
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $paciente = getPaciente($id);
            echo json_encode($paciente);
        } else {
            $pacientes = getPacientes();
            echo json_encode($pacientes);
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = addPaciente($data);
        echo json_encode(['id' =&gt; $id]);
        break;
    case 'PUT':
        if ($id) {
            $data = json_decode(file_get_contents('php://input'), true);
            $affected = updatePaciente($id, $data);
            echo json_encode(['affected' =&gt; $affected]);
        }
        break;
    case 'DELETE':
        if ($id) {
            $affected = deletePaciente($id);
            echo json_encode(['affected' =&gt; $affected]);
        }
        break;
}
?&gt;