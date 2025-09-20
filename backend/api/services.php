<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($method) {
    case 'GET':
        if (isset($_GET['category'])) {
            getServicesByCategory($conn, $_GET['category']);
        } else {
            getAllServices($conn);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getAllServices($conn) {
    $stmt = $conn->prepare("
        SELECT *
        FROM services
        WHERE status = 'active'
        ORDER BY category, name
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $services = [];
    while ($row = $result->fetch_assoc()) {
        $services[] = $row;
    }
    $stmt->close();

    // Group services by category
    $groupedServices = [];
    foreach ($services as $service) {
        $category = $service['category'];
        if (!isset($groupedServices[$category])) {
            $groupedServices[$category] = [];
        }
        $groupedServices[$category][] = $service;
    }

    echo json_encode(['services' => $groupedServices]);
}

function getServicesByCategory($conn, $category) {
    // Validate category
    if (!in_array($category, ['electrician', 'plumber'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid category']);
        return;
    }

    $stmt = $conn->prepare("
        SELECT *
        FROM services
        WHERE category = ? AND status = 'active'
        ORDER BY name
    ");
    $stmt->bind_param("s", $category);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $services = [];
    while ($row = $result->fetch_assoc()) {
        $services[] = $row;
    }
    $stmt->close();

    echo json_encode(['services' => $services]);
}
?> 