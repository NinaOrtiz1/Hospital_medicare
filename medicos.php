&lt;?php
require_once 'config.php';

function getMedicos() {
    global $pdo;
    $stmt = $pdo-&gt;query("SELECT * FROM medicos ORDER BY created_at DESC");
    return $stmt-&gt;fetchAll(PDO::FETCH_ASSOC);
}

function getMedico($id) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("SELECT * FROM medicos WHERE id = ?");
    $stmt-&gt;execute([$id]);
    return $stmt-&gt;fetch(PDO::FETCH_ASSOC);
}

function addMedico($data) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("INSERT INTO medicos (nombre, apellido, especialidad, telefono, email, cedula_profesional) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt-&gt;execute([$data['nombre'], $data['apellido'], $data['especialidad'], $data['telefono'], $data['email'], $data['cedula_profesional']]);
    return $pdo-&gt;lastInsertId();
}

function updateMedico($id, $data) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("UPDATE medicos SET nombre = ?, apellido = ?, especialidad = ?, telefono = ?, email = ?, cedula_profesional = ? WHERE id = ?");
    $stmt-&gt;execute([$data['nombre'], $data['apellido'], $data['especialidad'], $data['telefono'], $data['email'], $data['cedula_profesional'], $id]);
    return $stmt-&gt;rowCount();
}

function deleteMedico($id) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("DELETE FROM medicos WHERE id = ?");
    $stmt-&gt;execute([$id]);
    return $stmt-&gt;rowCount();
}

// Manejo de requests
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $medico = getMedico($id);
            echo json_encode($medico);
        } else {
            $medicos = getMedicos();
            echo json_encode($medicos);
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = addMedico($data);
        echo json_encode(['id' =&gt; $id]);
        break;
    case 'PUT':
        if ($id) {
            $data = json_decode(file_get_contents('php://input'), true);
            $affected = updateMedico($id, $data);
            echo json_encode(['affected' =&gt; $affected]);
        }
        break;
    case 'DELETE':
        if ($id) {
            $affected = deleteMedico($id);
            echo json_encode(['affected' =&gt; $affected]);
        }
        break;
}
?&gt;