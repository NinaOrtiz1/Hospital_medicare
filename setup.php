<?php
// setup.php - Crear base de datos y tablas
$host = 'localhost';
$username = 'root'; // Cambia según tu configuración
$password = ''; // Cambia según tu configuración

try {
    $pdo = new PDO("mysql:host=$host", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Crear base de datos
    $pdo->exec("CREATE DATABASE IF NOT EXISTS hospital_medicare");
    $pdo->exec("USE hospital_medicare");

    // Crear tablas
    $sql = "
    CREATE TABLE IF NOT EXISTS pacientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        fecha_nacimiento DATE,
        telefono VARCHAR(20),
        email VARCHAR(100) UNIQUE,
        direccion TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS medicos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        especialidad VARCHAR(100),
        telefono VARCHAR(20),
        email VARCHAR(100) UNIQUE,
        cedula_profesional VARCHAR(50) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS citas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        paciente_id INT NOT NULL,
        medico_id INT NOT NULL,
        fecha_hora DATETIME NOT NULL,
        motivo TEXT,
        estado ENUM('programada', 'completada', 'cancelada') DEFAULT 'programada',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
        FOREIGN KEY (medico_id) REFERENCES medicos(id) ON DELETE CASCADE,
        INDEX idx_fecha_hora (fecha_hora),
        INDEX idx_estado (estado)
    );

    CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        rol ENUM('admin', 'medico', 'recepcionista') DEFAULT 'recepcionista',
        activo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS historial_medico (
        id INT AUTO_INCREMENT PRIMARY KEY,
        paciente_id INT NOT NULL,
        medico_id INT NOT NULL,
        fecha DATE NOT NULL,
        tipo ENUM('consulta', 'laboratorio', 'receta', 'procedimiento', 'vacunacion') NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        notas TEXT,
        especialidad VARCHAR(100),
        archivos_adjuntos JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE,
        FOREIGN KEY (medico_id) REFERENCES medicos(id) ON DELETE CASCADE,
        INDEX idx_paciente_fecha (paciente_id, fecha),
        INDEX idx_tipo (tipo)
    );

    CREATE TABLE IF NOT EXISTS notificaciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        mensaje TEXT NOT NULL,
        tipo ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
        usuario_id INT NULL,
        leida BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_usuario_leida (usuario_id, leida),
        INDEX idx_tipo (tipo)
    );

    CREATE TABLE IF NOT EXISTS configuracion (
        id INT AUTO_INCREMENT PRIMARY KEY,
        clave VARCHAR(100) UNIQUE NOT NULL,
        valor TEXT,
        descripcion VARCHAR(255),
        tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
        categoria VARCHAR(50) DEFAULT 'general',
        editable BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_clave (clave),
        INDEX idx_categoria (categoria)
    );
    ";

    $pdo->exec($sql);

    // Insertar datos de ejemplo
    $pdo->exec("
    INSERT IGNORE INTO usuarios (nombre, email, password, rol) VALUES
    ('Admin', 'admin@hospital.com', '" . password_hash('admin123', PASSWORD_DEFAULT) . "', 'admin'),
    ('Recepcionista', 'recepcion@hospital.com', '" . password_hash('recepcion123', PASSWORD_DEFAULT) . "', 'recepcionista');
    ");

    $pdo->exec("
    INSERT IGNORE INTO pacientes (nombre, apellido, fecha_nacimiento, telefono, email, direccion) VALUES
    ('María', 'García López', '1990-05-15', '+52 555 123 4567', 'maria.garcia@email.com', 'Calle Principal 123, Ciudad'),
    ('Juan', 'Pérez Rodríguez', '1985-08-20', '+52 555 234 5678', 'juan.perez@email.com', 'Avenida Central 456, Ciudad');
    ");

    $pdo->exec("
    INSERT IGNORE INTO medicos (nombre, apellido, especialidad, telefono, email, cedula_profesional) VALUES
    ('Roberto', 'García', 'Cardiología', '+52 555 111 2222', 'roberto.garcia@hospital.com', 'CED001'),
    ('Ana', 'Rodríguez', 'Pediatría', '+52 555 222 3333', 'ana.rodriguez@hospital.com', 'CED002');
    ");
    $pdo->exec("
    INSERT IGNORE INTO historial_medico (paciente_id, medico_id, fecha, tipo, titulo, notas, especialidad, archivos_adjuntos) VALUES
    (1, 1, '2024-03-15', 'consulta', 'Consulta de Seguimiento - Cardiología', 'Paciente presenta mejoría en niveles de presión arterial. Se mantiene medicación actual. Control en 3 meses.', 'Cardiología', '[\"ECG_20240315.pdf\"]'),
    (1, 2, '2024-03-10', 'laboratorio', 'Análisis de Sangre Completo', 'Glucosa: 120 mg/dL, Colesterol Total: 195 mg/dL, Triglicéridos: 150 mg/dL. Valores dentro de rango controlado.', 'Laboratorio', '[\"LAB_20240310.pdf\"]'),
    (1, 1, '2024-02-28', 'receta', 'Receta Médica', 'Losartán 50mg - 1 tableta cada 12 horas. Metformina 850mg - 1 tableta con cada comida.', 'Cardiología', NULL),
    (1, 2, '2024-02-15', 'vacunacion', 'Vacunación Anual - Influenza', 'Vacuna de influenza aplicada sin complicaciones. Próxima dosis: 2025.', 'Medicina Preventiva', NULL);
    ");

    // Insertar configuraciones del sistema
    $pdo->exec("
    INSERT IGNORE INTO configuracion (clave, valor, descripcion, tipo, categoria) VALUES
    ('hospital_nombre', 'Hospital General Medicare', 'Nombre del hospital', 'string', 'general'),
    ('hospital_direccion', 'Av. Principal 123, Ciudad Médica', 'Dirección del hospital', 'string', 'general'),
    ('hospital_telefono', '+52 555 123 4567', 'Teléfono principal del hospital', 'string', 'general'),
    ('hospital_email', 'info@hospitalmedicare.com', 'Correo electrónico del hospital', 'string', 'general'),
    ('max_citas_diarias', '50', 'Máximo número de citas por día', 'number', 'citas'),
    ('hora_apertura', '08:00', 'Hora de apertura del hospital', 'string', 'horarios'),
    ('hora_cierre', '18:00', 'Hora de cierre del hospital', 'string', 'horarios'),
    ('dias_laborales', '[\"lunes\", \"martes\", \"miercoles\", \"jueves\", \"viernes\"]', 'Días laborables de la semana', 'json', 'horarios'),
    ('notificaciones_email', 'true', 'Habilitar notificaciones por email', 'boolean', 'notificaciones'),
    ('recordatorio_citas', '24', 'Horas antes para recordar citas', 'number', 'notificaciones'),
    ('backup_automatico', 'true', 'Habilitar respaldo automático de base de datos', 'boolean', 'sistema'),
    ('idioma_predeterminado', 'es', 'Idioma predeterminado del sistema', 'string', 'sistema');
    ");

    // Insertar notificaciones de ejemplo
    $pdo->exec("
    INSERT IGNORE INTO notificaciones (titulo, mensaje, tipo, usuario_id, leida) VALUES
    ('Bienvenido al Sistema', 'El sistema de gestión hospitalaria ha sido configurado correctamente.', 'success', 1, false),
    ('Actualización del Sistema', 'Se han agregado nuevas funcionalidades para mejor gestión de pacientes.', 'info', NULL, false),
    ('Mantenimiento Programado', 'El sistema estará en mantenimiento el próximo domingo de 2:00 AM a 4:00 AM.', 'warning', NULL, false),
    ('Nueva Cita Registrada', 'Se ha registrado una nueva cita para el paciente María García López.', 'info', 1, true);
    ");

    echo "Base de datos y tablas creadas exitosamente.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>