&lt;?php
require_once 'config.php';

function getUsuarios() {
    global $pdo;
    $stmt = $pdo-&gt;query("SELECT id, nombre, email, rol, activo, created_at, updated_at FROM usuarios ORDER BY created_at DESC");
    return $stmt-&gt;fetchAll(PDO::FETCH_ASSOC);
}

function getUsuario($id) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("SELECT id, nombre, email, rol, activo, created_at, updated_at FROM usuarios WHERE id = ?");
    $stmt-&gt;execute([$id]);
    return $stmt-&gt;fetch(PDO::FETCH_ASSOC);
}

function addUsuario($data) {
    global $pdo;
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    $stmt = $pdo-&gt;prepare("INSERT INTO usuarios (nombre, email, password, rol, activo) VALUES (?, ?, ?, ?, ?)");
    $stmt-&gt;execute([$data['nombre'], $data['email'], $hashedPassword, $data['rol'] ?? 'recepcionista', $data['activo'] ?? true]);
    return $pdo-&gt;lastInsertId();
}

function updateUsuario($id, $data) {
    global $pdo;
    $updateFields = [];
    $params = [];
    
    if (isset($data['nombre'])) {
        $updateFields[] = "nombre = ?";
        $params[] = $data['nombre'];
    }
    if (isset($data['email'])) {
        $updateFields[] = "email = ?";
        $params[] = $data['email'];
    }
    if (isset($data['password'])) {
        $updateFields[] = "password = ?";
        $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
    }
    if (isset($data['rol'])) {
        $updateFields[] = "rol = ?";
        $params[] = $data['rol'];
    }
    if (isset($data['activo'])) {
        $updateFields[] = "activo = ?";
        $params[] = $data['activo'];
    }
    
    if (empty($updateFields)) {
        return 0;
    }
    
    $params[] = $id;
    $stmt = $pdo-&gt;prepare("UPDATE usuarios SET " . implode(', ', $updateFields) . " WHERE id = ?");
    $stmt-&gt;execute($params);
    return $stmt-&gt;rowCount();
}

function deleteUsuario($id) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("DELETE FROM usuarios WHERE id = ?");
    $stmt-&gt;execute([$id]);
    return $stmt-&gt;rowCount();
}

function loginUsuario($email, $password) {
    global $pdo;
    $stmt = $pdo-&gt;prepare("SELECT id, nombre, email, rol, activo FROM usuarios WHERE email = ?");
    $stmt-&gt;execute([$email]);
    $usuario = $stmt-&gt;fetch(PDO::FETCH_ASSOC);
    
    if ($usuario && password_verify($password, $usuario['password'])) {
        unset($usuario['password']);
        return $usuario;
    }
    return false;
}

// Manejo de requests
$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        if ($id) {
            $usuario = getUsuario($id);
            echo json_encode($usuario);
        } else {
            $usuarios = getUsuarios();
            echo json_encode($usuarios);
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($_GET['action']) && $_GET['action'] == 'login') {
            $usuario = loginUsuario($data['email'], $data['password']);
            echo json_encode($usuario ?: ['error' =&gt; 'Credenciales inválidas']);
        } else {
            $id = addUsuario($data);
            echo json_encode(['id' =&gt; $id]);
        }
        break;
    case 'PUT':
        if ($id) {
            $data = json_decode(file_get_contents('php://input'), true);
            $affected = updateUsuario($id, $data);
            echo json_encode(['affected' =&gt; $affected]);
        }
        break;
    case 'DELETE':
        if ($id) {
            $affected = deleteUsuario($id);
            echo json_encode(['affected' =&gt; $affected]);
        }
        break;
}
?&gt;