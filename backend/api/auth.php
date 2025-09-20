<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$data = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'register':
        register($conn, $data);
        break;
    case 'login':
        login($conn, $data);
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        break;
}

function register($conn, $data) {
    // Validate required fields
    $required = ['name', 'email', 'phone', 'password', 'user_type'];
    foreach ($required as $field) {
        if (!isset($data[$field])) {
            http_response_code(400);
            echo json_encode(['error' => "Missing required field: $field"]);
            return;
        }
    }

    // Validate user type
    if (!in_array($data['user_type'], ['user', 'handyman'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid user type']);
        return;
    }

    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $data['email']);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Email already exists']);
        return;
    }
    $stmt->close();

    // Hash password
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

    // Begin transaction
    $conn->begin_transaction();

    try {
        // Insert user
        $stmt = $conn->prepare("INSERT INTO users (name, email, phone, password, user_type) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $data['name'], $data['email'], $data['phone'], $hashedPassword, $data['user_type']);
        $stmt->execute();
        $userId = $stmt->insert_id;
        $stmt->close();

        // If handyman, insert additional details
        if ($data['user_type'] === 'handyman') {
            $stmt = $conn->prepare("INSERT INTO handymen (user_id, service_type, experience, address) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("isss", $userId, $data['service_type'], $data['experience'], $data['address']);
            $stmt->execute();
            $stmt->close();
        }

        $conn->commit();
        echo json_encode(['message' => 'Registration successful', 'user_id' => $userId]);
    } catch (Exception $e) {
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['error' => 'Registration failed']);
    }
}

function login($conn, $data) {
    // Validate required fields
    if (!isset($data['email']) || !isset($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        return;
    }

    // Get user
    $stmt = $conn->prepare("SELECT id, name, email, password, user_type, status FROM users WHERE email = ?");
    $stmt->bind_param("s", $data['email']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        return;
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    // Verify password
    if (!password_verify($data['password'], $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        return;
    }

    // Check if user is active
    if ($user['status'] !== 'active') {
        http_response_code(403);
        echo json_encode(['error' => 'Account is inactive']);
        return;
    }

    // Get additional details for handyman
    $handymanDetails = null;
    if ($user['user_type'] === 'handyman') {
        $stmt = $conn->prepare("SELECT id, service_type, status, is_available FROM handymen WHERE user_id = ?");
        $stmt->bind_param("i", $user['id']);
        $stmt->execute();
        $handymanDetails = $stmt->get_result()->fetch_assoc();
        $stmt->close();
    }

    // Remove password from response
    unset($user['password']);

    // Add handyman details if applicable
    if ($handymanDetails) {
        $user['handyman'] = $handymanDetails;
    }

    echo json_encode([
        'message' => 'Login successful',
        'user' => $user
    ]);
}
?> 